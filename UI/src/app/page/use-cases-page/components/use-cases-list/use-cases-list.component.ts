import { Component } from '@angular/core';
import { IServiceCard } from './../../../../shared/components/service-card/service-card.component';
import serviceCards from './../../../../shared/data/useCaseRoutes';

@Component({
  selector: 'app-use-cases-list',
  templateUrl: './use-cases-list.component.html',
  styleUrls: ['./use-cases-list.component.scss']
})
export class UseCasesListComponent {
  cards: IServiceCard[] = serviceCards;
}
