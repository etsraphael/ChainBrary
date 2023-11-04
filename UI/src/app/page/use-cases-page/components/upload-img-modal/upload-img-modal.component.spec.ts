import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadImgModalComponent } from './upload-img-modal.component';

describe('UploadImgModalComponent', () => {
  let component: UploadImgModalComponent;
  let fixture: ComponentFixture<UploadImgModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadImgModalComponent]
    });
    fixture = TestBed.createComponent(UploadImgModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
