import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { IOptionActionBtn } from '../../containers/token-management-page/token-management-page.component';
import { SharedTestModule } from './../../../../../../shared/components/shared-components.module';
import { UserCasesSharedComponentsModule } from './../../../../../use-cases-page/components/user-cases-shared-components.module';
import { TokenActionModalComponent } from './token-action-modal.component';

describe('TokenActionModalComponent', () => {
  let component: TokenActionModalComponent;
  let fixture: ComponentFixture<TokenActionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedTestModule, UserCasesSharedComponentsModule, TokenActionModalComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            action: IOptionActionBtn.Mint,
            addressConnected: '0x0000000000000000000000000000000000000000',
            tokenBalanceObs: of({
              data: 10,
              loading: false,
              error: null
            })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TokenActionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
