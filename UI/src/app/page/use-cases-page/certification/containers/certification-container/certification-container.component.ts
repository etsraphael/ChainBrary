import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalState, ModalStateType, Web3LoginService } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { environment } from './../../../../../../environments/environment';
import { OrganizationContract } from './../../../../../shared/contracts';
import { ProfileCreation } from './../../../../../shared/creations/profileCreation';
import { AuthStatusCode } from './../../../../../shared/enum';
import { IProfileAdded, IReceiptTransaction, ITransactionCard } from './../../../../../shared/interfaces';
import {
  addAccountFailure,
  addAccountSent,
  addAccountSuccess,
  editAccountFailure,
  editAccountSent,
  editAccountSuccess,
  loadAuth,
  setAuthPublicAddress
} from './../../../../../store/auth-store/state/actions';
import {
  selectAccount,
  selectAuthStatus,
  selectDailyPrice,
  selectPublicAddress
} from './../../../../../store/auth-store/state/selectors';
import { selectRecentTransactionsByComponent } from './../../../../../store/transaction-store/state/selectors';
import { ProfileCreationCommand } from 'src/app/shared/commands';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-certification-container',
  templateUrl: './certification-container.component.html',
  styleUrls: ['./certification-container.component.scss']
})
export class CertificationContainerComponent implements OnInit, OnDestroy {
  authStatus$: Observable<AuthStatusCode>;
  profileAccount$: Observable<IProfileAdded | null>;
  publicAddress$: Observable<string | null>;
  dailyPrice$: Observable<number | undefined>;
  modalSub: Subscription;
  web3: Web3;
  transactionCards$: Observable<ITransactionCard[]>;

  constructor(private store: Store, private web3LoginService: Web3LoginService, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.generateObs();
  }

  generateObs(): void {
    this.authStatus$ = this.store.select(selectAuthStatus);
    this.profileAccount$ = this.store.select(selectAccount);
    this.publicAddress$ = this.store.select(selectPublicAddress);
    this.dailyPrice$ = this.store.select(selectDailyPrice);
    this.transactionCards$ = this.store.select(selectRecentTransactionsByComponent('CertificationContainer'));
  }

  ngOnDestroy(): void {
    this.modalSub?.unsubscribe();
  }

  openLoginModal(): void {
    this.modalSub = this.web3LoginService.openLoginModal().subscribe((state: ModalState) => {
      switch (state.type) {
        case ModalStateType.SUCCESS:
          this.store.dispatch(
            setAuthPublicAddress({
              publicAddress: state.data?.publicAddress as string,
              networkId: state.data?.networkId as string,
              networkName: state.data?.networkName as string
            })
          );
          this.store.dispatch(loadAuth());
          this.web3LoginService.closeLoginModal();
          break;
      }
    });
  }

  async saveProfile(payload: {
    profile: ProfileCreation;
    edited: boolean;
    priceValue: number;
  }): Promise<IReceiptTransaction | void> {
    this.web3 = new Web3(window.ethereum);
    const organizationContract = new OrganizationContract();
    const contract: Contract = new this.web3.eth.Contract(
      organizationContract.getAbi(),
      organizationContract.getAddress()
    );

    const networkId: number = await this.web3.eth.net.getId();
    if (environment.networkSupported.indexOf(networkId) === -1) {
      this._snackBar.open('Network not supported', 'Close', {
        duration: 2000
      });
      return;
    }

    const command: ProfileCreationCommand = {
      contract,
      profile: payload.profile,
      priceValue: payload.priceValue,
      networkId
    };

    if (payload.edited) return this.editAccount(command);
    else return this.addAccount(command);
  }

  editAccount(command: ProfileCreationCommand): Promise<IReceiptTransaction> {
    return command.contract.methods
      .editAccount(
        environment.organizationName,
        command.profile.userName,
        command.profile.imgUrl,
        command.profile.description
      )
      .send({ from: command.profile.userAddress, value: String(command.priceValue) })
      .on('transactionHash', (hash: string) =>
        this.store.dispatch(editAccountSent({ account: command.profile, hash, networkId: command.networkId }))
      )
      .on('confirmation', (confirmationNumber: number, receipt: IReceiptTransaction) =>
        this.store.dispatch(
          editAccountSuccess({ hash: receipt.transactionHash, numberConfirmation: confirmationNumber })
        )
      )
      .on('error', (error: Error) => this.store.dispatch(editAccountFailure({ message: error.message })));
  }

  addAccount(command: ProfileCreationCommand): Promise<IReceiptTransaction> {
    return command.contract.methods
      .addAccount(
        environment.organizationName,
        command.profile.userName,
        command.profile.imgUrl,
        command.profile.description
      )
      .send({ from: command.profile.userAddress, value: String(command.priceValue) })
      .on('transactionHash', (hash: string) =>
        this.store.dispatch(addAccountSent({ account: command.profile, hash, networkId: command.networkId }))
      )
      .on('confirmation', (confirmationNumber: number, receipt: IReceiptTransaction) =>
        this.store.dispatch(
          addAccountSuccess({ hash: receipt.transactionHash, numberConfirmation: confirmationNumber })
        )
      )
      .on('error', (error: Error) => this.store.dispatch(addAccountFailure({ message: error.message })));
  }
}
