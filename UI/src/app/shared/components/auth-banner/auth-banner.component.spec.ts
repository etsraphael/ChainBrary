import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StoreModule } from '@ngrx/store';
import { SharedTestModule } from '../shared-components.module';
import { initialState as authInitialState } from './../../../store/auth-store/state/init';
import { AuthBannerComponent } from './auth-banner.component';

describe('AuthBannerComponent', () => {
  let component: AuthBannerComponent;
  let fixture: ComponentFixture<AuthBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          auth: () => authInitialState
        }),
        SharedTestModule
      ],
      declarations: [AuthBannerComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    });
    fixture = TestBed.createComponent(AuthBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
