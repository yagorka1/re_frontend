import { TestBed } from '@angular/core/testing';
import { CatalogPage } from './catalog';

describe('CatalogPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogPage],
    }).compileComponents();
  });

  it('renders the filters and content blocks', () => {
    const fixture = TestBed.createComponent(CatalogPage);
    fixture.detectChanges();

    const page: HTMLElement = fixture.nativeElement;
    expect(page.querySelector('app-catalog-filters')).toBeTruthy();
    expect(page.querySelector('app-catalog-list')).toBeTruthy();
  });
});
