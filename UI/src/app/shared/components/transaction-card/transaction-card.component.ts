import { Component, Input } from '@angular/core';
import { ITransactionCard } from '../../interfaces';

@Component({
  selector: 'app-transaction-card[cardContent]',
  templateUrl: './transaction-card.component.html',
  styleUrls: ['./transaction-card.component.scss']
})
export class TransactionCardComponent {
  @Input() cardContent: ITransactionCard;

  goToHashExplorer(): Window | null {
    return window.open(`https://goerli.etherscan.io/tx/${this.cardContent.hash}`, '_blank');
  }
}
