# Technic Technologies Admin — Frontend

This document describes the **current admin application** in `technic-technologies-admin`. It was written from the source. Where `ADMIN_IMPLEMENTATION_PLAN.md` or `DESIGN.md` disagrees with the code, the code is the current implementation and the conflict is called out.

The admin edits content for the public marketing site: blogs, careers, services, solutions, products, inquiries, job applications, media, and site settings. It does not talk to a database itself. It calls the backend REST API.

There is no role or permission system. A valid `token` cookie is the only gate.

---

## 1. Project overview

| Item | Actual implementation |
| --- | --- |
| Name | `technic-technologies-admin` (`package.json` version `0.1.0`, private) |
| Purpose | Content and operations console for Technic Technologies |
| Domain | Software products and technology services marketing content |
| Framework | Next.js `16.3.4` App Router (`src/app`) |
| Language | TypeScript, React `19.2.8` |
| UI kit | Custom Tailwind components. `@mui/material` is used only by `ConfirmDialog` |
| CSS | Tailwind CSS v4 (`@tailwindcss/postcss`). Tokens in `src/app/globals.css` |
| Icons | `lucide-react` |
| State | React `useState` / `useEffect`. No Redux, Zustand, Context store, or React Query |
| Forms | `react-hook-form` on the login page only. Every other form is controlled state |
| Validation | HTML `required` plus a slug regex on services and solutions. No Zod or Yup |
| HTTP | `axios` `ApiClient` in `src/lib/api.ts`. Image upload uses `fetch` + `FormData` |
| Auth library | None. Custom cookie helpers in `src/lib/session.ts` |
| Toasts | `react-hot-toast` |
| Dev server | `next dev -p 3006` |
| Production start | `next start` (no port flag; Next default 3000) |
| Build | `next build` with `NODE_OPTIONS=--max-old-space-size=8192` |

---

## 2. Project structure

```text
technic-technologies-admin/
├── src/
│   ├── proxy.ts                         # Route guard (Next.js proxy)
│   ├── app/
│   │   ├── layout.tsx                   # Geist fonts, metadata
│   │   ├── page.tsx                     # Marketing-style landing (usually redirected)
│   │   ├── globals.css
│   │   ├── api/session/route.ts         # Cookie setter. Not called by the login UI
│   │   └── admin/
│   │       ├── login/page.tsx
│   │       └── (dashboard)/
│   │           ├── layout.tsx           # Wraps pages in AdminLayout
│   │           ├── page.tsx             # /admin
│   │           ├── blogs/
│   │           ├── careers/
│   │           ├── services/
│   │           ├── solutions/
│   │           ├── products/
│   │           ├── applications/
│   │           ├── contacts/
│   │           ├── media/page.tsx
│   │           └── settings/page.tsx
│   └── lib/
│       ├── api.ts
│       ├── session.ts
│       └── upload.ts
├── components/admin/
│   ├── layout/   AdminLayout, AdminSidebar, AdminHeader
│   └── ui/       ConfirmDialog, ImageUpload, AIGenerator
├── AGENTS.md
├── DESIGN.md
├── ADMIN_IMPLEMENTATION_PLAN.md
└── package.json
```

The `(dashboard)` segment is a route group. It does not appear in the URL.

| Path | Responsibility |
| --- | --- |
| `src/proxy.ts` | Redirects `/` and unauthenticated `/admin/*` |
| `src/lib/api.ts` | Axios instance, Bearer header, 401 redirect |
| `src/lib/session.ts` | Read, write, and clear the `token` cookie from the browser |
| `src/lib/upload.ts` | Multipart image upload |
| `components/admin/layout` | Sidebar, header, toast host |
| `components/admin/ui` | Delete confirm, image field, AI prompt |

There is no `hooks/`, `store/`, `context/`, or shared `DataTable`. List pages each render their own `<table>`.

---

## 3. Architecture

```text
Browser
  ↓
src/proxy.ts (cookie named token?)
  ↓
Page (almost all are "use client")
  ↓
ApiClient (axios, baseURL NEXT_PUBLIC_API_URL, withCredentials, Bearer token)
  ↓
Backend REST API (default http://localhost:3001)
  ↓
response.data
  ↓
useState
  ↓
Table, form, or toast
```

`next.config.ts` only sets `experimental.cpus` and `workerThreads: false`. There is no image remote-pattern config in this app.

---

## 4. Routes

Every `/admin` page except login requires a `token` cookie. There are no role-specific routes.

