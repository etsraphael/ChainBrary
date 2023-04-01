import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TransactionEffects } from './state/effects';
import { TRANSACTION_FEATURE_KEY } from './state/interfaces';
import { reducer } from './state/reducers';

@NgModule({
  imports: [StoreModule.forFeature(TRANSACTION_FEATURE_KEY, reducer), EffectsModule.forFeature([TransactionEffects])]
})
export class TransactionStoreModule {}
