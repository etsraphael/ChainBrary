import { Component, Input } from '@angular/core';
import { ITokenCreationPayload } from './../../../../../../shared/interfaces';
import { FormatService } from './../../../../../../shared/services/format/format.service';
import { Web3LoginService } from '@chainbrary/web3-login';

@Component({
  selector: 'app-token-creation-review[tokenPayloadReview]',
  templateUrl: './token-creation-review.component.html',
  styleUrl: './token-creation-review.component.scss'
})
export class TokenCreationReviewComponent {
  @Input() tokenPayloadReview: ITokenCreationPayload;
  constructor(
    public formatService: FormatService,
    public web3LoginService: Web3LoginService
  ) {}
}
