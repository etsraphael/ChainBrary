import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedTestModule } from './../../../../../../shared/components/shared-components.module';
import { UserCasesSharedComponentsModule } from './../../../../components/user-cases-shared-components.module';
import { BidSearchComponent } from './bid-search.component';

describe('BidSearchComponent', () => {
  let component: BidSearchComponent;
  let fixture: ComponentFixture<BidSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestModule, UserCasesSharedComponentsModule],
      declarations: [BidSearchComponent]
    });
    fixture = TestBed.createComponent(BidSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
