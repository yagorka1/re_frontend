# Domain

A C2C marketplace for second-hand clothing. Buyer and seller are the same user type:
anyone can list an item and buy someone else's. The platform earns on a buyer protection
fee and paid promotion.

This document describes the target model. As implementation progresses, reconcile it with
`../re_backend` — contracts are authoritative there.

## Entities

**User** — profile: handle, avatar, city, rating, completed sales, join date, followers and
following. Verified by email and phone.

**Listing** — the entity everything else revolves around:

- title, description, up to 20 photos, price, currency
- category (a tree: women → tops → t-shirts), brand, size, color, condition
  (new with tags / excellent / good / fair), material
- status: `draft` → `active` → `reserved` → `sold` / `archived`
- seller, ships-from city, view and favorite counters

**Category / Brand / Size** — reference data. Size scales depend on the category
(footwear, clothing and kids' items use different charts), which drives filter rendering.

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

| Area              | Contents                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------ |
| Catalog           | Item feed, search, faceted filters (category, size, brand, price, condition, city), sorting, infinite scroll |
| Listing detail    | Gallery, description, seller card, buy / make an offer / favorite, similar items                             |
| Sell flow         | Wizard: photos → category → attributes → price → publish, with drafts                                        |
| Profile           | Own and other users: listings, reviews, followers                                                            |
| Wardrobe          | Own listings by status, sales, purchases                                                                     |
| Cart and checkout | Grouped by seller, shipping selection, payment                                                               |
| Chat              | Conversation list, thread, price negotiation                                                                 |
| Favorites         | Saved items and saved searches                                                                               |

## Frontend implications

- **SEO depends on SSR.** Catalog and listing pages are the main acquisition channel and
  must render server-side, with meta tags, Open Graph and structured data on detail pages.
- **Search state belongs in the URL** so results are shareable and reproducible during SSR.
- **Images dominate page weight**: `NgOptimizedImage`, responsive sizes, lazy loading below
  the fold.
- **Mobile traffic comes first** — build mobile-first.
- **Optimistic updates** for favorites and follows, reverted on request failure.
