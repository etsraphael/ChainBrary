import { Component } from '@angular/core';
import { NavService } from '../../services/nav/nav.service';
import { IHeaderBtn } from '../../interfaces';

@Component({
  selector: 'app-drawer-sidebar',
  templateUrl: './drawer-sidebar.component.html',
  styleUrls: ['./drawer-sidebar.component.scss']
})
export class DrawerSidebarComponent {
  constructor(public navService: NavService) {}

  headerBtns: IHeaderBtn[] = [
    {
      title: $localize`:@@headerBtn.Title.Home:Home`,
      url: '/landing-page/home'
    },
    {
      title: $localize`:@@headerBtn.Title.Partnership:Partnership`,
      url: '/landing-page/partnership'
    },
    {
      title: $localize`:@@headerBtn.Title.Services:Services`,
      url: '/use-cases/services'
    }
  ];
}
