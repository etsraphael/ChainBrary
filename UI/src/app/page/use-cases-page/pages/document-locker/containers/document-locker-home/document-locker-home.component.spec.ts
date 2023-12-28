import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedTestModule } from './../../../../../../shared/components/shared-components.module';
import { DocumentLockerHomeComponent } from './document-locker-home.component';

describe('DocumentLockerHomeComponent', () => {
  let component: DocumentLockerHomeComponent;
  let fixture: ComponentFixture<DocumentLockerHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestModule],
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
