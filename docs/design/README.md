# Design mockups

Static reference for the catalog screen, exported from the design canvas
[Re and Re Catalog](https://claude.ai/code/artifact/90a465ba-ab1a-435b-93dd-db7a05749271).
Open the files in a browser; nothing here is built, imported or shipped.

| File                                         | Artboard           |
| -------------------------------------------- | ------------------ |
| [catalog-desktop.html](catalog-desktop.html) | Catalog, 1440 wide |
| [catalog-mobile.html](catalog-mobile.html)   | Catalog, 390 × 844 |

The markup is plain HTML with inline styles and CSS variables — it is a picture of the
target, not a template. Angular components are written from scratch against the Tailwind
tokens in `src/styles.scss`; the mapping from these variables to token names is in the `/ui`
skill.

The canvas is the editable original: change the design there and re-export, do not patch
these files by hand. They are excluded from Prettier for the same reason.
