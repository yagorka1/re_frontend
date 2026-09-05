import { Directive, InputSignal, Signal, computed, input } from '@angular/core';

export type LinkVariant = 'nav' | 'inline' | 'muted' | 'chip' | 'chip-active';

const CHIP_BASE: string =
  'flex h-11 shrink-0 items-center rounded-full border px-4 text-sm font-semibold whitespace-nowrap';

const VARIANT_CLASSES: Record<LinkVariant, string> = {
  nav: 'text-ink-muted hover:text-ink text-sm font-bold',
  inline: 'text-ink underline underline-offset-2 hover:text-ink-muted',
  muted: 'text-ink-faint hover:text-ink-muted text-sm',
  // Category chips are links, not buttons: each one is a crawlable catalog URL.
  chip: `${CHIP_BASE} border-border bg-surface text-ink-muted hover:text-ink`,
  'chip-active': `${CHIP_BASE} border-ink bg-ink text-surface`,
};

// Styles a native <a> (routerLink or href) by variant, so the element stays a real link —
// native navigation, middle-click, `target` and `rel` all keep working without a wrapper API.
@Directive({
  selector: 'a[appLink]',
  host: {
    '[class]': 'classes()',
  },
})
export class LinkDirective {
  public readonly appLink: InputSignal<LinkVariant> = input<LinkVariant>('inline');

  protected readonly classes: Signal<string> = computed(() => VARIANT_CLASSES[this.appLink()]);
}
