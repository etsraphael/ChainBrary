import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import '@angular/localize/init';
import { MatDrawer } from '@angular/material/sidenav';
import { skipWhile, Subscription, takeUntil } from 'rxjs';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { AnalyticsService } from './shared/services/analytics/analytics.service';
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
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer: MatDrawer;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();

  constructor(
    private analyticsService: AnalyticsService,
    public navService: NavService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.analyticsService.initializeGoogleAnalytics();
    this.listenDrawer();
    this.listenForRouteChanges(); 
  }

  listenDrawer(): Subscription {
    return this.navService.drawerState$
      .pipe(
        skipWhile(() => this.drawer === undefined),
        takeUntil(this.destroyed$)
      )
      .subscribe((open: boolean) => (open ? this.drawer.open() : this.drawer.close()));
  }

  listenForRouteChanges(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  onDrawerOpenedChange(isOpened: boolean): void {
    if (!isOpened) this.navService.closedDrawer();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}