import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-use-cases-header[header]',
  templateUrl: './use-cases-header.component.html',
  styleUrls: ['./use-cases-header.component.scss']
})
export class UseCasesHeaderComponent {
  @Input() header: IUseCasesHeader;
}

export interface IUseCasesHeader {
  title: string;
  goBackLink: string | null;
  description: string | null;
}
