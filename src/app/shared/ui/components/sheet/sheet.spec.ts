import { Component, WritableSignal, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sheet } from './sheet';

@Component({
  selector: 'app-sheet-host',
  imports: [Sheet],
  template: `
    <button type="button" data-testid="opener" (click)="open.set(true)">Open</button>
    <app-sheet [(open)]="open" ariaLabel="Filters" closeLabel="Close">
      <button type="button" data-testid="first">First</button>
      <button type="button" data-testid="last">Last</button>
    </app-sheet>
  `,
})
class SheetHost {
  public readonly open: WritableSignal<boolean> = signal(false);
}

describe('Sheet', () => {
  let fixture: ComponentFixture<SheetHost>;
  let host: HTMLElement;

  const dialog: () => HTMLElement | null = () => host.querySelector('[role="dialog"]');
  const byTestId: (id: string) => HTMLElement = (id: string) =>
    host.querySelector(`[data-testid="${id}"]`) as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SheetHost] }).compileComponents();

    fixture = TestBed.createComponent(SheetHost);
    fixture.detectChanges();
    host = fixture.nativeElement;
  });

  afterEach(() => {
    fixture.componentInstance.open.set(false);
    fixture.detectChanges();
  });

  it('stays out of the DOM until it is opened', () => {
    expect(dialog()).toBeNull();
    expect(document.body.style.overflow).toBe('');
  });

  it('locks the page behind it and takes focus', async () => {
    byTestId('opener').click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(dialog()).toBeTruthy();
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.activeElement).toBe(byTestId('first'));
  });

  it('releases the page and returns focus when it closes', async () => {
    const opener: HTMLElement = byTestId('opener');
    opener.focus();
    opener.click();
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.componentInstance.open.set(false);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.body.style.overflow).toBe('');
    expect(document.activeElement).toBe(opener);
  });

  it('keeps Tab inside the panel', async () => {
    byTestId('opener').click();
    fixture.detectChanges();
    await fixture.whenStable();

    byTestId('last').focus();
    (dialog() as HTMLElement).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }),
    );
    fixture.detectChanges();

    expect(document.activeElement).toBe(byTestId('first'));
  });

  it('closes on Escape', async () => {
    byTestId('opener').click();
    fixture.detectChanges();
    await fixture.whenStable();

    (dialog() as HTMLElement).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();

    expect(dialog()).toBeNull();
  });
});
