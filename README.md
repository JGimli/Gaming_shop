# Gaming Shop

Gaming Shop is a full-stack game catalog application built with React, Vite, Express, and PostgreSQL.

The React frontend displays games in a responsive catalog, provides pagination, and includes live title search. Selecting a game opens a detail page with its image, title, price, and description. The Express API retrieves catalog data from PostgreSQL.


## Features

- Responsive game catalog
- Four-game pagination with a maximum of five pages
- Debounced live search
- Search result dropdown
- Game detail view
- Express API with CORS restricted to the local frontend
- PostgreSQL-backed game data

## Tech Stack

### Frontend

- React 19
- React Router DOM 7
- Axios
- Vite 8
- Oxlint

### Backend

- Node.js
- Express 5
- PostgreSQL and `pg`
- `cors`
- `dotenv`

## Project Structure

```text
Gaming_shop/
├── react-app/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── App.jsx
│       ├── Core.jsx
│       ├── Head.jsx
│       ├── Foot.jsx
│       ├── Search.jsx
│       ├── App.css
│       └── index.css
└── node-pg/
    └── backend/
        ├── index.js
        ├── games.js
        ├── package.json
        └── .env
```

## Prerequisites

- Node.js 18 or newer
- npm
- PostgreSQL
- A database named `gamestore` by default

## Database Setup

Create a PostgreSQL database and a `games` table containing the fields used by the application:

```sql
CREATE DATABASE gamestore;

\c gamestore

CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price VARCHAR(50),
    imagePath TEXT,
    description TEXT
);
```

Insert at least one game to verify the setup:

```sql
INSERT INTO games (title, price, imagePath, description)
VALUES (
    'Example Game',
    '$59.99',
    '/images/example-game.jpg',
    'An example game in the catalog.'
);
```

## Backend Configuration

From `node-pg/backend`, configure PostgreSQL connection values in `.env`:

```dotenv
PG_USER=postgres
PG_HOST=localhost
PG_DATABASE=gamestore
PG_PASSWORD=your_password
PG_PORT=5432
```

The backend uses these values with a PostgreSQL connection pool. If a variable is omitted, `games.js` falls back to the values shown above in configuration.

> Do not commit real database passwords. Use environment variables or a local `.env` file excluded from version control.

## Installation

Install the frontend dependencies:

```powershell
cd react-app
npm install
```

Install the backend dependencies:

```powershell
cd ..\node-pg\backend
npm install
```

## Running the Application

Start PostgreSQL, then run the backend:

```powershell
cd node-pg\backend
node index.js
```

The API is available at `http://localhost:3000`.

In a second terminal, start the frontend:

```powershell
cd react-app
npm run dev
```

Open `http://localhost:5173` in a browser.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | Returns all games |
| `GET` | `/search?title=<term>` | Returns games whose title contains the search term, case-insensitively |

Example:

```text
http://localhost:3000/search?title=zelda
```

## Frontend Routes

| Route | Purpose |
| --- | --- |
| `/` | Game catalog |
| `/game?title=<title>` | Selected game details |
| `/foot` | Footer component demo route |

## Scripts

### Frontend

Run from `react-app`:

```powershell
npm run dev      # Start Vite development server
npm run build    # Create a production build
npm run lint     # Run Oxlint
npm run preview  # Preview the production build locally
```

### Backend

Run from `node-pg/backend`:

```powershell
node index.js
```

The backend package currently does not define a dedicated start script or a test suite.

## Troubleshooting

- **CORS error:** Keep the frontend on `http://localhost:5173`, because that origin is allowed by the backend.
- **Frontend cannot reach the API:** Confirm the backend is running on port `3000`.
- **PostgreSQL connection error:** Check `.env`, database credentials, and whether PostgreSQL is running.
- **No games appear:** Confirm the `gamestore` database contains the `games` table and has rows.
