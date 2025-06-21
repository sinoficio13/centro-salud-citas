// Implementación simple de autenticación sin NextAuth para v0
export interface User {
  id: string
  name: string
  email: string
  role: string
}

export interface AuthSession {
  user: User
  expires: string
}

const USERS_DB = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    name: "Administrador",
    email: "admin@centrosalud.com",
    role: "root",
  },
  {
    id: "2",
    username: "recepcion",
    password: "recepcion123",
    name: "Recepcionista",
    email: "recepcion@centrosalud.com",
    role: "recepcion",
  },
  {
    id: "3",
    username: "doctor",
    password: "doctor123",
    name: "Dr. Pérez",
    email: "doctor@centrosalud.com",
    role: "doctor",
  },
  {
    id: "4",
    username: "fisio",
    password: "fisio123",
    name: "Fis. López",
    email: "fisio@centrosalud.com",
    role: "fisioterapeuta",
  },
]

export function validateCredentials(username: string, password: string): User | null {
  const user = USERS_DB.find((u) => u.username === username && u.password === password)

  if (user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  }

  return null
}

export function createSession(user: User): AuthSession {
  const expires = new Date()
  expires.setHours(expires.getHours() + 24) // 24 horas

  return {
    user,
    expires: expires.toISOString(),
  }
}

export function getStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem("auth-session")
    if (!stored) return null

    const session: AuthSession = JSON.parse(stored)

    // Verificar si la sesión ha expirado
    if (new Date() > new Date(session.expires)) {
      localStorage.removeItem("auth-session")
      return null
    }

    return session
  } catch {
    return null
  }
}

export function storeSession(session: AuthSession): void {
  if (typeof window === "undefined") return
  localStorage.setItem("auth-session", JSON.stringify(session))
}

export function clearSession(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("auth-session")
}
