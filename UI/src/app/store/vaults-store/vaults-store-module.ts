import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { VaultsEffects } from './state/effects';
import { VAULTS_FEATURE_KEY } from './state/interfaces';
import { reducer } from './state/reducers';

@NgModule({
  imports: [StoreModule.forFeature(VAULTS_FEATURE_KEY, reducer), EffectsModule.forFeature([VaultsEffects])]
})
export class VaultsStoreModule {}
