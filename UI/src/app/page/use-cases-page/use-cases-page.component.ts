import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import useCaseRoutes from './../../shared/data/useCaseRoutes';
import { ServiceItemMenu } from './../../shared/interfaces';

@Component({
  selector: 'app-use-cases-page',
  templateUrl: './use-cases-page.component.html',
  styleUrls: ['./use-cases-page.component.scss'],
  animations: [
    trigger('routeAnimations', [
      transition('payment-request => services', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ]),
        query(':enter', [style({ left: '-100%' })]),
        query(':leave', animateChild()),
        group([
          query(':leave', [animate('300ms ease-out', style({ left: '100%' }))]),
          query(':enter', [animate('300ms ease-out', style({ left: '0%' }))])
        ]),
        query(':enter', animateChild())
      ]),
      transition('services => payment-request', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ]),
        query(':enter', [style({ left: '100%' })]),
        query(':leave', animateChild()),
        group([
          query(':leave', [animate('300ms ease-out', style({ left: '-100%' }))]),
          query(':enter', [animate('300ms ease-out', style({ left: '0%' }))])
        ]),
        query(':enter', animateChild())
      ]),
      transition('* <=> *', [
        // handle any other transition
      ])
    ])
  ]
})
export class UseCasesPageComponent implements AfterViewInit {
  useCaseRoutes: ServiceItemMenu[] = useCaseRoutes;

  constructor(private cdRef:ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
