# Moustapha Adebigni — Portfolio

[Voir le site / Visit the site](https://moustapha-adebigni.vercel.app/)

Portfolio bilingue de développement indépendant en TypeScript, React et IA. Les études présentent le contexte, les choix techniques, la contribution personnelle et les vérifications effectuées.

| Étude / Case study | Français | English |
| --- | --- | --- |
| Pokou AI | [/fr/projects/pokou-ai](https://moustapha-adebigni.vercel.app/fr/projects/pokou-ai) | [/en/projects/pokou-ai](https://moustapha-adebigni.vercel.app/en/projects/pokou-ai) |
| Edge Forensics | [/fr/projects/edge-forensics](https://moustapha-adebigni.vercel.app/fr/projects/edge-forensics) | [/en/projects/edge-forensics](https://moustapha-adebigni.vercel.app/en/projects/edge-forensics) |
| Bridget | [/fr/projects/bridget](https://moustapha-adebigni.vercel.app/fr/projects/bridget) | [/en/projects/bridget](https://moustapha-adebigni.vercel.app/en/projects/bridget) |
| CROWN | [/fr/projects/crown](https://moustapha-adebigni.vercel.app/fr/projects/crown) | [/en/projects/crown](https://moustapha-adebigni.vercel.app/en/projects/crown) |

## Run locally

Use Node.js 22. The portfolio uses React, TypeScript, Vite and React Router.

```sh
npm ci
npm run dev
npm run lint
npm run build
npm run preview
```

French is the default for URLs without a language prefix. The FR/EN switch saves a preference on this browser. Explicit `/fr/` and `/en/` links always open in the specified language. Existing unprefixed home and project URLs still open the corresponding page.

Edit site copy in `src/copy.ts`, case studies in `src/projects.json`, and home metadata in `src/site.json`. The build generates localized metadata and a sitemap in `dist/`. The product repositories are private. Screenshots are captioned with their context, including sample-data and product-page examples.
