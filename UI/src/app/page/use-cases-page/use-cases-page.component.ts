import { Component } from '@angular/core';
import useCaseRoutes from './../../shared/data/useCaseRoutes';
import { ServiceItemMenu } from './../../shared/interfaces';

@Component({
  selector: 'app-use-cases-page',
  templateUrl: './use-cases-page.component.html',
  styleUrls: ['./use-cases-page.component.scss']
})
export class UseCasesPageComponent {
  useCaseRoutes: ServiceItemMenu[] = useCaseRoutes;
}
