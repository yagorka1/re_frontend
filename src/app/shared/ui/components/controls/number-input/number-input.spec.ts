import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberInput } from './number-input';

describe('NumberInput', () => {
  let fixture: ComponentFixture<NumberInput>;
  let input: HTMLInputElement;

  const type: (text: string) => void = (text: string) => {
    input.value = text;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [NumberInput] }).compileComponents();

    fixture = TestBed.createComponent(NumberInput);
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input');
  });

  it('starts empty rather than at zero', () => {
    expect(fixture.componentInstance.value()).toBeNull();
    expect(input.value).toBe('');
  });

  it('publishes a number as the value', () => {
    type('4200');

    expect(fixture.componentInstance.value()).toBe(4200);
  });

  it('reads a comma as the decimal separator', () => {
    type('12,5');

    expect(fixture.componentInstance.value()).toBe(12.5);
  });

  it('reports an emptied field as unset, not as zero', () => {
    type('4200');
    type('');

    expect(fixture.componentInstance.value()).toBeNull();
  });

  it('treats unparseable text as unset', () => {
    type('abc');

    expect(fixture.componentInstance.value()).toBeNull();
  });

  it('leaves a half-typed decimal alone while the value already matches', () => {
    type('12.');

    expect(input.value).toBe('12.');
    expect(fixture.componentInstance.value()).toBe(12);
  });

  it('rewrites the text when the value is set from the outside', () => {
    type('4200');
    fixture.componentRef.setInput('value', 900);
    fixture.detectChanges();

    expect(input.value).toBe('900');
  });

  it('clears the text when the value is reset to null', () => {
    type('4200');
    fixture.componentRef.setInput('value', null);
    fixture.detectChanges();

    expect(input.value).toBe('');
  });
});
