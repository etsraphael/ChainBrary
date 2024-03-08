import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTokenPageContainerComponent } from './add-token-page-container.component';

describe('AddTokenPageContainerComponent', () => {
  let component: AddTokenPageContainerComponent;
  let fixture: ComponentFixture<AddTokenPageContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTokenPageContainerComponent]
    });
    fixture = TestBed.createComponent(AddTokenPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
