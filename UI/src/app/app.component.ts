import { Component, OnInit } from '@angular/core';
import '@angular/localize/init';
import { AnalyticsService } from './shared/services/analytics/analytics.service';

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
  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.analyticsService.initializeGoogleAnalytics();
  }
}
