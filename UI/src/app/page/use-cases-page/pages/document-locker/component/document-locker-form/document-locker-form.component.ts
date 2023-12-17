import { Component } from '@angular/core';
import { INetworkDetail, NetworkChainId, Web3LoginService } from '@chainbrary/web3-login';
import { environment } from './../../../../../../../environments/environment';

@Component({
  selector: 'app-document-locker-form',
  templateUrl: './document-locker-form.component.html',
  styleUrls: ['./document-locker-form.component.scss']
})
export class DocumentLockerFormComponent {
  networkSupported: NetworkChainId[] = environment.contracts.documentLocker.networkSupported;

  constructor(public web3LoginService: Web3LoginService) {}

  networkList: INetworkDetail[] = this.networkSupported.map((chainId: NetworkChainId) =>
    this.web3LoginService.getNetworkDetailByChainId(chainId)
  );
}
