# @chainbrary/web3-login

This package provides a simple and customizable Web3 login modal for Angular applications. It supports account and network change events and provides methods to interact with the Ethereum blockchain.

## Installation

Use the package manager [npm](https://www.npmjs.com/package/@chainbrary/web3-login) to install `@chainbrary/web3-login`.

```bash
npm install @chainbrary/web3-login
```

### Usage

Import the Web3LoginModule into your Angular application and add it to the imports array in the @NgModule decorator of your AppModule:

```typescript
import { Web3LoginModule } from '@chainbrary/web3-login';

@NgModule({
  imports: [Web3LoginModule]
})
export class AppModule {}
```

Inject the Web3LoginService into your component or service where you want to use the Web3 login functionality:

```typescript
import { Web3LoginService } from '@chainbrary/web3-login';

constructor(private web3LoginService: Web3LoginService) {}
```

Use the service methods as needed:

### Opening the login modal

To open the login modal, call the openLoginModal() method. This method returns an EventEmitter that emits a IModalState object containing the current state of the modal (either 'opened' or 'closed').

```typescript
const stateEvent = this.web3LoginService.openLoginModal();

stateEvent.subscribe((state: IModalState) => {
  // Handle the modal state here
});
```

### Closing the login modal

To close the login modal programmatically, call the closeLoginModal() method.

```typescript
this.web3LoginService.closeLoginModal();
```

### Listening to account changes

To listen for account changes, use the onAccountChangedEvent$ observable:

```typescript
this.web3LoginService.onAccountChangedEvent$.subscribe((account: string | undefined) => {
  // Handle account changes here
});
```

### Listening to chain changes

To listen for chain changes, use the onChainChangedEvent$ observable:

```typescript
this.web3LoginService.onChainChangedEvent$.subscribe(({ chainId, networkName }) => {
  // Handle chain changes here
});
```

### Accessing the Current Network

Subscribe to the currentNetwork$ observable to get the current network details:

```typescript
this.web3LoginService.currentNetwork$.subscribe((networkDetail: INetworkDetail | null) => {
  // Handle current network details here
});
```

### Obtaining Network Information

Use getNetworkDetailByChainId(chainId: string | null) to get detailed information about a network based on its chain ID:

```typescript
const networkDetail = this.web3LoginService.getNetworkDetailByChainId(chainId);
```

### Customization

To customize the appearance of the login modal, modify the following CSS classes in your application:

```
.web3-login-modal: The modal container
.web3-login-header: The modal header
.web3-login-content: The modal content
.web3-login-footer: The modal footer
```

## Feedback and Improvements

We value your feedback and are committed to continuously improving the Chainbrary library. Your suggestions, comments, and ideas will help shape the future of this project. Please don't hesitate to share your thoughts with us through the contact channels listed above. We will strive to incorporate your feedback into future updates to enhance the library for all users.

## Contact Us

For any questions, feedback, or concerns, please feel free to contact us through the following channels:

- **Discord:** Join our [Chainbrary Discord server](https://discord.gg/6gjntSegP5)
- **Instagram:** Follow me on [Instagram](https://www.instagram.com/rafael.salei/)

### License

The `@chainbrary/web3-login` package is released under the MIT License.

Let me know if you need any additional information or if you have any questions.
