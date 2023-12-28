import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { UserCasesSharedComponentsModule } from './../../../../../../page/use-cases-page/components/user-cases-shared-components.module';
import { SharedTestModule } from './../../../../../../shared/components/shared-components.module';
import { initialState as authInitialState } from './../../../../../../store/auth-store/state/init';
import { initialState as documentLockerInitialState } from './../../../../../../store/document-locker-store/state/init';
import { DocumentLockerMakerComponent } from './document-locker-maker.component';
import { DocumentLockerFormComponent } from '../../component/document-locker-form/document-locker-form.component';

describe('DocumentLockerMakerComponent', () => {
  let component: DocumentLockerMakerComponent;
  let fixture: ComponentFixture<DocumentLockerMakerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedTestModule,
        StoreModule.forRoot({
          auth: () => authInitialState,
          documentLocker: () => documentLockerInitialState
        }),
        UserCasesSharedComponentsModule
      ],
      declarations: [DocumentLockerMakerComponent, DocumentLockerFormComponent]
    });
    fixture = TestBed.createComponent(DocumentLockerMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
