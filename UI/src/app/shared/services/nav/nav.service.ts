import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  private drawerState = new BehaviorSubject<boolean>(false);
  drawerState$ = this.drawerState.asObservable();

  toggleDrawer(): void {
    return this.drawerState.next(!this.drawerState.value);
  }

  closedDrawer(): void {
    return this.drawerState.next(false);
  }
}
