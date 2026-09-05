import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAppTransloco } from '@/core/i18n/transloco.config';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), provideAppTransloco()],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture: ComponentFixture<App> = TestBed.createComponent(App);
    const app: App = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
