import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentLockerFoundComponent } from './document-locker-found.component';

describe('DocumentLockerFoundComponent', () => {
  let component: DocumentLockerFoundComponent;
  let fixture: ComponentFixture<DocumentLockerFoundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentLockerFoundComponent]
    });
    fixture = TestBed.createComponent(DocumentLockerFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
