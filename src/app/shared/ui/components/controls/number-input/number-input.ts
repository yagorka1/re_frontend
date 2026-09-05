import {
  Component,
  InputSignal,
  ModelSignal,
  WritableSignal,
  effect,
  input,
  model,
  signal,
  untracked,
} from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';

import { FieldDirective } from '@/shared/ui/components/controls/field/field.directive';

// A comma is a decimal separator in two of the three locales. Unparseable text reads as
// unset; whether that is allowed is the form's question, not the control's.
function parseAmount(raw: string): number | null {
  const trimmed: string = raw.trim().replace(',', '.');

  if (trimmed === '') {
    return null;
  }

  const parsed: number = Number(trimmed);

  return Number.isFinite(parsed) ? parsed : null;
}

// Deliberately not <input type="number">: that element reports an empty string for anything
// the browser judges invalid, so a partly typed value is lost without a trace.
@Component({
  selector: 'app-number-input',
  imports: [FieldDirective],
  templateUrl: './number-input.html',
})
export class NumberInput implements FormValueControl<number | null> {
  public readonly value: ModelSignal<number | null> = model<number | null>(null);

  // Read by the form, not rendered as DOM attributes.
  public readonly min: InputSignal<number | undefined> = input<number>();
  public readonly max: InputSignal<number | undefined> = input<number>();
  public readonly placeholder: InputSignal<string> = input('');
  public readonly id: InputSignal<string | undefined> = input<string>();
  public readonly ariaLabel: InputSignal<string | undefined> = input<string>();

  // Kept apart from `value` so a half-finished entry such as "12." is not rewritten to "12"
  // mid-keystroke. Re-synced only when the model holds a number the text does not represent.
  protected readonly text: WritableSignal<string> = signal('');

  constructor() {
    effect(() => {
      const next: number | null = this.value();

      if (parseAmount(untracked(() => this.text())) !== next) {
        this.text.set(next === null ? '' : String(next));
      }
    });
  }

  protected onInput(raw: string): void {
    this.text.set(raw);
    this.value.set(parseAmount(raw));
  }
}
