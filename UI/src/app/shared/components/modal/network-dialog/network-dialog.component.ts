import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { INetworkDetail, NetworkChainId, Web3LoginService } from '@chainbrary/web3-login';
import { environment } from './../../../../../environments/environment';

@Component({
  selector: 'app-network-dialog',
  templateUrl: './network-dialog.component.html',
  styleUrl: './network-dialog.component.scss'
})
export class NetworkDialogComponent implements OnInit {
  searchTerm: string = '';
  networkList: INetworkDetail[] = [];
  networkSupported: NetworkChainId[] = environment.contracts.swapFactory.contracts.map((x) => x.chainId);

  constructor(
    private web3LoginService: Web3LoginService,
    private dialogRef: MatDialogRef<NetworkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: INetworkDialogData
  ) {}

  isSelected(chainId: NetworkChainId): boolean {
    return this.data.chainIdSelected === chainId;
  }

  get filteredNetworks(): INetworkDetail[] {
    return this.networkList.filter((network: INetworkDetail) =>
      network.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  ngOnInit(): void {
    this.generateNetworkSupported();
  }

  networkSelected(chainId: NetworkChainId): void {
    return this.dialogRef.close(chainId);
  }

  private generateNetworkSupported(): void {
    this.networkList = this.networkSupported.map((chainId: NetworkChainId) =>
      this.web3LoginService.getNetworkDetailByChainId(chainId)
    );
  }
}

export interface INetworkDialogData {
  chainIdSelected: NetworkChainId;
}
