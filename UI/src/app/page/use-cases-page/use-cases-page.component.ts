import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-use-cases-page',
  templateUrl: './use-cases-page.component.html',
  styleUrls: ['./use-cases-page.component.scss']
})
export class UseCasesPageComponent implements AfterViewInit {
  constructor(private cdRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  prepareRoute(outlet: RouterOutlet): void {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
