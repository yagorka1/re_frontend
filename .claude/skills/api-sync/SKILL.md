---
name: api-sync
description: Sync the typed client in src/app/api with the re_backend OpenAPI schema — regenerate it, triage breaking contract changes, and repair call sites. Use after the NestJS API changes, when the api layer fails to type-check, or when asked to update API types or the client.
---

# Sync the API client

`src/app/api/` is generated in full. Edits there are overwritten — behavior layered on top
of the client belongs in `features/*/data/`.

## 1. Check whether generation is set up

Look for an `api:generate` script in `package.json` and a generator config
(`openapi-ts.config.ts` / `orval.config.ts`).

If neither exists, generation has not been bootstrapped yet:

1. Confirm `../re_backend` actually serves a schema — it needs `@nestjs/swagger` and a
   `SwaggerModule` setup in `src/main.ts`. If Swagger is not wired up, tell the user it has
   to be added on the backend first, and stop. Do not invent a schema.
2. Propose a generator (default: `@hey-api/openapi-ts`), get agreement before installing the
   dependency, then add the script:

```json
"api:generate": "openapi-ts -i http://localhost:3000/api-json -o src/app/api"
```

3. Make sure `src/app/api` is not gitignored. The generated client is committed so builds do
   not depend on a running backend.

## 2. Regenerate

The backend must be running (`npm run start:dev` in `../re_backend`) if the schema is pulled
over HTTP. Then run `npm run api:generate`.

## 3. Triage the diff

Run `git diff --stat src/app/api` and read what actually changed. Call out breaking changes
specifically: renamed fields, optionality flips, changed types, removed endpoints.

Then run `npm run build` — the compiler will point at every broken call site.

## 4. Repair call sites

Fix **callers in `features/*/data/`**, never the generated output.

- Renamed field → update the mapper in `model/`; do not spread the new name through templates.
- Removed endpoint → find its replacement in the new schema. If there is none, ask the user
  rather than silently deleting functionality.
- New required request field → trace where the value comes from in the UI. If nothing
  supplies it, that is a product question — raise it.
- Weakened types (`any`, `unknown` appearing where a type used to be) usually mean missing
  Swagger decorators on the backend, not a frontend problem. Report it.

## 5. Verify and report

Run `npm test` and `npm run build`. In the summary tell the user which endpoints appeared or
disappeared, which changes were breaking, and what had to be adjusted in the features.
