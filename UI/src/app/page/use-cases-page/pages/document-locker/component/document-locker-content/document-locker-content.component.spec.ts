import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentLockerContentComponent } from './document-locker-content.component';

describe('DocumentLockerContentComponent', () => {
  let component: DocumentLockerContentComponent;
  let fixture: ComponentFixture<DocumentLockerContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentLockerContentComponent]
    });
    fixture = TestBed.createComponent(DocumentLockerContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
