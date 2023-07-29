import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StoreModule } from '@ngrx/store';
import { SharedTestModule } from '../shared-components.module';
import { UseCasesSidebarHeaderComponent } from './use-cases-sidebar-header.component';

describe('UseCasesSidebarHeaderComponent', () => {
  let component: UseCasesSidebarHeaderComponent;
  let fixture: ComponentFixture<UseCasesSidebarHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), SharedTestModule],
      declarations: [UseCasesSidebarHeaderComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UseCasesSidebarHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
