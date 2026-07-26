// Initialize Lucide Icons
lucide.createIcons();

// register GSAP plugins
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // The hero entrance is CSS now (see the .hero-animate keyframes in index.html) so
    // the headline and profile shot paint without waiting for this file to arrive.

    // cycle the closing word of the headline (one at a time, up/down)
    const roleItems = gsap.utils.toArray("#heroWords .hero-words__item");
    if (roleItems.length) {
        // remove extra delay between cycles so last->first shift matches others
        const roleTimeline = gsap.timeline({ repeat: -1, repeatDelay: 0 });
        roleItems.forEach(item => {
            roleTimeline.fromTo(item,
                { y: "100%", opacity: 0 },
                { y: "0%", opacity: 1, duration: 0.5, ease: "power3.out" }
            )
                .to(item, { y: "-100%", opacity: 0, duration: 0.5, ease: "power3.in" }, "+=1");
        });
    }

    // animate each section when it scrolls into view
    gsap.utils.toArray("section").forEach(section => {
        gsap.from(section.querySelectorAll("h2, .grid > div, .skills-card, .job-entry, .group"), {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.2,
            scrollTrigger: {
                trigger: section,
                start: "top 80%"
            }
        });
    });

    // project modal handling
    const modal = document.createElement('div');
    modal.id = 'projectModal';
    // make overlay flex so children can center, and ensure full viewport coverage
    modal.className = 'fixed inset-0 bg-black/70 hidden flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white w-[90vw] h-[90vh] max-w-none max-h-none overflow-y-auto p-8 relative rounded-lg flex flex-col md:flex-row">
            <button id="closeModal" class="absolute top-4 right-4 text-slate-500 hover:text-slate-900">
                <i data-lucide="x" class="w-6 h-6"></i>
            </button>
            <button id="modalPrev" class="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white rounded-full p-2 shadow hover:bg-slate-100">
                <i data-lucide="chevron-left" class="w-6 h-6 text-slate-600"></i>
            </button>
            <button id="modalNext" class="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white rounded-full p-2 shadow hover:bg-slate-100">
                <i data-lucide="chevron-right" class="w-6 h-6 text-slate-600"></i>
            </button>
            <div id="modalImageContainer" class="md:w-1/2 flex items-center justify-center mb-6 md:mb-0">
                <img id="modalImage" src="" class="w-full h-auto object-cover rounded" alt="Preview">
            </div>
            <div class="md:w-1/2 md:pl-8 flex flex-col justify-between">
                <div>
                    <h2 id="modalTitle" class="text-2xl font-semibold mb-4"><i data-lucide="file-text" class="w-6 h-6 inline-block mr-2"></i></h2>
                    <p id="modalDescription" class="text-lg text-slate-700 mb-4"></p>
                    <div id="modalTools" class="text-sm text-slate-500 mb-6"></div>
                    <!-- additional details for select projects -->
                    <div id="modalExtra" class="text-sm text-slate-500 mb-6"></div>
                    <div id="modalLinkContainer" class="mb-6"></div>
                </div>
                <a href="https://wa.link/hs0fpr" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center bg-red-600 hover:bg-red-500 text-white px-6 py-3 text-sm font-semibold tracking-[0.15em] uppercase transition-colors">
                    <i data-lucide="phone" class="w-4 h-4 mr-2"></i> Vamos Conversar
                </a>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    lucide.createIcons();

    function openModal(data) {
        document.getElementById('modalTitle').textContent = data.title;
        // use only first image for new layout
        const imgEl = document.getElementById('modalImage');
        if (data.images && data.images.length) {
            imgEl.src = data.images[0];
        } else {
            imgEl.src = '';
        }
        document.getElementById('modalDescription').textContent = data.description;
        document.getElementById('modalTools').textContent = t('tools_techniques') + data.tools;

        // special extra info for specific projects
        const extraContainer = document.getElementById('modalExtra');
        if (data.title) {
            if (data.title.includes('Plataforma Global')) {
                extraContainer.innerHTML = `
                    <div>
                        <h3 class="font-semibold">Contexto</h3>
                        <p>Portal de contabilidade para empresas externas, enfrentava dúvidas constantes em relatórios, onboarding confuso e dashboard pouco explorado.</p>
                        <h3 class="font-semibold mt-4">Resultados-chave</h3>
                        <ul class="list-disc pl-5">
                            <li class="mb-1">Churn 30 dias ↓ 10 %</li>
                            <li class="mb-1">Chamados sobre relatórios ↓ 18 %</li>
                            <li class="mb-1">Tempo de busca documentos ↓ 25 % (<small>2 m40 → 1 m50</small>)</li>
                            <li class="mb-1">Uso recorrente do dashboard ↑ 20 %</li>
                            <li class="mb-1">NPS +12 pontos</li>
                        </ul>
                    </div>
                `;
            } else if (data.title.includes('Site Instituciona')) {
                extraContainer.innerHTML = `
                    <div>
                        <h3 class="font-semibold">Contexto</h3>
                        <p>Site com forte valor, mas faltava clareza, foco no usuário e fluidez de conversão.</p>
                        <h3 class="font-semibold mt-4">Objetivos</h3>
                        <ul class="list-disc pl-5">
                            <li class="mb-1">Proposta de valor clara</li>
                            <li class="mb-1">Aumentar conversão visitantes→leads</li>
                            <li class="mb-1">Melhorar navegação e hierarquia</li>
                            <li class="mb-1">Otimizar mobile e reduzir fricção</li>
                        </ul>
                        <h3 class="font-semibold mt-4">Resultados estimados</h3>
                        <table class="w-full text-sm">
                            <tr><th class="text-left">Métrica</th><th class="text-left">Antes</th><th class="text-left">Depois</th></tr>
                            <tr><td>Taxa conversão</td><td>3,5%</td><td>5,7%</td></tr>
                            <tr><td>Bounce rate</td><td>58%</td><td>42%</td></tr>
                            <tr><td>Clique em CTA</td><td>8%</td><td>14%</td></tr>
                        </table>
                        <div class="mt-3">
                            <div class="text-xs mb-1">Taxa conversão</div>
                            <div class="w-full bg-slate-200 rounded h-2">
                                <div class="bg-red-600 h-2 rounded" style="width:62%"></div>
                            </div>
                        </div>
                    </div>
                `;
            } else if (data.title.includes('Jumper')) {
                extraContainer.innerHTML = `
                    <div>
                        <h3 class="font-semibold">${t('context')}</h3>
                        <p>${t('project_5_context')}</p>
                        <p class="mt-3">${t('zalieza_client_credit')} <a href="https://zalieza.com/" target="_blank" rel="noopener noreferrer" class="text-red-600 hover:underline font-semibold">Zalieza Marketing</a>.</p>
                    </div>
                `;
            } else if (data.title.includes('Vikings')) {
                extraContainer.innerHTML = `
                    <div>
                        <h3 class="font-semibold">${t('context')}</h3>
                        <p>${t('project_6_context')}</p>
                        <p class="mt-3">${t('zalieza_client_credit')} <a href="https://zalieza.com/" target="_blank" rel="noopener noreferrer" class="text-red-600 hover:underline font-semibold">Zalieza Marketing</a>.</p>
                    </div>
                `;
            } else {
                extraContainer.innerHTML = '';
            }
        } else {
            extraContainer.innerHTML = '';
        }

        // if there is an external url, render a button/link inside the modal
        const linkContainer = document.getElementById('modalLinkContainer');
        if (data.url) {
            linkContainer.innerHTML = `
                <a href="${data.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-red-600 hover:underline font-semibold">
                    Veja esse projeto <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </a>
            `;
            // reinitialise icons in case new arrow is inserted
            lucide.createIcons();
        } else {
            linkContainer.innerHTML = '';
        }

        modal.classList.remove('hidden');
        // fade overlay and scale content
        gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.5 });
        const modalContent = modal.firstElementChild;
        gsap.fromTo(modalContent, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out' });
        lucide.createIcons();
    }

    function closeModal() {
        gsap.to(modal, { opacity: 0, duration: 0.3, onComplete: () => modal.classList.add('hidden') });
    }

    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.getElementById('closeModal').addEventListener('click', closeModal);

    const projectCards = Array.from(document.querySelectorAll('.project-card'));
    let currentIndex = null;

    function buildDataFromCard(card) {
        return {
            title: t(card.dataset.title),
            description: t(card.dataset.description),
            tools: card.dataset.tools,
            images: card.dataset.images ? card.dataset.images.split(',') : [],
            url: card.dataset.url,
            dataKey: card.dataset.title
        };
    }

    // Make buildDataFromCard globally accessible for language switching
    window.buildDataFromCard = buildDataFromCard;
    window.currentProjectIndex = null;

    // open modal when clicking a thumbnail and set current index
    projectCards.forEach((card, idx) => {
        card.addEventListener('click', () => {
            window.currentProjectIndex = idx;
            currentIndex = idx;
            openModal(buildDataFromCard(card));
            updateModalNav();
        });
    });

    // the shortcut over the thumbnail opens the live site directly,
    // so it must not also trigger the card's modal
    document.querySelectorAll('.project-link').forEach(link => {
        link.addEventListener('click', e => e.stopPropagation());
    });

    // enable/disable modal prev/next buttons
    function updateModalNav() {
        const prev = document.getElementById('modalPrev');
        const next = document.getElementById('modalNext');
        if (!prev || !next) return;
        if (currentIndex <= 0) {
            prev.disabled = true;
            prev.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            prev.disabled = false;
            prev.classList.remove('opacity-50', 'cursor-not-allowed');
        }
        if (currentIndex >= projectCards.length - 1) {
            next.disabled = true;
            next.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            next.disabled = false;
            next.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }

    function updateModalContent(data, direction) {
        const container = modal.firstElementChild;
        // animate out
        gsap.to(container, {
            x: direction === 'right' ? 100 : -100, opacity: 0, duration: 0.18, ease: 'power2.in', onComplete: () => {
                // update fields
                updateModalNav();
                document.getElementById('modalTitle').textContent = data.title;
                const imgEl = document.getElementById('modalImage');
                imgEl.src = data.images && data.images.length ? data.images[0] : '';
                document.getElementById('modalDescription').textContent = data.description;
                document.getElementById('modalTools').textContent = t('tools_techniques') + data.tools;

                // reuse existing extra-generation logic by calling openModal's extra section code
                // but avoid re-animating the entire modal overlay
                const extraContainer = document.getElementById('modalExtra');
                if (data.title) {
                    if (data.title.includes('Plataforma Global')) {
                        extraContainer.innerHTML = `
                        <div>
                            <h3 class="font-semibold">Contexto</h3>
                            <p>Portal de contabilidade para empresas externas, enfrentava dúvidas constantes em relatórios, onboarding confuso e dashboard pouco explorado.</p>
                            <h3 class="font-semibold mt-4">Resultados-chave</h3>
                            <ul class="list-disc pl-5">
                                <li class="mb-1">Churn 30 dias ↓ 10 %</li>
                                <li class="mb-1">Chamados sobre relatórios ↓ 18 %</li>
                                <li class="mb-1">Tempo de busca documentos ↓ 25 % (<small>2 m40 → 1 m50</small>)</li>
                                <li class="mb-1">Uso recorrente do dashboard ↑ 20 %</li>
                                <li class="mb-1">NPS +12 pontos</li>
                            </ul>
                        </div>
                    `;
                    } else if (data.title.includes('Site Instituciona')) {
                        extraContainer.innerHTML = `
                        <div>
                            <h3 class="font-semibold">Contexto</h3>
                            <p>Site com forte valor, mas faltava clareza, foco no usuário e fluidez de conversão.</p>
                            <h3 class="font-semibold mt-4">Objetivos</h3>
                            <ul class="list-disc pl-5">
                                <li class="mb-1">Proposta de valor clara</li>
                                <li class="mb-1">Aumentar conversão visitantes→leads</li>
                                <li class="mb-1">Melhor navegação e hierarquia</li>
                                <li class="mb-1">Otimizar mobile e reduzir fricção</li>
                            </ul>
                            <h3 class="font-semibold mt-4">Resultados estimados</h3>
                            <table class="w-full text-sm">
                                <tr><th class="text-left">Métrica</th><th class="text-left">Antes</th><th class="text-left">Depois</th></tr>
                                <tr><td>Taxa conversão</td><td>3,5%</td><td>5,7%</td></tr>
                                <tr><td>Bounce rate</td><td>58%</td><td>42%</td></tr>
                                <tr><td>Clique em CTA</td><td>8%</td><td>14%</td></tr>
                            </table>
                            <div class="mt-3">
                                <div class="text-xs mb-1">Taxa conversão</div>
                                <div class="w-full bg-slate-200 rounded h-2">
                                    <div class="bg-red-600 h-2 rounded" style="width:62%"></div>
                                </div>
                            </div>
                        </div>
                    `;
                    } else if (data.title.includes('Jumper')) {
                        extraContainer.innerHTML = `
                        <div>
                            <h3 class="font-semibold">${t('context')}</h3>
                            <p>${t('project_5_context')}</p>
                            <p class="mt-3">${t('zalieza_client_credit')} <a href="https://zalieza.com/" target="_blank" rel="noopener noreferrer" class="text-red-600 hover:underline font-semibold">Zalieza Marketing</a>.</p>
                        </div>
                    `;
                    } else if (data.title.includes('Vikings')) {
                        extraContainer.innerHTML = `
                        <div>
                            <h3 class="font-semibold">${t('context')}</h3>
                            <p>${t('project_6_context')}</p>
                            <p class="mt-3">${t('zalieza_client_credit')} <a href="https://zalieza.com/" target="_blank" rel="noopener noreferrer" class="text-red-600 hover:underline font-semibold">Zalieza Marketing</a>.</p>
                        </div>
                    `;
                    } else {
                        extraContainer.innerHTML = '';
                    }
                } else {
                    extraContainer.innerHTML = '';
                }

                const linkContainer = document.getElementById('modalLinkContainer');
                if (data.url) {
                    linkContainer.innerHTML = `
                    <a href="${data.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-red-600 hover:underline font-semibold">
                        Veja esse projeto <i data-lucide="arrow-right" class="w-4 h-4"></i>
                    </a>
                `;
                    lucide.createIcons();
                } else {
                    linkContainer.innerHTML = '';
                }

                // animate in from opposite side
                gsap.fromTo(container, { x: direction === 'right' ? -100 : 100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.28, ease: 'power3.out', onComplete: updateModalNav });
                lucide.createIcons();
            }
        });
    }

    // handle modal prev/next clicks using event delegation (buttons are inside modal)
    document.addEventListener('click', (e) => {
        currentIndex = window.currentProjectIndex;
        if (!currentIndex && currentIndex !== 0) return;
        const prevBtn = e.target.closest('#modalPrev');
        const nextBtn = e.target.closest('#modalNext');
        if (prevBtn) {
            if (currentIndex > 0) {
                currentIndex -= 1;
                window.currentProjectIndex = currentIndex;
                updateModalContent(buildDataFromCard(projectCards[currentIndex]), 'left');
            }
        }
        if (nextBtn) {
            if (currentIndex < projectCards.length - 1) {
                currentIndex += 1;
                window.currentProjectIndex = currentIndex;
                updateModalContent(buildDataFromCard(projectCards[currentIndex]), 'right');
            }
        }
    });

    // Easter Egg: Konami Code (Up, Up, Down, Down, Left, Right, Left)
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                triggerEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function triggerEasterEgg() {
        const easterEgg = document.createElement('div');
        easterEgg.id = 'easterEgg';
        easterEgg.className = 'fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none';
        easterEgg.innerHTML = '<img src="img/eu-vetor.svg" alt="Easter Egg" class="w-full h-full object-contain" style="width: 100vw; height: 100vh;">';
        document.body.appendChild(easterEgg);

        // Create timeline for quick appear and disappear effect
        const tl = gsap.timeline();

        // Fade in from opacity 0 to 1
        tl.fromTo(easterEgg,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
        );

        // Fade out while entrance animation is still happening (starts at 70% of entrance)
        tl.to(easterEgg, {
            opacity: 0,
            scale: 1.1,
            duration: 0.6,
            ease: 'power2.in',
            onComplete: () => easterEgg.remove()
        }, 0.35); // Begin before fade in completes
    }
}


    //  navigation highlight script

