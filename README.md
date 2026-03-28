# MoMA Art Collection App

A full-stack web application for browsing, searching, and managing artworks from the Museum of Modern Art (MoMA) collection. Built with Next.js, React, MongoDB, and Tailwind CSS.

## Features

- **Browse** — Paginated gallery grid displaying artwork images, titles, artists, dates, and classifications
- **Search** — Search artworks by title or artist with server-side filtering
- **Add** — Create new artwork entries via a form
- **Edit** — Update existing artwork details
- **Delete** — Remove artworks from the collection
- **Auto-Seed** — Database is automatically populated with 1,000 artworks from the MoMA dataset on first load

## Tech Stack

| Layer      | Technology                  |
| ---------- | --------------------------- |
| Framework  | Next.js 16                  |
| Frontend   | React 19, Tailwind CSS 4    |
| HTTP       | Axios                       |
| Database   | MongoDB (In-Memory)         |
| ODM        | Mongoose                    |

> The app uses [mongodb-memory-server](https://github.com/typegoose/mongodb-memory-server) so there is **no need to install or run MongoDB** — it runs entirely in-memory.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd moma-art-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open the app** — visit [http://localhost:3000](http://localhost:3000) in your browser

The database seeds automatically on first page load — no manual setup required.

## Project Structure

```
src/
├── app/
│   ├── layout.js              # Root layout with navbar and footer
│   ├── page.js                # Main gallery page (search, CRUD, pagination)
│   ├── about/page.js          # About page (architecture, tech, limitations)
│   └── api/
│       ├── seed/route.js      # GET — seeds 1,000 artworks into the database
│       └── artworks/
│           ├── route.js       # GET (paginated + search) / POST (create)
│           └── [id]/route.js  # GET (single) / PUT (update) / DELETE
├── lib/
│   ├── mongodb.js             # MongoDB in-memory connection helper
│   └── Artwork.js             # Mongoose schema and model
data/
└── Artworks.json              # MoMA dataset used for seeding
```

## API Endpoints

| Method | Endpoint             | Description                          |
| ------ | -------------------- | ------------------------------------ |
| GET    | `/api/seed`          | Seed the database with MoMA artworks |
| GET    | `/api/artworks`      | List artworks (paginated + search)   |
| POST   | `/api/artworks`      | Create a new artwork                 |
| GET    | `/api/artworks/:id`  | Get a single artwork by ID           |
| PUT    | `/api/artworks/:id`  | Update an artwork by ID              |
| DELETE | `/api/artworks/:id`  | Delete an artwork by ID              |

### Query Parameters (GET /api/artworks)

- `page` — Page number (default: 1)
- `limit` — Results per page (default: 12)
- `search` — Filter by title or artist name

## Available Scripts

| Command         | Description                        |
| --------------- | ---------------------------------- |
| `npm run dev`   | Start the development server       |
| `npm run build` | Build for production               |
| `npm run start` | Start the production server        |
| `npm run lint`  | Run ESLint                         |
