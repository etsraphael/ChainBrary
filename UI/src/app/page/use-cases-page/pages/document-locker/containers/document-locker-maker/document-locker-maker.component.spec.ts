import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentLockerMakerComponent } from './document-locker-maker.component';

describe('DocumentLockerMakerComponent', () => {
  let component: DocumentLockerMakerComponent;
  let fixture: ComponentFixture<DocumentLockerMakerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentLockerMakerComponent]
    });
    fixture = TestBed.createComponent(DocumentLockerMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