| Route | Page | Purpose | Auth | Role | APIs |
| --- | --- | --- | --- | --- | --- |
| `/` | `src/app/page.tsx` | Landing with a link to login | Proxy redirects before render | None | None |
| `/admin/login` | `admin/login/page.tsx` | Sign in | Public. A token redirects to `/admin` | None | `POST /api/auth/login` |
| `/admin` | `(dashboard)/page.tsx` | Counts and shortcuts | Cookie | None | `GET /api/careers`, `/api/blogs`, `/api/services`, `/api/products`, `/api/admin/contacts` |
| `/admin/blogs` | `blogs/page.tsx` | Blog list | Cookie | None | `GET /api/blogs`, `DELETE /api/admin/blogs/:id` |
| `/admin/blogs/new` | `blogs/[id]/page.tsx` (`id === "new"`) | Create blog | Cookie | None | `POST /api/admin/blogs`, `POST /api/admin/ai/generate-blog`, `POST /api/admin/upload` |
| `/admin/blogs/[id]` | same | Edit blog | Cookie | None | `GET /api/blogs`, `PUT /api/admin/blogs/:id`, AI, upload |
| `/admin/careers` | `careers/page.tsx` | Job list | Cookie | None | `GET /api/careers`, `DELETE /api/admin/careers/:id` |
| `/admin/careers/new` | `careers/[id]/page.tsx` | Create job | Cookie | None | `POST /api/admin/careers`, `POST /api/admin/ai/generate-career` |
| `/admin/careers/[id]` | same | Edit job | Cookie | None | `GET /api/careers`, `PUT /api/admin/careers/:id`, AI |
| `/admin/services` | `services/page.tsx` | Service list | Cookie | None | `GET /api/services`, `DELETE /api/admin/services/:id` |
| `/admin/services/new` | `services/[id]/page.tsx` | Create service | Cookie | None | `POST /api/admin/services`, `POST /api/admin/ai/generate-service`, upload |
| `/admin/services/[id]` | same | Edit service | Cookie | None | `GET /api/admin/services/:id`, `PUT`, AI, upload |
| `/admin/services/[id]/preview` | `services/[id]/preview/page.tsx` | Draft preview | Cookie | None | `GET /api/admin/services/:id` |
| `/admin/solutions` | `solutions/page.tsx` | Solution list | Cookie | None | `GET /api/solutions`, `DELETE /api/admin/solutions/:id` |
| `/admin/solutions/new` | `solutions/[id]/page.tsx` | Create solution | Cookie | None | `POST /api/admin/solutions`, `POST /api/admin/ai/generate-solution`, upload |
| `/admin/solutions/[id]` | same | Edit solution | Cookie | None | `GET /api/admin/solutions/:id`, `PUT`, AI, upload |
| `/admin/solutions/[id]/preview` | `solutions/[id]/preview/page.tsx` | Draft preview | Cookie | None | `GET /api/admin/solutions/:id` |
| `/admin/products` | `products/page.tsx` | Product list | Cookie | None | `GET /api/products`, `DELETE /api/admin/products/:id` |
| `/admin/products/new` | `products/[id]/page.tsx` | Create product | Cookie | None | `POST /api/admin/products`, upload |
| `/admin/products/[id]` | same | Edit product | Cookie | None | `GET /api/products`, `PUT /api/admin/products/:id`, upload |
| `/admin/applications` | `applications/page.tsx` | Application list | Cookie | None | `GET /api/admin/applications` |
| `/admin/applications/[id]` | `applications/[id]/page.tsx` | Review one application | Cookie | None | `GET /api/admin/applications`, `PUT /api/admin/applications/:id/status` |
| `/admin/contacts` | `contacts/page.tsx` | Inquiry list | Cookie | None | `GET /api/admin/contacts`, `DELETE /api/admin/contacts/:id` |
| `/admin/contacts/[id]` | `contacts/[id]/page.tsx` | Read inquiry, change status | Cookie | None | `GET /api/admin/contacts`, `PUT /api/admin/contacts/:id` |
| `/admin/media` | `media/page.tsx` | Image library | Cookie | None | `GET /api/admin/media`, `POST /api/admin/upload` |
| `/admin/settings` | `settings/page.tsx` | Site contact settings | Cookie | None | `GET /api/settings`, `PUT /api/admin/settings` |
| `POST /api/session` | `src/app/api/session/route.ts` | Set an httpOnly `token` cookie | Called by nothing in this UI | None | Local route |
| `DELETE /api/session` | same | Clear that cookie | Called by nothing in this UI | None | Local route |

`/admin/dashboard` is not a page. The sidebar treats that path as the dashboard for the active style only.

Create and edit share one dynamic page. The create URL is `/admin/{module}/new`, not `/create` or `/[id]/edit`.

---

## 5. Navigation

```text
Dashboard                         /admin
Content
├── Blogs                         /admin/blogs
├── Careers                       /admin/careers
├── Services                      /admin/services
├── Solutions                     /admin/solutions
└── Products                      /admin/products
Applications
├── Job Applications              /admin/applications
└── Contacts                      /admin/contacts
Media
└── Media Library                 /admin/media
Configuration
└── Site Settings                 /admin/settings
Logout                            (button, not a route)
```

Icons are Lucide: `LayoutDashboard`, `FileText`, `Briefcase`, `Layers`, `Building2`, `Box`, `Users`, `Inbox`, `Image`, `Settings`, `LogOut`.

Visibility is not filtered by role. Every signed-in visitor sees every item.

Active item: path equals `/admin` for the dashboard, otherwise `pathname.startsWith(href)`. Active style is cyan soft background, deep cyan text, and a cyan left border.

The sidebar is fixed at `w-64`. From `md` up it stays open and the content uses `md:pl-64`. Below `md` it is off-canvas (`-translate-x-full`) until the header menu sets `open`. A dimmed backdrop closes it. Any pathname change also closes it.

There is no collapsed desktop rail.

Header (`AdminHeader`):

- Menu button below `md`.
- Search input from `sm` up. It has no `onChange`, no query, and no API. It does nothing.
- Bell button with an orange dot. No notification list and no API.
- Static label “Admin” / “Superuser”. It is not loaded from the login response.

Logout is only in the sidebar.

---

## 6. Authentication

```text
Open /admin/* without a token cookie
        ↓
src/proxy.ts redirects to /admin/login
        ↓
Email + password (react-hook-form, both required)
        ↓
POST /api/auth/login { email, password }
        ↓
response.data.token required
        ↓
document.cookie token=... (Path=/, Max-Age=30 days, SameSite=Lax, Secure on https)
        ↓
window.location.assign("/admin")
```

What is not implemented: forgot password, reset password, OTP, email verification, refresh token, and a dedicated user-profile fetch.

Token storage: a **non-httpOnly** cookie named `token`, written by `saveAdminToken`. JavaScript can read it. `ApiClient` copies it into `Authorization: Bearer`. Axios also sets `withCredentials: true`.

`src/app/api/session/route.ts` can set an **httpOnly** cookie of the same name, but the login page never calls it. Logout never calls `DELETE /api/session`.

Logout:

```text
clearAdminToken()
  ↓
POST {API_BASE}/api/auth/logout with Bearer and credentials: include
  ↓
window.location.href = /admin/login
```

A failed logout still redirects. The cookie is cleared first.

401 handling (`src/lib/api.ts`): if the response is 401, the request is not login, and the path is not `/admin/login`, clear the cookie and set `window.location.href` to `/admin/login`. Other statuses are rejected to the caller. There is no global 403 or 500 page.

Session length: cookie `Max-Age` is 30 days. There is no idle timeout in the UI. Expiry is whatever the backend does with the JWT, surfaced as 401.

Login errors render in a red alert: `response.data.error`, then `message`, then the thrown message, then “Invalid email or password.” Missing `token` throws “Login did not return a token.”

