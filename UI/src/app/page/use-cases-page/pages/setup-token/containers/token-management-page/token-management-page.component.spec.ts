import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenManagementPageComponent } from './token-management-page.component';

describe('TokenManagementPageComponent', () => {
  let component: TokenManagementPageComponent;
  let fixture: ComponentFixture<TokenManagementPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenManagementPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TokenManagementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
