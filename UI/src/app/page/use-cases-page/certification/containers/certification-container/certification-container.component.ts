import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalState, ModalStateType, Web3LoginService } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { OrganizationContract } from 'src/app/shared/contracts';
import { environment } from 'src/environments/environment';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { ProfileCreation } from './../../../../../shared/creations/profileCreation';
import { AuthStatusCode } from './../../../../../shared/enum';
import { IProfileAdded, IReceiptTransaction } from './../../../../../shared/interfaces';
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

  constructor(private store: Store, private web3LoginService: Web3LoginService) {}

  ngOnInit(): void {
    this.generateObs();
  }

  generateObs(): void {
    this.authStatus$ = this.store.select(selectAuthStatus);
    this.profileAccount$ = this.store.select(selectAccount);
    this.publicAddress$ = this.store.select(selectPublicAddress);
    this.dailyPrice$ = this.store.select(selectDailyPrice);
  }

  ngOnDestroy(): void {
    this.modalSub?.unsubscribe();
  }

  openLoginModal(): void {
    this.modalSub = this.web3LoginService.openLoginModal().subscribe((state: ModalState) => {
      switch (state.type) {
        case ModalStateType.SUCCESS:
          this.store.dispatch(setAuthPublicAddress({ publicAddress: state.data?.publicAddress as string }));
          this.store.dispatch(loadAuth());
          this.web3LoginService.closeLoginModal();
          break;
      }
    });
  }

  saveProfile(payload: {
    profile: ProfileCreation;
    edited: boolean;
    priceValue: number;
  }): Promise<IReceiptTransaction> {
    this.web3 = new Web3(window.ethereum);
    const organizationContract = new OrganizationContract();
    const contract: Contract = new this.web3.eth.Contract(
      organizationContract.getAbi(),
      organizationContract.getAddress()
    );

    if (payload.edited) return this.editAccount(contract, payload.profile, payload.priceValue);
    else return this.addAccount(contract, payload.profile, payload.priceValue);
  }

  editAccount(contract: Contract, profile: ProfileCreation, priceValue: number): Promise<IReceiptTransaction> {
    return contract.methods
      .editAccount(environment.organizationName, profile.userName, profile.imgUrl, profile.description)
      .send({ from: profile.userAddress, value: String(priceValue) })
      .on('transactionHash', (hash: string) => this.store.dispatch(editAccountSent({ account: profile, hash })))
      .on('confirmation', (confirmationNumber: number, receipt: IReceiptTransaction) =>
        this.store.dispatch(
          editAccountSuccess({ hash: receipt.transactionHash, numberConfirmation: confirmationNumber })
        )
      )
      .on('error', (error: Error) => this.store.dispatch(editAccountFailure({ message: error.message })));
  }

  addAccount(contract: Contract, profile: ProfileCreation, priceValue: number): Promise<IReceiptTransaction> {
    return contract.methods
      .addAccount(environment.organizationName, profile.userName, profile.imgUrl, profile.description)
      .send({ from: profile.userAddress, value: String(priceValue) })
      .on('transactionHash', (hash: string) => this.store.dispatch(addAccountSent({ account: profile, hash })))
      .on('confirmation', (confirmationNumber: number, receipt: IReceiptTransaction) =>
        this.store.dispatch(
          addAccountSuccess({ hash: receipt.transactionHash, numberConfirmation: confirmationNumber })
        )
      )
      .on('error', (error: Error) => this.store.dispatch(addAccountFailure({ message: error.message })));
  }
}
