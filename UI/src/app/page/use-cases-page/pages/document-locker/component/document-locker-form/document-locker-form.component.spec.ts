import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentLockerFormComponent } from './document-locker-form.component';
import { SharedTestModule } from './../../../../../../shared/components/shared-components.module';
import { initialState as authInitialState } from './../../../../../../store/auth-store/state/init';
import { initialState as documentLockerInitialState } from './../../../../../../store/document-locker-store/state/init';
import { StoreModule } from '@ngrx/store';

describe('DocumentLockerFormComponent', () => {
  let component: DocumentLockerFormComponent;
  let fixture: ComponentFixture<DocumentLockerFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedTestModule,
        StoreModule.forRoot({
          auth: () => authInitialState,
          documentLocker: () => documentLockerInitialState
        })
      ],
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
