import { mock } from 'ts-mockito';
import { FormatService } from "../../services/format/format.service";
import { AuthService } from "../../services/auth/auth.service";
import { WalletService } from "../../services/wallet/wallet.service";
import { PriceFeedService } from "../../services/price-feed/price-feed.service";
import { Web3LoginService } from '@chainbrary/web3-login';

export const formatServiceMock = mock(FormatService);
export const web3LoginServiceMock = mock(Web3LoginService);
export const authServiceMock = mock(AuthService);
export const walletServiceMock = mock(WalletService);
export const priceFeedServiceMock = mock(PriceFeedService);
