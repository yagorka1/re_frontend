import { Component, InputSignal, input } from '@angular/core';

export type IconName =
  'search' | 'heart' | 'message-circle' | 'user' | 'plus' | 'globe' | 'sun' | 'moon';

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.html',
})
export class Icon {
  public readonly name: InputSignal<IconName> = input.required<IconName>();
  public readonly size: InputSignal<number> = input(18);
}
