import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

import { ButtonDirective } from '@/shared/ui/components/button/button.directive';
import { Icon } from '@/shared/ui/components/icon/icon';
import { Input } from '@/shared/ui/components/input/input';
import { LinkDirective } from '@/shared/ui/components/link/link.directive';
import { Logo } from '@/shared/ui/components/logo/logo';
import { LanguageSwitch } from '@/shared/ui/widgets/language-switch/language-switch';
import { ThemeToggle } from '@/shared/ui/widgets/theme-toggle/theme-toggle';

interface NavLink {
  readonly key: string;
  readonly category: string;
}

const NAV_LINKS: readonly NavLink[] = [
  { key: 'header.nav.women', category: 'women' },
  { key: 'header.nav.men', category: 'men' },
  { key: 'header.nav.kids', category: 'kids' },
  { key: 'header.nav.shoesAndBags', category: 'shoes-and-bags' },
];

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    ThemeToggle,
    LanguageSwitch,
    TranslocoPipe,
    ButtonDirective,
    Icon,
    Input,
    LinkDirective,
    Logo,
  ],
  templateUrl: './header.html',
})
export class Header {
  protected readonly navLinks = NAV_LINKS;
}
