import { describe, expect, it } from 'vitest';
import { BodyComponent } from './body.component';

describe('BodyComponent', () => {
  const component: BodyComponent = new BodyComponent();

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
