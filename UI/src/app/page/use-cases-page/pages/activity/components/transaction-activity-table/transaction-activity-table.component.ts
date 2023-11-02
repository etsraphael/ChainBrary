import { Component, Input } from '@angular/core';
import { ITransactionLog, TransactionRole } from '@chainbrary/transaction-search';
import { INetworkDetail, Web3LoginService } from '@chainbrary/web3-login';
import { FormatService } from './../../../../../../shared/services/format/format.service';

@Component({
  selector: 'app-transaction-activity-table[userIsConnected]',
  templateUrl: './transaction-activity-table.component.html',
  styleUrls: ['./transaction-activity-table.component.scss']
})
export class TransactionActivityTableComponent {
  @Input() transactionsTable: ITransactionLog[] = [];
  @Input() currentNetwork: INetworkDetail | null;
  @Input() transactionsIsLoading: boolean;
  @Input() historicalTransactionsError: string | null;
  @Input() userIsConnected: boolean;
  displayedColumns: string[] = ['action', 'amount', 'date'];
  role = TransactionRole;

  constructor(
    public formatService: FormatService,
    public web3LoginService: Web3LoginService
  ) {}

  get networkSymbol(): string {
    return this.currentNetwork?.nativeCurrency.symbol || '';
  }

  getAmount(item: ITransactionLog): string {
    if (item.role === TransactionRole.Sender) return `-${item.amount}`;
    else return `+${item.amount}`;
  }
}
