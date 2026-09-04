import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // The catalog feed is query-param driven and must stay indexable, so it renders per
    // request rather than being prerendered into a shared HTML file.
    path: '**',
    renderMode: RenderMode.Server,
  },
];
