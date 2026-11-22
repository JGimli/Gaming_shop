# Gaming Shop

Gaming Shop is a full-stack game catalog application built with React, Vite, Express, and PostgreSQL.

The React frontend displays games in a responsive catalog, provides pagination, live title search, game details, and a persistent shopping cart. The Express API retrieves catalog data from PostgreSQL.
Users can register and log in through the API. Passwords are hashed with Node.js `scrypt`; the frontend keeps the returned public user details in browser `sessionStorage` until logout or the tab's session ends.


## Features

- Responsive game catalog
- Four-game pagination with a maximum of five pages
- Debounced live search
- Search result dropdown
- Game detail view
- Shopping cart with quantity controls
- Cart item count in the navigation
- Cart data persisted in browser local storage
- User registration and login
- User session retained for the browser tab session, with a header logout action
- Empty-cart and clear-cart states
- Calculated item totals and cart total
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
│       ├── AuthContext.jsx
│       ├── CartContext.jsx
│       ├── CartPage.jsx
│       ├── Core.jsx
│       ├── Head.jsx
│       ├── Foot.jsx
│       ├── LoginPage.jsx
│       ├── RegisterPage.jsx
│       ├── Search.jsx
│       ├── App.css
│       └── index.css
└── node-pg/
    └── backend/
        ├── index.js
        ├── games.js
        ├── register.js
        ├── users.js
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

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL CHECK (char_length(username) >= 3),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL
);
```

The registration endpoint normalizes email addresses to lowercase and stores a
`scrypt` password hash in `password_hash`; clients should send the password
itself to the API, not a precomputed hash.

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

The backend uses these values with PostgreSQL connection pools. If a variable
is omitted, the current defaults are `postgres`, `localhost`, `gamestore`,
`123`, and `5432`, respectively. Set a strong local `PG_PASSWORD` rather than
relying on the development fallback.

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
| `POST` | `/register` | Creates an account and returns its username and email |
| `POST` | `/login` | Verifies credentials and returns the user's username and email |

Registration and login accept JSON:

```json
{
  "username": "player1",
  "email": "player@example.com",
  "password": "your-password"
}
```

For login, send only `email` and `password`. Registration returns `201`,
successful login returns `200`, invalid input returns `400`, incorrect login
credentials return `401`, and an already-registered email returns `409`.

Example:

```text
http://localhost:3000/search?title=zelda
```

## Frontend Routes

| Route | Purpose |
| --- | --- |
| `/` | Game catalog |
| `/game?title=<title>` | Selected game details |
| `/cart` | Shopping cart |
| `/login` | Login form |
| `/register` | Registration form |
| `/foot` | Footer component demo route |

## Authentication

The login and registration forms send credentials to the backend and navigate
home after success. The backend hashes passwords using `scrypt` and returns
only the user's username and email. The frontend stores that public profile
under `gaming-shop-user` in browser `sessionStorage`; the header changes to a
logout action while a user is present. Logging out removes the stored profile.

This is client-side session state, not a server-issued session or access token.
The password-reset link is present, but password reset is not implemented.

## Shopping Cart

The cart is managed by `CartContext.jsx` and shared across the application through React Context.

Users can:

- Add a game from the catalog
- Add a game from its detail page
- Increase or decrease an item quantity
- Remove an individual item
- Clear the complete cart
- View the item count and total price

Cart entries are stored in browser `localStorage` under the key `gaming-shop-cart`. Reloading the page restores the saved cart.

The checkout button is currently a placeholder and does not process a payment.

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
- **Cart items disappear:** Check whether browser local storage is enabled or whether the browser data has been cleared.
