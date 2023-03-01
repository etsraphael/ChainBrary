import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';

@Component({
  selector: 'app-certification-edit-card',
  templateUrl: './certification-edit-card.component.html',
  styleUrls: ['./certification-edit-card.component.scss']
})
export class CertificationEditCardComponent implements OnInit, AfterViewInit {
  avatarEditEnabled = true;
  avatarInputVisible = false;
  mainForm: FormGroup<CertificationForm>;

  enableAvatarEdit(): void {
    this.avatarEditEnabled = false;
    this.avatarInputVisible = true;
  }

  ngOnInit(): void {
    this.mainForm = new FormGroup({
      avatarUrl: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      subtitle: new FormControl('', [Validators.required])
    });
  }

  ngAfterViewInit(): void {
    this.mainForm
      .get('avatarUrl')!
      .valueChanges.pipe(
        filter((value: string | null) => value !== null && value !== ''),
        debounceTime(350),
        distinctUntilChanged()
      )
      .subscribe((value: string | null) => {
        console.log(value);
        // this.urlChanged(value);
      });
  }

  submitForm(): void {
    console.log(this.mainForm.value);
  }

  urlChanged(url: string): void {
    console.log('url', url);
  }
}

export interface CertificationForm {
  avatarUrl: FormControl<string | null>;
  username: FormControl<string | null>;
  subtitle: FormControl<string | null>;
}
