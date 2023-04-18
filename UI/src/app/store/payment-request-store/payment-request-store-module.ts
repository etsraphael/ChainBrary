import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { PaymentRequestEffects } from './state/effects';
import { PAYMENT_REQUEST_FEATURE_KEY } from './state/interfaces';
import { reducer } from './state/reducers';

@NgModule({
  imports: [
    StoreModule.forFeature(PAYMENT_REQUEST_FEATURE_KEY, reducer),
    EffectsModule.forFeature([PaymentRequestEffects])
  ]
})
export class PaymentRequestStoreModule {}
