export interface AuthUser {
  email: string;
  name: string;
  role: string;
}

export interface LoginResult {
  success: boolean;
  user?: AuthUser;
  message?: string;
}

export async function loginWithEmail(email: string, password: string): Promise<LoginResult> {
  const cleanEmail = email.toLowerCase().trim();

  if (cleanEmail === "admin@specflow.ai" && password === "admin123") {
    return {
      success: true,
      user: {
        email: cleanEmail,
        name: "Administrador SpecFlow",
        role: "Administrador",
      },
    };
  }

  return {
    success: false,
    message: "Credenciales inválidas.",
  };
}

export async function loginWithProvider(provider: "Google" | "GitHub" | "Microsoft"): Promise<LoginResult> {
  return {
    success: true,
    user: {
      email: `${provider.toLowerCase()}@specflow.ai`,
      name: `Usuario ${provider}`,
      role: "Administrador",
    },
  };
}