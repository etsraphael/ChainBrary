import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TokenCreationPageComponent } from './token-creation-page.component';

describe('TokenCreationPageComponent', () => {
  let component: TokenCreationPageComponent;
  let fixture: ComponentFixture<TokenCreationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TokenCreationPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TokenCreationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
