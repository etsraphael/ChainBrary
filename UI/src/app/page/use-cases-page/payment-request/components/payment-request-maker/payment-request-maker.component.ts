import { Component, Input } from '@angular/core';
import { IProfileAdded } from './../../../../../shared/interfaces';
import { AuthStatusCode } from './../../../../../shared/enum';

@Component({
  selector: 'app-payment-request-maker[authStatus][profileAccount][publicAddress]',
  templateUrl: './payment-request-maker.component.html',
  styleUrls: ['./payment-request-maker.component.scss']
})
export class PaymentRequestMakerComponent {
  AuthStatusCodeTypes = AuthStatusCode;
  @Input() authStatus: AuthStatusCode;
  @Input() profileAccount: IProfileAdded | null;
  @Input() publicAddress: string | null;
}
