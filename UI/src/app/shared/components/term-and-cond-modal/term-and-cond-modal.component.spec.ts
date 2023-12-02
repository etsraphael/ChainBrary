import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedTestModule } from '../shared-components.module';
import { TermAndCondModalComponent } from './term-and-cond-modal.component';

describe('TermAndCondModalComponent', () => {
  let component: TermAndCondModalComponent;
  let fixture: ComponentFixture<TermAndCondModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestModule],
      declarations: [TermAndCondModalComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: 'test markdown' }
      ]
    });
    fixture = TestBed.createComponent(TermAndCondModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
