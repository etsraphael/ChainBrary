import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DexSwappingPageComponent } from './dex-swapping-page.component';

describe('DexSwappingPageComponent', () => {
  let component: DexSwappingPageComponent;
  let fixture: ComponentFixture<DexSwappingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DexSwappingPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DexSwappingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
