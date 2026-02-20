export const RoleEnum = {
  USER: 'USER',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export const UserStatusEnum = {
  PENDING: 'PENDING',
  REGISTERED: 'REGISTERED',
} as const;

export const ClassStatusEnum = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
} as const;

export const VideoStatusEnum = {
  UPLOADING: 'UPLOADING',
  UPLOADED: 'UPLOADED',
  FAILED: 'FAILED',
} as const;

export const AccessStatusEnum = {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  REVOKED: 'REVOKED',
} as const;

export type UserRole = (typeof RoleEnum)[keyof typeof RoleEnum];
export type UserStatus = (typeof UserStatusEnum)[keyof typeof UserStatusEnum];
export type ClassStatus = (typeof ClassStatusEnum)[keyof typeof ClassStatusEnum];
export type VideoStatus = (typeof VideoStatusEnum)[keyof typeof VideoStatusEnum];
export type AccessStatus = (typeof AccessStatusEnum)[keyof typeof AccessStatusEnum];

export function enumToSelectOptions<T extends Record<string, string>>(
  enumObj: T,
  labelFormatter?: (key: string) => string
): { text: string; value: string }[] {
  return Object.values(enumObj).map((value) => ({
    text: labelFormatter ? labelFormatter(value) : value.replace(/_/g, ' '),
    value,
  }));
}