A visitor who already has a token and opens `/admin/login` is redirected to `/admin` by the proxy.

---

## 7. Authorization, roles, and permissions

Searches for role checks, `can`, RBAC, and permission maps found no enforcement.

The header string “Superuser” is hardcoded. It does not come from an API and it does not hide any control.

| Module | View | Create | Edit | Delete | Export | Other |
| --- | --- | --- | --- | --- | --- | --- |
| All modules below | Any holder of `token` | Same | Same | Same, where a delete button exists | Not implemented | Same |

Applications have no delete button. Settings and media have no delete-all action. Media items cannot be deleted from this UI.

403 handling: not implemented. A 403 would surface as the local `catch` (toast or inline error), not a dedicated forbidden screen.

---

## 8. Feature inventory

| Feature | Route | Components | APIs | Roles | Status |
| --- | --- | --- | --- | --- | --- |
| Login | `/admin/login` | Login page | `POST /api/auth/login` | Cookie only | Implemented |
| Logout | Sidebar | `AdminSidebar` | `POST /api/auth/logout` | Cookie | Implemented |
| Dashboard counts | `/admin` | Dashboard page | Five list GETs | Cookie | Implemented. Health panel is static text |
| Blogs CRUD | `/admin/blogs`, `/admin/blogs/[id]` | List, form, `AIGenerator`, `ImageUpload` | Blogs + AI + upload | Cookie | Implemented |
| Careers CRUD | `/admin/careers`, `/admin/careers/[id]` | List, form, AI | Careers + AI | Cookie | Implemented. `applicationEmail` is saved but has no input |
| Services CRUD + preview | `/admin/services`, `[id]`, `[id]/preview` | List, form, AI, upload | Services admin + public list | Cookie | Implemented |
| Solutions CRUD + preview | `/admin/solutions`, `[id]`, `[id]/preview` | List, form, AI, upload | Solutions admin + public list | Cookie | Implemented |
| Products CRUD | `/admin/products`, `[id]` | List, form, AI, upload | Products | Cookie | Implemented. Type is website, app, or both |
| Job applications | `/admin/applications`, `[id]` | List, review form | Applications | Cookie | Read + status/notes. No delete |
| Contacts | `/admin/contacts`, `[id]` | List, view, status form | Contacts | Cookie | Read, status, delete. No create |
| Media library | `/admin/media` | `ImageUpload` | Media + upload | Cookie | Upload and copy URL. No delete |
| Site settings | `/admin/settings` | Settings form | Settings | Cookie | Implemented |
| AI fill | Blog, career, service, solution editors | `AIGenerator` | `/api/admin/ai/generate-*` | Cookie | Implemented |
| Image upload | Those editors and media | `ImageUpload` | `POST /api/admin/upload` | Cookie | Implemented |

Not implemented, despite `ADMIN_IMPLEMENTATION_PLAN.md`: reusable `DataTable`, `Pagination`, `StatusBadge`, `EmptyState`, `PageHeader`, search on tables, server pagination, dark glassmorphism theme, and routes named `/create` and `/[id]/edit`.

---

## 9. Business flows

### Sign in

1. Entry: `/admin/login`, or a proxy redirect.
2. Permission: none.
3. Submit email and password.
4. Both fields are `required`.
5. `POST /api/auth/login`.
6. Button label becomes “Signing in...” and is disabled.
7. Success stores the token and hard-navigates to `/admin`.
8. No toast.
9. Error stays on the page in a red alert. Fields remain.

### Sign out

Sidebar Logout clears the cookie, posts to `/api/auth/logout`, then hard-navigates to `/admin/login`.

### Content CRUD (blogs, careers, products, services, solutions)

```text
List page
  ↓
GET collection (public list URL, or admin URL for service/solution edit)
  ↓
"Loading ..." then table, or empty copy
  ↓
Add → /admin/{module}/new
Edit → /admin/{module}/{_id}
  ↓
Form. Services and solutions check the slug regex before save
  ↓
POST /api/admin/{module} or PUT /api/admin/{module}/:id
  ↓
router.push back to the list
  ↓
Error stays on the form (response.data.error)
```

Delete:

```text
Trash icon
  ↓
MUI ConfirmDialog
  ↓
DELETE /api/admin/{module}/:id
  ↓
toast.success and refetch
  ↓
toast.error on failure
Cancel closes the dialog and does not call the API
```

List fetch failures are `console.error` only. State stays an empty array, so the UI shows the empty copy, not an error.

### Contact message

```text
GET /api/admin/contacts
  ↓
Table sorted by createdAt descending (client)
  ↓
Open /admin/contacts/:id
  ↓
If status is New, PUT { status: "Read" } immediately
  ↓
Admin may set New, Read, Responded, or Archived and Save
  ↓
PUT /api/admin/contacts/:id { status }
  ↓
Redirect to the list
```

“Reply via Email Client” is a `mailto:` link. It does not call an API. Delete uses the confirm dialog.

### Job application review

```text
GET /api/admin/applications
  ↓
Open /admin/applications/:id
  ↓
If status is New, PUT .../status { status: "Reviewing" } immediately
  ↓
Admin sets status and internal notes
  ↓
PUT /api/admin/applications/:id/status { status, notes }
  ↓
Redirect to the list
```

Resume is an external link (`application.resumeUrl`, `target="_blank"`), not a file generated by this app. There is no delete.

### Publish

Draft and Published are a `<select>` on the content form, saved with the rest of the payload. There is no separate publish endpoint and no confirm dialog. Careers also offer `Closed`.

Published services and solutions open the public site in a new tab (`NEXT_PUBLIC_SITE_URL`, default `http://localhost:3005`). Drafts open the in-admin preview route.

### AI generate

Prompt is required (toast if empty). On an existing record that already has a title, a toast asks “Replace the current content?” Cancel does nothing. Confirm calls `POST /api/admin/ai/generate-{blog|career|service|solution}` with `{ prompt }`. The form copies `response.data.data`. Uploaded image fields are kept on service and solution generation (`prev.image` / `prev.heroImage`). Success toast: “Form updated from your prompt.” The record is not saved until the admin submits the form.

