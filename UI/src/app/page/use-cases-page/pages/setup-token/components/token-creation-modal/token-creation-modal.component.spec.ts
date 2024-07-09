import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenCreationModalComponent } from './token-creation-modal.component';

describe('TokenCreationModalComponent', () => {
  let component: TokenCreationModalComponent;
  let fixture: ComponentFixture<TokenCreationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenCreationModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TokenCreationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
