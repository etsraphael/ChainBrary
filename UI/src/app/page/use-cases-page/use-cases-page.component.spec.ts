import { UseCasesPageComponent } from './use-cases-page.component';
import { SideBarRoute } from '../../shared/interfaces';
import { describe, expect, it, beforeEach } from 'vitest';

describe('UseCasesPageComponent', () => {
  let component: UseCasesPageComponent;
  let useCaseRoutes: SideBarRoute[];

  beforeEach(() => {
    component = new UseCasesPageComponent();
    useCaseRoutes = component.useCaseRoutes;
  });

  it('should create UseCasesPageComponent component', () => {
    expect(component).toBeTruthy();
  });

  it('should have useCaseRoutes with title property', () => {
    const titles = ['Payment Request', 'Proposal'];

    useCaseRoutes.forEach((route: SideBarRoute, index: number) => {
      expect(route.title).toBeDefined();
      expect(route.title).toBeTypeOf('string');
      expect(route.title.length).toBeGreaterThan(0);
      expect(route.title).toEqual(titles[index]);
    });
  });

  it('should have useCaseRoutes with path property', () => {
    useCaseRoutes.forEach((route: SideBarRoute) => {
      expect(route.path).toBeDefined();
      expect(route.path).toBeTypeOf('string');
      expect(route.path.length).toBeGreaterThan(0);
    });
  });

  it('should have useCaseRoutes with icon property', () => {
    useCaseRoutes.forEach((route: SideBarRoute) => {
      expect(route.icon).toBeDefined();
      expect(route.icon).toBeTypeOf('string');
      expect(route.icon.length).toBeGreaterThan(0);
    });
  });

  it('should have useCaseRoutes with enabled property', () => {
    useCaseRoutes.forEach((route: SideBarRoute) => {
      expect(route.enabled).toBeDefined();
      expect(route.enabled).toBeTypeOf('boolean');
    });
  });
});
