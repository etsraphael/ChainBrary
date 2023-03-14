import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalState, ModalStateType, Web3LoginService } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { OrganizationContract } from 'src/app/shared/contracts';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { ProfileCreation } from './../../../../../shared/creations/profileCreation';
import { AuthStatusCode } from './../../../../../shared/enum';
import { IProfileAdded, IReceiptTransaction } from './../../../../../shared/interfaces';
import {
  editAccountFailure,
  editAccountSuccess,
  loadAuth,
  setAuthPublicAddress
} from './../../../../../store/auth-store/state/actions';
import {
  selectAccount,
  selectAuthStatus,
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

  saveProfile(profile: ProfileCreation): Promise<IReceiptTransaction> {
    this.web3 = new Web3(window.ethereum);
    const organizationContract = new OrganizationContract();
    const contract: Contract = new this.web3.eth.Contract(
      organizationContract.getAbi(),
      organizationContract.getAddress()
    );

    // const create = await contract.methods
    //   .addAccount('ChainBrary0', profile.userName, profile.imgUrl, profile.description)
    //   .send({ from: profile.userAddress, value: this.web3.utils.toWei(String(0), 'ether')  });

    return contract.methods
      .editAccount('chainbrary0', profile.userName, profile.imgUrl, profile.description)
      .send({ from: profile.userAddress })
      .on('transactionHash', (hash: string) => {
        console.log(`Transaction hash: ${hash}`);
      })
      .on('confirmation', (confirmationNumber: number, receipt: IReceiptTransaction) => {
        console.log(`Confirmation number:`, confirmationNumber);
        console.log(`Receipt:`, receipt);
        this.store.dispatch(editAccountSuccess());
      })
      .on('receipt', (receipt: IReceiptTransaction) => {
        console.log(`Receipt`, receipt);
      })
      .on('error', (error: Error) => {
        return this.store.dispatch(editAccountFailure({ message: error.message }));
      });
  }
}