### Media

Upload through `ImageUpload` with folder `media`, then `GET /api/admin/media`. Clicking a card copies `url` with `navigator.clipboard` and shows “Path copied” for 1.5s.

### Settings

`GET /api/settings` fills the form. `PUT /api/admin/settings` saves it. Success is an inline green banner for 3 seconds, not a toast and not a redirect.

---

## 10. Dashboard

Route: `/admin`.

Widgets are five count cards. Each value is `array.length` from:

| Card | Endpoint | Link |
| --- | --- | --- |
| Careers | `GET /api/careers` | `/admin/careers` |
| Blogs | `GET /api/blogs` | `/admin/blogs` |
| Services | `GET /api/services` | `/admin/services` |
| Products | `GET /api/products` | `/admin/products` |
| Contacts | `GET /api/admin/contacts` | `/admin/contacts` |

A failed call is replaced with `{ data: [] }`, so that card shows 0. There is no solutions or applications count.

Loading: five pulsing cards. No empty state. No date filter. No charts. No refetch button. Counts load once on mount.

“System Status” (“Database Connected”, “API Endpoints Online”) is static copy. It does not call a health endpoint.

Quick actions: New Career, Write Blog, Manage Services, View Messages.

Grid: 1 column, `sm:2`, `lg:3`, `xl:5`.

---

## 11. Forms

| Form | Route | Fields | Validation | API | Success | Error |
| --- | --- | --- | --- | --- | --- | --- |
| Login | `/admin/login` | email*, password* | `required` | `POST /api/auth/login` | Redirect `/admin` | Inline alert |
| Blog | `/admin/blogs/new` and `[id]` | title*, slug*, category*, author*, status, excerpt*, content*, featured image, video, gallery URLs, tags (comma-separated), SEO title and description | HTML required | POST or PUT `/api/admin/blogs` | `router.push('/admin/blogs')` | Inline `data.error` |
| Career | `/admin/careers/new` and `[id]` | title*, slug*, department*, location*, employment type*, experience display*, salary, status (Draft / Published / Closed), description*, experience options, responsibilities, requirements, skills, application fields | HTML required. Empty list rows are dropped | POST or PUT `/api/admin/careers` | Redirect to list | Inline |
| Service | `/admin/services/new` and `[id]` | title, slug*, short description, description, icon, images, hero, overview, benefits, features, technologies, process, deliverables, use cases, FAQs, CTA, SEO, order, status | Slug `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`. New records auto-slug from the title until the slug is edited | POST or PUT `/api/admin/services` | Redirect to list | Inline |
| Solution | `/admin/solutions/new` and `[id]` | Same shape as a service plus industry, card image, overview image, metrics. CTA default button “Talk to Our Experts” | Same slug rule. Slug change on edit shows an orange warning | POST or PUT `/api/admin/solutions` | Redirect to list | Inline |
| Product | `/admin/products/new` and `[id]` | name*, slug* (auto from the name on create until edited), tagline*, short description, description*, long description HTML, category, type (website / app / both), website and store URLs for the selected type, images, features, metrics, benefits, technology stack, mobile screenshots, CTA, SEO, order, status | Slug `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`. Duplicate slug: “Slug already exists. Please choose another slug.” | POST or PUT `/api/admin/products` | Redirect to list | Inline |
| Contact status | `/admin/contacts/[id]` | status select | None | `PUT /api/admin/contacts/:id` `{ status }` | Redirect to list | Inline |
| Application review | `/admin/applications/[id]` | status, notes | None | `PUT /api/admin/applications/:id/status` `{ status, notes }` | Redirect to list | Inline |
| Settings | `/admin/settings` | companyName*, footer text, email*, phone*, whatsapp, address*, googleMaps iframe text, social URLs (linkedin, twitter, facebook, instagram) | HTML required on the starred fields | `PUT /api/admin/settings` | Green banner 3s | Inline |
| Media upload | `/admin/media` | file | Image or video MIME, max 4 MB | `POST /api/admin/upload` | Reloads the grid | Red text |
| AI prompt | Editors | prompt | Non-empty, else toast | generate-* | Toast, form state updated, not saved | Toast |

\* Required in the browser.

Career `applicationEmail` is in state and in the JSON body, and AI can fill it. There is no input for it.

Default application fields on a new career: firstName, lastName, email, phone, resume (text URL), coverLetter, portfolio, linkedin, experience (select). Each can be shown or hidden. Custom fields add name, label, type (`text`, `email`, `tel`, `textarea`, `select`, `file`), required, and active. Common field types cannot be changed. Common fields cannot be removed, only hidden.

Status defaults: content forms start at `Draft`. Contact and application views start at `New` until the record loads.

Cancel: list pages use dialog Cancel. Editors use the back arrow (`Link`) and do not warn about unsaved changes. There is no form reset button.

Blog tags are split on commas. Gallery entries that are empty strings are removed before save.

---

## 12. Tables

No table has search, filters, column sorting, pagination, page size, or bulk actions. Horizontal scroll starts at `min-w-[720px]` (solutions `760px`).

| Table | Route | API | Columns | Client order | Row actions |
| --- | --- | --- | --- | --- | --- |
| Blogs | `/admin/blogs` | `GET /api/blogs` | Title, Category, Author, Status, Actions | API order | Edit, Delete |
| Careers | `/admin/careers` | `GET /api/careers` | Title, Department, Status, Actions | API order | Edit, Delete |
| Services | `/admin/services` | `GET /api/services` | Order, Icon, Title, Slug, Status, Updated, Actions | `order` ascending | View, Edit, Delete |
| Solutions | `/admin/solutions` | `GET /api/solutions` | Order, Icon, Title, Slug, Status, Updated, Actions | `order` ascending | View, Edit, Delete |
| Products | `/admin/products` | `GET /api/products` | Order, Name, Tagline, Type, Status, Actions | `order` ascending | Edit, Delete |
| Contacts | `/admin/contacts` | `GET /api/admin/contacts` | Date, Name, Email, Interest, Status, Actions | `createdAt` descending | View, Delete |
| Applications | `/admin/applications` | `GET /api/admin/applications` | Date, Applicant (+ email), Position (`jobId.title`), Experience, Status, Actions | API order | View only |

