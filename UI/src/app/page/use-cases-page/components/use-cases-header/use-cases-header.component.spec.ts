import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UseCasesHeaderComponent } from './use-cases-header.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('UseCasesHeaderComponent', () => {
  let component: UseCasesHeaderComponent;
  let fixture: ComponentFixture<UseCasesHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [UseCasesHeaderComponent]
    });
    fixture = TestBed.createComponent(UseCasesHeaderComponent);
    component = fixture.componentInstance;
    component.header = {
      title: 'title',
      description: 'description'
    }
    fixture.detectChanges();


  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
