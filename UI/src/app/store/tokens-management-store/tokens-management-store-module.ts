import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TokenManagementEffects } from './state/effects';
import { TOKEN_MANAGEMENT_FEATURE_KEY } from './state/interfaces';
import { reducer } from './state/reducers';

@NgModule({
  imports: [
    StoreModule.forFeature(TOKEN_MANAGEMENT_FEATURE_KEY, reducer),
    EffectsModule.forFeature([TokenManagementEffects])
  ]
})
export class TokenManagementStoreModule {}
