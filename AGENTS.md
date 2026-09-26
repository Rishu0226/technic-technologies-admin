<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:admin-implementation-rules -->
# Technic Technologies Admin

`FRONTEND.md` is the inventory of routes, APIs, forms, and flows. `DESIGN.md` is the visual system. The source wins when `ADMIN_IMPLEMENTATION_PLAN.md` disagrees. That plan still correctly forbids database access from this app.

This package is the admin console. It is not the public site and it is not the backend.

## Stack and folders

- Next.js 16 App Router under `src/app`. React 19. TypeScript. Tailwind v4.
- Dev server port is `3006` (`npm run dev`).
- Layout chrome lives in `components/admin/layout`. Shared controls live in `components/admin/ui`.
- HTTP lives in `src/lib/api.ts` (`ApiClient`). Image upload lives in `src/lib/upload.ts`. The cookie lives in `src/lib/session.ts`.
- Route protection is `src/proxy.ts`. Do not add a second auth check that fights it.
- Pages under `src/app/admin/(dashboard)` are client components wrapped by `AdminLayout`. The `(dashboard)` segment is not part of the URL.
- Do not add Redux, Zustand, or React Query unless the task explicitly changes the architecture. State is `useState`.
- `react-hook-form` is used on the login page only. Other forms are controlled state. Match the file you are editing.
- Toasts are `react-hot-toast`, mounted once in `AdminLayout`.

## Routes

Cookie required for every `/admin` path except `/admin/login`.

| Path | Meaning |
| --- | --- |
| `/admin` | Dashboard. There is no `/admin/dashboard` page |
| `/admin/blogs`, `/admin/careers`, `/admin/services`, `/admin/solutions`, `/admin/products` | Lists |
| `/admin/{module}/new` | Create. Do not invent `/create` |
| `/admin/{module}/[id]` | Edit. Do not invent `/edit` |
| `/admin/services/[id]/preview`, `/admin/solutions/[id]/preview` | Draft preview |
| `/admin/applications`, `/admin/applications/[id]` | Review only. No delete |
| `/admin/contacts`, `/admin/contacts/[id]` | Read, status, delete |
| `/admin/media` | Upload and copy URL. No delete |
| `/admin/settings` | Site settings |

`id === "new"` is the create mode inside the `[id]` page.

## API rules

- Base URL: `NEXT_PUBLIC_API_URL`, default `http://localhost:3001`.
- Send the existing Bearer token through `ApiClient`. Do not put secrets in this repo.
- Keep `withCredentials: true`.
- Do not call `POST /api/session` or `DELETE /api/session` unless you are deliberately switching the login cookie to the httpOnly route and updating `src/proxy.ts` and `readAdminToken` together. Login currently writes a JS-readable `token` cookie via `saveAdminToken`.
- A 401 that is not the login request must keep clearing the cookie and sending the browser to `/admin/login`.
- List pages for blogs, careers, and products load with the public GET (`/api/blogs`, `/api/careers`, `/api/products`) and find the row by `_id`. Service and solution editors use `GET /api/admin/services/:id` and `GET /api/admin/solutions/:id`. Do not mix those patterns by accident.
- Mutations:
  - `POST` and `PUT` `/api/admin/{blogs|careers|services|solutions|products}`
  - `DELETE /api/admin/{module}/:id` for those five, plus contacts
  - `PUT /api/admin/contacts/:id` with `{ status }`
  - `PUT /api/admin/applications/:id/status` with `{ status, notes }`
  - `PUT /api/admin/settings`
  - `POST /api/admin/upload` as multipart (`image`, `folder`)
  - `POST /api/admin/ai/generate-{blog|career|service|solution}` with `{ prompt }`
- No PATCH and no query-string pagination exist. Do not add them without a backend contract.
- Save success redirects to the list with `router.push`. Delete success uses `toast.success` and refetches. Do not toast a save that already redirects.
- Opening a contact with status `New` silently sets `Read`. Opening an application with status `New` silently sets `Reviewing`. Keep those unless the task changes them.

## Auth and permissions

There are no roles. The header words “Admin” and “Superuser” are static. Do not hide buttons based on that label. Any code that adds real roles must be driven by an API field, not that text.

## Forms and content rules

- Service and solution slugs must match `/^[a-z0-9]+(?:-[a-z0-9]+)*$/` before the request.
- On create, those slugs follow the title until the admin edits the slug.
- On solution edit, warn when the slug changes.
- Empty repeaters (features, FAQs, blank strings) are stripped before save. Keep that.
- Career application fields use the `COMMON_FIELDS` set. Common fields can be hidden, not deleted. Custom fields may use `text`, `email`, `tel`, `textarea`, `select`, or `file`.
- `applicationEmail` is in the career payload and has no input. Do not drop it from the payload.
- AI generation updates form state only. It must not save by itself. On service and solution generation, keep already uploaded image URLs.
- Image uploads: JPG, PNG, WEBP, GIF, or a video MIME, and at most 4 MB. Folder is one of `blogs`, `products`, `services`, `solutions`, `media`.

## UI

Follow `DESIGN.md`. Light theme only. Use `technic-*` classes, `.tn-input`, and `.tn-label`.

- Sidebar is fixed and hidden below `md`. Do not make a second navigation.
- Tables scroll horizontally (`min-w-[720px]`). They have no search, filter, or pagination. Do not pretend the header search box searches; it is not wired.
- Deletes go through `ConfirmDialog`.
- Published services and solutions link to `NEXT_PUBLIC_SITE_URL`. Drafts use the in-admin preview.
- Status values already in the UI must stay spelled the same: `Draft`, `Published`, `Closed`, `New`, `Read`, `Responded`, `Archived`, `Reviewing`, `Shortlisted`, `Interview`, `Rejected`, `Hired`.

## Do not break

- `src/proxy.ts` matcher: `/` and `/admin/:path*`. Public files such as `/Assest/logo-brand.png` must stay outside it.
- Login must still require `response.data.token` before navigation.
- Dashboard counts are array lengths. A failed request becomes 0 for that card. The “Database Connected” panel is static copy, not a health check.
<!-- END:admin-implementation-rules -->
