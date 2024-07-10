import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenCreationFormComponent } from './token-creation-form.component';

describe('TokenCreationFormComponent', () => {
  let component: TokenCreationFormComponent;
  let fixture: ComponentFixture<TokenCreationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenCreationFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TokenCreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
