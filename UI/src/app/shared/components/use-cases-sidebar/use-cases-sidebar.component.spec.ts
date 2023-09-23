import '@angular/compiler';
import { describe, expect, it } from 'vitest';
import { UseCasesSidebarComponent } from './use-cases-sidebar.component';
import { walletServiceMock } from '../../tests';

describe('UseCasesSidebarComponent', () => {
  const component: UseCasesSidebarComponent = new UseCasesSidebarComponent(
    walletServiceMock
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
