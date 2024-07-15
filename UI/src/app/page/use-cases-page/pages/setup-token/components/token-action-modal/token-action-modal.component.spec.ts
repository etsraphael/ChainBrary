import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TokenActionModalComponent } from './token-action-modal.component';

describe('TokenActionModalComponent', () => {
  let component: TokenActionModalComponent;
  let fixture: ComponentFixture<TokenActionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenActionModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TokenActionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
