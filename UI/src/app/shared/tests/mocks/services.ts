import { Store } from '@ngrx/store';
import { mock } from 'ts-mockito';
import { AuthService } from '../../services';
import { WalletService } from '../../services/wallet/wallet.service';
import { PriceFeedService } from '../../services/price-feed/price-feed.service';

export const storeMock = mock(Store);
export const authServiceMock = mock(AuthService);
export const walletServiceMock = mock(WalletService);
export const priceFeedServiceMock = mock(PriceFeedService);
