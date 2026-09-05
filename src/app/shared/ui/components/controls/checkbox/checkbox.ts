import { Component, InputSignal, ModelSignal, input, model } from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-checkbox',
  imports: [],
  templateUrl: './checkbox.html',
})
export class Checkbox implements FormValueControl<boolean> {
  public readonly value: ModelSignal<boolean> = model(false);

  public readonly disabled: InputSignal<boolean> = input(false);
}
