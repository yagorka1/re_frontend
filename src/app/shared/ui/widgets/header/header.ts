import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

import { ButtonDirective } from '@/shared/ui/components/button/button.directive';
import { Icon } from '@/shared/ui/components/icon/icon';
import { Logo } from '@/shared/ui/components/logo/logo';
import { LanguageSwitch } from '@/shared/ui/widgets/language-switch/language-switch';
import { ThemeToggle } from '@/shared/ui/widgets/theme-toggle/theme-toggle';

@Component({
  selector: 'app-header',
  imports: [ThemeToggle, LanguageSwitch, TranslocoPipe, ButtonDirective, Icon, Logo],
  templateUrl: './header.html',
})
export class Header {}
