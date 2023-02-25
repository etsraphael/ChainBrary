import { Component, Input } from '@angular/core';
import { SideBarRoute } from '../../interfaces';

@Component({
  selector: 'app-nav-bar-mobile[routes]',
  templateUrl: './nav-bar-mobile.component.html',
  styleUrls: ['./nav-bar-mobile.component.scss']
})
export class NavBarMobileComponent {
  @Input() routes: SideBarRoute[];
}
