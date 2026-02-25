# Cricrox (Cricbuzz-like Tournament Scoring Platform)

This repository now contains a **Phase 1 + Phase 2 foundation** for a cricket tournament scoring platform with:

- Tournament management domain model (Prisma/PostgreSQL)
- REST API contract design
- Real-time WebSocket event contract
- Ball-by-ball scoring engine (pure functions)
- Edge-case aware scoring rules (legal ball counting, extras, wickets, strike rotation)

## Recommended Stack

- **Frontend:** Next.js + Tailwind CSS
- **Backend:** Node.js (Express or NestJS)
- **Database:** PostgreSQL + Prisma ORM
- **Realtime:** Socket.io
- **Auth:** JWT with `ADMIN`, `SCORER`, `VIEWER`

## Project Structure

- `docs/system-architecture.md` — architecture, routes, socket events, phased roadmap
- `prisma/schema.prisma` — full relational schema for tournaments, scoring, and stats
- `src/scoring/engine.ts` — deterministic scoring engine for ball events
- `src/scoring/engine.test.ts` — scoring engine validation tests

## Quick Start

```bash
npm install
npm test
```

## Next Phases

1. Implement Express/Nest routes defined in the architecture doc.
2. Add Prisma migrations and seed scripts for 4 teams / 60 players / 6 matches.
3. Build Next.js pages:
   - Tournament list/dashboard
   - Match live + scorecard
   - Scorer panel (mobile-first)
4. Hook scorer actions to WebSocket broadcasts.
5. Add points table + NRR aggregation jobs.
