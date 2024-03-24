import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { SharedTestModule } from './../../../../shared/components/shared-components.module';
import { initialState as authInitialState } from './../../../../store/auth-store/state/init';
import { WithdrawTokenPageContainerComponent } from './withdraw-token-page-container.component';

describe('WithdrawTokenPageContainerComponent', () => {
  let component: WithdrawTokenPageContainerComponent;
  let fixture: ComponentFixture<WithdrawTokenPageContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedTestModule,
        RouterTestingModule,
        StoreModule.forRoot({
          auth: () => authInitialState
        })
      ],
      declarations: [WithdrawTokenPageContainerComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatSnackBarRef, useValue: {} },
        { provide: MAT_SNACK_BAR_DATA, useValue: {} }
      ]
    });
    fixture = TestBed.createComponent(WithdrawTokenPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
