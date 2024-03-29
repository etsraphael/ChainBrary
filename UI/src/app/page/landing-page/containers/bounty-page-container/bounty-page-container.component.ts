import { Component } from '@angular/core';
import { IHeaderBodyPage } from './../../../../shared/components/header-body-page/header-body-page.component';

@Component({
  selector: 'app-bounty-page-container',
  templateUrl: './bounty-page-container.component.html',
  styleUrls: ['./bounty-page-container.component.scss']
})
export class BountyPageContainerComponent {
  headerPayload: IHeaderBodyPage = {
    title: $localize`:@@BugBountyProgram.Title:Bug Bounty Program`,
    goBackLink: null,
    description: $localize`:@@BugBountyProgram.Desc:Welcome to the Chainbrary Bug Bounty Program. Our commitment is to provide a secure and reliable platform for our users. We encourage responsible disclosure of vulnerabilities and invite security researchers to participate in this program. Our focus is predominantly on safeguarding user funds against unauthorized access and fraudulent activities.`
  };
}
