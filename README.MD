# spiral

Website for tracking your skating skill progress through Learn to Skate tracks.

**Stack:** React/Typescript, Python/FastAPI

The frontend authenticates with Supabase, and the FastAPI backend verifies JWT bearer tokens before serving protected API routes.

## Environment

### Frontend

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Backend

- `DATABASE_URL`
- `SUPABASE_JWKS_URL`
- `SUPABASE_ISSUER`

Currently supported tracks:

- Basic
- Adult
- Pre-freeskate
- Freeskate

I plan to add more tracks and/or let users create their own eventually...

Upcoming features:

- [x] Drag and drop kanban UI for skill tracking
- [ ] Calendar-based diary page for logging your practices
- [ ] Graphs to see your progress over time
- [ ] Deploy the website!
