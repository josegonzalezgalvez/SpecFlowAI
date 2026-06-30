import {
  AppModule,
  ProfileDefinition,
  RoleDefinition,
  RolePermission,
} from "./types";

export const modules: AppModule[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    route: "/",
    order: 1,
    enabled: true,
  },
  {
    id: "projects",
    name: "Projects",
    route: "/projects",
    order: 2,
    enabled: true,
  },
  {
    id: "discovery",
    name: "Discovery",
    route: "/discovery",
    order: 3,
    enabled: true,
  },
  {
    id: "specifications",
    name: "Specifications",
    route: "/specifications",
    order: 4,
    enabled: true,
  },
  {
    id: "architecture",
    name: "Architecture",
    route: "/architecture",
    order: 5,
    enabled: true,
  },
  {
    id: "development",
    name: "Development",
    route: "/development",
    order: 6,
    enabled: true,
  },
  {
    id: "testing",
    name: "Testing",
    route: "/testing",
    order: 7,
    enabled: true,
  },
  {
    id: "deployment",
    name: "Deployment",
    route: "/deployment",
    order: 8,
    enabled: true,
  },
  {
    id: "rag",
    name: "Knowledge",
    route: "/knowledge",
    order: 9,
    enabled: true,
  },
  {
    id: "iam",
    name: "Identity",
    route: "/iam",
    order: 10,
    enabled: true,
  }
];

export const roles: RoleDefinition[] = [
  {
    id: "platform-admin",
    name: "Platform Administrator",
    description: "Administración completa"
  },
  {
    id: "project-admin",
    name: "Project Administrator",
    description: "Administra proyectos"
  },
  {
    id: "developer",
    name: "Developer",
    description: "Construye soluciones"
  },
  {
    id: "architect",
    name: "Architect",
    description: "Diseña arquitectura"
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Solo lectura"
  }
];

export const profiles: ProfileDefinition[] = [
  {
    id: "default-admin",
    name: "Administrador",
    description: "Perfil administrador",
    roleIds: ["platform-admin"]
  }
];

const allActions = [
  "Read",
  "Create",
  "Update",
  "Delete",
  "Approve",
  "ExecuteAI",
  "Export",
  "Manage",
] as const;

export const rolePermissions: RolePermission[] = modules.flatMap((module) =>
  allActions.map((action) => ({
    roleId: "platform-admin",
    moduleId: module.id,
    action,
  }))
);
