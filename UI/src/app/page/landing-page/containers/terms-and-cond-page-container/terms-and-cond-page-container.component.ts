import { Component } from '@angular/core';
import { termsAndCondGlobal } from './../../../../shared/data/termAndCond';

@Component({
  selector: 'app-terms-and-cond-page-container',
  templateUrl: './terms-and-cond-page-container.component.html',
  styleUrls: ['./terms-and-cond-page-container.component.scss']
})
export class TermsAndCondPageContainerComponent {
  termsAndCondGlobalData = termsAndCondGlobal;
}
