import '@angular/compiler';
import { describe, expect, it } from 'vitest';
import { HeaderPageComponent } from './header-page.component';
import { routerMock } from '../../tests/modules/modules.mock';

describe('HeaderPageComponent', () => {
  const component: HeaderPageComponent = new HeaderPageComponent(
    routerMock
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
