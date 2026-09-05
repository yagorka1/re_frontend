import { Directive } from '@angular/core';

// Typography and resets only — the border, padding and icons belong to the wrapper the
// field sits in.
@Directive({
  selector: 'input[appField], textarea[appField]',
  host: {
    class:
      'text-ink placeholder:text-ink-faint w-full min-w-0 border-none bg-transparent text-sm outline-none',
  },
})
export class FieldDirective {}
