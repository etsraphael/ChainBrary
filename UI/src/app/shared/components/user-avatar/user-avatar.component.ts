import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-user-avatar[editable]',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
})
export class UserAvatarComponent {
  @Output() onEditClick = new EventEmitter<void>();
  @Input() editable: boolean;
}
