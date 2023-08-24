import { describe, expect, it } from 'vitest';
import { HeaderPageComponent } from './header.component';

describe('HeaderPageComponent', () => {
  const component: HeaderPageComponent = new HeaderPageComponent();

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