View on a published service or solution opens `{NEXT_PUBLIC_SITE_URL}/services|solutions/{slug}`. A non-published row opens the admin preview route.

Loading copy is “Loading …”. Empty copy is specific per page (“No blog posts found. Create one!”, and the same pattern). A failed fetch looks like empty.

Status pills: `Published` is green. Anything else on those content tables is gray, including career `Closed`. Contact and application tables use the status colors in section 23.

---

## 13. Search, filter, sort, pagination

Not implemented on list pages.

The header search box is visual only.

The only ordering is the client sorts in the table section. No query string is read or written. No debounce.

---

## 14. Modals and drawers

| UI | Trigger | Purpose | API | Success | Error |
| --- | --- | --- | --- | --- | --- |
| `ConfirmDialog` (MUI) | Delete on blogs, careers, services, solutions, products, contacts | Confirm delete | DELETE for that module | Toast + refetch | Toast, dialog closes |
| Mobile sidebar | Header menu below `md` | Navigation | None | Navigating closes it | Backdrop or X closes it |
| AI replace toast | Generate on an existing titled record | Confirm overwrite | None until Replace | Continues to generate | Cancel dismisses |

Delete copy:

- Blogs, careers, products, contacts: “This action cannot be undone.”
- Solutions: “This removes the solution from the public site.”
- Services: same undone sentence as blogs.

Confirm is a red MUI button. Cancel is a gray bordered button. There is no status-change confirmation.

---

## 15. Status workflows

Content status is saved with the main form. Values found in the UI:

| Module | Values |
| --- | --- |
| Blog, service, solution, product | `Draft`, `Published` |
| Career | `Draft`, `Published`, `Closed` |
| Contact | `New`, `Read`, `Responded`, `Archived` |
| Application | `New`, `Reviewing`, `Shortlisted`, `Interview`, `Rejected`, `Hired` |

Contact: opening a `New` message sends `Read` without a confirm. The select can set it back to `New`.

Application: opening a `New` application sends `Reviewing` without a confirm. Save sends the selected status plus notes.

Badge colors:

| Status | Fill | Text |
| --- | --- | --- |
| Published, Hired, Responded | success soft | success |
| Draft and other unlabeled content statuses, Read, Archived | neutral soft | muted |
| New, Shortlisted | cyan soft | cyan deep |
| Reviewing, Interview | orange soft | orange deep |
| Rejected | error soft | error |

---

## 16. Upload and download

Upload (`ImageUpload` → `POST /api/admin/upload`):

- Field name `image`, plus `folder`: `blogs`, `products`, `services`, `solutions`, or `media`.
- Accept default: `image/jpeg,image/png,image/webp,image/gif`.
- Extra check: MIME must start with `image/` or `video/`. Size must be ≤ 4 MB.
- No progress percentage. The button shows a spinner and “Uploading...”.
- Success returns `{ url, publicId, id }` and stores `url` on the form, or refreshes the media grid.
- Remove on a form clears the URL in state. It does not call a delete API.
- Error text: API `error` or “Image upload failed.” / the local validation sentence.

There is no CSV, Excel, or PDF export, and no import.

Application “View Resume” opens `resumeUrl` in a new tab. It is not a download endpoint in this repo.

Media “Copy image path” copies the URL to the clipboard.

---

## 17. Notifications

`react-hot-toast`, mounted in `AdminLayout`, position `top-right`, white background, gray border.

| Event | Toast |
| --- | --- |
| Delete success | “{Thing} deleted successfully” or “Solution deleted” |
| Delete failure | “Failed to delete …” |
| AI empty prompt | “Please enter a prompt first.” |
| AI success | “Form updated from your prompt.” |
| AI failure | `response.data.error` or “Failed to generate content” |
| AI replace | Custom toast, stays until Replace or Cancel |

Saves for blogs, careers, services, solutions, products, contacts, applications, and settings do **not** toast. They redirect or show an inline banner.

The header bell is not a notification center. There is no notification API and no read/unread feed.

---

## 18. Error handling

| Case | Behavior |
| --- | --- |
| 401, not login | Clear cookie, hard redirect to `/admin/login` |
| Login failure | Inline alert |
| List GET failure | `console.error`. UI shows the empty state |
| Dashboard GET failure | That count becomes 0 |
| Form save failure | Inline message from `response.data.error`, or a local fallback sentence |
| Settings load failure | “Failed to load settings” |
| Media load failure | “Could not load uploaded images.” |
| Preview load failure | “Unable to load this service.” or “Unable to load this solution.” |
| Missing contact or application after a successful list | “Contact message not found.” / “Application not found.” |
| 403, 404, 422, 500 | No dedicated screens. Axios rejects and the local `catch` runs |
| Network error | Same `catch`. Login uses `err.message` if there is no response body |

Slug validation on services and solutions runs before the request and does not call the API.

---

## 19. Loading and empty states

| Surface | Loading | Empty | Error |
| --- | --- | --- | --- |
| Dashboard | Five pulse cards | Counts of 0 | Swallowed per request |
| Tables | Centered “Loading …” | Page-specific sentence | Looks empty |
| Editors | “Loading...” until the GET finishes. Create pages skip the fetch | n/a | Red banner |
| Settings | “Loading settings...” | Blank fields if the payload is empty | Red banner |
| Preview | “Loading preview...” | Sections omitted when arrays are empty | Red sentence |
| Upload | Spinner on the button | Dashed placeholder when there is no URL | Red sentence under the control |
| Unauthorized | Proxy redirect, not an in-page state | | |
| Forbidden | Not implemented | | |

---

## 20. State management

| State | Where | Persistence |
| --- | --- | --- |
| `token` cookie | `session.ts` | 30 days, `SameSite=Lax`, not httpOnly |
| List rows, delete id, loading | Each list page | Memory |
| Form objects and array editors | Each editor | Memory |
| `mobileOpen` | `AdminLayout` | Memory |
| Toast queue | `react-hot-toast` | Memory |

