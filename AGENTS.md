# Restay - Codex Engineering Guidelines

## 1. Project Overview

Restay is an Airbnb-inspired accommodation booking
portfolio application.

Production:
https://restay.vercel.app/

Goal:
Improve the existing application to production-oriented
frontend engineering standards.

Preserve existing functionality, visual identity,
and business logic.

Do not rebuild the application from scratch.

## 2. Technology Stack

Core:

- Next.js 15 App Router
- React 18
- TypeScript
- ESLint

Frontend:

- Jotai
- Mantine 6
- Ant Design Next.js Registry
- Swiper 9
- React Hook Form
- React Datepicker
- React Hot Toast

Backend and Services:

- Next.js Route Handlers
- MongoDB
- Supabase Realtime
- NextAuth v5 beta
- Vercel

Internationalization:

- next-intl (already installed)
- Korean (ko)
- English (en)

Inspect package.json, lockfile, and source code
to verify the actual dependencies and architecture.

Do not introduce additional libraries unnecessarily.

## 3. Engineering Priorities

Improve the project in the following areas:

P0 - Stability and Performance

- Preserve all existing features.
- Investigate slow initial page loading.
- Optimize API requests and data fetching.
- Reduce unnecessary client-side JavaScript.
- Optimize image loading and rendering.

P1 - Responsive Design

- Implement mobile and tablet layouts.
- Preserve desktop design.
- Improve navigation and touch interactions.
- Prevent horizontal overflow.

P1 - Internationalization

- Implement Korean and English localization.
- Use the existing next-intl installation.
- Preserve Korean URLs.
- Add English URL prefixes.
- Translate user-facing UI strings.

P1 - Code Quality

- Refactor duplicated code.
- Improve component responsibilities.
- Improve TypeScript safety.
- Review Jotai state management.
- Improve error and loading states.

P2 - Quality Assurance

- Improve accessibility.
- Improve SEO.
- Introduce meaningful automated tests.
- Document performance improvements.

Priorities guide planning.
Do not execute all work automatically.

## 4. Next.js Architecture

- Follow Next.js 15 App Router conventions.
- Prefer Server Components when appropriate.
- Use Client Components only when necessary.
- Respect server/client boundaries.
- Follow asynchronous params and searchParams rules.
- Avoid unnecessary API waterfalls.
- Preserve existing Route Handler contracts.
- Use appropriate loading and error boundaries.
- Review caching carefully for authenticated data.

Do not change authentication or database behavior
without approval.

## 5. React and TypeScript

- Prefer small, focused components.
- Extract reusable logic when justified.
- Avoid unnecessary abstractions.
- Avoid unnecessary useEffect.
- Avoid premature useMemo or useCallback.
- Use stable list keys.
- Avoid unnecessary rerenders.
- Preserve existing types and interfaces.
- Avoid unnecessary any and unsafe assertions.
- Prefer local state for local UI.
- Preserve Jotai for existing shared state.

Do not introduce Redux or Zustand without approval.

## 6. Performance Optimization

Investigate:

- Initial page loading
- LCP, INP, CLS, TTFB
- API response times
- MongoDB query performance
- Duplicate requests
- JavaScript bundle size
- Image optimization
- Hydration overhead
- Unnecessary rerenders

Consider:

- Server-side data fetching
- next/image
- Dynamic imports
- Suspense
- Request deduplication
- Appropriate caching
- Lazy loading
- Bundle reduction

Measure before optimizing.

Record baseline and after-change results.

Do not invent performance measurements.

## 7. Responsive Design

Support:

- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px and above

These are testing ranges, not fixed CSS breakpoints.

Target pages:

- Home
- Listing details
- Reservation
- Wishlist
- Trips
- Messages
- Authentication UI

Requirements:

- Prefer mobile-first styling where practical.
- Preserve existing desktop layout.
- Avoid horizontal scrolling.
- Ensure accessible touch targets.
- Implement responsive navigation.
- Optimize listing grids and image galleries.
- Make forms usable on mobile.
- Account for longer English translations.

## 8. Internationalization

