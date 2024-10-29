import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DexHomePageComponent } from './dex-home-page.component';

describe('DexHomePageComponent', () => {
  let component: DexHomePageComponent;
  let fixture: ComponentFixture<DexHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DexHomePageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DexHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
