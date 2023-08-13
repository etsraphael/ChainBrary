import { describe, expect, it } from 'vitest';
import { NavBarMobileComponent } from './nav-bar-mobile.component';

describe('NavBarMobileComponent', () => {
  const component: NavBarMobileComponent = new NavBarMobileComponent();

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
