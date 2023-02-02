import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GlobalEffects } from './state/effects';
import { GLOBAL_FEATURE_KEY } from './state/interfaces';
import { reducer } from './state/reducers';

@NgModule({
  imports: [StoreModule.forFeature(GLOBAL_FEATURE_KEY, reducer), EffectsModule.forFeature([GlobalEffects])]
})
export class GlobalStoreModule {}
