import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header-body-page[header]',
  templateUrl: './header-body-page.component.html',
  styleUrls: ['./header-body-page.component.scss']
})
export class HeaderBodyPageComponent {
  @Input() header: IHeaderBodyPage;
}

export interface IHeaderBodyPage {
  title: string;
  description: string | null;
  goBackLink: string | null;
}
