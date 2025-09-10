# Helpdesk App

Aplicação de helpdesk (Vite + React + TypeScript + Tailwind + shadcn/ui).

## Scripts

```sh
# instalar deps
npm install

# dev server (http://localhost:8080 por padrão)
npm run dev

# lint
npm run lint

# build de produção
npm run build

# preview do build local
npm run preview
```

## Estrutura (resumo)

- `src/pages/` — páginas (Dashboard, Tickets, Relatórios, etc.)
- `src/hooks/` — hooks (ex.: `use-tickets`, `use-local-storage`)
- `src/components/` — componentes (layout e ui)
- `public/` — assets estáticos

## Notas

- Tickets são persistidos em LocalStorage via `use-tickets`.
- Tema dark/ligth habilitado; UI com shadcn/ui.

## Deploy

Pode ser publicado em Vercel/Netlify/GitHub Pages. Gere o build com `npm run build` e aponte o host para a pasta `dist/`.
