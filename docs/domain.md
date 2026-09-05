# Domain

A C2C marketplace for second-hand goods with shipping, modelled on Vinted: clothing is the
first and largest vertical, but the category tree also holds home, electronics, books and
sports. Buyer and seller are the same user type: anyone can list an item and buy someone
else's. The platform earns on a buyer protection fee and paid promotion.

This document describes the target model. As implementation progresses, reconcile it with
`../re_backend` — contracts are authoritative there.

## Entities

**User** — profile: handle, avatar, city, rating, completed sales, join date, followers and
following. Verified by email and phone.

**Listing** — the entity everything else revolves around:

- title, description, up to 20 photos, price, currency
- category (a leaf of the tree: women → clothing → tops), brand, size, color, condition,
  material
- condition is one of five levels, as on Vinted: `new_with_tags`, `new_without_tags`,
  `very_good`, `good`, `satisfactory`
- status: `draft` → `active` → `reserved` → `sold` / `archived`
- seller, ships-from city, view and favorite counters

**Category** — a tree of arbitrary depth; three levels (section → type → kind, e.g.
Men → Shoes → Sneakers) is the working maximum. There is no separate "subcategory" entity:
a subcategory is a deeper node of the same tree. Listings attach to a leaf; filtering by a
node includes all of its descendants. Which facets apply, and with which value set, hangs
off the node: shoes use an EU size chart, kids' items use age, home and electronics have no
size at all, electronics have no material.

**Brand / Size / Color / Material** — reference data, addressed by id. Size charts and
material lists are scoped to a category node as described above; brands and colors are
global.

**Favorite** — a buyer's saved item.

**Cart / Order** — the cart groups by seller: buying from two sellers produces two orders
with two shipments. An order holds line items, shipping, fees, and a status
(`pending` → `paid` → `shipped` → `delivered` → `completed` / `cancelled` / `disputed`).

**Payment** — escrow: funds are held at checkout and released to the seller after delivery
is confirmed or the confirmation window expires.

**Shipping** — shipping method, pickup point, tracking number, label.

**Conversation / Message** — chat between buyer and seller, scoped to a listing. Supports
price offers and links to the resulting order.

**Review** — left after a completed order, scored 1–5, feeds the profile rating.

**Notification** — new message, price drop on a favorited item, order status change.

## Key screens

| Area              | Contents                                                                         |
| ----------------- | -------------------------------------------------------------------------------- |
| Catalog           | Item feed, search, faceted filters (see below), sorting, infinite scroll         |
| Listing detail    | Gallery, description, seller card, buy / make an offer / favorite, similar items |
| Sell flow         | Wizard: photos → category → attributes → price → publish, with drafts            |
| Profile           | Own and other users: listings, reviews, followers                                |
| Wardrobe          | Own listings by status, sales, purchases                                         |
| Cart and checkout | Grouped by seller, shipping selection, payment                                   |
| Chat              | Conversation list, thread, price negotiation                                     |
| Favorites         | Saved items and saved searches                                                   |

## Catalog filters

One fixed set of facets for every section of the tree, as on Vinted. Sections do not add
facets of their own; they change the value set or hide a facet that does not apply.

| Facet     | Kind      | Notes                                                                                                       |
| --------- | --------- | ----------------------------------------------------------------------------------------------------------- |
| Search    | text      | Matches title and description. Enables the relevance sort.                                                  |
| Category  | tree node | Chips show the children of the current node, a breadcrumb leads back up, the dropdown shows the whole tree. |
| Size      | multi     | Chart depends on the category node; hidden where none applies.                                              |
| Brand     | multi     | Searchable list, popular brands first.                                                                      |
| Condition | multi     | The five levels above.                                                                                      |
| Color     | multi     | Swatches.                                                                                                   |
| Price     | range     | `from` / `to` in one currency.                                                                              |
| Material  | multi     | List depends on the category node; hidden where none applies.                                               |
| City      | single    | Exists because pickup exists. Drop it if the product goes delivery-only.                                    |

Sorting: relevance (only with a search query), price ascending, price descending, newest.
The default is newest, or relevance when a query is present.

The backend returns facet counts for category, condition, brand and size, and the price
bounds for the current result set. The whole filter state is serialised into the URL —
the parameter scheme is in [architecture.md](architecture.md#search-state-in-the-url) —
which is also what a saved search stores.

Rollout order: category, price, condition and sorting need no reference data and go first;
size, brand and material wait for the `catalog` reference module in `re_backend`; color and
city are simple and block nothing.

## Frontend implications

- **SEO depends on SSR.** Catalog and listing pages are the main acquisition channel and
  must render server-side, with meta tags, Open Graph and structured data on detail pages.
- **Search state belongs in the URL** so results are shareable and reproducible during SSR.
- **Images dominate page weight**: `NgOptimizedImage`, responsive sizes, lazy loading below
  the fold.
- **Mobile traffic comes first** — build mobile-first.
- **Optimistic updates** for favorites and follows, reverted on request failure.
