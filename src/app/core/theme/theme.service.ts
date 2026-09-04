import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';

const LIGHT = 'light';
const DARK = 'dark';

export type Theme = typeof LIGHT | typeof DARK;

const STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly theme = signal<Theme>(this.readInitialTheme());
  readonly isDark = computed(() => this.theme() === DARK);

  constructor() {
    effect(() => {
      const theme = this.theme();
      this.document.documentElement.classList.toggle(DARK, theme === DARK);

      if (this.isBrowser) {
        localStorage.setItem(STORAGE_KEY, theme);
      }
    });
  }

  toggle(): void {
    this.theme.update((current) => (current === DARK ? LIGHT : DARK));
  }

  private readInitialTheme(): Theme {
    if (!this.isBrowser) {
      return LIGHT;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === DARK ? DARK : LIGHT;
  }
}
