# MoMA Art App — Progress Tracker

## Completed

### Layer 1 — Database
- `src/lib/mongodb.js` — Connection helper using `mongodb-memory-server` + `mongoose`
- `src/lib/Artwork.js` — Mongoose schema/model with all MoMA dataset fields
- `src/app/api/seed/route.js` — Seeds 1,000 artworks from `data/Artworks.json` into MongoDB

### Layer 2 — API Routes (CRUD)
- `src/app/api/artworks/route.js` — GET (paginated + search) and POST (create)
- `src/app/api/artworks/[id]/route.js` — GET (single), PUT (update), DELETE

### Layer 3 — Frontend
- `src/app/layout.js` — Nav bar (Gallery, About links) + footer
- `src/app/page.js` — Main gallery page with:
  - Artwork grid with images
  - Search by title/artist
  - Pagination
  - Add/Edit/Delete forms
  - Auto-seeds database on first load
- Uses Axios for all API requests
- Tailwind CSS for styling

---

## Remaining

### Required
- [ ] About page (`src/app/about/page.js`) — how it works, tech used, limitations, alternatives
- [ ] README.md — install & run instructions

### Higher Marks
- [ ] Filter by classification, department, artist
- [ ] Sort results (by date, title, artist)
- [ ] User profiles & purchase tracking
- [ ] UI polish — transitions, animations, loading states
- [ ] Input validation & error handling
- [ ] Responsive design improvements
- [ ] Scale dataset to 10,000 items

### Final
- [ ] Record 2-5 min video demo
