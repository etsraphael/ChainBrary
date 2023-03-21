import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Buffer } from 'buffer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.scss']
})
export class PaymentPageComponent implements OnInit {
  encodedRequest: string;

  constructor(private route: ActivatedRoute) {
    this.setUpId();
  }

  setUpId(): Subscription {
    return this.route.params.subscribe((params: Params) => {
      this.encodedRequest = params['id'];
    });
  }

  ngOnInit(): void {
    this.setUpDecodedTransaction();
  }

  setUpDecodedTransaction(): void {
    const decodedString = Buffer.from(this.encodedRequest, 'base64').toString('utf-8');
  }
}