No `localStorage` or `sessionStorage`. No URL search params. No global cache. Each page fetches on mount.

---

## 21. Components

| Group | Files |
| --- | --- |
| Layout | `AdminLayout` hosts sidebar, header, `<main>`, and `Toaster`. Dashboard route layout is a thin wrapper |
| Navigation | `AdminSidebar`, `AdminHeader` |
| Auth | Login page. No auth context |
| Dashboard | `src/app/admin/(dashboard)/page.tsx` only |
| Forms | Page-local. Shared pieces are `ImageUpload` and `AIGenerator` |
| Tables | Inline in each list page |
| Modal | `ConfirmDialog` |
| Feature pages | One folder per module under `src/app/admin/(dashboard)` |

`AIGenerator` calls back into the page (`onGenerate`). The page performs the POST. `ImageUpload` calls `uploadImage` itself.

---

## 22. API inventory

Base URL: `process.env.NEXT_PUBLIC_API_URL` or `http://localhost:3001`.

Auth on `ApiClient`: `Authorization: Bearer {token}` when the cookie exists, plus `withCredentials: true`, plus `Content-Type: application/json`. Upload uses `fetch` and sets Bearer only, not `Content-Type` (the browser sets the multipart boundary).

There is no permission header.

| Method | Endpoint | Purpose | Called from | Auth | Request | Response used | Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| POST | `/api/auth/login` | Sign in | Login page | Public | `{ email, password }` | `data.token` | Inline alert. 401 does not redirect |
| POST | `/api/auth/logout` | End session | Sidebar | Bearer if present | Empty body | Ignored | Still redirects |
| POST | `/api/session` | Set httpOnly cookie | **No UI caller** | Body token | `{ token: string }` | `{ ok: true }` | 400 `{ error: "Missing token" }` |
| DELETE | `/api/session` | Clear httpOnly cookie | **No UI caller** | Cookie | None | `{ ok: true }` | — |
| GET | `/api/blogs` | Blog list and edit lookup | Dashboard, blog list, blog edit | Bearer | None | Array. Edit finds `_id` | List looks empty. Edit sets error |
| POST | `/api/admin/blogs` | Create blog | Blog form when `id === "new"` | Bearer | Blog payload | Unused | Inline |
| PUT | `/api/admin/blogs/:id` | Update blog | Blog form | Bearer | Same payload | Unused | Inline |
| DELETE | `/api/admin/blogs/:id` | Delete blog | Blog list | Bearer | Path id | Unused | Toast |
| GET | `/api/careers` | Job list and edit lookup | Dashboard, career list, career edit | Bearer | None | Array | Same pattern as blogs |
| POST | `/api/admin/careers` | Create job | Career form | Bearer | Career payload | Unused | Inline |
| PUT | `/api/admin/careers/:id` | Update job | Career form | Bearer | Same | Unused | Inline |
| DELETE | `/api/admin/careers/:id` | Delete job | Career list | Bearer | Path id | Unused | Toast |
| GET | `/api/services` | Service list and dashboard count | Dashboard, service list | Bearer | None | Array with `_id`, `order`, `icon`, `title`, `slug`, `status`, `updatedAt` | Empty UI |
| GET | `/api/admin/services/:id` | One service | Service form, service preview | Bearer | Path id | Full service object spread into the form | Inline / preview text |
| POST | `/api/admin/services` | Create service | Service form | Bearer | Filtered payload | Unused | Inline |
| PUT | `/api/admin/services/:id` | Update service | Service form | Bearer | Same | Unused | Inline |
| DELETE | `/api/admin/services/:id` | Delete service | Service list | Bearer | Path id | Unused | Toast |
| GET | `/api/solutions` | Solution list | Solution list | Bearer | None | `SolutionRow` | Empty UI |
| GET | `/api/admin/solutions/:id` | One solution | Solution form, preview | Bearer | Path id | Full solution | Inline / preview text |
| POST | `/api/admin/solutions` | Create | Solution form | Bearer | Filtered payload | Unused | Inline |
| PUT | `/api/admin/solutions/:id` | Update | Solution form | Bearer | Same | Unused | Inline |
| DELETE | `/api/admin/solutions/:id` | Delete | Solution list | Bearer | Path id | Unused | Toast |
| GET | `/api/products` | Product list and edit lookup | Dashboard, product list, product edit | Bearer | None | Array | Empty or form error |
| POST | `/api/admin/products` | Create | Product form | Bearer | Product fields including `slug`, `shortDescription`, `longDescription`, `type`, and URLs | Unused | Inline |
| PUT | `/api/admin/products/:id` | Update | Product form | Bearer | Same | Unused | Inline |
| DELETE | `/api/admin/products/:id` | Delete | Product list | Bearer | Path id | Unused | Toast |
| GET | `/api/admin/contacts` | Inquiry list and detail lookup | Dashboard, contact list, contact detail | Bearer | None | Array | Empty or “not found” |
| PUT | `/api/admin/contacts/:id` | Set status | Contact detail, including silent Read | Bearer | `{ status }` | Unused | Console on silent update. Inline on save |
| DELETE | `/api/admin/contacts/:id` | Delete inquiry | Contact list | Bearer | Path id | Unused | Toast |
| GET | `/api/admin/applications` | Application list and detail lookup | Application list and detail | Bearer | None | Array. UI reads `_id`, `createdAt`, `applicantName`, `email`, `phone`, `jobId.title`, `experience`, `status`, `notes`, `resumeUrl`, `fields` | Empty or “not found” |
| PUT | `/api/admin/applications/:id/status` | Set status and notes | Application detail | Bearer | `{ status }` on auto-review, `{ status, notes }` on save | Unused | Console or inline |
| GET | `/api/admin/media` | Library | Media page | Bearer | None | `{ _id, filename, url, createdAt }[]` | Red banner |
| POST | `/api/admin/upload` | Upload file | `upload.ts` | Bearer, multipart | `image` file, `folder` string | `{ url, publicId, id }` | Thrown `error` |
| GET | `/api/settings` | Load settings | Settings page | Bearer | None | company, address, email, phone, whatsapp, googleMaps, footerInformation, socialLinks | “Failed to load settings” |
| PUT | `/api/admin/settings` | Save settings | Settings page | Bearer | Form object in section 11 | Unused | Inline |
| POST | `/api/admin/ai/generate-blog` | Fill blog form | Blog editor | Bearer | `{ prompt }` | `data.data` fields | Toast |
| POST | `/api/admin/ai/generate-career` | Fill career form | Career editor | Bearer | `{ prompt }` | `data.data` | Toast |
| POST | `/api/admin/ai/generate-service` | Fill service form | Service editor | Bearer | `{ prompt }` | `data.data`. Images kept | Toast |
| POST | `/api/admin/ai/generate-solution` | Fill solution form | Solution editor | Bearer | `{ prompt }` | `data.data`. Existing slug kept on edit. Images kept | Toast |

