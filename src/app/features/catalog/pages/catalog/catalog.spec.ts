import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { provideAppTransloco } from '@/core/i18n/transloco.config';
import { CatalogPage } from './catalog';

describe('CatalogPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogPage],
      providers: [provideRouter([]), provideAppTransloco()],
    }).compileComponents();
  });

  it('renders the filters and content blocks', () => {
    const fixture: ComponentFixture<CatalogPage> = TestBed.createComponent(CatalogPage);
    fixture.detectChanges();

    const page: HTMLElement = fixture.nativeElement;
    expect(page.querySelector('app-catalog-filters')).toBeTruthy();
    expect(page.querySelector('app-catalog-list')).toBeTruthy();
  });
});
