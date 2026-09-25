/**
 * Seletor de idioma (.lang-switch em index.html / en/index.html). Clicar
 * grava a escolha em localStorage — o script inline do <head> respeita
 * essa preferência e para de redirecionar pelo idioma do navegador.
 * Falha de storage (modo privado, bloqueio) é ignorada: o link segue
 * funcionando, só não "lembra" a escolha.
 */
export function initLangSwitch() {
  document.querySelectorAll('.lang-switch__link').forEach((link) => {
    link.addEventListener('click', () => {
      try {
        localStorage.setItem('rv-lang', link.dataset.lang);
      } catch {
        /* sem storage disponível */
      }
    });
  });
}