document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('#home, section[id]');
    const navLinks = document.querySelectorAll('header nav a');

    function updateActiveLink() {
        let scrollPos = window.scrollY + 120; // offset for header height
        sections.forEach(sec => {
            const top = sec.offsetTop;
            const bottom = top + sec.offsetHeight;
            if (scrollPos >= top && scrollPos < bottom) {
                navLinks.forEach(link => {
                    link.classList.remove('text-red-600', 'font-semibold');
                    link.classList.add('hover:text-slate-900');
                    if (link.getAttribute('href') === '#' + sec.id) {
                        link.classList.add('text-red-600', 'font-semibold');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', () => {
        updateActiveLink();
        // shrink header when beyond top
        const header = document.querySelector('header');
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    updateActiveLink();
});
  
    // Mobile Menu Script

document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menuToggle');
    const closeMenu = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    // Open menu
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.add('menu-open');
        mobileMenu.style.transform = 'translateX(0)';
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        lucide.createIcons();
    });

    // Close menu
    function closeMenuFunc() {
        mobileMenu.classList.remove('menu-open');
        mobileMenu.style.transform = 'translateX(100%)';
        // Allow body scroll
        document.body.style.overflow = 'auto';
    }

    closeMenu.addEventListener('click', closeMenuFunc);

    // Close menu when clicking on a nav link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            closeMenuFunc();
        });
    });

    // Close menu when clicking outside (on the overlay area)
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            closeMenuFunc();
        }
    });
});
