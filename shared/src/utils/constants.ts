export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    DISCORD_CALLBACK: '/auth/discord/callback',
  },
  TASKS: {
    BASE: '/tasks',
    BY_ID: (id: string) => `/tasks/${id}`,
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    PROFILE: '/users/profile',
  },
} as const;

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const VALIDATION_LIMITS = {
  USERNAME: {
    MIN: 3,
    MAX: 32,
  },
  TASK_TITLE: {
    MIN: 1,
    MAX: 200,
  },
  TASK_DESCRIPTION: {
    MAX: 1000,
  },
} as const;
