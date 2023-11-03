import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBidMenuComponent } from './home-bid-menu.component';

describe('HomeBidMenuComponent', () => {
  let component: HomeBidMenuComponent;
  let fixture: ComponentFixture<HomeBidMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeBidMenuComponent]
    });
    fixture = TestBed.createComponent(HomeBidMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
