import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Web3HeaderPageComponent } from './web3-header.component';

describe('HeaderPageComponent', () => {
  let component: Web3HeaderPageComponent;
  let fixture: ComponentFixture<Web3HeaderPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Web3HeaderPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(Web3HeaderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
