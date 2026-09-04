import { Component } from '@angular/core';

import { ThemeToggle } from '@/shared/ui/theme-toggle/theme-toggle';

@Component({
  selector: 'app-header',
  imports: [ThemeToggle],
  templateUrl: './header.html',
})
export class Header {}
