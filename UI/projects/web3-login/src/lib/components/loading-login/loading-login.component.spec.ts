import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingLoginComponent } from './loading-login.component';

describe('LoadingLoginComponent', () => {
  let component: LoadingLoginComponent;
  let fixture: ComponentFixture<LoadingLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingLoginComponent]
    });
    fixture = TestBed.createComponent(LoadingLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
