import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { SharedTestModule } from './../../shared/components/shared-components.module';
import { UseCasesPageComponent } from './use-cases-page.component';

describe('UseCasesPageComponent', () => {
  let component: UseCasesPageComponent;
  let fixture: ComponentFixture<UseCasesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedTestModule, StoreModule.forRoot({})],
      declarations: [UseCasesPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UseCasesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
