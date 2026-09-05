# Plan: catalog filter block

Working plan, not documentation. Delete this file once the block ships; the rules it
produces belong in `docs/architecture.md`, the facet list in `docs/domain.md`.

The facets themselves are specified in [domain.md](../domain.md#catalog-filters) and the
query-parameter scheme in [architecture.md](../architecture.md#search-state-in-the-url).
This file only covers how the UI gets built, in what order, and why.

## Approach

Two rules shape the order of work.

**The URL contract comes before the components.** Filter state lives entirely in query
params, so the parsing and serialising functions and the store are the spine. Building
controls first means rewriting their API once the state shape is settled.

**There is no generic `Select` here.** None of the facets is one: condition and colour are
checkbox lists, brand is a searchable list, price is two number fields, category is a tree.
The only thing they share is the popover shell — a trigger pill, a panel, outside-click and
Escape handling, `aria-expanded`. That shell already exists, written inline inside
`language-switch`, and gets extracted rather than reinvented.

## Stages

Each stage builds, lints and tests on its own, so each is one pull request.

### 1. Primitives in `shared/ui/components`

Value-holding controls go under `components/controls`, the rest sits a level up.

- `popover` — trigger button plus lazily rendered panel. The panel is an `ng-template`
  marked with `appPopoverPanel`, not projected content: Angular instantiates projected
  content even inside `@if`, so a panel behind `ng-content` would be built for every facet
  on every page load. `language-switch` moves onto it in the same change, which is what
  proves the API.
- `checkbox` — a native input wrapped in a label, implements `FormValueControl<boolean>`.
- `ButtonDirective` — the `chip` variant is really the filter pill from the mockup, so it is
  renamed `pill`. `LinkDirective` gains `chip` and `chip-active` for the category chips,
  which are anchors rather than buttons because each one is a crawlable catalog URL.
- `number-input` — the price range's control, a separate component rather than a mode of
  `Input`: signal forms bind one concrete value type per control, so a field whose model is a
  number cannot share a `FormValueControl<string>`. It avoids `<input type="number">`, which
  reports an empty string for anything the browser judges invalid and so loses half-typed
  values. `FieldDirective` carries the styling both controls share.
- `Icon` — `chevron-down`, `sliders`, `x`, `check`.

### 2. State and reference data

- Types in `features/catalog/model`: category node, facet option, filter state, sort option.
- Pure parse and serialise functions for the query-parameter scheme. Unknown values are
  dropped rather than raising, because saved searches and inbound links outlive the
  reference data they were built from. Default values are never written to the URL.
- A store in `features/catalog/data` that reads `queryParamMap`, exposes signals and writes
  back through the router. Components never touch the route themselves.
- Reference data (category tree, conditions, colours, sizes, brands, materials, cities) as a
  local fixture shaped like the future API response. The `catalog` module in `re_backend` is
  still empty, so this is temporary and must be marked as such.

### 3. Desktop block

`catalog-filters` becomes a container: search field, category chip row with breadcrumbs,
pill bar, sort control, result count. One component per facet shape in
`features/catalog/ui`, each controlled through a `value` input and a change output:

- category tree,
- option list with checkboxes, which covers condition, colour, size, material and brand,
- price range,
- sort,
- active-filter chips with a reset action.

### 4. Mobile and tests

A bottom sheet reusing the same facet components, with scroll locking and focus trapping.
Tests: a round trip through parse and serialise, popover open and close, facet change
outputs, and the pill bar rendering.

## Open questions

- **Desktop layout.** The `ui` skill calls for a sidebar; the mockup and Vinted both use a
  pill bar with popovers. The pill bar is the recommendation, which makes the skill wrong
  and in need of a fix. Undecided, and it governs stage 3.
- **City facet.** It exists only because pickup exists. If the product goes delivery-only,
  the facet goes with it.
