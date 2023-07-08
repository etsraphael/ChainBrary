import { LandingPageHeaderPageComponent } from './landing-page-header.component';
import { describe, expect, it, beforeEach } from 'vitest';

describe('LandingPageHeaderPageComponent', () => {
  let component: LandingPageHeaderPageComponent;

  beforeEach(() => {
    component = new LandingPageHeaderPageComponent();
  });

  it('should create LandingPageHeaderPageComponent component', () => {
    expect(component).toBeTruthy();
  });
});
