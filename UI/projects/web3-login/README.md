# @chainbrary/web3-login

The `@chainbrary/web3-login` package provides a simple way for users to connect to web3 providers and interact with decentralized applications.

## Installation

You can install the package using npm:

```
npm install @chainbrary/web3-login
```

## Usage

To use the @chainbrary/web3-login package, first add it to your Angular project:

```
import Web3Login from '@chainbrary/web3-login';

@NgModule({
  declarations: [AppComponent],
  imports: [
    ...
    Web3LoginModule // <-- Add this line
  ],
```

You can then use the Web3Login class to connect to a web3 provider and retrieve the user's account:

```
import { Web3LoginService, ModalState } from '@chainbrary/web3-login';

constructor(private web3LoginService: Web3LoginService) { }

sampleFunctionToOpenTheModal(): void {
  this.web3LoginService.openLoginModal().subscribe((state: ModalState) => {
    console.log(state);
  });
}

forceToQuitTheModal(): void {
  this.web3LoginService.closeLoginModal();
}
```

The connect method will prompt the user to connect to a web3 provider (such as MetaMask) and grant permission to access their account. The getAccount method will then retrieve the user's account from the web3 provider.

## License

The `@chainbrary/web3-login` package is released under the MIT License.
