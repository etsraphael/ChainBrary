import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-bid-creation',
  templateUrl: './bid-creation.component.html',
  styleUrls: ['./bid-creation.component.scss']
})
export class BidCreationComponent implements OnInit {
  mainForm: FormGroup<BidForm>;

  ngOnInit(): void {
    this.mainForm = new FormGroup({
      bidName: new FormControl<string | null>(null, [Validators.required]),
      ownerName: new FormControl<string | null>(null, [Validators.required]),
      description: new FormControl<string | null>(null, [Validators.required]),
      duration: new FormControl<number | null>(null, [Validators.required]),
      photos: new FormControl<ValidPhoto[] | null>(null),
      termsAndCond: new FormControl<boolean | null>(null, [Validators.requiredTrue])
    });
  }
}

export interface ValidPhoto {
  url: string;
  valid: boolean;
}

export interface BidForm {
  bidName: FormControl<string | null>;
  ownerName: FormControl<string | null>;
  description: FormControl<string | null>;
  duration: FormControl<number | null>;
  photos: FormControl<ValidPhoto[] | null>;
  termsAndCond: FormControl<boolean | null>;
}
