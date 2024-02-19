import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedComponentsModule } from './../../../shared/components/shared-components.module';
import { FooterPageComponent } from './footer-page.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('FooterPageComponent', () => {
  let component: FooterPageComponent;
  let fixture: ComponentFixture<FooterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedComponentsModule, RouterTestingModule],
      declarations: [FooterPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
