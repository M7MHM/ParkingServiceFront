# Parking App — frontend

A parking management web app. Customers browse parking lots, pick a spot and a time slot, book it and manage their bookings. Administrators manage parking lots and their spots. It is the web client for a .NET parking API (JWT auth, CQRS) and runs fully offline against built-in demo data.

> Built with the Next.js App Router, React 19 and TypeScript, with a strong focus on type-safe API contracts, server-first data fetching and accessible, mobile-first UI.

## Features

**Customers**
- Browse parking lots with live availability, pricing and opening hours
- Lot detail page with the list of currently available spots
- Booking form: pick a spot, choose start and end time, see an instant price estimate
- Validation mirrors the backend rules (start not in the past, end after start, within opening hours)
- Friendly handling of conflicts, e.g. "that spot was just taken" refreshes the spot list
- "My bookings": upcoming and past tabs, expandable details, cancellation with a confirmation dialog

**Administrators**
- Dashboard of all parking lots with status and availability
- Create, edit and delete parking lots
- Spot management per lot: add, edit and delete spots (size, rate, EV charger, covered, accessible)

**Platform**
- Cookie-based session (HttpOnly) with route protection and post-login redirects
- Role-aware navigation and admin area, responsive from phone to desktop
- Loading skeletons, empty states, error boundaries and not-found pages

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components, Server Actions, Cache Components, Proxy) |
| UI | React 19, Tailwind CSS 4, lucide-react |
| Language | TypeScript (strict) |
| Forms and validation | React Hook Form, Zod 4 (`@hookform/resolvers`) |
| Auth | JWT issued by the API, stored in an HttpOnly cookie |

## Getting started

Requires Node.js 20 or newer.

```bash
npm install
cp .env.example .env.local   # on Windows: copy .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. With the default `MOCK_API=true` no backend is needed:

| Account | How |
| --- | --- |
| Customer | Sign in with any email and password. Comes with sample bookings. |
| Administrator | Sign in with an email that starts with `admin`, for example `admin@demo.com`. |

Scripts: `npm run dev`, `npm run build`, `npm start`, `npm run lint`.

### Using the real API

Set `MOCK_API=false` and `NEXT_PUBLIC_API_BASE_URL` to your API in `.env.local`. The variable is only read on the server, so no browser CORS configuration is needed for it.

The API does not implement everything the UI needs yet, so a few features are limited against it:

| Feature | Endpoint | Real API | Behaviour with `MOCK_API=false` |
| --- | --- | --- | --- |
| Sign in, register | `POST /api/auth/*` | yes | real |
| Lot detail, available spots | `GET /api/parking-lots/{id}`, `.../spots/available` | yes | real |
| Create lot, add spot | `POST /api/parking-lots`, `.../spots` | yes | real |
| Create and cancel booking | `POST /api/bookings`, `.../{id}/cancel` | yes | real |
| List parking lots | `GET /api/parking-lots` | missing | demo data |
| List my bookings | `GET /api/bookings` | missing | demo data (your new bookings do not appear) |
| Update or delete a lot | `PUT`/`DELETE /api/parking-lots/{id}` | missing | real call, fails until implemented |
| Update or delete a spot | `PUT`/`DELETE .../spots/{spotId}` | missing | real call, fails until implemented |
| List all spots of a lot | n/a | missing | shows available spots only |

Each of these lives in one service function (see the `*.service.ts` files), so switching to a real endpoint when it ships is a one-line change.

## Architecture

The code is organised by feature, with a thin routing layer on top and shared building blocks underneath.

```
src/
  app/                    Routes only: layouts, pages, loading and error boundaries
    parkings/             Public browsing and the booking page
    (customer)/bookings/  Signed-in customer area
    admin/parkings/       Admin area
    (auth)/               Login and register
  features/               One folder per domain: parkings, bookings, auth
    <feature>/
      api/                Service functions: the only code that talks to the API
      actions/            Server Actions: validate input, call a service, return a typed result
      schemas/            Zod schemas for requests, responses and forms
      types/              TypeScript types mirroring the backend contracts
      components/         Feature UI (server components by default, client where needed)
  components/ui/          Reusable design-system pieces: Button, Alert, Badge, EmptyState, ConfirmDialog ...
  components/layout/      Site header and responsive navigation
  lib/                    API client, session handling, shared helpers
  mocks/                  In-memory demo backend used by MOCK_API
  proxy.ts                Route protection
```

Key decisions:

- **Server-first.** Pages are Server Components that fetch data and stream behind `Suspense` boundaries. Only interactive pieces (forms, dialogs, navigation) are client components. Mutations are Server Actions.
- **The browser never sees the token or the API.** The JWT lives in an HttpOnly cookie. All API calls happen on the server through one typed client, which adds the `Authorization` header, applies a timeout, and turns RFC 7807 problem responses into a typed `ApiError`.
- **Validate at the boundary, in both directions.** Zod schemas parse every API response (a contract change fails loudly instead of rendering garbage) and validate user input twice: in the browser for instant feedback, and again in the Server Action as the authoritative check.
- **Backend rules are mirrored, not guessed.** Booking validation, price rounding (whole hours, rounded up) and cancellation rules follow the backend source.
- **Optimistic route protection.** `src/proxy.ts` redirects signed-out visitors away from `/bookings` and `/admin`, and signed-in users away from `/login` and `/register`. It only checks that a session cookie exists; the API remains the real authority. The admin layout adds a role check for UX.
- **A swappable mock backend.** `src/mocks` is a small in-memory implementation of the API with the same rules and error statuses (404, 409, 400), so conflicts, cancellations and admin edits behave realistically offline.

## Known limitations

- Demo data lives in server memory: it resets when the server restarts and is not shared between serverless instances. Use it for previews, not production.
- Opening hours are compared with the booking start in UTC, because that is what the backend does. The UI labels them accordingly.
- No automated tests yet.
