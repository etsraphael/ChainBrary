import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatDialogRef } from '@angular/material/dialog';
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
  urlImageFound: string | null;
  imageIsLoading = false;
  urlInvalid = false;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();

  urlRegex = new RegExp(
    '(https?:\\/\\/)?' + // protocol
      '([\\w\\d-]+\\.)+[\\w\\d-]+' + // domain
      '(\\:[0-9]+)?' + // port
      '(\\/[-a-zA-Z\\d%@_.~+&:]*)*' + // path
      '(\\?[;&a-zA-Z\\d%@_.,~+&:=-]*)?' + // query
      '(\\#[-a-zA-Z\\d_]*)?' // fragment locator
  );

  get providerSelectedText(): string | undefined {
    return this.storageProviders.find((provider) => provider.key === this.providerSelected)?.text;
  }

  constructor(private dialogRef: MatDialogRef<UploadImgModalComponent>) {}

  ngOnInit(): void {
    this.setUpForm();
    this.listenUrl();
  }

  setUpForm(): void {
    this.mainForm = new FormGroup({
      url: new FormControl<string | null>(null, [Validators.required, Validators.pattern(this.urlRegex)])
    });
  }

  listenUrl(): void {
    this.mainForm
      .get('url')
      ?.valueChanges.pipe(
        map((url: string | null) => url?.trim() || ''), // Trim the URL and handle null
        filter((url: string | null) => url !== null && this.mainForm.get('url')?.valid == true),
        map((url: string | null) => url as string),
        debounceTime(400),
        takeUntil(this.destroyed$)
      )
      .subscribe((url: string) => this.reviewImage(url));
  }

  async reviewImage(url: string): Promise<void> {
    this.imageIsLoading = true;

    switch (true) {
      case url.startsWith('https://drive.google.com/'): {
        return this.handleImageUrl(
          url,
          new RegExp(/file\/d\/(.+?)\/view/),
          'https://drive.google.com/uc?export=view&id='
        );
      }
      default: {
        return this.handleImageUrl(url, new RegExp(''), null);
      }
    }
  }

  async handleImageUrl(url: string, pattern: RegExp, prefix: string | null): Promise<void> {
    const match = prefix ? url.match(pattern)?.[1] : url;
    const finalUrl = prefix ? `${prefix}${match}` : url;

    if (match && (await this.isImageValid(finalUrl))) {
      this.urlImageFound = finalUrl;
    } else {
      this.mainForm.get('url')?.setErrors({ invalidUrl: 'The URL provided does not have any pictures attached' });
    }

    this.imageIsLoading = false;
  }

  async isImageValid(url: string): Promise<boolean> {
    const img: HTMLImageElement = new Image();
    img.src = url;

    return new Promise((resolve) => {
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  }

  changeProviderStorage(provider: MatButtonToggleChange): void {
    this.providerSelected = provider.value;
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }

  reset(): void {
    this.mainForm.reset();
    this.urlImageFound = null;
  }

  submit(): void {
    const { url } = this.mainForm.value;
    return this.dialogRef.close(url);
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
