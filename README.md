# Flashcards (Backend)

A RESTful API backend for the Flashcards application, built to power the Vue 3 frontend client ([flashcards-fe](https://github.com/vincenttao04/flashcards-fe)).

This personal project extends the frontend into a fully functional full-stack application, focusing on clean architecture, scalable CRUD operations, and robust relational data modelling.

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Data Models](#data-models)
  - [`Deck`](#deck)
  - [`Card`](#card)
- [API Endpoints](#api-endpoints)
  - [Decks - `/decks`](#decks---decks)
    - [Request Body - `POST` and `PUT /decks`](#request-body---post-and-put-decks)
  - [Cards - `/decks/:deckId/cards`, `/cards/:id`](#cards---decksdeckidcards-cardsid)
  - [Debug - `/debug`](#debug---debug)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment](#environment)
  - [Database Setup](#database-setup)
  - [Running the Dev Server](#running-the-dev-server)
- [Prisma Reference](#prisma-reference)
  - [Manual Reset (Fresh Start)](#manual-reset-fresh-start)
- [Configuration](#configuration)
- [Future Work](#future-work)
- [License](#license)
- [Author](#author)

## Tech Stack

| Layer      | Technology                        |
| ---------- | --------------------------------- |
| Runtime    | Node.js (ESM)                     |
| Language   | TypeScript 5                      |
| Framework  | Express 5                         |
| ORM        | Prisma 7                          |
| Database   | SQLite (`better-sqlite3` adapter) |
| Dev runner | `tsx watch`                       |

## Project Structure

```
flashcards-be/
├── prisma/
│   ├── schema.prisma           # Data models (Deck, Card)
│   ├── migrations/             # SQL migration history
│   └── migration_lock.toml
├── src/
│   ├── index.ts                # App entry point, Express setup
│   ├── prisma.ts               # Prisma client singleton
│   └── routes/
│       ├── decks.ts            # CRUD routes for decks
│       ├── cards.ts            # CRUD routes for individual cards
│       └── debug.ts            # DB connectivity check
├── prisma.config.ts            # Prisma CLI config (schema path, datasource URL)
├── tsconfig.json
└── package.json
```

## Data Models

### `Deck`

| Field         | Type     | Notes                |
| ------------- | -------- | -------------------- |
| `id`          | Int      | Auto-increment PK    |
| `title`       | String   | Required             |
| `description` | String   | Required             |
| `createdAt`   | DateTime | Auto-set             |
| `cards`       | Card[]   | One-to-many relation |

### `Card`

| Field       | Type     | Notes             |
| ----------- | -------- | ----------------- |
| `id`        | Int      | Auto-increment PK |
| `question`  | String   | Required          |
| `answer`    | String   | Required          |
| `deckId`    | Int      | FK → `Deck.id`    |
| `createdAt` | DateTime | Auto-set          |

Deleting a `Deck` cascades to all of its `Card` records.

## API Endpoints

### Decks - `/decks`

| Method   | Path         | Description                                        |
| -------- | ------------ | -------------------------------------------------- |
| `POST`   | `/decks`     | Create a deck with cards                           |
| `GET`    | `/decks`     | Get all decks (desc by `createdAt`)                |
| `GET`    | `/decks/:id` | Get a single deck with its cards                   |
| `PUT`    | `/decks/:id` | Replace a deck's title, description, and all cards |
| `DELETE` | `/decks/:id` | Delete a deck and all its cards                    |

All deck responses include the nested `cards` array.

The `PUT /decks/:id` update uses a **bulk replace** pattern - all existing cards are deleted and recreated from the request body. This aligns with how the frontend manages deck edits.

#### Request Body - `POST` and `PUT /decks`

```json
{
  "title": "My Deck",
  "description": "A description",
  "cards": [{ "question": "What is X?", "answer": "X is..." }]
}
```

### Cards - `/decks/:deckId/cards`, `/cards/:id`

> **Note:** These endpoints are functional but not actively used by the frontend, which manages cards through deck-level bulk operations instead.

| Method   | Path                   | Description                            |
| -------- | ---------------------- | -------------------------------------- |
| `POST`   | `/decks/:deckId/cards` | Add a single card to a deck            |
| `GET`    | `/decks/:deckId/cards` | Get all cards for a deck               |
| `PUT`    | `/cards/:id`           | Update a single card's question/answer |
| `DELETE` | `/cards/:id`           | Delete a single card                   |

### Debug - `/debug`

| Method | Path        | Description                                              |
| ------ | ----------- | -------------------------------------------------------- |
| `GET`  | `/debug/db` | Confirms database connectivity (`{ "db": "connected" }`) |

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

```bash
git clone https://github.com/vincenttao04/flashcards-be.git
cd flashcards-be
npm install
```

### Environment

Create a `.env` file in the project root:

```env
DATABASE_URL="file:./dev.db"
```

### Database Setup

Run the initial migration to create the SQLite database and tables:

```bash
npx prisma migrate dev --name init
```

### Running the Dev Server

```bash
npm run dev
```

Server starts at `http://localhost:3000`.

## Prisma Reference

```bash
# Apply a new schema change as a migration
npx prisma migrate dev --name <name>

# Format schema.prisma
npx prisma format

# Reset DB - drops, remigrates, regenerates client
npx prisma migrate reset
```

### Manual Reset (Fresh Start)

Only use this when you want to discard all migration history:

1. Delete `prisma/migrations/`
2. Delete `dev.db`
3. Run `npx prisma migrate dev --name init`
4. Run `npx prisma generate` if the client is out of sync

## Configuration

**`tsconfig.json`** - Targets ES2023, uses `bundler` module resolution, strict mode enabled. `ignoreDeprecations: "5.0"` is required to match the installed TypeScript version.

**`prisma.config.ts`** - Points Prisma CLI to `prisma/schema.prisma` and reads `DATABASE_URL` from environment.

**`src/prisma.ts`** - Instantiates a single `PrismaClient` using the `better-sqlite3` adapter, shared across all route handlers.

## Future Work

- **Card ordering** - Cards are currently sorted by `createdAt desc` only; support manual reordering via an `order` field on the `Card` model.
- **User accounts** - The API has no ownership model; all decks are globally readable and writable; adding a `User` model with a `userId` FK on `Deck` would scope data per user.
- **JWT / session-based auth** - Complement user accounts with an auth middleware layer (e.g. `jsonwebtoken` or `express-session`) to protect routes and identify the requesting user.
- **Pagination on `GET /decks`** - Currently returns all decks in one response; add `page`/`limit` query params to support larger datasets.
- **Tests** - No test coverage exists; integration tests against the SQLite DB (e.g. with `vitest` + `supertest`) would cover the core CRUD flows.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Vincent Tao - @vincenttao04
