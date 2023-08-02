import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-chainbrary-button',
  templateUrl: './chainbrary-button.component.html',
  styleUrls: ['./chainbrary-button.component.scss']
})
export class ChainbraryButtonComponent {
  @Input() buttonClasses: string[];
  @Input() buttonText?: string;
  @Input() buttonType?: string = 'button';
  @Input() isDisabled?: boolean = false;

  @Output() callToAction = new EventEmitter();

  emit(): void {
    return this.callToAction.emit();
  }
}
