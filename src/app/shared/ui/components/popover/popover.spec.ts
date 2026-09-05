import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Popover } from './popover';
import { PopoverPanelDirective } from './popover-panel.directive';

@Component({
  selector: 'app-popover-host',
  imports: [Popover, PopoverPanelDirective],
  template: `
    <app-popover ariaLabel="Size">
      Size
      <ng-template appPopoverPanel>
        <p data-testid="panel">Panel content</p>
      </ng-template>
    </app-popover>
  `,
})
class PopoverHost {}

describe('Popover', () => {
  let fixture: ComponentFixture<PopoverHost>;
  let host: HTMLElement;

  const trigger: () => HTMLButtonElement = () => host.querySelector('button') as HTMLButtonElement;
  const panel: () => HTMLElement | null = () => host.querySelector('[data-testid="panel"]');

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PopoverHost] }).compileComponents();

    fixture = TestBed.createComponent(PopoverHost);
    fixture.detectChanges();
    host = fixture.nativeElement;
  });

  it('keeps the panel out of the DOM until it is opened', () => {
    expect(panel()).toBeNull();
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
  });

  it('renders the panel when the trigger is clicked', () => {
    trigger().click();
    fixture.detectChanges();

    expect(panel()).toBeTruthy();
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
  });

  it('closes again on a second click', () => {
    trigger().click();
    fixture.detectChanges();
    trigger().click();
    fixture.detectChanges();

    expect(panel()).toBeNull();
  });

  it('closes on Escape and returns focus to the trigger', () => {
    trigger().click();
    fixture.detectChanges();

    trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(panel()).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it('closes when a click lands outside the popover', () => {
    trigger().click();
    fixture.detectChanges();

    document.body.click();
    fixture.detectChanges();

    expect(panel()).toBeNull();
  });
});
