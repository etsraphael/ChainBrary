import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentLockerHomeComponent } from './document-locker-home.component';

describe('DocumentLockerHomeComponent', () => {
  let component: DocumentLockerHomeComponent;
  let fixture: ComponentFixture<DocumentLockerHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentLockerHomeComponent]
    });
    fixture = TestBed.createComponent(DocumentLockerHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
