import { Component } from '@angular/core';
import useCaseRoutes from './../../../../shared/data/useCaseRoutes';
import { ServiceItemMenu } from './../../../../shared/interfaces';

@Component({
  selector: 'app-use-cases-list',
  templateUrl: './use-cases-list.component.html',
  styleUrls: ['./use-cases-list.component.scss']
})
export class UseCasesListComponent {
  useCaseRoutes: ServiceItemMenu[] = useCaseRoutes;
}
