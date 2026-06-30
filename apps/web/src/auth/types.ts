export type PermissionAction =
  | "Read"
  | "Create"
  | "Update"
  | "Delete"
  | "Approve"
  | "ExecuteAI"
  | "Export"
  | "Manage";

export interface AppModule {
  id: string;
  name: string;
  route: string;
  icon?: string;
  order: number;
  enabled: boolean;
}

export interface RolePermission {
  roleId: string;
  moduleId: string;
  action: PermissionAction;
}

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
}

export interface ProfileDefinition {
  id: string;
  name: string;
  description: string;
  roleIds: string[];
}

export interface AuthenticatedUser {
  email: string;
  name: string;
  profileId: string;
}