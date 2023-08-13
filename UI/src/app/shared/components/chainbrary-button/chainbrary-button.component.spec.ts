import { describe, expect, it, vi } from 'vitest';
import { ChainbraryButtonComponent } from './chainbrary-button.component';

describe('ChainbraryButtonComponent', () => {
  const component: ChainbraryButtonComponent = new ChainbraryButtonComponent();

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit call to actions when click on chainbrary button', () => {
    const spyOnCallToAction = vi.spyOn(component.callToAction, 'emit');
    component.emit();

    expect(spyOnCallToAction).toHaveBeenCalled();
  })
});
