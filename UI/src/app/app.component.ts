import { Component, OnInit, ViewChild } from '@angular/core';
import '@angular/localize/init';
import { AnalyticsService } from './shared/services/analytics/analytics.service';
import { MatDrawer } from '@angular/material/sidenav';
import { NavService } from './shared/services/nav/nav.service';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('drawer') drawer: MatDrawer;

  constructor(
    private analyticsService: AnalyticsService,
    public navService: NavService
  ) {}

  ngOnInit(): void {
    this.analyticsService.initializeGoogleAnalytics();
    this.navService.drawerState$.subscribe((open: boolean) => (open ? this.drawer.open() : this.drawer.close()));
  }

  onDrawerOpenedChange(isOpened: boolean): void {
    if (!isOpened) {
      this.navService.closedDrawer();
    }
  }
}
