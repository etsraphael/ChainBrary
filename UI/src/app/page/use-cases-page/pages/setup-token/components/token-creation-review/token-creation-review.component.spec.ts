import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenCreationReviewComponent } from './token-creation-review.component';

describe('TokenCreationReviewComponent', () => {
  let component: TokenCreationReviewComponent;
  let fixture: ComponentFixture<TokenCreationReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenCreationReviewComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TokenCreationReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
