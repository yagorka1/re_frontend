import { Component, InputSignal, ModelSignal, input, model } from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-input',
  imports: [],
  templateUrl: './input.html',
})
export class Input implements FormValueControl<string> {
  public readonly value: ModelSignal<string> = model('');

  public readonly type: InputSignal<'text' | 'search' | 'email' | 'password'> = input<
    'text' | 'search' | 'email' | 'password'
  >('text');
  public readonly placeholder: InputSignal<string> = input('');
  public readonly id: InputSignal<string | undefined> = input<string>();
}
