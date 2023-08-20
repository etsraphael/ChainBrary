# @chainbrary/token-bridge

The @chainbrary/token-bridge library provides an Angular service, Erc20Service, developed by the Chainbrary's team for easy interaction with the Ethereum ERC-20 token standard. It provides a set of methods that allow you to perform various token-related operations, such as getting the token balance of an address, checking the token allowance of an address, increasing or decreasing token allowance, transferring tokens between addresses, and approving an address to spend tokens on your behalf.

This service relies on the Web3.js library to communicate with the Ethereum blockchain.

## Installation

To use the Erc20Service, you need to install the required dependencies:

```bash
npm install web3 @chainbrary/token-bridge
```

Make sure you also have the Angular service imported into your project.

Usage
First, import the service and its associated interfaces in your component or service:

```typescript
import { Erc20Service } from '@chainbrary/token-bridge';
import { IBalancePayload, IAllowancePayload, IEditAllowancePayload, ITransferPayload } from '@chainbrary/token-bridge';
```

Then, inject the service in the constructor of your component or service:

```typescript
constructor(private erc20Service: Erc20Service) {}
```

## Methods

The following methods are available in the Erc20Service class:

### getBalance

`getBalance(payload: IBalancePayload): Promise<number>` to get the token balance of the given address.

Example:

```typescript
const payload: IBalancePayload = {
  tokenAddress: '0x1234567890123456789012345678901234567890',
  chainId: '1',
  owner: '0x0987654321098765432109876543210987654321'
};
const balance = await this.erc20Service.getBalance(payload);
console.log(`Balance: ${balance}`);
```

### getAllowance

`getAllowance(payload: IAllowancePayload): Promise<number>` to get the token allowance of the given address.

Example:

```typescript
const payload: IAllowancePayload = {
  tokenAddress: '0x1234567890123456789012345678901234567890',
  chainId: '1',
  owner: '0x0987654321098765432109876543210987654321',
  spender: '0x5678901234567890123456789012345678901234'
};
const allowance = await this.erc20Service.getAllowance(payload);
console.log(`Allowance: ${allowance}`);
```

### increaseAllowance

`increaseAllowance(payload: IEditAllowancePayload): Promise<boolean>` to increase the token allowance of the given address.

Example:

```typescript
const payload: IEditAllowancePayload = {
  tokenAddress: '0x1234567890123456789012345678901234567890',
  chainId: '1',
  owner: '0x0987654321098765432109876543210987654321',
  spender: '0x5678901234567890123456789012345678901234',
  amount: 100
};
const result = await this.erc20Service.increaseAllowance(payload);
console.log(`Transaction Success: ${result}`);
```

### decreaseAllowance

`decreaseAllowance(payload: IEditAllowancePayload): Promise<boolean>` to decrease the token allowance of the given address.

Example:

```typescript
const payload: IEditAllowancePayload = {
  tokenAddress: '0x1234567890123456789012345678901234567890',
  chainId: '1',
  owner: '0x0987654321098765432109876543210987654321',
  spender: '0x5678901234567890123456789012345678901234',
  amount: 50
};
const result = await this.erc20Service.decreaseAllowance(payload);
console.log(`Transaction Success: ${result}`);
```

### transfer

`transfer(payload: ITransferPayload): Promise<boolean> ` to transfer tokens between addresses.

Example:

```typescript
const payload: ITransferPayload = {
  tokenAddress: '0x1234567890123456789012345678901234567890',
  chainId: '1',
  amount: 100,
  from: '0x0987654321098765432109876543210987654321',
  to: '0x5678901234567890123456789012345678901234'
};
const result = await this.erc20Service.transfer(payload);
console.log(`Transaction Success: ${result}`);
```

### approve

`approve(payload: IEditAllowancePayload): Promise<boolean>` to approve an address to spend tokens on your behalf.

Example:

```typescript
const payload = {
  tokenAddress: '0x1234567890123456789012345678901234567890',
  chainId: '1',
  owner: '0x0987654321098765432109876543210987654321',
  spender: '0x5678901234567890123456789012345678901234',
  amount: 200
};
const result = await this.erc20Service.approve(payload);
console.log(`Transaction Success: ${result}`);
```

# Credits

This library was developed by the Chainbrary's team.

Note: Make sure you have an Ethereum provider (such as MetaMask) installed and configured properly before using the service.

Please be aware that interacting with blockchain networks might involve transaction fees, and the operations could fail due to various reasons, such as insufficient funds, rejected transactions, etc. Always handle errors properly and inform users about possible outcomes.

## Feedback and Improvements

We value your feedback and are committed to continuously improving the Chainbrary library. Your suggestions, comments, and ideas will help shape the future of this project. Please don't hesitate to share your thoughts with us through the contact channels listed above. We will strive to incorporate your feedback into future updates to enhance the library for all users.

## Contact Us

For any questions, feedback, or concerns, please feel free to contact us through the following channels:

- **Discord:** Join our [Chainbrary Discord server](https://discord.gg/6gjntSegP5)
- **Instagram:** Follow me on [Instagram](https://www.instagram.com/rafael.salei/)

### License

The `@chainbrary/token-bridge` package is released under the MIT License.

Let me know if you need any additional information or if you have any questions.
