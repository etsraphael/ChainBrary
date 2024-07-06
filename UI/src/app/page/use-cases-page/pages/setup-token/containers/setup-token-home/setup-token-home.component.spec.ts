import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SetupTokenHomeComponent } from './setup-token-home.component';

describe('SetupTokenHomeComponent', () => {
  let component: SetupTokenHomeComponent;
  let fixture: ComponentFixture<SetupTokenHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupTokenHomeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SetupTokenHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
