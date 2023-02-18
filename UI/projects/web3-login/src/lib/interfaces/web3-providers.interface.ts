export interface Web3Provider {
  key: string;
  name: string;
  iconUrl: string;
  backgroundColorGradient: {
    start: string;
    end: string;
    orientation: {
      start: [number, number];
      end: [number, number];
    };
  };
}

export const providerData: Web3Provider[] = [
  {
    key: 'metamask',
    name: 'Metamask',
    iconUrl: './../assets/metamask.svg',
    backgroundColorGradient: {
      start: '#B16000',
      end: '#DF7900',
      orientation: {
        start: [0, 0],
        end: [0, 1]
      }
    }
  }
];
