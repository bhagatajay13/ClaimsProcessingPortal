
export type UserRole = 'ADMIN' | 'CLAIMS_MANAGER' | 'VIEWER';

export type Permission =
  | 'VIEW_CLAIMS'
  | 'EDIT_CLAIM'
  | 'DELETE_CLAIM'
  | 'ASSIGN_CLAIM'
  | 'VIEW_DOCUMENTS';

export const rolePermissions: Record<UserRole, Permission[]> = {
  ADMIN: [
    'VIEW_CLAIMS',
    'EDIT_CLAIM',
    'DELETE_CLAIM',
    'ASSIGN_CLAIM',
    'VIEW_DOCUMENTS',
  ],

  CLAIMS_MANAGER: [
    'VIEW_CLAIMS',
    'EDIT_CLAIM',
    'ASSIGN_CLAIM',
    'VIEW_DOCUMENTS',
  ],

  VIEWER: [
    'VIEW_CLAIMS',
    'VIEW_DOCUMENTS',
  ],
};

export const hasPermission = (
  role: UserRole,
  permission: Permission
): boolean => {
  return rolePermissions[role].includes(permission);
};
