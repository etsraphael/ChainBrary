import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentLockerFormComponent } from './document-locker-form.component';

describe('DocumentLockerFormComponent', () => {
  let component: DocumentLockerFormComponent;
  let fixture: ComponentFixture<DocumentLockerFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentLockerFormComponent]
    });
    fixture = TestBed.createComponent(DocumentLockerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
