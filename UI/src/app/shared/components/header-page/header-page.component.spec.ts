import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslationService } from '../../services/translation/translation.service';
import { SharedComponentsModule } from '../shared-components.module';
import { HeaderPageComponent } from './header-page.component';

describe('HeaderPageComponent', () => {
  let component: HeaderPageComponent;
  let fixture: ComponentFixture<HeaderPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedComponentsModule, RouterTestingModule],
      declarations: [HeaderPageComponent],
      providers: [TranslationService, provideAnimations()]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
