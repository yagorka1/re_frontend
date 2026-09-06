import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TranslocoService } from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';

import { provideAppTransloco } from '@/core/i18n/transloco.config';
import { CatalogFilters } from '@/features/catalog/ui/catalog-filters/catalog-filters';

@Component({
  selector: 'app-catalog-filters-host',
  imports: [CatalogFilters],
  template: '<app-catalog-filters />',
})
class CatalogFiltersHost {}

describe('CatalogFilters', () => {
  let harness: RouterTestingHarness;
  let router: Router;
  let host: HTMLElement;

  const pills: () => HTMLButtonElement[] = () =>
    Array.from(host.querySelectorAll('[data-testid="pill-bar"] app-popover button[aria-haspopup]'));

  const pill: (label: string) => HTMLButtonElement = (label: string) => {
    const found: HTMLButtonElement | undefined = pills().find((button: HTMLButtonElement) =>
      button.textContent?.includes(label),
    );

    if (found === undefined) {
      throw new Error(`No filter pill labelled "${label}"`);
    }

    return found;
  };

  const sortOptionLabels: () => string[] = () =>
    Array.from(host.querySelectorAll('app-catalog-facet-choice li button')).map(
      (button: Element) => button.textContent?.trim() ?? '',
    );

  async function start(url: string): Promise<void> {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'catalog', component: CatalogFiltersHost }]),
        provideAppTransloco(),
      ],
    });

    harness = await RouterTestingHarness.create(url);
    router = TestBed.inject(Router);
    host = harness.routeNativeElement as HTMLElement;

    // Translations are bundled behind a dynamic import, so the labels are empty until the
    // language file resolves.
    await firstValueFrom(TestBed.inject(TranslocoService).load('en'));
    harness.detectChanges();
  }

  async function settle(): Promise<void> {
    await new Promise<void>((resolve: () => void) => setTimeout(resolve));
    harness.detectChanges();
  }

  it('renders one pill per facet, plus sorting', async () => {
    await start('/catalog');

    const labels: (string | null)[] = pills().map((button: HTMLButtonElement) =>
      button.getAttribute('aria-label'),
    );

    expect(labels).toEqual([
      'Category',
      'Size',
      'Brand',
      'Price',
      'Condition',
      'Colour',
      'Material',
      'City',
      'Sort',
    ]);
  });

  it('writes a facet chosen in a popover into the URL', async () => {
    await start('/catalog');

    pill('Size').click();
    harness.detectChanges();

    const firstOption: HTMLInputElement = host.querySelector(
      'app-catalog-facet-options input[type="checkbox"]',
    ) as HTMLInputElement;
    firstOption.click();
    await settle();

    expect(router.url).toBe('/catalog?size=xs');
  });

  it('shows the active facets as removable chips', async () => {
    await start('/catalog?color=black&cond=good');

    const chips: string[] = Array.from(
      host.querySelectorAll('app-catalog-active-filters li button'),
    ).map((button: Element) => button.textContent?.trim() ?? '');

    expect(chips[0]).toContain('Good');
    expect(chips[1]).toContain('Black');

    (host.querySelector('app-catalog-active-filters li button') as HTMLButtonElement).click();
    await settle();

    expect(router.url).toBe('/catalog?color=black');
  });

  it('translates reference labels with the language switcher', async () => {
    await start('/catalog?color=black&cat=women-dresses');

    const chips: () => string[] = () =>
      Array.from(host.querySelectorAll('app-catalog-active-filters li button')).map(
        (button: Element) => button.textContent?.trim() ?? '',
      );

    expect(chips()[0]).toContain('Dresses');
    expect(chips()[1]).toContain('Black');

    const transloco: TranslocoService = TestBed.inject(TranslocoService);
    await firstValueFrom(transloco.load('ru'));
    transloco.setActiveLang('ru');
    harness.detectChanges();

    expect(chips()[0]).toContain('Платья');
    expect(chips()[1]).toContain('Чёрный');
  });

  it('opens the mobile sheet with the same facets', async () => {
    await start('/catalog');

    expect(host.querySelector('[role="dialog"]')).toBeNull();

    (host.querySelector('[data-testid="open-filters"]') as HTMLButtonElement).click();
    harness.detectChanges();

    const sheet: HTMLElement = host.querySelector('[role="dialog"]') as HTMLElement;
    expect(sheet).toBeTruthy();
    expect(sheet.querySelectorAll('app-catalog-facet-options').length).toBe(4);
    expect(sheet.querySelector('app-catalog-facet-price')).toBeTruthy();
    expect(sheet.querySelector('app-catalog-facet-colors')).toBeTruthy();
  });

  it('hides relevance while there is no query to be relevant to', async () => {
    await start('/catalog');

    pill('Sort').click();
    harness.detectChanges();

    expect(sortOptionLabels()).toEqual(['Price: low to high', 'Price: high to low', 'Newest']);
  });

  it('offers relevance once a query is present', async () => {
    await start('/catalog?q=dress');

    pill('Sort').click();
    harness.detectChanges();

    expect(sortOptionLabels()).toContain('Relevance');
  });
});
