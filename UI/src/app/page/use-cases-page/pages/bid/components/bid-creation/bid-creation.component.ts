import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UploadImgModalComponent } from './../../../../../../page/use-cases-page/components/upload-img-modal/upload-img-modal.component';

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

  constructor(private dialog: MatDialog) {}

  get imgList(): string[] {
    return this.mainForm.get('photos')?.value as string[];
  }

  ngOnInit(): void {
    this.setUpForm();
  }

  setUpForm(): void {
    this.mainForm = new FormGroup({
      bidName: new FormControl<string | null>(null, [Validators.required]),
      ownerName: new FormControl<string | null>(null, [Validators.required]),
      description: new FormControl<string | null>(null, [Validators.required]),
      duration: new FormControl<number | null>(null, [Validators.required]),
      photos: new FormControl<string[] | null>([]),
      termsAndCond: new FormControl<boolean | null>(null, [Validators.requiredTrue])
    });
  }

  openImageDialog(): void {
    const dialogRef: MatDialogRef<UploadImgModalComponent> =  this.dialog.open(UploadImgModalComponent, {
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
      panelClass: ['col-12', 'col-md-6', 'col-lg-5', 'col-xl-4']
    });

    const modalSub = dialogRef.afterClosed().pipe(
    ).subscribe((url: string | null) => {
      if(url) {
        const photos: string[] = this.mainForm.get('photos')?.value as string[];

        if (!photos.includes(url)) {
          photos.push(url);
          this.mainForm.get('photos')?.setValue(photos);

          this.prevButton.nativeElement.click();

        }
      }
      modalSub.unsubscribe();
    })

  }


  removeImageByUrl(url: string): void {
    const photos: string[] = this.mainForm.get('photos')?.value as string[];
    const index = photos.findIndex((photo: string) => photo === url);
    photos.splice(index, 1);
    this.mainForm.get('photos')?.setValue(photos);
  }
}


export interface BidForm {
  bidName: FormControl<string | null>;
  ownerName: FormControl<string | null>;
  description: FormControl<string | null>;
  duration: FormControl<number | null>;
  photos: FormControl<string[] | null>;
  termsAndCond: FormControl<boolean | null>;
}
