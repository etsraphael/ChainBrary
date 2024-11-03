import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SwapEffects } from './state/effects';
import { SWAP_FEATURE_KEY } from './state/interfaces';
import { reducer } from './state/reducers';

@NgModule({
  imports: [StoreModule.forFeature(SWAP_FEATURE_KEY, reducer), EffectsModule.forFeature([SwapEffects])]
})
export class SwapStoreModule {}
