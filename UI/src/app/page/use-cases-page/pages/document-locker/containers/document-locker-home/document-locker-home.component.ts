import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-document-locker-home',
  templateUrl: './document-locker-home.component.html',
  styleUrls: ['./document-locker-home.component.scss']
})
export class DocumentLockerHomeComponent implements AfterViewInit {
  constructor(private cdRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  prepareRoute(outlet: RouterOutlet): void {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
