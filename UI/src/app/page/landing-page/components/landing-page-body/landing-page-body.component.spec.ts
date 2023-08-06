import { describe, expect, it } from 'vitest';
import { LandingPageBodyComponent } from './landing-page-body.component';

describe('LandingPageBodyComponent', () => {
  const component: LandingPageBodyComponent = new LandingPageBodyComponent();

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
