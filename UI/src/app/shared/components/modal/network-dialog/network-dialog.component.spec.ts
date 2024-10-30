import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkDialogComponent } from './network-dialog.component';

describe('NetworkDialogComponent', () => {
  let component: NetworkDialogComponent;
  let fixture: ComponentFixture<NetworkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NetworkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
