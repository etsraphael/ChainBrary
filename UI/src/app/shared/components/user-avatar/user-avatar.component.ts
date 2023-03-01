import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
})
export class UserAvatarComponent {
  @Output() onEditClick = new EventEmitter<void>();
  // avatar editable to do here
}
