'use client';

/* eslint-disable react-hooks/set-state-in-effect, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ModuleName =
  | "Proyectos"
  | "Requerimientos"
  | "Arquitectura"
  | "Estimación"
  | "Desarrollo"
  | "Testing"
  | "Deploy"
  | "RAG"
  | "Administración";

export type PermissionType =
  | "Ver"
  | "Crear"
  | "Editar"
  | "Aprobar"
  | "Eliminar"
  | "Ejecutar IA";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profile: string;
  status: 'Activo' | 'Inactivo';
  lastAccess: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissionCount: number;
  modules: { [key in ModuleName]?: PermissionType[] };
}

export interface Profile {
  id: string;
  name: string;
  description: string;
  roles: string[]; // Linked role names
}

export type PermissionMatrix = {
  [key in ModuleName]: {
    [key in PermissionType]: boolean;
  };
};

interface IAMContextType {
  users: User[];
  roles: Role[];
  profiles: Profile[];
  permissionsMatrix: PermissionMatrix;
  isLoggedIn: boolean;
  currentUser: { email: string; name: string; role: string } | null;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  addUser: (user: Omit<User, 'id' | 'lastAccess'>) => void;
  deleteUser: (id: string) => void;
  addRole: (role: Omit<Role, 'id' | 'permissionCount'>) => void;
  deleteRole: (id: string) => void;
  addProfile: (profile: Omit<Profile, 'id'>) => void;
  deleteProfile: (id: string) => void;
  toggleMatrixPermission: (module: ModuleName, permission: PermissionType) => void;
}

const defaultModules: ModuleName[] = [
  "Proyectos",
  "Requerimientos",
  "Arquitectura",
  "Estimación",
  "Desarrollo",
  "Testing",
  "Deploy",
  "RAG",
  "Administración"
];

const defaultPermissions: PermissionType[] = [
  "Ver",
  "Crear",
  "Editar",
  "Aprobar",
  "Eliminar",
  "Ejecutar IA"
];

// Initial mock data
const initialUsers: User[] = [
  { id: '1', name: 'Juan Pérez', email: 'juan.perez@specflow.ai', role: 'Administrador', profile: 'Administrador de TI', status: 'Activo', lastAccess: 'Hace 2 min' },
  { id: '2', name: 'Marta Ruiz', email: 'marta.ruiz@specflow.ai', role: 'Ingeniero de Software', profile: 'Desarrollador Senior', status: 'Activo', lastAccess: 'Hace 5 min' },
  { id: '3', name: 'Luis Vega', email: 'luis.vega@specflow.ai', role: 'Arquitecto de Soluciones', profile: 'Líder Técnico', status: 'Activo', lastAccess: 'Hace 18 min' },
  { id: '4', name: 'Ana Torres', email: 'ana.torres@specflow.ai', role: 'QA Engineer', profile: 'Ingeniero QA', status: 'Activo', lastAccess: 'Hace 31 min' },
  { id: '5', name: 'Carlos Gómez', email: 'carlos.gomez@specflow.ai', role: 'Administrador', profile: 'Administrador de TI', status: 'Inactivo', lastAccess: 'Hace 3 días' }
];

const initialRoles: Role[] = [
  {
    id: 'r1',
    name: 'Administrador',
    description: 'Acceso total y configuración de todo el Command Center y módulos.',
    permissionCount: 54,
    modules: defaultModules.reduce((acc, mod) => ({ ...acc, [mod]: defaultPermissions }), {})
  },
  {
    id: 'r2',
    name: 'Ingeniero de Software',
    description: 'Permite desarrollar y ejecutar pruebas y flujos automatizados de IA.',
    permissionCount: 12,
    modules: {
      "Proyectos": ["Ver"],
      "Desarrollo": ["Ver", "Crear", "Editar", "Ejecutar IA"],
      "Testing": ["Ver", "Crear", "Editar", "Ejecutar IA"],
      "RAG": ["Ver", "Ejecutar IA"]
    }
  },
  {
    id: 'r3',
    name: 'Arquitecto de Soluciones',
    description: 'Diseño estructural de aplicaciones, requerimientos y consultas RAG.',
    permissionCount: 11,
    modules: {
      "Proyectos": ["Ver"],
      "Requerimientos": ["Ver", "Crear", "Editar", "Aprobar"],
      "Arquitectura": ["Ver", "Crear", "Editar", "Aprobar"],
      "RAG": ["Ver", "Ejecutar IA"]
    }
  },
  {
    id: 'r4',
    name: 'QA Engineer',
    description: 'Creación de suites de pruebas y aprobación de releases en Testing.',
    permissionCount: 7,
    modules: {
      "Proyectos": ["Ver"],
      "Testing": ["Ver", "Crear", "Editar", "Aprobar", "Ejecutar IA"],
      "Deploy": ["Ver"]
    }
  }
];

const initialProfiles: Profile[] = [
  { id: 'p1', name: 'Administrador de TI', description: 'Administradores globales del sistema y seguridad.', roles: ['Administrador'] },
  { id: 'p2', name: 'Líder Técnico', description: 'Arquitectos que supervisan y guían el equipo técnico.', roles: ['Arquitecto de Soluciones', 'Ingeniero de Software'] },
  { id: 'p3', name: 'Desarrollador Senior', description: 'Ingenieros enfocados en construcción y pipelines de desarrollo.', roles: ['Ingeniero de Software'] },
  { id: 'p4', name: 'Ingeniero QA', description: 'Responsables de asegurar calidad de código y despliegues.', roles: ['QA Engineer'] }
];

// Create default permission matrix
const initialMatrix: PermissionMatrix = defaultModules.reduce((acc, mod) => {
  const modPerms = {} as { [key in PermissionType]: boolean };
  defaultPermissions.forEach(perm => {
    // Admins get everything, let's configure a mock global matrix where most permissions are active
    modPerms[perm] = true;
  });
  return { ...acc, [mod]: modPerms };
}, {} as PermissionMatrix);

const IAMContext = createContext<IAMContextType | undefined>(undefined);

export function IAMProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [permissionsMatrix, setPermissionsMatrix] = useState<PermissionMatrix>(initialMatrix);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; role: string } | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Sync state from localStorage on mount (safe hydration)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUsers = localStorage.getItem('sf_users');
      const storedRoles = localStorage.getItem('sf_roles');
      const storedProfiles = localStorage.getItem('sf_profiles');
      const storedMatrix = localStorage.getItem('sf_matrix');
      const storedSession = localStorage.getItem('sf_session');

      if (storedUsers) setUsers(JSON.parse(storedUsers));
      if (storedRoles) setRoles(JSON.parse(storedRoles));
      if (storedProfiles) setProfiles(JSON.parse(storedProfiles));
      if (storedMatrix) setPermissionsMatrix(JSON.parse(storedMatrix));
      if (storedSession) {
        const session = JSON.parse(storedSession);
        setIsLoggedIn(true);
        setCurrentUser(session);
      }
      setHydrated(true);
    }
  }, []);

  // Save changes to localStorage helper
  const save = (key: string, data: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  const login = (email: string, password?: string): boolean => {
    // Basic mock authentication: any password works for mock email addresses
    let name = 'Usuario SpecFlow';
    let role = 'Visualizador';

    const cleanEmail = email.toLowerCase().trim();
    if (cleanEmail === 'admin@specflow.ai' || cleanEmail === 'juan.perez@specflow.ai') {
      name = 'Juan Pérez';
      role = 'Administrador';
    } else {
      const foundUser = users.find(u => u.email.toLowerCase().trim() === cleanEmail);
      if (foundUser) {
        name = foundUser.name;
        role = foundUser.role;
      }
    }

    const session = { email: cleanEmail, name, role };
    setIsLoggedIn(true);
    setCurrentUser(session);
    save('sf_session', session);
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sf_session');
    }
  };

  const addUser = (newUser: Omit<User, 'id' | 'lastAccess'>) => {
    const userWithId: User = {
      ...newUser,
      id: Math.random().toString(36).substring(2, 9),
      lastAccess: 'Nunca'
    };
    const updated = [userWithId, ...users];
    setUsers(updated);
    save('sf_users', updated);
  };

  const deleteUser = (id: string) => {
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    save('sf_users', updated);
  };

  const addRole = (newRole: Omit<Role, 'id' | 'permissionCount'>) => {
    // Count permissions
    let count = 0;
    Object.values(newRole.modules).forEach(perms => {
      if (perms) count += perms.length;
    });

    const roleWithId: Role = {
      ...newRole,
      id: 'r_' + Math.random().toString(36).substring(2, 9),
      permissionCount: count
    };
    const updated = [...roles, roleWithId];
    setRoles(updated);
    save('sf_roles', updated);
  };

  const deleteRole = (id: string) => {
    const updated = roles.filter(r => r.id !== id);
    setRoles(updated);
    save('sf_roles', updated);
  };

  const addProfile = (newProfile: Omit<Profile, 'id'>) => {
    const profileWithId: Profile = {
      ...newProfile,
      id: 'p_' + Math.random().toString(36).substring(2, 9)
    };
    const updated = [...profiles, profileWithId];
    setProfiles(updated);
    save('sf_profiles', updated);
  };

  const deleteProfile = (id: string) => {
    const updated = profiles.filter(p => p.id !== id);
    setProfiles(updated);
    save('sf_profiles', updated);
  };

  const toggleMatrixPermission = (module: ModuleName, permission: PermissionType) => {
    const updated = {
      ...permissionsMatrix,
      [module]: {
        ...permissionsMatrix[module],
        [permission]: !permissionsMatrix[module][permission]
      }
    };
    setPermissionsMatrix(updated);
    save('sf_matrix', updated);
  };

  return (
    <IAMContext.Provider
      value={{
        users,
        roles,
        profiles,
        permissionsMatrix,
        isLoggedIn,
        currentUser,
        login,
        logout,
        addUser,
        deleteUser,
        addRole,
        deleteRole,
        addProfile,
        deleteProfile,
        toggleMatrixPermission
      }}
    >
      {hydrated ? children : <div className="min-h-screen bg-[#0B0F19]"></div>}
    </IAMContext.Provider>
  );
}

export function useIAM() {
  const context = useContext(IAMContext);
  if (!context) {
    throw new Error('useIAM must be used within an IAMProvider');
  }
  return context;
}
