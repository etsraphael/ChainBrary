import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NetworkDialogComponent } from './../../../../../../shared/components/modal/network-dialog/network-dialog.component';

@Component({
  selector: 'app-dex-swapping-page',
  templateUrl: './dex-swapping-page.component.html',
  styleUrls: ['./dex-swapping-page.component.scss']
})
export class DexSwappingPageComponent {
  constructor(public dialog: MatDialog) {}

  openNetowkDialog(): MatDialogRef<NetworkDialogComponent> {
    return this.dialog.open(NetworkDialogComponent, {
      panelClass: ['col-12', 'col-md-8', 'col-lg-6', 'col-xl-5'],
      autoFocus: false
    });
  }
}
