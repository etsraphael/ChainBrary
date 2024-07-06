import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupTokenMenuComponent } from './setup-token-menu.component';

describe('SetupTokenMenuComponent', () => {
  let component: SetupTokenMenuComponent;
  let fixture: ComponentFixture<SetupTokenMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupTokenMenuComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SetupTokenMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
