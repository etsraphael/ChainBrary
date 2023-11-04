import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UploadImgModalComponent } from './../../../../../../page/use-cases-page/components/upload-img-modal/upload-img-modal.component';

@Component({
  selector: 'app-bid-creation',
  templateUrl: './bid-creation.component.html',
  styleUrls: ['./bid-creation.component.scss']
})
export class BidCreationComponent implements OnInit {
  mainForm: FormGroup<BidForm>;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.setUpForm();
  }

  setUpForm(): void {
    this.mainForm = new FormGroup({
      bidName: new FormControl<string | null>(null, [Validators.required]),
      ownerName: new FormControl<string | null>(null, [Validators.required]),
      description: new FormControl<string | null>(null, [Validators.required]),
      duration: new FormControl<number | null>(null, [Validators.required]),
      photos: new FormControl<ValidPhoto[] | null>(null),
      termsAndCond: new FormControl<boolean | null>(null, [Validators.requiredTrue])
    });
  }

  openImageDialog(): void {
    this.dialog.open(UploadImgModalComponent, {
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
      panelClass: ['col-12', 'col-md-6', 'col-lg-5', 'col-xl-4']
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
