import { Component } from '@angular/core';
import { IHeaderBodyPage } from './../../../../shared/components/header-body-page/header-body-page.component';

@Component({
  selector: 'app-add-token-page-container',
  templateUrl: './add-token-page-container.component.html',
  styleUrls: ['./add-token-page-container.component.scss']
})
export class AddTokenPageContainerComponent {
  headerPayload: IHeaderBodyPage = {
    title: `Community Vault`,
    goBackLink: '/community-vaults/list',
    description: null
  };
}
