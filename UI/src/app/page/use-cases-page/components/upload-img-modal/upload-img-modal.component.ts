import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { ReplaySubject, debounceTime, filter, map, takeUntil } from 'rxjs';

@Component({
  selector: 'app-upload-img-modal',
  templateUrl: './upload-img-modal.component.html',
  styleUrls: ['./upload-img-modal.component.scss']
})
export class UploadImgModalComponent implements OnInit, OnDestroy {
  storageProviders: IStorageProvider[] = [
    {
      key: 'googleDrive',
      label: 'Google Drive',
      text: '1. Go to <a href="https://drive.google.com/drive/my-drive" target="_blank">Google Drive</a>  \n2. Click on "+ New" > Then "New File"  \n3. Upload your file \n4. Right click on the file > "Get shareable link"  \n5. Copy the link and paste it here \n6. Make sure the image will be accessible at anytime'
    },
    {
      key: 'PostImg',
      label: 'PostImg',
      text: '1. Go to <a href="https://postimages.org/" target="_blank">Post Image</a> \n2. Click on "Choose images"  \n3. Upload your file \n4. Copy the "Direct link" and paste it here \n5. Make sure the image will be accessible at anytime'
    }
  ];
  providerSelected: 'googleDrive' | 'PostImg' = 'googleDrive';
  mainForm: FormGroup<UploadImgModalForm>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();

  get providerSelectedText(): string | undefined {
    return this.storageProviders.find((provider) => provider.key === this.providerSelected)?.text;
  }

  ngOnInit(): void {
    this.setUpForm();
    this.listenUrl();
  }

  setUpForm(): void {
    this.mainForm = new FormGroup({
      url: new FormControl<string | null>(null)
    });
  }

  listenUrl(): void {
    this.mainForm
      .get('url')
      ?.valueChanges.pipe(
        filter((url: string | null) => url !== null),
        map((url: string | null) => url as string),
        debounceTime(400),
        takeUntil(this.destroyed$)
      )
      .subscribe((url: string) => this.reviewImage(url));
  }

  reviewImage(url: string): void {
    switch (this.providerSelected) {
      case 'googleDrive':
        // eslint-disable-next-line no-case-declarations
        const fileIdMatch = url.match(/file\/d\/(.+?)\/view/);
        if (fileIdMatch) {
          const fileId = fileIdMatch[1];
          const embeddableUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
          console.log('Embeddable Google Drive Image URL:', embeddableUrl);
        }

        // TODO: Ignore https if already there - retreive image and check if it's valid
        break;

      default:
        break;
    }
  }

  changeProviderStorage(provider: MatButtonToggleChange): void {
    this.providerSelected = provider.value;
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}

export interface IStorageProvider {
  key: 'googleDrive' | 'PostImg';
  label: string;
  text: string;
}

export interface UploadImgModalForm {
  url: FormControl<string | null>;
}
