import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, ElementRef, afterNextRender, inject, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

import { LanguageService } from '@/core/i18n/language.service';
import { ButtonDirective } from '@/shared/ui/components/button/button.directive';
import { Icon } from '@/shared/ui/components/icon/icon';

@Component({
  selector: 'app-language-switch',
  imports: [TranslocoPipe, ButtonDirective, Icon],
  templateUrl: './language-switch.html',
})
export class LanguageSwitch {
  protected readonly languageService = inject(LanguageService);
  protected readonly isOpen = signal(false);

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const onDocumentClick = (event: MouseEvent) => {
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

  toggle(): void {
    this.isOpen.update((open) => !open);
  }

  select(id: string): void {
    this.languageService.setLanguage(id);
    this.isOpen.set(false);
  }
}
