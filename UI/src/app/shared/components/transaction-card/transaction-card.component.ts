import { Component, Input, OnInit } from '@angular/core';
import { ITransactionCard } from '../../interfaces';

@Component({
  selector: 'app-transaction-card[cardContent]',
  templateUrl: './transaction-card.component.html',
  styleUrls: ['./transaction-card.component.scss']
})
export class TransactionCardComponent implements OnInit {
  @Input() cardContent: ITransactionCard;
  scanLink: string;

  ngOnInit(): void {
    this.generateScanLink(this.cardContent.networkId);
  }

  generateScanLink(networkId: number): void {
    switch (networkId) {
      case 1:
        this.scanLink = `https://etherscan.io/tx/${this.cardContent.hash}`;
        break;
      case 5:
        this.scanLink = `https://goerli.etherscan.io/tx/${this.cardContent.hash}`;
        break;
    }
  }

  goToHashExplorer(): Window | null {
    return window.open(this.scanLink, '_blank');
  }
}
