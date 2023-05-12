import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PriceSettingsForm } from './../../../../../shared/interfaces';

@Component({
  selector: 'app-payment-request-price-settings[priceForm]',
  templateUrl: './payment-request-price-settings.component.html',
  styleUrls: ['./payment-request-price-settings.component.scss']
})
export class PaymentRequestPriceSettingsComponent {
  @Input() priceForm: FormGroup<PriceSettingsForm>;
  @Output() goToNextPage = new EventEmitter<void>();
  @Output() goToPreviousPage = new EventEmitter<void>();
}