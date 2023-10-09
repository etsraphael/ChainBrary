import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrivateGlobalValuesService {
  private _isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  set isLoading(value: boolean) {
    this._isLoading.next(value);
  }

  get isLoading$(): Observable<boolean> {
    return this._isLoading.asObservable();
  }
}