No PATCH. No query parameters on any call.

Blog edit, career edit, and product edit do not have a GET-by-id. They download the public list and `.find` the `_id`. If the public list hides drafts, those editors cannot load the record. That behavior is not verified from this repo.

---

## 23. API groups

```text
Authentication
  POST /api/auth/login
  POST /api/auth/logout
  POST /api/session
  DELETE /api/session

Blogs
  GET /api/blogs
  POST /api/admin/blogs
  PUT /api/admin/blogs/:id
  DELETE /api/admin/blogs/:id
  POST /api/admin/ai/generate-blog

Careers and applications
  GET /api/careers
  POST /api/admin/careers
  PUT /api/admin/careers/:id
  DELETE /api/admin/careers/:id
  POST /api/admin/ai/generate-career
  GET /api/admin/applications
  PUT /api/admin/applications/:id/status

Services
  GET /api/services
  GET /api/admin/services/:id
  POST /api/admin/services
  PUT /api/admin/services/:id
  DELETE /api/admin/services/:id
  POST /api/admin/ai/generate-service

Solutions
  GET /api/solutions
  GET /api/admin/solutions/:id
  POST /api/admin/solutions
  PUT /api/admin/solutions/:id
  DELETE /api/admin/solutions/:id
  POST /api/admin/ai/generate-solution

Products
  GET /api/products
  GET /api/products/:slug
  POST /api/admin/products
  PUT /api/admin/products/:id
  DELETE /api/admin/products/:id
  POST /api/admin/ai/generate-product

Contacts
  GET /api/admin/contacts
  PUT /api/admin/contacts/:id
  DELETE /api/admin/contacts/:id

Media
  GET /api/admin/media
  POST /api/admin/upload

Settings
  GET /api/settings
  PUT /api/admin/settings
```

---

## 24. Page to API mapping

| Page | APIs |
| --- | --- |
| `/admin/login` | `POST /api/auth/login` |
| Sidebar logout | `POST /api/auth/logout` |
| `/admin` | GET careers, blogs, services, products, admin contacts |
| `/admin/blogs` | GET `/api/blogs`, DELETE `/api/admin/blogs/:id` |
| `/admin/blogs/new` | POST blog, optional AI, optional upload |
| `/admin/blogs/[id]` | GET `/api/blogs`, PUT blog, optional AI, optional upload |
| `/admin/careers` | GET `/api/careers`, DELETE admin career |
| `/admin/careers/new` | POST career, optional AI |
| `/admin/careers/[id]` | GET `/api/careers`, PUT career, optional AI |
| `/admin/services` | GET `/api/services`, DELETE admin service |
| `/admin/services/new` | POST service, optional AI, optional upload |
| `/admin/services/[id]` | GET admin service, PUT, optional AI, optional upload |
| `/admin/services/[id]/preview` | GET admin service |
| `/admin/solutions` | GET `/api/solutions`, DELETE admin solution |
| `/admin/solutions/new` | POST solution, optional AI, optional upload |
| `/admin/solutions/[id]` | GET admin solution, PUT, optional AI, optional upload |
| `/admin/solutions/[id]/preview` | GET admin solution |
| `/admin/products` | GET `/api/products`, DELETE admin product |
| `/admin/products/new` | POST product, optional upload |
| `/admin/products/[id]` | GET `/api/products`, PUT, optional upload |
| `/admin/applications` | GET `/api/admin/applications` |
| `/admin/applications/[id]` | GET applications, PUT status |
| `/admin/contacts` | GET contacts, DELETE contact |
| `/admin/contacts/[id]` | GET contacts, PUT contact |
| `/admin/media` | GET media, POST upload |
| `/admin/settings` | GET `/api/settings`, PUT `/api/admin/settings` |

---

## 25. Component to API mapping

| Caller | API | Purpose |
| --- | --- | --- |
| `ApiClient` request interceptor | — | Adds Bearer from the cookie |
| `ApiClient` response interceptor | — | 401 clears cookie and redirects |
| `uploadImage` | `POST /api/admin/upload` | Multipart upload |
| `ImageUpload` | via `uploadImage` | Editors and media page |
| `AIGenerator` | none directly | Page callback performs the generate POST |
| `AdminSidebar` | `POST /api/auth/logout` | Logout |
| `ConfirmDialog` | none | Parent runs DELETE |

---

## 26. Environment variables

Names only.

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend origin. Default `http://localhost:3001` |
| `NEXT_PUBLIC_SITE_URL` | Public site origin for “view live” links. Default `http://localhost:3005` |
| `NODE_ENV` | `session` route sets `Secure` on the unused httpOnly cookie when `production` |

There is no `.env.example` in this project. Do not put backend secrets (`JWT_SECRET`, database URLs) in this app. The implementation plan still states that rule, and the code follows it.

---

## 27. Integrations

| Service | Where | Notes |
| --- | --- | --- |
| Technic backend | `ApiClient`, upload, logout | REST. Bearer + credentials |
| Google fonts | `src/app/layout.tsx` | Geist and Geist Mono via `next/font` |
| MUI | `ConfirmDialog` only | Dialog, not a theme provider |
| Clipboard | Media page | `navigator.clipboard.writeText` |
| Public website | Service and solution view links | `NEXT_PUBLIC_SITE_URL` |
| mailto / tel | Contact and application detail | Opens the user’s mail or phone app |

AI generation is a backend endpoint, not a browser SDK.

