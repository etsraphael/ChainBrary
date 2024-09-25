import { Injectable } from '@angular/core';
import { INetworkDetail, Web3LoginService } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, map } from 'rxjs';
import { selectCurrentNetwork } from './../../../store/auth-store/state/selectors';

export interface CustomWeb3Error {
  code: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  constructor(
    private web3LoginService: Web3LoginService,
    private store: Store
  ) {}

  private readonly networkOnStore$: Observable<INetworkDetail | null> = this.store.select(selectCurrentNetwork);

  get networkIsMatching$(): Observable<boolean> {
    return combineLatest([this.web3LoginService.currentNetwork$, this.networkOnStore$]).pipe(
      map(
        ([currentNetwork, networkOnStore]) =>
          networkOnStore !== null && currentNetwork?.chainId === networkOnStore?.chainId
      )
    );
  }

  get netWorkOnWallet$(): Observable<INetworkDetail | null> {
    return this.web3LoginService.currentNetwork$;
  }

  formatErrorMessage(error: unknown): CustomWeb3Error {
    const code: number = this.extractErrorCode(error);
    let message: string;

    switch (code) {
      case -32002:
        message = $localize`:@@ErrorMessage.WalletAlreadyProcessing:Error -32002: Wallet is already processing another request`;
        break;
      case -32000:
        message = $localize`:@@ErrorMessage.WalletNotEnoughBalance:Error -32000: Wallet connect has not enough balance to pay for the transaction`;
        break;
      case 4001:
        message = $localize`:@@ErrorMessage.TransactionRejected:Error 4001: Transaction rejected by wallet`;
        break;
      default:
        message = $localize`:@@ErrorMessage.TransactionError:An error occurred while sending the transaction on the wallet`;
    }

    return { code, message };
  }

  private extractErrorCode(error: unknown): number {
    console.log('error', error);
    if (typeof error === 'object' && error !== null) {
      const err = error as { code?: number; cause?: { code?: number }; error?: { code: number, message: string }  };
      console.log('err', err);
      console.log('err.cause', err.cause);
      console.log('response', err.cause?.code ?? err.code ?? err.error?.code ?? 0);
      return err.cause?.code ?? err.code ?? err.error?.code ?? 0;
    }
    return 0;
  }
}
