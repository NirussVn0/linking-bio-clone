export interface User {
  id: string;
  discordId: string;
  username: string;
  discriminator: string;
  avatar?: string;
  email?: string;
  roles: UserRole[];
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

export interface CreateUserDto {
  discordId: string;
  username: string;
  discriminator: string;
  avatar?: string;
  email?: string;
}

export interface UpdateUserDto {
  username?: string;
  avatar?: string;
  email?: string;
  roles?: UserRole[];
}
