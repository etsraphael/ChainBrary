import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
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
  constructor(private analyticsService: AnalyticsService, private meta: Meta) {}

  ngOnInit(): void {
    this.analyticsService.initializeGoogleAnalytics();
    this.meta.updateTag({ name: 'description', content: "ChainBrary is a platform that aims to make blockchain technology more accessible to everyone by providing users with a library of open-source and secure tools for building and interacting with blockchain applications." });
  }
}
