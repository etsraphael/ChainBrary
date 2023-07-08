import { Component, Input, OnInit } from '@angular/core';
import { ITransactionCard } from '../../interfaces';
import { NetworkChainId } from '@chainbrary/web3-login';

@Component({
  selector: 'app-transaction-card[cardContent]',
  templateUrl: './transaction-card.component.html',
  styleUrls: ['./transaction-card.component.scss']
})
export class TransactionCardComponent implements OnInit {
  @Input() cardContent: ITransactionCard;
  scanLink: string;

  ngOnInit(): void {
    this.generateScanLink(this.cardContent.chainId);
  }

  generateScanLink(chainId: NetworkChainId): void {
    // TODO: Add more chainId
    switch (chainId) {
      case NetworkChainId.ETHEREUM:
        this.scanLink = `https://etherscan.io/tx/${this.cardContent.hash}`;
        break;
      case NetworkChainId.SEPOLIA:
        this.scanLink = `https://sepolia.etherscan.io/tx/${this.cardContent.hash}`;
        break;
    }
  }

  goToHashExplorer(): Window | null {
    return window.open(this.scanLink, '_blank');
  }
}
