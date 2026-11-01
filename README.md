# RevTech Frontend

React + Vite + TypeScript frontend prepared for local development and subsequent integration with the existing RevTech FastAPI backend.

## Requirements

- Node.js 20.19+ (or 22.12+)
- npm
- Visual Studio Code

## Run locally

1. Extract this ZIP and open the `revtech-frontend` folder in VS Code.
2. Open **Terminal → New Terminal**.
3. Install packages: `npm install`
4. Copy `.env.example` to `.env.local`.
5. Start the frontend: `npm run dev`
6. Open the localhost URL printed by Vite.

## Commands

- `npm run dev` — development server
- `npm run build` — TypeScript check and production build
- `npm run preview` — preview production build
- `npm run lint` — TypeScript checks

## Backend integration status

- Frontend only. The FastAPI backend and its database are not included or modified.
- Hackathon scenario UI and seeded catalogue/provider/parts/review/warranty records have been removed.
- Product, spare-parts and provider service adapters currently return empty results rather than invented records. Empty states should be shown until real API data is connected.
- `src/services/apiClient.ts` is the centralized HTTP client. It reads `VITE_API_BASE_URL` and provides JSON parsing and structured HTTP errors.
- `.env.example` defaults to `http://127.0.0.1:8000`. Change it only if your backend uses another address.
- No API route paths or request/response schemas have been assumed. Before wiring individual features, inspect the running FastAPI Swagger page at `http://127.0.0.1:8000/docs` and map the exact routes and schemas into the service layer.
- Gemini integration is not configured yet. Do not put Gemini keys, admin keys, or other secrets in frontend environment variables.
- The login screen is a UI placeholder only. Sign-in does not authenticate, create sessions, or protect API routes. The “Preview the application” link is for frontend review only.
- Authentication and user-specific persistence are not integrated yet. Browser-local device storage is temporary and must be replaced by authenticated backend persistence before production.
- No backend endpoint has been wired or guessed. The frontend is an integration scaffold, not a completed backend-connected application.

## Integration rules

1. Preserve the backend's existing endpoint names and Pydantic schemas.
2. Keep all HTTP calls inside `src/services/`; do not call `fetch` directly from page components.
3. Implement loading, error, empty and success states for every API-backed page.
4. Display source, verification status and uncertainty supplied by the backend. Never label unverified stock, pricing, repair centres or specifications as verified.
