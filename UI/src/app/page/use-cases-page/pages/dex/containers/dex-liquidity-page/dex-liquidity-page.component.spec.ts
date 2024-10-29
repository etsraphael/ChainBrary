import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DexLiquidityPageComponent } from './dex-liquidity-page.component';

describe('DexLiquidityPageComponent', () => {
  let component: DexLiquidityPageComponent;
  let fixture: ComponentFixture<DexLiquidityPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DexLiquidityPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DexLiquidityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
