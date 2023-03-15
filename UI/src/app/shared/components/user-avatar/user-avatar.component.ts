import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-user-avatar[editable]',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
})
export class UserAvatarComponent {
  @Output() editClickEvent = new EventEmitter<void>();
  @Input() editable: boolean;
  @Input() avatarUrl: string | null;
}
