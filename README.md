# Abyssal AI

Projecte full-stack desenvolupat com a treball de final de DAW (M12). Aplicació web amb un sistema de joc basat en habitacions, gestió d'usuaris i partides (Room Escape).

## Tecnologies

| Capa          | Stack                                |
| ------------- | ------------------------------------ |
| Frontend      | Next.js 16, React 19, Tailwind CSS 4 |
| Backend       | Express 5, Prisma ORM, TypeScript    |
| Base de dades | PostgreSQL                           |
| Testing       | Vitest, Testing Library              |

## Estructura del projecte

```
M12Projecte/
├── frontend/          # Aplicació Next.js
├── backend/           # API REST amb Express + Prisma
├── docs/              # Documentació del projecte
├── .husky/            # Git hooks (pre-commit, post-merge)
└── package.json       # Configuració arrel (workspaces)
```

## Requisits previs

- Node.js >= 20
- npm >= 10
- PostgreSQL

## Instal·lació

```bash
# Clona el repositori
git clone <url-del-repositori>
cd M12Projecte

# Instal·la totes les dependències (frontend + backend)
npm install
```

## Scripts disponibles

### Arrel

| Comanda                | Descripció                         |
| ---------------------- | ---------------------------------- |
| `npm run dev:frontend` | Arrenca el frontend en mode dev    |
| `npm run dev:backend`  | Arrenca el backend en mode dev     |
| `npm run format`       | Formata tot el codi amb Prettier   |
| `npm run format:check` | Comprova el format sense modificar |

### Frontend (`cd frontend`)

| Comanda             | Descripció                        |
| ------------------- | --------------------------------- |
| `npm run dev`       | Arrenca Next.js en mode dev       |
| `npm run build`     | Genera el build de producció      |
| `npm run lint`      | Executa ESLint                    |
| `npm run typecheck` | Comprova els tipus amb TypeScript |
| `npm test`          | Executa els tests amb Vitest      |

### Backend (`cd backend`)

| Comanda             | Descripció                         |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Arrenca el servidor amb hot-reload |
| `npm run typecheck` | Comprova els tipus amb TypeScript  |

## Git Hooks

El projecte utilitza **Husky** per garantir la qualitat del codi:

- **pre-commit** — Bloqueja commits a `main`, executa typecheck (frontend + backend) i Prettier via lint-staged
- **commit-msg** — Valida que el missatge segueixi [Conventional Commits](docs/COMMITS.md)
- **post-merge** — Executa `npm install` automàticament si `package-lock.json` ha canviat

## Convencions

- **Commits**: Format [Conventional Commits](docs/COMMITS.md) — `type(scope): descripció`
- **Branques**: No es permeten commits directes a `main`
- **Format**: Prettier s'aplica automàticament als fitxers staged
