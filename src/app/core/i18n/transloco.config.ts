import { Injectable, isDevMode } from '@angular/core';
import { Translation, TranslocoLoader, provideTransloco } from '@jsverse/transloco';

const LOADERS: Record<string, () => Promise<{ default: Translation }>> = {
  en: () => import('./translations/en.json'),
  sr: () => import('./translations/sr.json'),
  ru: () => import('./translations/ru.json'),
};

// Translations are bundled at build time via dynamic import instead of an HttpLoader hitting
// `/i18n/<lang>.json`. SSR's HttpClient needs an absolute URL to fetch a static asset from the
// server process, which an HttpLoader complicates for no benefit here — this loader works
// identically on the server and in the browser.
@Injectable({ providedIn: 'root' })
class InlineTranslocoLoader implements TranslocoLoader {
  public async getTranslation(lang: string): Promise<Translation> {
    const module: { default: Translation } = await LOADERS[lang]();
    return module.default;
  }
}

export function provideAppTransloco() {
  return provideTransloco({
    config: {
      availableLangs: [
        { id: 'en', label: 'English' },
        { id: 'sr', label: 'Srpski' },
        { id: 'ru', label: 'Русский' },
      ],
      defaultLang: 'en',
      fallbackLang: 'en',
      reRenderOnLangChange: true,
      prodMode: !isDevMode(),
    },
    loader: InlineTranslocoLoader,
  });
}
