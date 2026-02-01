export function getAvatar(user?: { avatar?: string }) {
  if (user?.avatar && user.avatar.trim() !== '') return user.avatar;
  return '/images/user_avatar.png';
}