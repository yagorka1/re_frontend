import { Component, InputSignal, ModelSignal, input, model } from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';

import { FieldDirective } from '@/shared/ui/components/controls/field/field.directive';

export type InputType = 'text' | 'search' | 'email' | 'password';

@Component({
  selector: 'app-input',
  imports: [FieldDirective],
  templateUrl: './input.html',
  // The host is an element of its own, so the `w-full` on the inner input only reaches as
  // far as the host does — without this the field collapses to its inline width.
  host: {
    class: 'block min-w-0 grow',
  },
})
export class Input implements FormValueControl<string> {
  public readonly value: ModelSignal<string> = model('');

  public readonly type: InputSignal<InputType> = input<InputType>('text');
  public readonly placeholder: InputSignal<string> = input('');
  public readonly id: InputSignal<string | undefined> = input<string>();
  public readonly ariaLabel: InputSignal<string | undefined> = input<string>();
}
