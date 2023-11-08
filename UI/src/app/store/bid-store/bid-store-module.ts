import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { BidEffects } from './state/effects';
import { BID_FEATURE_KEY } from './state/interfaces';
import { reducer } from './state/reducers';

@NgModule({
  imports: [StoreModule.forFeature(BID_FEATURE_KEY, reducer), EffectsModule.forFeature([BidEffects])]
})
export class BidStoreModule {}
