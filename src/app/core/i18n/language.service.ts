import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, Signal, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';

export interface LanguageOption {
  readonly id: string;
  readonly label: string;
}

const STORAGE_KEY: string = 'language';

export const AVAILABLE_LANGUAGES: readonly LanguageOption[] = [
  { id: 'en', label: 'English' },
  { id: 'sr', label: 'Srpski' },
  { id: 'ru', label: 'Русский' },
];

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly transloco: TranslocoService = inject(TranslocoService);
  private readonly document: Document = inject(DOCUMENT);
  private readonly isBrowser: boolean = isPlatformBrowser(inject(PLATFORM_ID));

  public readonly languages: readonly LanguageOption[] = AVAILABLE_LANGUAGES;
  public readonly activeLang: Signal<string> = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });
  public readonly activeLanguage: Signal<LanguageOption> = computed(() => {
    const active: string = this.activeLang();
    return this.languages.find((language) => language.id === active) ?? this.languages[0];
  });

  constructor() {
    const stored: string | null = this.readStoredLanguage();
    if (stored) {
      this.transloco.setActiveLang(stored);
    }

    effect(() => {
      const active: string = this.activeLang();
      this.document.documentElement.lang = active;

      if (this.isBrowser) {
        localStorage.setItem(STORAGE_KEY, active);
      }
    });
  }

  public setLanguage(id: string): void {
    this.transloco.setActiveLang(id);
  }

  private readStoredLanguage(): string | null {
    if (!this.isBrowser) {
      return null;
    }

    const stored: string | null = localStorage.getItem(STORAGE_KEY);
    return this.languages.some((language) => language.id === stored) ? stored : null;
  }
}
