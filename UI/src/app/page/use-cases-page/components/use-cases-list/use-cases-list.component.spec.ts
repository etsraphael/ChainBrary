import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UseCasesListComponent } from './use-cases-list.component';

describe('UseCasesListComponent', () => {
  let component: UseCasesListComponent;
  let fixture: ComponentFixture<UseCasesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
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
