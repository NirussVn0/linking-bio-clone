export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  username: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  email?: string;
  verified?: boolean;
}

export interface LoginResponse {
  user: {
    id: string;
    username: string;
    avatar?: string;
    roles: string[];
  };
  tokens: AuthTokens;
}
