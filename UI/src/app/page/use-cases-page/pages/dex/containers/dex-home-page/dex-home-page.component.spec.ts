import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { SharedComponentsModule } from '../../../../../../shared/components/shared-components.module';
import { DexHomePageComponent } from './dex-home-page.component';

describe('DexHomePageComponent', () => {
  let component: DexHomePageComponent;
  let fixture: ComponentFixture<DexHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedComponentsModule, StoreModule.forRoot({}), RouterModule.forRoot([])],
      declarations: [DexHomePageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DexHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
