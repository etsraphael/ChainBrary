import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DocumentLockerEffects } from './state/effects';
import { DOCUMENT_LOCKER_FEATURE_KEY } from './state/interfaces';
import { reducer } from './state/reducers';

@NgModule({
  imports: [
    StoreModule.forFeature(DOCUMENT_LOCKER_FEATURE_KEY, reducer),
    EffectsModule.forFeature([DocumentLockerEffects])
  ]
})
export class DocumentLockerStoreModule {}
