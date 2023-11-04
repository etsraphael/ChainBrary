import { Component } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

@Component({
  selector: 'app-upload-img-modal',
  templateUrl: './upload-img-modal.component.html',
  styleUrls: ['./upload-img-modal.component.scss']
})
export class UploadImgModalComponent {
  storageProviders: IStorageProvider[] = [
    {
      key: 'googleDrive',
      label: 'Google Drive',
      text: '1. Go to <a href="https://drive.google.com/drive/my-drive" target="_blank">Google Drive</a>.  \n2. Click on "+ New" > Then "New File"  \n3. Upload your file \n4. Right click on the file > "Get shareable link"  \n5. Copy the link and paste it here \n6. Make sure the image will be accessible at anytime'
    },
    {
      key: 'PostImg',
      label: 'PostImg',
      text: '1. Lorem ipsum dolor sit amet  \n2. Consectetur adipiscing elit  \n3. Integer molestie lorem at massa'
    }
  ];
  providerSelected: 'googleDrive' | 'PostImg' = 'googleDrive';

  get providerSelectedText(): string | undefined {
    return this.storageProviders.find((provider) => provider.key === this.providerSelected)?.text;
  }

  changeProviderStorage(provider: MatButtonToggleChange): void {
    this.providerSelected = provider.value;
  }
}

export interface IStorageProvider {
  key: 'googleDrive' | 'PostImg';
  label: string;
  text: string;
}
