import { Component, input, model } from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-input',
  imports: [],
  templateUrl: './input.html',
})
export class Input implements FormValueControl<string> {
  readonly value = model('');

  readonly type = input<'text' | 'search' | 'email' | 'password'>('text');
  readonly placeholder = input('');
  readonly id = input<string>();
}
