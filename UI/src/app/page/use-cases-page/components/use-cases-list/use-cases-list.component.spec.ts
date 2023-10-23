import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseCasesListComponent } from './use-cases-list.component';

describe('UseCasesListComponent', () => {
  let component: UseCasesListComponent;
  let fixture: ComponentFixture<UseCasesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UseCasesListComponent]
    });
    fixture = TestBed.createComponent(UseCasesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
