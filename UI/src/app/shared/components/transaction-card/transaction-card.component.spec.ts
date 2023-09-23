import '@angular/compiler';
import { describe, expect, it } from 'vitest';
import { TransactionCardComponent } from './transaction-card.component';
import { NetworkChainId } from '@chainbrary/web3-login';
import { transactionCardMock } from '../../tests';

describe('TransactionCardComponent', () => {
  const component: TransactionCardComponent = new TransactionCardComponent();

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should scanLink with etherscan link on ETHEREUM network', () => {
    component.cardContent = transactionCardMock;
    component.generateScanLink(component.cardContent.chainId);

    expect(component.scanLink).toBe(`https://etherscan.io/tx/${component.cardContent.hash}`);
  });

  it('should scanLink with sepolia etherscan link on SEPOLIA network', () => {
    const sepoliaTransaction = { ...transactionCardMock, chainId: NetworkChainId.SEPOLIA };
    component.cardContent = sepoliaTransaction;
    component.generateScanLink(component.cardContent.chainId);

    expect(component.scanLink).toBe(`https://sepolia.etherscan.io/tx/${component.cardContent.hash}`);
  });

  it('should scanLink with polygon etherscan link on POLYGON network', () => {
    const polygonTransaction = { ...transactionCardMock, chainId: NetworkChainId.POLYGON };
    component.cardContent = polygonTransaction;
    component.generateScanLink(component.cardContent.chainId);

    expect(component.scanLink).toBe(`https://polygonscan.com/tx/${component.cardContent.hash}`);
  });

  it('should scanLink with bnb etherscan link on BNB network', () => {
    const bnbTransaction = { ...transactionCardMock, chainId: NetworkChainId.BNB };
    component.cardContent = bnbTransaction;
    component.generateScanLink(component.cardContent.chainId);

    expect(component.scanLink).toBe(`https://bscscan.com/tx/${component.cardContent.hash}`);
  });

  it('should scanLink with bnb etherscan link on BNB network', () => {
    const avalancheTransaction = { ...transactionCardMock, chainId: NetworkChainId.AVALANCHE };
    component.cardContent = avalancheTransaction;
    component.generateScanLink(component.cardContent.chainId);

    expect(component.scanLink).toBe(`https://snowtrace.io/tx/${component.cardContent.hash}`);
  });
});
