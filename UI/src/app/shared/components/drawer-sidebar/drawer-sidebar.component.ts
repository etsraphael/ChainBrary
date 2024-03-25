import { Component } from '@angular/core';
import { NavService } from '../../services/nav/nav.service';

@Component({
  selector: 'app-drawer-sidebar',
  templateUrl: './drawer-sidebar.component.html',
  styleUrls: ['./drawer-sidebar.component.scss']
})
export class DrawerSidebarComponent {
  constructor(public navService: NavService) {}
}
