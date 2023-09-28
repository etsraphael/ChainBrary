import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CardBodyLoginComponent } from './card-body-login.component';

describe('CardBodyLoginComponent', () => {
  let component: CardBodyLoginComponent;
  let fixture: ComponentFixture<CardBodyLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CardBodyLoginComponent]
    });
    fixture = TestBed.createComponent(CardBodyLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
