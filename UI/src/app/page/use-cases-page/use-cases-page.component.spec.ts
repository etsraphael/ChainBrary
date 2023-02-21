import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseCasesPageComponent } from './use-cases-page.component';

describe('UseCasesPageComponent', () => {
  let component: UseCasesPageComponent;
  let fixture: ComponentFixture<UseCasesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UseCasesPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UseCasesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
