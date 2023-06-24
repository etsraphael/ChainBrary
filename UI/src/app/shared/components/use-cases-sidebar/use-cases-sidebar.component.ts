import { Component } from '@angular/core';
import { INetworkDetail } from '@chainbrary/web3-login';
import { Observable } from 'rxjs';
import useCaseRoutes from '../../data/useCaseRoutes';
import { SideBarRoute } from '../../interfaces';
import { WalletService } from '../../services/wallet/wallet.service';

@Component({
  selector: 'app-use-cases-sidebar',
  templateUrl: './use-cases-sidebar.component.html',
  styleUrls: ['./use-cases-sidebar.component.scss']
})
export class UseCasesSidebarComponent {
  useCaseRoutes: SideBarRoute[] = useCaseRoutes;
  networkOnStore$: Observable<INetworkDetail | null>;

  constructor(public walletService: WalletService) {}
}
