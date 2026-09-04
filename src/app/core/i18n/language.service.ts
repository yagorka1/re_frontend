import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';

export interface LanguageOption {
  readonly id: string;
  readonly label: string;
}

const STORAGE_KEY = 'language';

export const AVAILABLE_LANGUAGES: readonly LanguageOption[] = [
  { id: 'en', label: 'English' },
  { id: 'sr', label: 'Srpski' },
  { id: 'ru', label: 'Русский' },
];

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly transloco = inject(TranslocoService);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly languages = AVAILABLE_LANGUAGES;
  readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });
  readonly activeLanguage = computed(() => {
    const active = this.activeLang();
    return this.languages.find((language) => language.id === active) ?? this.languages[0];
  });

  constructor() {
    const stored = this.readStoredLanguage();
    if (stored) {
      this.transloco.setActiveLang(stored);
    }

    effect(() => {
      const active = this.activeLang();
      this.document.documentElement.lang = active;

      if (this.isBrowser) {
        localStorage.setItem(STORAGE_KEY, active);
      }
    });
  }

  setLanguage(id: string): void {
    this.transloco.setActiveLang(id);
  }

  private readStoredLanguage(): string | null {
    if (!this.isBrowser) {
      return null;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    return this.languages.some((language) => language.id === stored) ? stored : null;
  }
}
