import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedTestModule } from './../../../../../../shared/components/shared-components.module';
import { UseCasesActionCardComponent } from './../../../../components/use-cases-action-card/use-cases-action-card.component';
import { UseCasesHeaderComponent } from './../../../../components/use-cases-header/use-cases-header.component';
import { DocumentLockerMenuComponent } from './document-locker-menu.component';

describe('DocumentLockerMenuComponent', () => {
  let component: DocumentLockerMenuComponent;
  let fixture: ComponentFixture<DocumentLockerMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestModule],
      declarations: [DocumentLockerMenuComponent, UseCasesHeaderComponent, UseCasesActionCardComponent]
    });
    fixture = TestBed.createComponent(DocumentLockerMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
