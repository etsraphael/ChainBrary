import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AuthEffects } from './state/effects';
import { AUTH_FEATURE_KEY } from './state/interfaces';
import { reducer } from './state/reducers';

@NgModule({
  imports: [StoreModule.forFeature(AUTH_FEATURE_KEY, reducer), EffectsModule.forFeature([AuthEffects])]
})
export class AuthStoreModule {}
