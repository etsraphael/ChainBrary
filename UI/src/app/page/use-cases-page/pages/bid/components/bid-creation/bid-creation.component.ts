import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadImgModalComponent } from './../../../../../../page/use-cases-page/components/upload-img-modal/upload-img-modal.component';
import { TermAndCondModalComponent } from './../../../../../../shared/components/term-and-cond-modal/term-and-cond-modal.component';
import { bidTermAndCond } from './../../../../../../shared/data/termAndCond';

@Component({
  selector: 'app-bid-creation',
  templateUrl: './bid-creation.component.html',
  styleUrls: ['./bid-creation.component.scss']
})
export class BidCreationComponent implements OnInit {
  @ViewChild('carouselExampleCaptions', { static: true }) carousel: ElementRef;
  @ViewChild('nextButton', { static: true }) nextButton: ElementRef<HTMLButtonElement>;
  @ViewChild('prevButton', { static: true }) prevButton: ElementRef<HTMLButtonElement>;

  mainForm: FormGroup<BidForm>;
  imgList: string[] = [];
  imgLimit = 5;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.setUpForm();
  }

  setUpForm(): void {
    this.mainForm = new FormGroup({
      bidName: new FormControl<string | null>(null, [Validators.required]),
      ownerName: new FormControl<string | null>(null, [Validators.required]),
      description: new FormControl<string | null>(null, [Validators.required]),
      duration: new FormControl<number | null>(null, [Validators.required]),
      termsAndCond: new FormControl<boolean | null>(null, [Validators.requiredTrue])
    });
  }

  openImageDialog(): void {
    const dialogRef: MatDialogRef<UploadImgModalComponent> = this.dialog.open(UploadImgModalComponent, {
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
      panelClass: ['col-12', 'col-md-6', 'col-lg-5', 'col-xl-4']
    });

    const modalSub = dialogRef
      .afterClosed()
      .pipe()
      .subscribe((url: string | null) => {
        // URL does not exist
        if (!url) return;

        // URL already exists
        if (this.imgList.includes(url)) {
          this.snackBar.open('Image already added', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          return;
        }

        // Add URL to list
        this.imgList.push(url);
        this.prevButton.nativeElement.click();
        modalSub.unsubscribe();
      });
  }

  removeImageByUrl(url: string): void {
    const index = this.imgList.findIndex((photo: string) => photo === url);
    this.imgList.splice(index, 1);
    this.nextButton.nativeElement.click();
  }

  openTermAndCond(event: MouseEvent): void {
    event.preventDefault();

    this.dialog.open(TermAndCondModalComponent, {
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
      panelClass: ['col-12', 'col-md-6', 'col-lg-8'],
      data: bidTermAndCond,
      autoFocus: false
    });
  }
}

export interface BidForm {
  bidName: FormControl<string | null>;
  ownerName: FormControl<string | null>;
  description: FormControl<string | null>;
  duration: FormControl<number | null>;
  termsAndCond: FormControl<boolean | null>;
}
