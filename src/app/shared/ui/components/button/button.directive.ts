import { Directive, InputSignal, Signal, computed, input } from '@angular/core';

export type ButtonVariant = 'icon' | 'icon-accent' | 'chip' | 'primary';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  icon: 'border-border text-ink-muted hover:text-ink flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-card border',
  'icon-accent':
    'border-border bg-success-muted text-success flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border',
  chip: 'border-border text-ink-muted hover:text-ink flex h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-card border px-3 text-sm font-semibold',
  primary:
    'bg-brand hover:bg-brand-strong flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-card px-5 text-sm font-bold text-white',
};

// Styles a native <button> by variant, so the element stays a real button — native `type`,
// `disabled`, `aria-*` and click behavior all keep working without a wrapper API.
@Directive({
  selector: 'button[appButton]',
  host: {
    '[class]': 'classes()',
  },
})
export class ButtonDirective {
  public readonly appButton: InputSignal<ButtonVariant> = input<ButtonVariant>('icon');

  protected readonly classes: Signal<string> = computed(() => VARIANT_CLASSES[this.appButton()]);
}
