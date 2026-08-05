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

    // project detail view: a full-page overlay (not a boxed modal) that sits
    // above everything, including the header and footer
    const modal = document.createElement('div');
    modal.id = 'projectModal';
    modal.className = 'fixed inset-0 bg-white hidden overflow-y-auto z-50';
    modal.innerHTML = `
        <div id="modalPage" class="max-w-4xl mx-auto px-6 lg:px-16 py-16">
            <button id="closeModal" class="inline-flex items-center gap-2 text-sm font-medium tracking-wide text-slate-500 hover:text-slate-900 transition-colors mb-10">
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
                <span data-i18n="back_to_projects">Voltar</span>
            </button>

            <h2 id="modalTitle" class="text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 mb-4"></h2>
            <div id="modalTools" class="text-sm text-slate-500 mb-8"></div>
            <p id="modalDescription" class="text-lg text-slate-600 leading-relaxed mb-8"></p>

            <!-- additional details for select projects -->
            <div id="modalExtra" class="text-sm text-slate-500 leading-relaxed mb-10"></div>

            <div class="flex flex-wrap items-center gap-4 mb-16">
                <div id="modalLinkContainer"></div>
                <a href="https://wa.link/hs0fpr" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center bg-red-600 hover:bg-red-500 text-white px-6 py-3 text-sm font-semibold tracking-[0.15em] uppercase transition-colors">
                    <i data-lucide="phone" class="w-4 h-4 mr-2"></i> Vamos Conversar
                </a>
            </div>

            <!-- screenshots gallery: reserved space for the project's prints -->
            <div id="modalGallerySection" class="border-t border-slate-100 pt-10 pb-16">
                <h3 class="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 mb-6" data-i18n="project_screenshots">Veja com detalhes</h3>
                <div id="modalGallery" class="grid grid-cols-1 gap-6"></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    lucide.createIcons();

    // renders the comma-separated data-images list into the screenshots grid
    function renderGallery(images) {
        const section = document.getElementById('modalGallerySection');
        const gallery = document.getElementById('modalGallery');
        if (!images || !images.length) {
            section.classList.add('hidden');
            gallery.innerHTML = '';
            return;
        }
        section.classList.remove('hidden');
        gallery.innerHTML = images.map(src => `
            <div class="group overflow-hidden rounded-sm border border-slate-100 bg-slate-50">
                <img src="${src}" loading="lazy" decoding="async" alt="Print do projeto"
                    class="w-full h-auto object-cover transition-transform duration-500 ease-out group-hover:scale-105">
            </div>
        `).join('');
    }

    function openModal(data) {
        document.getElementById('modalTitle').textContent = data.title;
        document.getElementById('modalDescription').textContent = data.description;
        renderGallery(data.images);
        document.getElementById('modalTools').textContent = t('tools_techniques') + data.tools;

        // special extra info for specific projects
        const extraContainer = document.getElementById('modalExtra');
        if (data.dataKey) {
            if (data.dataKey === 'project_1_title') {
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
            } else if (data.dataKey === 'project_2_title') {
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
            } else if (data.dataKey === 'project_5_title') {
                extraContainer.innerHTML = `
                    <div>
                        <h3 class="font-semibold">${t('context')}</h3>
                        <p>${t('project_5_context')}</p>
                        <p class="mt-3">${t('zalieza_client_credit')} <a href="https://zalieza.com/" target="_blank" rel="noopener noreferrer" class="text-red-600 hover:underline font-semibold">Zalieza Marketing</a>.</p>
                    </div>
                `;
            } else if (data.dataKey === 'project_6_title') {
                extraContainer.innerHTML = `
                    <div>
                        <h3 class="font-semibold">${t('context')}</h3>
                        <p>${t('project_6_context')}</p>
                        <p class="mt-3">${t('zalieza_client_credit')} <a href="https://zalieza.com/" target="_blank" rel="noopener noreferrer" class="text-red-600 hover:underline font-semibold">Zalieza Marketing</a>.</p>
                    </div>
                `;
            } else if (data.dataKey === 'project_7_title') {
                extraContainer.innerHTML = `
                    <div>
                        <h3 class="font-semibold">${t('project_7_challenge_title')}</h3>
                        <p>${t('project_7_challenge_text')}</p>
                        <h3 class="font-semibold mt-4">${t('project_7_approach_title')}</h3>
                        <p>${t('project_7_approach_text')}</p>
                        <ul class="flex flex-wrap gap-2 my-3 pl-0 list-none">
                            <li class="flex items-center gap-2 px-3 py-1 border border-slate-200 text-xs uppercase tracking-wide"><i data-lucide="sparkles" class="w-3.5 h-3.5"></i>${t('project_7_pillar_1')}</li>
                            <li class="flex items-center gap-2 px-3 py-1 border border-slate-200 text-xs uppercase tracking-wide"><i data-lucide="gauge" class="w-3.5 h-3.5"></i>${t('project_7_pillar_2')}</li>
                            <li class="flex items-center gap-2 px-3 py-1 border border-slate-200 text-xs uppercase tracking-wide"><i data-lucide="shield-check" class="w-3.5 h-3.5"></i>${t('project_7_pillar_3')}</li>
                        </ul>
                        <h3 class="font-semibold mt-4">${t('project_7_concept_title')}</h3>
                        <p>${t('project_7_concept_text')}</p>
                        <h3 class="font-semibold mt-4">${t('project_7_result_title')}</h3>
                        <p>${t('project_7_result_text')}</p>
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
        modal.scrollTop = 0;
        // lock the page behind the overlay so only the project page scrolls
        document.body.style.overflow = 'hidden';
        // fade overlay and slide the page content up into place
        gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.4 });
        const modalContent = document.getElementById('modalPage');
        gsap.fromTo(modalContent, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' });
        lucide.createIcons();
    }

    function closeModal() {
        gsap.to(modal, {
            opacity: 0, duration: 0.3, onComplete: () => {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });
    }

    document.getElementById('closeModal').addEventListener('click', closeModal);

    // Esc closes the project page, same as the back button
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
    });

    const projectCards = Array.from(document.querySelectorAll('.project-card'));

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
            openModal(buildDataFromCard(card));
        });
    });

    // the shortcut over the thumbnail opens the live site directly,
    // so it must not also trigger the card's modal
    document.querySelectorAll('.project-link').forEach(link => {
        link.addEventListener('click', e => e.stopPropagation());
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
