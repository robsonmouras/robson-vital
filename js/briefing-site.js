/* Briefing de site — navegação por etapas, rascunho local, Cloudflare Turnstile
   e envio para o Web App do Google Apps Script.

   Mesma engrenagem do briefing de identidade visual (js/briefing.js); o que muda
   são as perguntas, a chave do rascunho e a ramificação de página única.

   Os dois valores abaixo são os únicos que precisam ser preenchidos depois de
   publicar o Apps Script deste formulário. A site key do Turnstile é pública por
   definição e pode ser a mesma do outro briefing, já que o widget é liberado por
   domínio; a secret key vive só no Apps Script. */
const ENDPOINT = 'https://script.google.com/macros/s/AKfycbwlWJKTCrAo6Lu-VpRL8K_K6OaF_lw-hHbtsYyhIJMVYMrd5iRJ0ELnHa1g0xYYqdLGgA/exec';
const TURNSTILE_SITE_KEY = '0x4AAAAAAEAHQMq_kGnLj1Im';

const DRAFT_KEY = 'briefing-site-v1';

// Enquanto as chaves não forem preenchidas a página continua utilizável para
// testar o layout: o Turnstile é pulado e o envio avisa o que falta configurar.
const isPlaceholder = value => !value || value.startsWith('COLE_AQUI');
const turnstileEnabled = !isPlaceholder(TURNSTILE_SITE_KEY);

const form = document.getElementById('briefingForm');
const steps = Array.from(form.querySelectorAll('.step'));
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const btnSubmit = document.getElementById('btnSubmit');
const btnSubmitLabel = document.getElementById('btnSubmitLabel');
const btnSpinner = document.getElementById('btnSpinner');
const formNav = document.getElementById('formNav');
const intro = document.getElementById('intro');
const formError = document.getElementById('formError');
const progress = document.getElementById('progress');
const progressFill = document.getElementById('progressFill');
const progressBar = document.getElementById('progressBar');
const stepCurrent = document.getElementById('stepCurrent');
const stepName = document.getElementById('stepName');
const successBox = document.getElementById('successBox');
const turnstileBox = document.getElementById('turnstileBox');

const startedAt = Date.now();
let current = 0;
let turnstileToken = '';
let turnstileStatus = 'idle'; // idle | loading | ready | error

document.getElementById('stepTotal').textContent = String(steps.length);

/* ------------------------------------------------------------------ etapas */

function showStep(index, { focus = true } = {}) {
    current = Math.max(0, Math.min(index, steps.length - 1));

    steps.forEach((step, i) => { step.hidden = i !== current; });

    const isLast = current === steps.length - 1;
    btnPrev.disabled = current === 0;
    btnNext.classList.toggle('hidden', isLast);
    btnSubmit.classList.toggle('hidden', !isLast);
    btnSubmit.classList.toggle('inline-flex', isLast);

    const percent = Math.round(((current + 1) / steps.length) * 100);
    progressFill.style.width = percent + '%';
    progressBar.setAttribute('aria-valuenow', String(percent));
    stepCurrent.textContent = String(current + 1);
    stepName.textContent = steps[current].dataset.stepName || '';

    if (isLast && turnstileEnabled) loadTurnstile();

    progress.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (focus) {
        const first = steps[current].querySelector('input:not([type=hidden]):not([tabindex="-1"]), textarea');
        // o foco só depois da animação de entrada, senão o navegador cancela o scroll
        if (first) setTimeout(() => first.focus({ preventScroll: true }), 350);
    }
}

/* -------------------------------------------------------------- validação */

// Sobe até o bloco que tem o <p class="field-error"> como filho direto — pode ser
// a div do campo ou, nas caixas de seleção, o fieldset inteiro
function errorSlotFor(el) {
    let node = el.parentElement;
    while (node && node !== form) {
        const slot = node.querySelector(':scope > .field-error');
        if (slot) return slot;
        node = node.parentElement;
    }
    return null;
}

