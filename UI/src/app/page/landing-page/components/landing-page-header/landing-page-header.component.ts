import { Component } from '@angular/core';
import { ThemeService } from './../../../../shared/services/theme/theme.service';

@Component({
  selector: 'app-landing-page-header',
  templateUrl: './landing-page-header.component.html',
  styleUrls: ['./landing-page-header.component.scss']
})
export class LandingPageHeaderComponent {
  constructor(public themeService: ThemeService) {}
}
