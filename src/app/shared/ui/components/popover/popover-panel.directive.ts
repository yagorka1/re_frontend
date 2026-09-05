import { Directive, TemplateRef, inject } from '@angular/core';

// A template rather than projected content: Angular instantiates projected content eagerly,
// even inside @if, so every closed facet panel would still be built on page load.
@Directive({
  selector: 'ng-template[appPopoverPanel]',
})
export class PopoverPanelDirective {
  public readonly templateRef: TemplateRef<unknown> = inject(TemplateRef);
}
