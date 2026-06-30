import type {
  AppModule,
  AuthenticatedUser,
  PermissionAction,
  ProfileDefinition,
  RoleDefinition,
  RolePermission,
} from "./types";

export interface AuthorizationData {
  modules: AppModule[];
  roles: RoleDefinition[];
  profiles: ProfileDefinition[];
  rolePermissions: RolePermission[];
}

export class AuthorizationService {
  constructor(private readonly data: AuthorizationData) {}

  can(user: AuthenticatedUser, moduleId: string, action: PermissionAction): boolean {
    const profile = this.data.profiles.find((item) => item.id === user.profileId);

    if (!profile) return false;

    return this.data.rolePermissions.some(
      (permission) =>
        profile.roleIds.includes(permission.roleId) &&
        permission.moduleId === moduleId &&
        permission.action === action
    );
  }

  getVisibleModules(user: AuthenticatedUser): AppModule[] {
    return this.data.modules
      .filter((module) => module.enabled && this.can(user, module.id, "Read"))
      .sort((a, b) => a.order - b.order);
  }
}
