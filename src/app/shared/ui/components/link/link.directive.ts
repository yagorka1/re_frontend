import { Directive, computed, input } from '@angular/core';

export type LinkVariant = 'nav' | 'inline' | 'muted';

const VARIANT_CLASSES: Record<LinkVariant, string> = {
  nav: 'text-ink-muted hover:text-ink text-sm font-bold',
  inline: 'text-ink underline underline-offset-2 hover:text-ink-muted',
  muted: 'text-ink-faint hover:text-ink-muted text-sm',
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
  readonly appLink = input<LinkVariant>('inline');

  protected readonly classes = computed(() => VARIANT_CLASSES[this.appLink()]);
}
