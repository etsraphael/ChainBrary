import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NetworkChainId } from '@chainbrary/web3-login';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { SharedComponentsModule } from '../../shared-components.module';
import { ITokensDialogData, TokensDialogComponent } from './tokens-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TokensDialogComponent', () => {
  let component: TokensDialogComponent;
  let fixture: ComponentFixture<TokensDialogComponent>;

  const data: ITokensDialogData = {
    tokenId: 'tokenId',
    chainIdSelected: NetworkChainId.LOCALHOST,
    tokenSearch$: of({
      data: null,
      loading: false,
      error: null
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedComponentsModule, StoreModule.forRoot({}), BrowserAnimationsModule],
      declarations: [TokensDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        {
          provide: MAT_DIALOG_DATA,
          useValue: data
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TokensDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
