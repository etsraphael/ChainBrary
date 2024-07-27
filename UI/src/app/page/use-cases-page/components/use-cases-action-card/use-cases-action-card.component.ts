import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-use-cases-action-card[payload]',
  templateUrl: './use-cases-action-card.component.html',
  styleUrls: ['./use-cases-action-card.component.scss']
})
export class UseCasesActionCardComponent {
  @Input() payload: IUseCasesActionCard;
}

export interface IUseCasesActionCard {
  id: string;
  title: string;
  description: string;
  routerLink: string;
  buttonText: string;
  imgSrc: string;
}
