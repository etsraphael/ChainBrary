import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedTestModule } from './../../../../../../shared/components/shared-components.module';
import { BidContainerComponent } from './bid-container.component';

describe('BidContainerComponent', () => {
  let component: BidContainerComponent;
  let fixture: ComponentFixture<BidContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestModule],
      declarations: [BidContainerComponent]
    });
    fixture = TestBed.createComponent(BidContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
