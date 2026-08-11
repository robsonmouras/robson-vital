import './style.css';
import { initSmoothScroll } from './smooth-scroll.js';
import { initHero } from './hero.js';
import { initProjects } from './projects.js';
import { initTrajectory } from './trajectory.js';
import { initSectionNav } from './section-nav.js';
import { initContact } from './contact.js';
import { initTabTitle } from './tab-title.js';

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

const lenis = initSmoothScroll({ prefersReducedMotion });
initHero({ prefersReducedMotion });
initProjects({ lenis });
initTrajectory({ prefersReducedMotion });
initSectionNav({ lenis });
initContact({ lenis });
initTabTitle();
