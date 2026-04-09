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
- Docker (per aixecar PostgreSQL)

## Instal·lació i posada en marxa

### 1. Clona el repositori

```bash
git clone <url-del-repositori>
cd M12Projecte
```

### 2. Configura les variables d'entorn

Crea els fitxers `.env` a partir dels exemples:

```bash
# .env a l'arrel del projecte (credencials Docker PostgreSQL)
cp .env.example .env
```

Edita `.env` i descomenta/omple les credencials:

```env
POSTGRES_DB=abyssal_db
POSTGRES_USER=el_meu_usuari
POSTGRES_PASSWORD=el_meu_password
```

```bash
# .env al backend
cp backend/.env.example backend/.env
```

Edita `backend/.env` i completa la `DATABASE_URL` amb les mateixes credencials:

```env
DATABASE_URL=postgresql://el_meu_usuari:el_meu_password@localhost:5432/abyssal_db?schema=public
TOKEN_SECRET=una-clau-secreta-qualsevol
TOKEN_EXPIRES_IN=7d
```

### 3. Instal·la les dependències

```bash
npm install
```

### 4. Aixeca la base de dades

```bash
npm run db:start
```

Això arrenca un contenidor PostgreSQL via Docker Compose.

### 5. Aplica les migracions i genera el client Prisma

```bash
npm run db:deploy
npm run db:generate
```

### 6. Arrenca l'aplicació

```bash
# Opció A: arrenca frontend i backend per separat (en terminals separades)
npm run dev:backend
npm run dev:frontend

# Opció B: arrenca tot alhora (DB + migracions + backend + frontend)
npm run dev:full
```

El frontend estarà disponible a `http://localhost:3000` i el backend a `http://localhost:3001` (o el port configurat).

## Scripts disponibles

### Arrel

| Comanda                | Descripció                                          |
| ---------------------- | --------------------------------------------------- |
| `npm run dev:frontend` | Arrenca el frontend en mode dev                     |
| `npm run dev:backend`  | Arrenca el backend en mode dev                      |
| `npm run dev:full`     | Arrenca DB + migracions + backend + frontend alhora |
| `npm run db:start`     | Aixeca el contenidor PostgreSQL                     |
| `npm run db:stop`      | Atura el contenidor PostgreSQL                      |
| `npm run db:deploy`    | Aplica les migracions pendents                      |
| `npm run db:generate`  | Genera el client Prisma                             |
| `npm run db:studio`    | Obre Prisma Studio (UI per explorar la BD)          |
| `npm run format`       | Formata tot el codi amb Prettier                    |
| `npm run format:check` | Comprova el format sense modificar                  |

### Frontend (`cd frontend`)

| Comanda             | Descripció                        |
| ------------------- | --------------------------------- |
| `npm run dev`       | Arrenca Next.js en mode dev       |
| `npm run build`     | Genera el build de producció      |
| `npm run lint`      | Executa ESLint                    |
| `npm run typecheck` | Comprova els tipus amb TypeScript |
| `npm test`          | Executa els tests amb Vitest      |

### Backend (`cd backend`)

| Comanda              | Descripció                         |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Arrenca el servidor amb hot-reload |
| `npm run typecheck`  | Comprova els tipus amb TypeScript  |
| `npm run db:migrate` | Crea una nova migració Prisma      |
| `npm run db:reset`   | Reseteja la BD i re-aplica tot     |

## Git Hooks

El projecte utilitza **Husky** per garantir la qualitat del codi:

- **pre-commit** — Bloqueja commits a `main`, executa typecheck (frontend + backend) i Prettier via lint-staged
- **commit-msg** — Valida que el missatge segueixi [Conventional Commits](docs/COMMITS.md)
- **post-merge** — Executa `npm install` automàticament si `package-lock.json` ha canviat

## Convencions

- **Commits**: Format [Conventional Commits](docs/COMMITS.md) — `type(scope): descripció`
- **Branques**: No es permeten commits directes a `main`
- **Format**: Prettier s'aplica automàticament als fitxers staged
