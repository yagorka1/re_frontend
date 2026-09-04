import { Component, input } from '@angular/core';

export type IconName =
  'search' | 'heart' | 'message-circle' | 'user' | 'plus' | 'globe' | 'sun' | 'moon';

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.html',
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(18);
}
