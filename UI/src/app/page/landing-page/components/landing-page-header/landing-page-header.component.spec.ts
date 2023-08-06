import { describe, expect, it } from 'vitest';
import { LandingPageHeaderPageComponent } from './landing-page-header.component';

describe('LandingPageHeaderPageComponent', () => {
  const component: LandingPageHeaderPageComponent = new LandingPageHeaderPageComponent();

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
