"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { AuthSession } from "./auth-supabase"
import { getStoredSession, storeSession, clearSession, validateCredentials, createSession } from "./auth-supabase"

interface AuthContextType {
  session: AuthSession | null
  status: "loading" | "authenticated" | "unauthenticated"
  signIn: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading")

  useEffect(() => {
    // Cargar sesión almacenada al inicializar
    const storedSession = getStoredSession()
    if (storedSession) {
      setSession(storedSession)
      setStatus("authenticated")
    } else {
      setStatus("unauthenticated")
    }
  }, [])

  const signIn = async (username: string, password: string) => {
    try {
      setStatus("loading")
      const user = await validateCredentials(username, password)

      if (!user) {
        setStatus("unauthenticated")
        return { success: false, error: "Credenciales inválidas" }
      }

      const newSession = createSession(user)
      storeSession(newSession)
      setSession(newSession)
      setStatus("authenticated")

      return { success: true }
    } catch (error) {
      console.error("Error en signIn:", error)
      setStatus("unauthenticated")
      return { success: false, error: "Error al conectar con la base de datos" }
    }
  }

  const signOut = () => {
    clearSession()
    setSession(null)
    setStatus("unauthenticated")
  }

  return <AuthContext.Provider value={{ session, status, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Hook compatible con useSession de NextAuth para facilitar migración
export function useSession() {
  const { session, status } = useAuth()
  return {
    data: session,
    status,
  }
}
