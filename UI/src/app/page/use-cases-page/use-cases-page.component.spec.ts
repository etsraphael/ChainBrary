import { describe, expect, it } from 'vitest';
import { UseCasesPageComponent } from './use-cases-page.component';

describe('UseCasesPageComponent', () => {
  const component: UseCasesPageComponent = new UseCasesPageComponent();

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
