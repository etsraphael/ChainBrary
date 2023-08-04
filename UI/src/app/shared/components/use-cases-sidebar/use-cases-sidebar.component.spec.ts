import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StoreModule } from '@ngrx/store';
import { SharedTestModule } from '../shared-components.module';
import { UseCasesSidebarHeaderComponent } from '../use-cases-sidebar-header/use-cases-sidebar-header.component';
import { initialState as authInitialState } from './../../../store/auth-store/state/init';
import { UseCasesSidebarComponent } from './use-cases-sidebar.component';

describe('UseCasesSidebarComponent', () => {
  let component: UseCasesSidebarComponent;
  let fixture: ComponentFixture<UseCasesSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          auth: () => authInitialState
        }),
        SharedTestModule
      ],
      declarations: [UseCasesSidebarComponent, UseCasesSidebarHeaderComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UseCasesSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
