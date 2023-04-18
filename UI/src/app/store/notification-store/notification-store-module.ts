import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { NotificationEffects } from './state/effects';

@NgModule({
  imports: [EffectsModule.forFeature([NotificationEffects])]
})
export class NotificationStoreModule {}
