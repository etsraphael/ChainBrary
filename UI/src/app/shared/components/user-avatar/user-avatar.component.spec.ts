import { describe, expect, it } from 'vitest';
import { UserAvatarComponent } from './user-avatar.component';

describe('UserAvatarComponent', () => {
  const component: UserAvatarComponent = new UserAvatarComponent();

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
