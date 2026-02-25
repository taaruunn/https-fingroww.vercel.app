# Cricrox System Architecture

## 1) High-level Architecture

- **Next.js frontend** for admin/scorer/viewer interfaces.
- **Node backend** (Express/Nest) exposing REST + WebSocket.
- **PostgreSQL** for normalized cricket/tournament data.
- **Prisma** for ORM and migrations.
- **Socket.io** for live score push events.

Flow:
1. Scorer submits ball event via API.
2. Scoring engine computes derived state.
3. Ball + snapshots persisted in DB transaction.
4. `scoreUpdate` + `ballAdded` pushed via WebSocket.
5. Viewer pages update in realtime.

## 2) Role Model

- `ADMIN`: full tournament control
- `SCORER`: match setup + ball-by-ball scoring + undo/edit
- `VIEWER`: public read-only pages

## 3) REST API Blueprint

### Tournament Management
- `POST /api/tournaments`
- `POST /api/tournaments/:id/teams`
- `POST /api/teams/:id/players`
- `POST /api/matches`
- `POST /api/matches/:id/squads`
- `PATCH /api/tournaments/:id/rules`

### Scoring
- `POST /api/matches/:id/start`
- `POST /api/innings/:id/balls`
- `POST /api/innings/:id/undo`
- `PATCH /api/innings/:id/overs/:overNo`
- `POST /api/innings/:id/end`

### Public
- `GET /api/matches/:id/live`
- `GET /api/matches/:id/scorecard`
- `GET /api/tournaments/:id/points-table`
- `GET /api/tournaments/:id/leaders`
- `GET /api/teams/:id`
- `GET /api/players/:id`

## 4) WebSocket Events

- `scoreUpdate` — total, wickets, overs, RR, RRR
- `ballAdded` — normalized ball event and computed aftermath
- `undoBall` — ball reverted and snapshots refreshed
- `matchStatus` — toss/start/innings-break/result

## 5) Scoring Rules (Implemented in `engine.ts`)

- Legal ball increments when extra is not `WIDE` and not `NO_BALL`.
- Batter runs = `runsOffBat` only.
- Extras tracked by type: wide/no-ball/bye/leg-bye/penalty.
- Over closes after 6 legal balls.
- Strike rotates on odd runs from completed run total.
- Wickets support dismissal metadata and count unless retired.

## 6) Edge Cases Covered

- Wides/no-balls do not consume legal delivery.
- Byes/leg-byes consume legal delivery.
- Retired dismissal recorded but not counted as wicket by default.
- Undo last ball recomputes innings state from history.

## 7) Phase Plan

1. **Phase 1**: Prisma schema + contracts (done here).
2. **Phase 2**: Scoring engine + tests (done here).
3. **Phase 3**: API implementation + auth guards.
4. **Phase 4**: Next.js scorer UI + live public page.
5. **Phase 5**: Leaderboards, points table, NRR policies.