---

## 28. Security

Implemented:

- `src/proxy.ts` blocks `/admin/*` without a `token` cookie and sends logged-in users away from the login page.
- Bearer token on API calls.
- `withCredentials: true` on axios and on upload/logout fetch.
- Login and logout redirect with a full page load.
- 401 interceptor clears the cookie.
- File type and 4 MB checks before upload.
- Delete confirmations on the modules that delete.

Not implemented, or weaker than the plan describes:

- The live login cookie is readable by JavaScript. The httpOnly session route is unused.
- No CSRF token.
- No role checks.
- No 403 page.
- Header search does not send input anywhere, but it also does not sanitize because it does not submit.
- Google Maps settings field stores raw iframe HTML. This admin does not render it. Whether the public site renders it is outside this repo.
- Resume links are whatever URL the API returns, opened in a new tab with `noopener`.

---

## 29. Design system

Tokens live in `src/app/globals.css`. `color-scheme: light`. No dark mode.

| Token | Value | Class |
| --- | --- | --- |
| Cyan | `#10b8d4` | `technic-cyan` |
| Cyan deep | `#0797b2` | `technic-cyan-deep` |
| Orange | `#ff8a00` | `technic-orange` |
| Orange deep | `#e86f00` | `technic-orange-deep` |
| Text | `#1f2937` | `technic-text` |
| Secondary | `#4b5563` | `technic-secondary` |
| Muted | `#6b7280` | `technic-muted` |
| Page background | `#f5fafc` | `technic-bg` |
| Surface | `#ffffff` | `technic-surface` |
| Border | `#e5e7eb` | `technic-border` |
| Success / soft | `#16a34a` / `#dcfce7` | `technic-success` / `technic-success-soft` |
| Error / soft | `#dc2626` / `#fee2e2` | `technic-error` / `technic-error-soft` |
| Cyan soft | `#e8f9fc` | `technic-cyan-soft` |
| Orange soft | `#fff3e6` | `technic-orange-soft` |
| Neutral soft | `#f3f4f6` | `technic-neutral-soft` |
| Table header | `#f8fafc` | `technic-header` |

Gradient: `linear-gradient(135deg, #10b8d4, #ff8a00)` as `bg-brand-gradient`.

Font: Geist (`--font-geist-sans`) for sans and headings. Geist Mono is loaded. Blog content textarea uses `font-mono`.

Shadows: `shadow-tn-sm`, `shadow-tn-md`, `shadow-tn-lg`, `shadow-tn-card`.

Inputs: `.tn-input` (white, 1px border, `0.5rem` radius, padding `0.5rem 1rem`, cyan focus ring). Labels: `.tn-label`.

Primary button: gradient, white text, `rounded-xl` or `rounded-lg`, disabled at 50% opacity.

Delete actions: `text-technic-error`. Confirm button background `#DC2626`.

Cards: white, `border-technic-border`, `rounded-2xl`, light shadow.

Logo: `/Assest/logo-brand.png`.

Focus: 2px cyan outline on links and buttons.

---

## 30. Responsive behavior

| Width | Behavior |
| --- | --- |
| Below `md` (768px) | Sidebar hidden. Header menu opens it over a dim layer. User name hidden. Main padding `p-4` |
| `sm` (640px) and up | Header search is visible (still non-functional). Dashboard cards become 2 columns |
| `md` and up | Sidebar stays open. Content offset `pl-64`. Settings and many forms become 2 columns. “Admin / Superuser” is visible |
| `lg` | Dashboard 3 columns. Application review becomes a 2/1 split |
| `xl` | Dashboard 5 columns |

Tables scroll horizontally instead of collapsing into cards. Dialogs are MUI’s default centered dialog. There is no tablet-specific sidebar collapse.

---

## 31. Accessibility

- Login errors use `role="alert"`.
- Logo link and menu buttons have accessible names.
- Table icon buttons include `sr-only` “Edit”, “Delete”, or “View”.
- AI prompt has a visually hidden label.
- Image previews in `ImageUpload` use `alt=""`.
- Confirm dialog text is MUI `DialogContentText`. Focus trap behavior is whatever MUI Dialog provides.
- Sidebar nav has no `aria-current`.
- The header search has `aria-label="Search"` but no results.

---

## 32. Conflicts with older documents

| Document | Claim | Code |
| --- | --- | --- |
| `ADMIN_IMPLEMENTATION_PLAN.md` | Dark glassmorphism | Light tokens in `globals.css`. `DESIGN.md` matches the light theme |
| Plan | Routes `/create` and `/[id]/edit` | Routes are `/new` and `/[id]` |
| Plan | HTTP-only JWT cookie from the backend, `withCredentials` only | Login writes a JS-readable cookie and also sends Bearer. `withCredentials` is set. The httpOnly `/api/session` route is unused |
| Plan | Reusable DataTable with search and pagination; all forms use react-hook-form | Only login uses react-hook-form. Tables are local and have no search or pagination |
| Plan | `/admin/dashboard` | Only `/admin` exists |
| `README.md` | Dev server on port 3000 | `npm run dev` uses port 3006. `npm start` does not set a port |
| `src/app/page.tsx` | Renders a landing page | `src/proxy.ts` redirects `/` before that page when the proxy runs |
| Dashboard copy | “Database Connected” / “API Endpoints Online” | Static text, not a health check |
| `DESIGN.md` status row | Draft, Read, Archived share gray | Matches the badges. Career `Closed` also uses the gray content badge |

The plan’s rule still holds: this app must not contain database connection strings or query the database directly.

---

## 33. Gaps

- Backend validation and fields the UI never reads.
- Whether `GET /api/blogs`, `/api/careers`, and `/api/products` return drafts. Editors depend on those lists.
- JWT lifetime inside the token. The UI only knows the 30-day cookie and the 401 redirect.
- `POST /api/session` and `DELETE /api/session` are implemented and unused.
- Header search, notifications, and the Superuser label are not backed by data.
- No export, import, bulk edit, pagination, or per-module permissions.
- `applicationEmail` is not editable in the career form.
- Media items cannot be deleted here.
- Applications cannot be deleted here.