function setError(el, message) {
    const slot = errorSlotFor(el);
    if (slot) {
        slot.textContent = message;
        slot.classList.toggle('hidden', !message);
    }
    if (el.matches('input, textarea')) {
        el.setAttribute('aria-invalid', message ? 'true' : 'false');
    }
}

function validateField(el) {
    if (el.type === 'checkbox') {
        if (!el.checked) return 'Precisa marcar esta opção para enviar.';
        return '';
    }
    if (!el.value.trim()) return 'Este campo é obrigatório.';
    if (el.type === 'email' && !el.checkValidity()) return 'Confira o e-mail — parece estar incompleto.';
    return '';
}

function validateStep(index) {
    const step = steps[index];
    let firstInvalid = null;

    step.querySelectorAll('[data-req="1"]').forEach(el => {
        const message = validateField(el);
        setError(el, message);
        if (message && !firstInvalid) firstInvalid = el;
    });

    step.querySelectorAll('[data-req-group="1"]').forEach(group => {
        const checked = group.querySelector('input:checked');
        const anchor = group.querySelector('input');
        setError(anchor, checked ? '' : 'Marque pelo menos uma opção.');
        if (!checked && !firstInvalid) firstInvalid = anchor;
    });

    if (firstInvalid) {
        firstInvalid.closest('fieldset, div')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus({ preventScroll: true });
        return false;
    }
    return true;
}

/* ------------------------------------------------------- campos condicionais */

// "Outro" nas caixas de seleção revela o campo de texto correspondente
form.querySelectorAll('input[data-other]').forEach(box => {
    box.addEventListener('change', () => toggleOther(box));
});

function toggleOther(box) {
    const target = document.getElementById(box.dataset.other);
    if (!target) return;
    target.hidden = !box.checked;
    target.classList.toggle('hidden', !box.checked);
    if (!box.checked) target.value = '';
    else target.focus();
}

// "O que funciona e o que incomoda" só aparece para quem já tem site
const wrapSiteAtual = document.getElementById('wrap_q_site_atual');
form.querySelectorAll('input[name="q_tem_site"]').forEach(radio => {
    radio.addEventListener('change', syncSiteAtual);
});

function syncSiteAtual() {
    const sim = form.querySelector('input[name="q_tem_site"][value="Sim"]');
    const show = Boolean(sim && sim.checked);
    wrapSiteAtual.hidden = !show;
    if (!show) document.getElementById('q_site_atual').value = '';
}

/* --------------------------------------------------- site completo x página */

/* A primeira pergunta do formulário decide o rumo do projeto: quem responde
   "campanha" quase sempre precisa de uma página só, e aí perguntar por blog e
   por páginas internas só atrapalha. O tipo derivado vai junto para a planilha
   em q_tipo_projeto, para a resposta ficar registrada e não só implícita. */
const OBJETIVO_PAGINA_UNICA = 'Divulgar uma campanha ou promoção';
const OBJETIVO_INDECISO = 'Ainda não sei, me ajuda a decidir';

const tipoProjeto = document.getElementById('q_tipo_projeto');
const recursosTitulo = document.getElementById('recursosTitulo');
const recursosIntro = document.getElementById('recursosIntro');

form.querySelectorAll('input[name="q_objetivo"]').forEach(radio => {
    radio.addEventListener('change', syncTipoProjeto);
});

function syncTipoProjeto() {
    const escolhido = form.querySelector('input[name="q_objetivo"]:checked');
    const valor = escolhido ? escolhido.value : '';
    const paginaUnica = valor === OBJETIVO_PAGINA_UNICA;

    if (!valor) tipoProjeto.value = '';
    else if (paginaUnica) tipoProjeto.value = 'Página única';
    else if (valor === OBJETIVO_INDECISO) tipoProjeto.value = 'A definir';
    else tipoProjeto.value = 'Site completo';

    recursosTitulo.textContent = paginaUnica ? 'O que a página precisa ter' : 'O que o site precisa ter';
    recursosIntro.textContent = paginaUnica
        ? 'Como é uma campanha, o mais provável é uma página única — a lista abaixo já vem enxuta pra isso.'
        : 'Marque tudo que faz sentido pra vocês.';

    // As opções que só existem em site de várias páginas sabem quem são
    form.querySelectorAll('[data-so-site-completo]').forEach(opt => {
        opt.hidden = paginaUnica;
        const input = opt.querySelector('input');
        if (paginaUnica && input) input.checked = false;
    });
}

