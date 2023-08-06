import { describe, expect, it } from 'vitest';
import { LandingPageContainerComponent } from './landing-page-container.component';

describe('LandingPageContainerComponent', () => {
  const component: LandingPageContainerComponent = new LandingPageContainerComponent();

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
