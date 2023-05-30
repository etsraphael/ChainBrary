import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChainbraryButtonComponent } from './chainbrary-button.component';

describe('ChainbraryButtonComponent', () => {
  let component: ChainbraryButtonComponent;
  let fixture: ComponentFixture<ChainbraryButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChainbraryButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChainbraryButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
