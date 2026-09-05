import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Injectable,
  PLATFORM_ID,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';

const LIGHT: 'light' = 'light';
const DARK: 'dark' = 'dark';

export type Theme = typeof LIGHT | typeof DARK;

const STORAGE_KEY: string = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document: Document = inject(DOCUMENT);
  private readonly isBrowser: boolean = isPlatformBrowser(inject(PLATFORM_ID));

  public readonly theme: WritableSignal<Theme> = signal<Theme>(this.readInitialTheme());
  public readonly isDark: Signal<boolean> = computed(() => this.theme() === DARK);

  constructor() {
    effect(() => {
      const theme: Theme = this.theme();
      this.document.documentElement.classList.toggle(DARK, theme === DARK);

      if (this.isBrowser) {
        localStorage.setItem(STORAGE_KEY, theme);
      }
    });
  }

  public toggle(): void {
    this.theme.update((current) => (current === DARK ? LIGHT : DARK));
  }

  private readInitialTheme(): Theme {
    if (!this.isBrowser) {
      return LIGHT;
    }

    const stored: string | null = localStorage.getItem(STORAGE_KEY);
    return stored === DARK ? DARK : LIGHT;
  }
}
