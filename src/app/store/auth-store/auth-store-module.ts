import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AuthEffects } from './effects';
import { AUTH_FEATURE_KEY } from './interfaces';
import { reducer } from './reducers';

@NgModule({
  imports: [StoreModule.forFeature(AUTH_FEATURE_KEY, reducer), EffectsModule.forFeature([AuthEffects])]
})
export class AuthStoreModule {}
