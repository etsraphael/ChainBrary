import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    switch (this.providerSelected) {
      case 'googleDrive':
        return this.googleDriveUrl(url);
      case 'PostImg':
        return this.postImage(url);
    }
  }

  async postImage(url: string): Promise<void> {
    const postImgPattern = /^https:\/\/i\.postimg\.cc\/[a-zA-Z0-9]+\/.+\.jpg$/;

    // Check if the URL is a valid PostImg URL
    if (postImgPattern.test(url) && (await this.isImageValid(url))) {
      this.urlImageFound = url; // Assume this is where you want to store the valid URL
    } else {
      this.mainForm.get('url')?.setErrors({ invalidUrl: 'The URL provided does not have any pictures attached' });
    }

    this.imageIsLoading = false;
  }

  async googleDriveUrl(url: string): Promise<void> {
    const fileId = url.match(/file\/d\/(.+?)\/view/)?.[1];
    const embeddableUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

    if (fileId && (await this.isImageValid(embeddableUrl))) {
      this.urlImageFound = embeddableUrl;
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
}

export interface IStorageProvider {
  key: 'googleDrive' | 'PostImg';
  label: string;
  text: string;
}

export interface UploadImgModalForm {
  url: FormControl<string | null>;
}
