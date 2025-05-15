export const API_ENDPOINT = {
  USER: {
    ME: '/api/v1/me',
    CLASS: '/api/v1/me/class'
  },
  ADMIN: {
    USER: '/api/v1/users',
    CLASS: '/api/v1/class',
    SUBCLASS: '/api/v1/subclass',
    DASHBOARD: '/api/v1/dashboard',
  },
  LANDING: {},
} as const
