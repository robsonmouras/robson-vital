import { defineConfig } from 'vite';

// Publicado em https://robsonmouras.github.io/robson-vital/ (GitHub Pages de
// projeto, não de usuário) — o site fica numa subpasta, não na raiz do
// domínio, então todo asset precisa desse prefixo pra resolver certo (ver
// %BASE_URL% em index.html e import.meta.env.BASE_URL em src/projects.js).
//
// Só aplica o prefixo no BUILD (o que sobe pro Pages) — no `npm run dev`
// mantém base "/" pra continuar acessando em localhost normalmente, sem
// precisar digitar /robson-vital/ toda hora.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/robson-vital/' : '/',
}));
