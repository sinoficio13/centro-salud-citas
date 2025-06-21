import { supabase } from "./supabase"
import bcrypt from "bcryptjs"

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

export async function validateCredentials(username: string, password: string): Promise<User | null> {
  try {
    // Buscar usuario en Supabase
    const { data: usuarios, error } = await supabase
      .from("usuarios")
      .select(`
        id,
        nombre_usuario,
        password_hash,
        email,
        activo,
        roles (
          nombre_rol
        )
      `)
      .eq("nombre_usuario", username)
      .eq("activo", true)
      .single()

    if (error || !usuarios) {
      console.error("Error al buscar usuario:", error)
      return null
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, usuarios.password_hash)

    if (!isValidPassword) {
      return null
    }

    // Actualizar último acceso
    await supabase.from("usuarios").update({ ultimo_acceso: new Date().toISOString() }).eq("id", usuarios.id)

    // Registrar en bitácora
    await supabase.from("bitacora_actividad").insert({
      id_usuario: usuarios.id,
      tipo_accion: "LOGIN",
      entidad_afectada: "USUARIO",
      id_entidad_afectada: usuarios.id,
      detalles_cambio_json: { accion: "Inicio de sesión exitoso" },
    })

    return {
      id: usuarios.id,
      name: usuarios.nombre_usuario,
      email: usuarios.email,
      role: usuarios.roles?.nombre_rol || "usuario",
    }
  } catch (error) {
    console.error("Error en validación de credenciales:", error)
    return null
  }
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

// Funciones para interactuar con la base de datos
export async function getPacientes() {
  const { data, error } = await supabase.from("pacientes").select("*").eq("activo", true).order("nombre")

  if (error) {
    console.error("Error al obtener pacientes:", error)
    return []
  }

  return data || []
}

export async function getCitas(fechaInicio?: string, fechaFin?: string) {
  let query = supabase.from("citas").select(`
      *,
      pacientes (nombre, apellido),
      usuarios (nombre_usuario),
      tipos_servicio (nombre_servicio),
      recursos_fisicos (nombre_recurso)
    `)

  if (fechaInicio) {
    query = query.gte("fecha_hora_inicio", fechaInicio)
  }

  if (fechaFin) {
    query = query.lte("fecha_hora_inicio", fechaFin)
  }

  const { data, error } = await query.order("fecha_hora_inicio")

  if (error) {
    console.error("Error al obtener citas:", error)
    return []
  }

  return data || []
}

export async function getRecursosFisicos() {
  const { data, error } = await supabase.from("recursos_fisicos").select("*").eq("activo", true).order("nombre_recurso")

  if (error) {
    console.error("Error al obtener recursos:", error)
    return []
  }

  return data || []
}

export async function getTiposServicio() {
  const { data, error } = await supabase.from("tipos_servicio").select("*").eq("activo", true).order("nombre_servicio")

  if (error) {
    console.error("Error al obtener tipos de servicio:", error)
    return []
  }

  return data || []
}

export async function getBitacora(limite = 50) {
  const { data, error } = await supabase
    .from("bitacora_actividad")
    .select(`
      *,
      usuarios (nombre_usuario)
    `)
    .order("fecha_hora_accion", { ascending: false })
    .limit(limite)

  if (error) {
    console.error("Error al obtener bitácora:", error)
    return []
  }

  return data || []
}

export async function crearPaciente(paciente: {
  nombre: string
  apellido: string
  dni: string
  fecha_nacimiento: string
  telefono?: string
  email?: string
  direccion?: string
}) {
  const { data, error } = await supabase.from("pacientes").insert(paciente).select().single()

  if (error) {
    console.error("Error al crear paciente:", error)
    throw error
  }

  return data
}

export async function actualizarCita(id: string, updates: any) {
  const { data, error } = await supabase
    .from("citas")
    .update({
      ...updates,
      ultima_modificacion_fecha: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error al actualizar cita:", error)
    throw error
  }

  return data
}
