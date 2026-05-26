# PublicProduct — Digital Asset Management

A Next.js 16 / React 19 DAM platform with authentication, blogs, features, and pricing pages. Backend content is served by a Strapi CMS.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Auth | NextAuth v5 (Credentials + JWT) |
| CMS | Strapi (REST API) |
| Data fetching | `fetch` (server), SWR (client) |
| Testing | Jest 30, React Testing Library 16 |

## Getting Started

```bash
npm install
```

Create a `.env.local` with:

```
STRAPI_URL=http://localhost:1337
AUTH_SECRET=<your-secret>
```

```bash
npm run dev      # http://localhost:3000
npm test         # jest
npm run lint     # eslint
```

---

## Component Architecture

### Server Components

Rendered on the server. No browser APIs, no hooks, no event handlers. Can `async`/`await` directly.

| File | Description |
|---|---|
| `app/layout.tsx` | Root layout — wraps every page in `<Providers>` and `<Header>` |
| `app/page.tsx` | Home page — calls `getFeatures()`, static hero/testimonials |
| `app/features/page.tsx` | Features page — fetches feature list from Strapi |
| `app/pricing/page.tsx` | Pricing page — renders `<PlanGrid>` with all plans |
| `app/login/page.tsx` | Login page shell — renders `<LoginForm>` |
| `app/dashboard/page.tsx` | Dashboard — protected, shows authenticated content |
| `app/blogs/page.tsx` | Blog listing page |
| `app/blogs/[slug]/page.tsx` | Individual blog post page |
| `app/blogs/create/page.tsx` | Blog creation page — renders `<CreateBlogForm>` |
| `app/blogs/create/actions.ts` | Server Action — `createBlog()` handles form submission |
| `app/components/Header.tsx` | Site header with nav links |
| `app/components/Footer.tsx` | Site footer |
| `app/components/FeatureGrid.tsx` | Renders a responsive grid of feature cards |
| `app/components/PlanGrid.tsx` | Renders a grid of `<PlanCard>` components |
| `app/components/PlanCard.tsx` | Single pricing plan card |
| `app/components/LiveSection.tsx` | Wraps `<LiveSectionBox>` with server-fetched data |
| `app/components/Loader.tsx` | `<Spinner>` UI component |

### Client Components

Marked `'use client'`. Run in the browser — can use hooks, state, and event handlers.

| File | Description |
|---|---|
| `app/components/Providers.tsx` | Wraps the tree with `<SessionProvider>` and `<BlogProvider>` |
| `app/components/LoginForm.tsx` | Email/password form — calls `signIn('credentials', ...)` |
| `app/components/AuthButtons.tsx` | Sign-in / sign-out buttons depending on session state |
| `app/components/LogoutButton.tsx` | Calls `signOut()` on click |
| `app/components/BlogGrid.tsx` | Blog card grid with client-side filtering |
| `app/components/Blog.tsx` | Individual blog card / detail view |
| `app/components/BlogCategory.tsx` | Category filter tabs |
| `app/components/BlogMore.tsx` | "Load more" pagination button |
| `app/components/LiveSectionBox.tsx` | Live-updating data section (uses SWR) |
| `app/components/SubscriptionBox.tsx` | Email subscription form |
| `app/blogs/create/CreateBlogForm.tsx` | Rich form for creating blog posts |
| `app/context/blogContext.tsx` | `BlogContext` + `BlogProvider` — shared blog state |
| `app/hooks/useBlog.tsx` | `useBlog()` — consumes `BlogContext` |

### API Routes

| Route | Methods | Description |
|---|---|---|
| `app/api/auth/[...nextauth]/route.ts` | GET, POST | NextAuth handler |
| `app/api/blogs/route.ts` | GET | Fetches blog list from Strapi |
| `app/api/stats/route.ts` | GET | Returns site statistics |
| `app/api/subscribe/route.ts` | GET, POST | Email subscription |
| `app/api/preview/route.ts` | GET | Strapi draft preview mode |

### Data / Config

| File | Exports |
|---|---|
| `app/data/features.tsx` | `getFeatures()` (fetch), `allFeatures[]`, `Feature` type |
| `app/data/plans.ts` | `allPlans[]`, `Plan` type |
| `app/data/blogs.tsx` | `posts[]` static blog data |

---

## Auth Flow

1. User submits `<LoginForm>` → calls `signIn('credentials', { email, password, redirect: false })`
2. NextAuth calls `auth.ts` → `authorize()` → POST to Strapi `/api/auth/local`
3. On success, Strapi returns a JWT + refresh token stored in the NextAuth JWT callback
4. Sessions include `accessToken`; refresh is handled automatically in the `jwt` callback
5. On sign-out, the refresh token is revoked via Strapi `/api/token/revoke`

## Testing

```bash
npm test               # run all tests
npm run test:watch     # watch mode
```

Tests live in `tests/`. Each test file mirrors a component:

| Test file | What it covers |
|---|---|
| `tests/login.test.tsx` | `LoginForm` — rendering, sign-in success/failure, loading state |
| `tests/home.test.tsx` | `HomePage` — static content, `getFeatures()` mock, all sections |
| `tests/featureGrid.test.tsx` | `FeatureGrid` — card rendering, icon slot, `cols`, `iconSize` props |
