import { LandingPageContainerComponent } from './landing-page-container.component';
import { describe, expect, it, beforeEach } from 'vitest';

describe('LandingPageContainerComponent', () => {
  let component: LandingPageContainerComponent;

  beforeEach(() => {
    component = new LandingPageContainerComponent();
  });

  it('should create LandingPageContainerComponent component', () => {
    expect(component).toBeTruthy();
  });
});
