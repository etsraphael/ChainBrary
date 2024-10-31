import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokensDialogComponent } from './tokens-dialog.component';

describe('TokensDialogComponent', () => {
  let component: TokensDialogComponent;
  let fixture: ComponentFixture<TokensDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokensDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TokensDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