Use the already installed next-intl library.

Supported locales:

- ko: default
- en: secondary

### Routing

Prefer:
localePrefix: "as-needed"

Expected URLs:

- / -> Korean
- /en -> English
- /listings/[id] -> Korean
- /en/listings/[id] -> English

Preserve existing Korean URLs and deep links.

Review locale detection and cookie behavior
to ensure Korean URLs remain stable.

Do not introduce /ko prefixes unless approved.

### Translation Resources

Use:

- messages/ko.json
- messages/en.json

Requirements:

- Organize translations by feature or namespace.
- Keep translation keys consistent.
- Avoid hardcoded user-facing UI strings.
- Support translation parameters.
- Support pluralization when necessary.
- Handle missing translation keys.

Translate:

- Navigation
- Search and filters
- Listing UI
- Reservation UI
- Wishlist and trips
- Messages UI
- Authentication UI
- Buttons and labels
- Forms and validation
- Modals and notifications
- Loading and error messages

Do not automatically translate MongoDB content
or user-generated messages.

### Language Switching

- Add a language selector to Navbar.
- Preserve the current route when switching.
- Preserve dynamic IDs and query parameters.
- Maintain authentication sessions.
- Persist language preference appropriately.
- Support mobile navigation.
- Avoid unnecessary full-page reloads.

### Localization

- Localize dates, times and numbers.
- Preserve KRW payment currency.
- Do not alter payment amounts.
- Preserve existing timezone behavior.
- Preserve original user-generated content.

### SEO

- Use locale-aware metadata.
- Set the correct HTML lang attribute.
- Implement hreflang alternates.
- Review canonical URLs.
- Avoid duplicate content indexing.

### Performance

- Prefer server-side translations where practical.
- Avoid loading unnecessary translation resources.
- Avoid excessive client-side translation bundles.
- Measure performance impact.

## 9. Authentication and Critical Features

Preserve:

- NextAuth v5 authentication
- Google, Naver and Kakao OAuth
- Credentials authentication
- Session handling
- Protected routes
- MongoDB reservations
- Supabase realtime chat
- Wishlist functionality
- Payment integration

Before changing routing:

- Inspect existing middleware.
- Check OAuth callback routes.
- Check login/logout redirects.
- Check protected page redirects.
- Check API route exclusions.
- Check reservation and payment navigation.

Never execute real payments during testing.

## 10. Dependency Management

- Inspect existing dependencies before adding packages.
- next-intl is already installed.
- Do not reinstall it unnecessarily.
- Do not upgrade major versions without approval.
- Investigate unused dependencies before removal.
- Check actual styled-components usage.
- Avoid replacing existing UI libraries blindly.

## 11. Security

- Never expose .env values.
- Never expose database credentials.
- Never expose server-only keys to client code.
- Do not modify production data.
- Do not modify database schemas without approval.
- Do not deploy automatically.
- Do not push to remote repositories without approval.
- Do not access unrelated projects.
- Do not modify payment or authentication logic
  without explicit approval.

## 12. Verification

Inspect package.json before running commands.

Required checks where applicable:

- TypeScript
- ESLint
- Production build
- Relevant tests
- Responsive layouts
- Authentication navigation
- Localization routing

The existing package.json may contain
"next lint", which is unsupported in Next.js 15.

Review the ESLint configuration before running lint.

Never claim tests passed unless executed.

Report pre-existing errors separately from
errors introduced by the current change.

## 13. Development Workflow

For substantial tasks:

1. Analyze the current implementation.
2. Identify confirmed issues.
3. Propose a focused plan.
4. Explain affected files and risks.
5. Wait for user approval.
6. Implement one approved phase.
7. Run relevant verification.
8. Review the diff.
9. Report results and remaining issues.
10. Wait before starting the next major phase.

Do not perform unrelated refactoring.

Do not automatically implement every priority.

## 14. Completion Report

After each approved implementation phase, report:

1. Summary of changes
2. Modified files
3. Technical reasoning
4. Verification commands and results
5. Remaining risks or issues
6. Recommended next phase

Respond in Korean.
