import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { provideAppTransloco } from '@/core/i18n/transloco.config';
import { Header } from './header';

describe('Header', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([]), provideAppTransloco()],
    }).compileComponents();
  });

  it('renders the wordmark and the theme and language switchers', () => {
    const fixture: ComponentFixture<Header> = TestBed.createComponent(Header);
    fixture.detectChanges();

    const header: HTMLElement = fixture.nativeElement;
    expect(header.querySelector('app-logo')).toBeTruthy();
    expect(header.querySelector('app-theme-toggle')).toBeTruthy();
    expect(header.querySelector('app-language-switch')).toBeTruthy();
  });
});
