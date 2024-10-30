import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NetworkDialogComponent } from './../../../../../../shared/components/modal/network-dialog/network-dialog.component';
import { NetworkChainId } from '@chainbrary/web3-login';

@Component({
  selector: 'app-dex-swapping-page',
  templateUrl: './dex-swapping-page.component.html',
  styleUrls: ['./dex-swapping-page.component.scss']
})
export class DexSwappingPageComponent {
  constructor(private dialog: MatDialog) {}
  networkPath: NetworkChainId[] = [NetworkChainId.ETHEREUM, NetworkChainId.ETHEREUM];

  openNetowkDialog(): MatDialogRef<NetworkDialogComponent> {
    const dialogRef: MatDialogRef<NetworkDialogComponent> = this.dialog.open(NetworkDialogComponent, {
      panelClass: ['col-12', 'col-md-8', 'col-lg-6', 'col-xl-5'],
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((chainId: NetworkChainId) => {
      if (chainId) this.handleNetworkSelected(chainId);
    });

    return dialogRef;
  }

  private handleNetworkSelected(chainId: NetworkChainId): void {
    // Handle the selected network here
    console.log('Selected Network Chain ID:', chainId);
  }
}
