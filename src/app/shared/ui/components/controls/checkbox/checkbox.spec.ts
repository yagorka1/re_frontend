import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  let fixture: ComponentFixture<Checkbox>;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Checkbox] }).compileComponents();

    fixture = TestBed.createComponent(Checkbox);
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input');
  });

  it('starts unchecked', () => {
    expect(input.checked).toBe(false);
    expect(fixture.componentInstance.value()).toBe(false);
  });

  it('writes the new state into the value model when toggled', () => {
    input.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe(true);
  });

  it('reflects a value set from the outside', () => {
    fixture.componentRef.setInput('value', true);
    fixture.detectChanges();

    expect(input.checked).toBe(true);
  });

  it('blocks interaction when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(input.disabled).toBe(true);
  });
});
