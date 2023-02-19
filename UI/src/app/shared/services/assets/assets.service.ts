import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectTheme } from 'src/app/store/global-store/state/selectors';
import { RootState } from './../../../store/root-state';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {
  constructor(private readonly store: Store) {}

  get svgAssetByNames(): string {


    // select thet good path here to do..
    this.store.select(selectTheme).subscribe((state) => {
      console.log(state)
    })


    return 'assets/svg/';
  }
}
