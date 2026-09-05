import { DOCUMENT } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  Signal,
  WritableSignal,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

import { LanguageOption, LanguageService } from '@/core/i18n/language.service';
import { ButtonDirective } from '@/shared/ui/components/button/button.directive';
import { Icon } from '@/shared/ui/components/icon/icon';

@Component({
  selector: 'app-language-switch',
  imports: [TranslocoPipe, ButtonDirective, Icon],
  templateUrl: './language-switch.html',
})
export class LanguageSwitch {
  private readonly languageService: LanguageService = inject(LanguageService);

  protected readonly languages: readonly LanguageOption[] = this.languageService.languages;
  protected readonly activeLang: Signal<string> = this.languageService.activeLang;
  protected readonly isOpen: WritableSignal<boolean> = signal(false);

  private readonly host: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);
  private readonly document: Document = inject(DOCUMENT);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const onDocumentClick: (event: MouseEvent) => void = (event: MouseEvent) => {
        if (this.isOpen() && !this.host.nativeElement.contains(event.target as Node)) {
          this.isOpen.set(false);
        }
      };

      this.document.addEventListener('click', onDocumentClick);
      this.destroyRef.onDestroy(() => {
        this.document.removeEventListener('click', onDocumentClick);
      });
    });
  }

  protected toggle(): void {
    this.isOpen.update((open) => !open);
  }

  protected select(id: string): void {
    this.languageService.setLanguage(id);
    this.isOpen.set(false);
  }

  protected isActiveLanguage(id: string): boolean {
    return this.activeLang() === id;
  }
}
