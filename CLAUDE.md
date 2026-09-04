# re_frontend

Frontend for a C2C second-hand clothing marketplace (a Vinted-like app): users list items
they no longer wear, browse a faceted catalog, negotiate in chat, and complete an escrowed
order with shipping.

- Domain model and screens: [docs/domain.md](docs/domain.md)
- Application architecture: [docs/architecture.md](docs/architecture.md)
- Decisions and their costs: [docs/decisions.md](docs/decisions.md)

## Status

This repository is still an Angular CLI scaffold. There is no domain code yet:
`app.routes.ts` is empty and `app.html` contains only `<router-outlet />`. Everything below
describes the target conventions, not what is already implemented.

Known issue: `src/app/app.spec.ts` asserts a `Hello, re_frontend` heading that the template
does not render, so `npm test` fails. Fix it alongside the first real page.

## Related repositories

- `../re_backend` — NestJS 12 API (also a bare scaffold). Source of truth for API contracts.

## Stack

| Area         | Choice                                                                  |
| ------------ | ----------------------------------------------------------------------- |
| Framework    | Angular 22, standalone, **zoneless** (`zone.js` is not installed)       |
| Rendering    | SSR + hydration (`@angular/ssr`, Express host in `src/server.ts`)       |
| Styling      | Tailwind CSS + in-house components, no component library                |
| State        | Signals + services; NgRx SignalStore only where a service stops scaling |
| API          | REST, typed client generated from the `re_backend` OpenAPI schema       |
| Structure    | `core` / `shared` / `features`, lazily routed features                  |
| Search state | Filters, sorting and paging live in URL query params                    |
| Tests        | Vitest (`@angular/build:unit-test`)                                     |
| Formatting   | Prettier: `printWidth 100`, single quotes, 2-space indent               |

The reasoning and the cost of each choice is in [docs/decisions.md](docs/decisions.md).

## Commands

```bash
npm start          # dev server on http://localhost:4200
npm run build      # production build into dist/ (SSR, outputMode: server)
npm run watch      # development build in watch mode
npm test           # Vitest
npm run serve:ssr:re_frontend   # run the built SSR server (PORT, defaults to 4000)
npx prettier --write .
npx ng generate component features/<feature>/ui/<name>
```

Full stack locally: `npm run start:dev` in `../re_backend`, plus `npm start` here.

## Angular 22 conventions

The app is zoneless — state that does not live in a signal will not re-render.

- Always `ChangeDetectionStrategy.OnPush`, with `signal()` / `computed()` for state.
- Signal-based IO: `input()`, `input.required()`, `output()`, `model()`. Do not use the
  `@Input` / `@Output` decorators in new code.
- Inject with `inject()`, not constructor parameters.
- Template control flow is `@if` / `@for` / `@switch` / `@defer`. Do not use `*ngIf`,
  `*ngFor`, `NgClass` or `NgStyle`.
- Standalone components with `imports: [...]`; no `NgModule`.
- Async data via `resource()` / `httpResource()`, or a service that writes into a signal.
  Keep RxJS for event streams, not for holding state.
- Product images always go through `NgOptimizedImage`.
- File names carry no type suffix (`catalog.ts`, `catalog.html`, `catalog.scss`, the
  Angular 22 CLI style); component selectors use the `app-` prefix.

Angular 22 was released after my training cutoff. When unsure about an API, check the docs
through the `context7` MCP server instead of relying on memory.

## SSR constraints

- Components and services execute on the server. No direct `window`, `document` or
  `localStorage` in fields, constructors or `ngOnInit`. Use `afterNextRender()`,
  `isPlatformBrowser()`, or inject `DOCUMENT`.
- `src/app/app.routes.server.ts` currently prerenders `**`. Dynamic pages (item detail,
  profile, chat) need `RenderMode.Server`; genuinely static pages stay `Prerender`.
- On the server the auth token comes from the request cookie, never from `localStorage`.

## Generated API client

`src/app/api/` is generated and must not be hand-edited — changes there are overwritten.
Wrap it in `features/*/data/` services instead. Regeneration: the `/api-sync` skill.

## Working expectations

- Do not commit or push unless asked.
- Touch `angular.json`, `tsconfig*.json` or dependencies only when the task requires it,
  and call it out explicitly.
- Conversation is in Russian; everything written into the repository — code, identifiers,
  documentation, commit messages — is in English.
- Run `npm test` and `npm run build` after any non-trivial change.

## Keeping the docs current

Documentation is updated in the same change that makes it stale — never as a follow-up task.
Route by what actually changed:

| Change                                                          | Goes into                                                                       |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| New or renamed npm script                                       | Commands table in this file                                                     |
| New dependency or tool                                          | Stack table here; plus `docs/decisions.md` if there was a real choice           |
| New convention, boundary or layer rule                          | `docs/architecture.md`, and the conventions here if it constrains everyday code |
| New render mode, guard, interceptor or other app-wide mechanism | `docs/architecture.md`                                                          |
| New domain entity, status, or screen                            | `docs/domain.md`                                                                |
| A choice someone would otherwise re-litigate later              | `docs/decisions.md` — one paragraph: what, why, what it costs                   |
| A workflow repeated more than twice                             | A new skill in `.claude/skills/`                                                |
| Something in the docs turned out to be wrong or obsolete        | Fix or delete it on the spot                                                    |

What does **not** go into the docs: individual components, services, routes and features.
The code is the documentation for those. Document a feature only when it introduces a rule
other code has to follow.

Two specifics worth remembering, because both files currently describe a scaffold rather
than a real app:

- The "Status" section above is a snapshot. Update it as the scaffold gets replaced, and
  delete it once it no longer says anything true.
- `docs/domain.md` is a reconstruction, not a spec. When `re_backend` contradicts it, the
  backend wins — correct the doc rather than coding around it.

Keep entries short. These files are read in full at the start of every session; length is
paid for on every task, so an entry earns its place by changing what someone would do.

## Repository skills

- `/feature` — scaffold a feature: routes, pages, signal-based data layer, tests.
- `/api-sync` — regenerate the OpenAPI client and repair call sites.
- `/ui` — Tailwind tokens and marketplace component patterns.
