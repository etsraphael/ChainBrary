import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthStatusCode } from './../../../../../shared/enum';
import { selectAuthStatus } from './../../../../../store/auth-store/state/selectors';

@Component({
  selector: 'app-certification-container',
  templateUrl: './certification-container.component.html',
  styleUrls: ['./certification-container.component.scss']
})
export class CertificationContainerComponent implements OnInit {
  authStatus$: Observable<AuthStatusCode>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.authStatus$ = this.store.select(selectAuthStatus);
  }
}
