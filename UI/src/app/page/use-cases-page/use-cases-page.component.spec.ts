import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { SharedTestModule } from './../../shared/components/shared-components.module';
import { UseCasesPageComponent } from './use-cases-page.component';
import { initialState as authInitialState } from './../../store/auth-store/state/init';
import { ServiceItemMenu } from './../../shared/interfaces';

describe('UseCasesPageComponent', () => {
  let component: UseCasesPageComponent;
  let fixture: ComponentFixture<UseCasesPageComponent>;
  let useCaseRoutes: ServiceItemMenu[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SharedTestModule,
        StoreModule.forRoot({
          auth: () => authInitialState
        })
      ],
      declarations: [UseCasesPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UseCasesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    useCaseRoutes = component.useCaseRoutes;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have useCaseRoutes with title property', () => {
    const titles = useCaseRoutes.map((route: ServiceItemMenu) => route.title);

    useCaseRoutes.forEach((route: ServiceItemMenu, index: number) => {
      expect(route.title).toBeDefined();
      expect(typeof route.title).toEqual('string');
      expect(route.title.length).toBeGreaterThan(0);
      expect(route.title).toEqual(titles[index]);
    });
  });

  it('should have useCaseRoutes with path property', () => {
    useCaseRoutes.forEach((route: ServiceItemMenu) => {
      expect(route.path).toBeDefined();
      expect(typeof route.path).toEqual('string');
      expect(route.path.length).toBeGreaterThan(0);
    });
  });

  it('should have useCaseRoutes with icon property', () => {
    useCaseRoutes.forEach((route: ServiceItemMenu) => {
      expect(route.icon).toBeDefined();
      expect(typeof route.icon).toEqual('string');
      expect(route.icon.length).toBeGreaterThan(0);
    });
  });

  it('should have useCaseRoutes with enabled property', () => {
    useCaseRoutes.forEach((route: ServiceItemMenu) => {
      expect(route.enabled).toBeDefined();
      expect(typeof route.enabled).toEqual('boolean');
    });
  });
});
