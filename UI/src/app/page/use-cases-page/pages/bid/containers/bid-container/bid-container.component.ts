import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-bid-container',
  templateUrl: './bid-container.component.html',
  styleUrls: ['./bid-container.component.scss']
})
export class BidContainerComponent implements AfterViewInit {
  constructor(private cdRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  prepareRoute(outlet: RouterOutlet): void {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
