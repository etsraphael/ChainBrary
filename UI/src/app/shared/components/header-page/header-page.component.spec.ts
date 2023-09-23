import '@angular/compiler';
import { describe, expect, it } from 'vitest';
import { HeaderPageComponent } from './header-page.component';
import { routerMock } from '../../tests';

describe('HeaderPageComponent', () => {
  const component: HeaderPageComponent = new HeaderPageComponent(
    routerMock
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
