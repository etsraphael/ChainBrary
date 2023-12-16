import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentLockerMenuComponent } from './document-locker-menu.component';

describe('DocumentLockerMenuComponent', () => {
  let component: DocumentLockerMenuComponent;
  let fixture: ComponentFixture<DocumentLockerMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentLockerMenuComponent]
    });
    fixture = TestBed.createComponent(DocumentLockerMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
