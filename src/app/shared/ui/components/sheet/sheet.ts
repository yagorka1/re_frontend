import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  InputSignal,
  ModelSignal,
  PLATFORM_ID,
  Signal,
  effect,
  inject,
  input,
  model,
  viewChild,
} from '@angular/core';

const FOCUSABLE: string =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// A modal panel anchored to the bottom of the screen — the mobile counterpart of a popover.
// Nothing here is library-provided, so the dialog semantics are ours: the page behind stops
// scrolling, Tab stays inside, Escape closes, and focus returns where it came from.
@Component({
  selector: 'app-sheet',
  imports: [],
  templateUrl: './sheet.html',
  // Both listeners sit on the host rather than on the panel: the panel itself is not
  // focusable, so a handler there would only fire for keys pressed on its contents.
  host: {
    '(keydown.escape)': 'open.set(false)',
    '(keydown)': 'onKeydown($event)',
  },
})
export class Sheet {
  public readonly open: ModelSignal<boolean> = model(false);
  public readonly ariaLabel: InputSignal<string> = input.required<string>();
  // The backdrop is a button so it is reachable and announced, which needs a name.
  public readonly closeLabel: InputSignal<string> = input.required<string>();

  protected readonly panel: Signal<ElementRef<HTMLElement> | undefined> =
    viewChild<ElementRef<HTMLElement>>('panel');

  private readonly document: Document = inject(DOCUMENT);
  private readonly isBrowser: boolean = isPlatformBrowser(inject(PLATFORM_ID));
  private lastFocused: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const open: boolean = this.open();

      if (!this.isBrowser) {
        return;
      }

      this.document.body.style.overflow = open ? 'hidden' : '';

      if (open) {
        this.lastFocused = this.document.activeElement as HTMLElement | null;
        this.focusables()[0]?.focus();
      } else {
        this.lastFocused?.focus();
        this.lastFocused = null;
      }
    });
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') {
      return;
    }

    const focusables: readonly HTMLElement[] = this.focusables();
    if (focusables.length === 0) {
      return;
    }

    const first: HTMLElement = focusables[0];
    const last: HTMLElement = focusables[focusables.length - 1];
    const active: Element | null = this.document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private focusables(): readonly HTMLElement[] {
    const panel: HTMLElement | undefined = this.panel()?.nativeElement;
    return panel === undefined ? [] : Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
  }
}
