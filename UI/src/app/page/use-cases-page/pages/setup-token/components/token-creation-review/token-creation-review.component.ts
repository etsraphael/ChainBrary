import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITokenCreationPayload } from './../../../../../../shared/interfaces';
import { FormatService } from './../../../../../../shared/services/format/format.service';
import { Web3LoginService } from '@chainbrary/web3-login';
import { CommonButtonText } from './../../../../../../shared/enum';

@Component({
  selector: 'app-token-creation-review[tokenPayloadReview]',
  templateUrl: './token-creation-review.component.html',
  styleUrl: './token-creation-review.component.scss'
})
export class TokenCreationReviewComponent {
  @Input() tokenPayloadReview: ITokenCreationPayload;
  @Output() createTokenEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() goBackEvent: EventEmitter<void> = new EventEmitter<void>();
  commonButtonText = CommonButtonText;

  constructor(
    public formatService: FormatService,
    public web3LoginService: Web3LoginService
  ) {}

  get optionsChecked(): string[] {
    return [
      this.tokenPayloadReview.canBurn ? 'Burnable' : null,
      this.tokenPayloadReview.canMint ? 'Mintable' : null,
      this.tokenPayloadReview.canPause ? 'Pausable' : null
    ].filter((option): option is string => option !== null);
  }
}
