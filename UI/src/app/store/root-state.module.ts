import { CommonModule } from '@angular/common';
import { isDevMode, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AuthStoreModule } from './auth-store';
import { BidStoreModule } from './bid-store';
import { DocumentLockerStoreModule } from './document-locker-store';
import { GlobalStoreModule } from './global-store';
import { NotificationStoreModule } from './notification-store';
import { PaymentRequestStoreModule } from './payment-request-store';
import { TransactionStoreModule } from './transaction-store';
import { VaultsStoreModule } from './vaults-store';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
    AuthStoreModule,
    GlobalStoreModule,
    PaymentRequestStoreModule,
    NotificationStoreModule,
    TransactionStoreModule,
    BidStoreModule,
    DocumentLockerStoreModule,
    VaultsStoreModule,
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() })
  ]
})
export class RootStateModule {}
