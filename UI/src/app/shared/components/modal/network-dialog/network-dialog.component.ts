import { Component } from '@angular/core';

@Component({
  selector: 'app-network-dialog',
  templateUrl: './network-dialog.component.html',
  styleUrl: './network-dialog.component.scss'
})
export class NetworkDialogComponent {
  searchTerm: string = '';
  networks = [
    { name: 'Ethereum Mainnet', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png' },
    { name: 'Scroll Mainnet', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png' },
    { name: 'Astar', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png' },
    { name: 'BNB Chain', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png' },
    { name: 'Avalanche', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png' },
    { name: 'Polygon PoS', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png' },
    { name: 'Arbitrum One', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png' },
    { name: 'OP Mainnet', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png' },
    { name: 'Arbitrum Nova', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png' },
    { name: 'Aptos', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png' },
    { name: 'Fantom', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png' },
    { name: 'Flow EVM', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png' }
  ];

  get filteredNetworks() {
    return this.networks.filter((network) => network.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }
}
