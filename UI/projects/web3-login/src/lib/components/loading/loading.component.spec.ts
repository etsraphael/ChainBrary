import { describe, expect, it } from 'vitest';
import { LoadingComponent } from './loading.component';

describe('LoadingComponent', () => {
  const component: LoadingComponent = new LoadingComponent();

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
