import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  InputSignal,
  Signal,
  WritableSignal,
  afterNextRender,
  contentChild,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';

import { ButtonDirective, ButtonVariant } from '@/shared/ui/components/button/button.directive';
import { PopoverPanelDirective } from '@/shared/ui/components/popover/popover-panel.directive';

export type PopoverAlign = 'start' | 'end';

let nextPopoverId: number = 0;

@Component({
  selector: 'app-popover',
  imports: [NgTemplateOutlet, ButtonDirective],
  templateUrl: './popover.html',
  host: {
    '(keydown.escape)': 'closeAndRefocus()',
  },
})
export class Popover {
  public readonly variant: InputSignal<ButtonVariant> = input<ButtonVariant>('pill');
  public readonly align: InputSignal<PopoverAlign> = input<PopoverAlign>('start');
  public readonly ariaLabel: InputSignal<string | undefined> = input<string>();
  public readonly ariaHasPopup: InputSignal<string> = input<string>('dialog');

  protected readonly panel: Signal<PopoverPanelDirective> =
    contentChild.required(PopoverPanelDirective);
  protected readonly trigger: Signal<ElementRef<HTMLButtonElement>> =
    viewChild.required<ElementRef<HTMLButtonElement>>('trigger');

  protected readonly isOpen: WritableSignal<boolean> = signal(false);
  protected readonly panelId: string = `app-popover-${nextPopoverId++}`;

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

  public close(): void {
    this.isOpen.set(false);
  }

  protected toggle(): void {
    this.isOpen.update((open: boolean) => !open);
  }

  protected closeAndRefocus(): void {
    if (!this.isOpen()) {
      return;
    }

    this.isOpen.set(false);
    this.trigger().nativeElement.focus();
  }
}