/* ----------------------------------------------------------- data do prazo */

/* Campo de data nativo: o calendário é o do próprio sistema, então funciona
   igual no celular e no desktop, sem biblioteca. */
const prazo = document.getElementById('q_prazo');

// Prazo no passado só entraria por engano
prazo.min = new Date().toISOString().slice(0, 10);

// Sem valor, o campo mostra "dd/mm/aaaa"; a classe deixa esse texto na mesma cor
// dos placeholders, em vez de parecer uma resposta já preenchida.
function syncPrazo() {
    prazo.classList.toggle('has-value', Boolean(prazo.value));
}

prazo.addEventListener('change', syncPrazo);

// Clicar em qualquer ponto do campo abre o calendário, e não só no ícone
prazo.addEventListener('click', () => {
    if (typeof prazo.showPicker !== 'function') return;
    try {
        prazo.showPicker();
    } catch (_) {
        // navegador recusou (fora de gesto do usuário): o ícone continua valendo
    }
});

/* ------------------------------------------------------------- rascunho */

// O formulário é longo; perder tudo por um refresh acidental seria o pior
// jeito de terminar um briefing.
let draftTimer;

function saveDraft() {
    clearTimeout(draftTimer);
    draftTimer = setTimeout(() => {
        try {
            localStorage.setItem(DRAFT_KEY, JSON.stringify(collectFields()));
        } catch (_) {
            // localStorage cheio ou bloqueado: o formulário segue funcionando
        }
    }, 400);
}

function restoreDraft() {
    let data;
    try {
        data = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
    } catch (_) {
        return;
    }
    if (!data) return;

    Object.entries(data).forEach(([name, value]) => {
        const inputs = form.querySelectorAll(`[name="${CSS.escape(name)}"]`);
        if (!inputs.length) return;

        if (inputs[0].type === 'checkbox' || inputs[0].type === 'radio') {
            const values = Array.isArray(value) ? value : [value];
            inputs.forEach(input => { input.checked = values.includes(input.value); });
        } else {
            inputs[0].value = value;
        }
    });

    form.querySelectorAll('input[data-other]').forEach(toggleOther);
    syncSiteAtual();
    syncTipoProjeto();
    syncPrazo();
}

const clearDraft = () => {
    try { localStorage.removeItem(DRAFT_KEY); } catch (_) { /* nada a fazer */ }
};

/* ---------------------------------------------------------------- coleta */

function collectFields() {
    const data = {};

    form.querySelectorAll('input, textarea').forEach(el => {
        if (!el.name || el.name === 'website') return; // a armadilha vai separada

        if (el.type === 'checkbox') {
            if (el.name === 'lgpd') {
                data.lgpd = el.checked;
                return;
            }
            if (!data[el.name]) data[el.name] = [];
            if (el.checked) data[el.name].push(el.value);
            return;
        }

        if (el.type === 'radio') {
            if (el.checked) data[el.name] = el.value;
            else if (!(el.name in data)) data[el.name] = '';
            return;
        }

        data[el.name] = el.value.trim();
    });

    return data;
}

/* -------------------------------------------------------------- turnstile */

function loadTurnstile() {
    if (turnstileStatus !== 'idle') return;
    turnstileStatus = 'loading';

    // o callback precisa existir antes do script rodar
    window.onTurnstileReady = () => {
        turnstileStatus = 'ready';
        window.turnstile.render('#turnstileBox', {
            sitekey: TURNSTILE_SITE_KEY,
            action: 'briefing-site',
            language: 'pt-br',
            theme: 'light',
            callback: token => {
                turnstileToken = token;
                hideFormError();
            },
            'expired-callback': () => { turnstileToken = ''; },
            'error-callback': () => { turnstileToken = ''; }
        });
    };

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileReady';
    script.async = true;
    script.defer = true;
    script.onerror = () => {
        turnstileStatus = 'error';
        turnstileBox.innerHTML =
            '<p class="text-sm text-red-600">Não consegui carregar a verificação de segurança. ' +
            'Se você usa bloqueador de anúncios, desative nesta página e recarregue.</p>';
    };
    document.head.appendChild(script);
}

