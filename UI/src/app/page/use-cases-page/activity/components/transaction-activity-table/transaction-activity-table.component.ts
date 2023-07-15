import { Component, Input } from '@angular/core';
import { ITransactionLog, TransactionRole } from '@chainbrary/transaction-search';
import { FormatService } from './../../../../../shared/services/format/format.service';

@Component({
  selector: 'app-transaction-activity-table',
  templateUrl: './transaction-activity-table.component.html',
  styleUrls: ['./transaction-activity-table.component.scss']
})
export class TransactionActivityTableComponent {
  @Input() transactionsTable: ITransactionLog[] = [];
  displayedColumns: string[] = ['action', 'amount', 'date'];
  role = TransactionRole;

  constructor(public formatService: FormatService) {}
}
