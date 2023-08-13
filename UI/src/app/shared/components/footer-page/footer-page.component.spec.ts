import { describe, expect, it } from 'vitest';
import { FooterPageComponent } from './footer-page.component';

describe('FooterPageComponent', () => {
  const component: FooterPageComponent = new FooterPageComponent();

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
