import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalState, ModalStateType, Web3LoginService } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { loadAuth, setAuthPublicAddress } from './../../../../../store/auth-store/state/actions';
import { AuthStatusCode } from './../../../../../shared/enum';
import { selectAccount, selectAuthStatus } from './../../../../../store/auth-store/state/selectors';
import { IProfileAdded } from './../../../../../shared/interfaces';
import { ProfileCreation } from './../../../../../shared/creations/profileCreation';
import Web3 from 'web3';
import { OrganizationContract } from 'src/app/shared/contracts';

@Component({
  selector: 'app-certification-container',
  templateUrl: './certification-container.component.html',
  styleUrls: ['./certification-container.component.scss']
})
export class CertificationContainerComponent implements OnInit, OnDestroy {
  authStatus$: Observable<AuthStatusCode>;
  profileAccount$: Observable<IProfileAdded | null>;
  modalSub: Subscription;
  web3: Web3;

  constructor(private store: Store, private web3LoginService: Web3LoginService) {}

  ngOnInit(): void {
    this.generateObs();
  }

  generateObs(): void {
    this.authStatus$ = this.store.select(selectAuthStatus);
    this.profileAccount$ = this.store.select(selectAccount);
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

  async saveProfile(profile: ProfileCreation) {
    this.web3 = new Web3(window.ethereum);
    const organizationContract = new OrganizationContract();
    const payload = new this.web3.eth.Contract(organizationContract.getAbi(), organizationContract.getAddress());

    // const create = await payload.methods
    //   .addAccount('ChainBrary0', profile.userName, profile.imgUrl, profile.description)
    //   .send({ from: '0xd288b9F2028cea98F3132B700Fa45c95023EcA24', value: this.web3.utils.toWei(String(0), 'ether')  });

    // const create = await payload.methods
    //   .editAccount('ChainBrary0', profile.userName, 'https://pbs.twimg.com/profile_images/1633389227047260160/eG55D0eG_400x400.jpg', profile.description)
    //   .send({ from: '0xd288b9F2028cea98F3132B700Fa45c95023EcA24' });
  }
}
