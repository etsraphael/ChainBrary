import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseCasesHeaderComponent } from './use-cases-header.component';

describe('UseCasesHeaderComponent', () => {
  let component: UseCasesHeaderComponent;
  let fixture: ComponentFixture<UseCasesHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UseCasesHeaderComponent]
    });
    fixture = TestBed.createComponent(UseCasesHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
