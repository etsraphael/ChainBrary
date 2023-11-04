import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';

export const routeAnimations = trigger('routeAnimations', [
  // full screen transitions
  transition('payment-request => services, activity => services, bid => services', [
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
  transition('services => payment-request, services => activity, services => bid', [
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
  // container transitions
  transition('bid-creation => bid-services', [
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
      query(':leave', [style({ opacity: 0 })]),
      query(':enter', [animate('300ms ease-out', style({ left: '0%' }))])
    ]),
    query(':enter', animateChild())
  ]),
  transition('services => payment-request, services => activity, services => bid, bid-services => bid-creation', [
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
      query(':leave', [style({ opacity: 0 })]),
      query(':enter', [animate('300ms ease-out', style({ left: '0%' }))])
    ]),
    query(':enter', animateChild())
  ]),
  // default transition
  transition('* <=> *', [
    // handle any other transition
  ])
]);