/* ----------------------------------------------------------------- envio */

function showFormError(message) {
    formError.textContent = message;
    formError.classList.remove('hidden');
    formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

const hideFormError = () => formError.classList.add('hidden');

/* O envio passa por Turnstile e Apps Script, então demora o suficiente para a
   pessoa achar que o clique não pegou e clicar de novo. A rodinha e o botão
   travado resolvem os dois. */
function setSubmitting(on) {
    btnSubmit.disabled = on;
    btnSubmit.setAttribute('aria-busy', on ? 'true' : 'false');
    btnSpinner.classList.toggle('hidden', !on);
    btnSubmitLabel.textContent = on ? 'Enviando…' : 'Enviar briefing';
}

async function submitBriefing() {
    hideFormError();

    // valida tudo, não só a última etapa: dá para chegar aqui pelo teclado
    for (let i = 0; i < steps.length; i++) {
        if (!validateStep(i)) {
            showStep(i);
            return;
        }
    }

    if (turnstileEnabled && !turnstileToken) {
        showFormError(turnstileStatus === 'error'
            ? 'A verificação de segurança não carregou. Recarregue a página e tente de novo — seu rascunho está salvo.'
            : 'Confirme a verificação de segurança antes de enviar.');
        return;
    }

    if (isPlaceholder(ENDPOINT)) {
        showFormError('O endereço do Apps Script ainda não foi configurado em js/briefing-site.js.');
        return;
    }

    setSubmitting(true);

    try {
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            // text/plain evita o preflight de CORS, que o Apps Script não responde
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
                fields: collectFields(),
                token: turnstileToken,
                trap: document.getElementById('website').value,
                elapsedMs: Date.now() - startedAt
            })
        });

        const result = await response.json();
        if (!response.ok || !result.ok) throw new Error(result.error || 'Falha ao gravar o briefing.');

        clearDraft();
        // fica só a confirmação na tela: a chamada para preencher o briefing e a
        // barra de etapas não têm mais função nenhuma depois que ele foi enviado
        intro.classList.add('hidden');
        progress.classList.add('hidden');
        form.classList.add('hidden');
        formNav.classList.add('hidden');
        successBox.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        showFormError('Não consegui enviar agora: ' + error.message +
            ' Suas respostas continuam salvas aqui — tente de novo em instantes.');
        setSubmitting(false);
        if (turnstileEnabled && window.turnstile) {
            // o token é de uso único: sem resetar, a segunda tentativa falha sempre
            window.turnstile.reset();
            turnstileToken = '';
        }
    }
}

/* -------------------------------------------------------------- listeners */

btnNext.addEventListener('click', () => {
    if (validateStep(current)) showStep(current + 1);
});

btnPrev.addEventListener('click', () => showStep(current - 1));

form.addEventListener('submit', event => {
    event.preventDefault();
    submitBriefing();
});

// Enter em campo de uma linha avança em vez de enviar o formulário incompleto
form.addEventListener('keydown', event => {
    if (event.key !== 'Enter') return;
    if (event.target.tagName === 'TEXTAREA') return;
    event.preventDefault();
    if (current < steps.length - 1 && validateStep(current)) showStep(current + 1);
});

form.addEventListener('input', event => {
    saveDraft();
    // o erro some assim que a pessoa corrige, sem esperar o próximo clique
    if (event.target.getAttribute('aria-invalid') === 'true' && !validateField(event.target)) {
        setError(event.target, '');
    }
});

form.addEventListener('change', saveDraft);

restoreDraft();
showStep(0, { focus: false });
