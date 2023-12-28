import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { SharedTestModule } from './../../../../../../shared/components/shared-components.module';
import { initialState as authInitialState } from './../../../../../../store/auth-store/state/init';
import { initialState as documentLockerInitialState } from './../../../../../../store/document-locker-store/state/init';
import { UseCasesHeaderComponent } from './../../../../components/use-cases-header/use-cases-header.component';
import { DocumentLockerFoundComponent } from './document-locker-found.component';

describe('DocumentLockerFoundComponent', () => {
  let component: DocumentLockerFoundComponent;
  let fixture: ComponentFixture<DocumentLockerFoundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedTestModule,
        StoreModule.forRoot({
          auth: () => authInitialState,
          documentLocker: () => documentLockerInitialState
        })
      ],
      declarations: [DocumentLockerFoundComponent, UseCasesHeaderComponent]
    });
    fixture = TestBed.createComponent(DocumentLockerFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
