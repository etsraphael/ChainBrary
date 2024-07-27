import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenSearchPageComponent } from './token-search-page.component';

describe('TokenSearchPageComponent', () => {
  let component: TokenSearchPageComponent;
  let fixture: ComponentFixture<TokenSearchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenSearchPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TokenSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
