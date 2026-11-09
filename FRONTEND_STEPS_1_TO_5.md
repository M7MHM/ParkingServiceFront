# Parking Frontend — steps 1–5

This file records the first implementation pass. It is a progress note, not a claim that the full frontend is complete.

## 1. Backend reference

- `_backend_reference/` is present locally and ignored by Git.
- Keep it for API and CQRS contract lookups while building the frontend.
- It contains environment files, database files, and build output as well as source. Do not add it to GitHub or include it in deployment.

## 2. Git state

- The checked-out branch is `main`; local `main` and `origin/main` point to commit `d163e33`.
- Local `origin/HEAD` still points to `feat/parking-frontend-startup`. Check the repository's default-branch setting on GitHub and change it to `main` if that is the intended default.
- Before this pass, `.gitignore`, `package.json`, and `package-lock.json` had local changes. Those dependency changes were preserved. No commit or push was made.

## 3. Backend contract snapshot

Confirmed in the copied C# controllers:

| Area | Backend route | Frontend status |
| --- | --- | --- |
| Auth | `POST /api/auth/register`, `POST /api/auth/login` | Existing API service and server actions match; login and registration pages now use them. |
| Parking lots | `GET /api/parking-lots/{id}`, `POST /api/parking-lots` | Existing detail/create calls match. |
| Spots | `GET /api/parking-lots/{parkingLotId}/spots/available`, `POST /api/parking-lots/{parkingLotId}/spots` | Backend supports both; frontend service/actions still need these flows. |
| Bookings | `GET /api/bookings/{id}`, `POST /api/bookings`, `POST /api/bookings/{id}/cancel`, `POST /api/bookings/{id}/complete` | Frontend booking schemas exist, but the service/actions and UI flows are still pending. |

The copied backend snapshot does not currently define a parking-lot list route, parking-lot `PUT`/`DELETE`, or a bookings list route. The frontend has assumed list/update/delete calls in places; confirm or add those backend endpoints before relying on those calls.

## 4. API configuration

- `.env.local` has a non-empty `NEXT_PUBLIC_API_BASE_URL`; its value is intentionally not recorded here.
- `.env.example` documents the variable without exposing the local URL.
- The copied backend CORS policy currently allows `http://localhost:3000`. The existing auth actions call the API from the Next.js server, so browser CORS does not apply to those calls. Add the deployed frontend origin if the browser will call the API directly.

## 5. Authentication entry points

- Added `/login` and `/register` pages connected to the existing server actions.
- Forms display field and API errors, preserve non-sensitive form values, and show a pending state while submitting.
- Replaced the default Next.js starter home page with a small Parking landing page that links to parking, sign-in, and registration.

## Not verified in this pass

- No build, lint, or end-to-end run was performed.
- The backend was inspected as a local reference; no backend files were changed.
