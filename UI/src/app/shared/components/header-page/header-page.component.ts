import { Component } from '@angular/core';
import '@angular/localize/init';
import { IHeaderBtn } from '../../interfaces';
import { NavService } from '../../services/nav/nav.service';
import { environment } from './../../../../environments/environment';

@Component({
  selector: 'app-header-page',
  templateUrl: './header-page.component.html',
  styleUrls: ['./header-page.component.scss']
})
export class HeaderPageComponent {
  language: string[] = ['en', 'fr'];
  languageSelected: string;
  environment = environment;

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

  constructor(public navService: NavService) {}
}
