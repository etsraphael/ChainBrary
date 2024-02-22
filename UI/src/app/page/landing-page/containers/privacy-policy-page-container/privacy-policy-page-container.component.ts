import { Component } from '@angular/core';
import { privacyAndPolicy } from './../../../../shared/data/privacyPolicy';

@Component({
  selector: 'app-privacy-policy-page-container',
  templateUrl: './privacy-policy-page-container.component.html',
  styleUrls: ['./privacy-policy-page-container.component.scss']
})
export class PrivacyPolicyPageContainerComponent {
  privacyAndPolicyData = privacyAndPolicy;
}
