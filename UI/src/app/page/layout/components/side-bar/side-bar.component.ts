import { Component } from '@angular/core';
import { AuthStatusCode } from './../../../../shared/enum';
@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {
  authStatusCode = AuthStatusCode;
}
