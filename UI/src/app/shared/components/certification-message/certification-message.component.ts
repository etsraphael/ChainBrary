import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-certification-message',
  templateUrl: './certification-message.component.html',
  styleUrls: ['./certification-message.component.scss']
})
export class CertificationMessageComponent {
  @Output() hideCertifficationCard = new EventEmitter<void>();

  hideCertifficationCardHandler(): void {
    return this.hideCertifficationCard.emit();
  }
}
