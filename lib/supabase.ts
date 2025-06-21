import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos de base de datos
export interface Database {
  public: {
    Tables: {
      roles: {
        Row: {
          id: string
          nombre_rol: string
          permisos_json: any
          activo: boolean
          fecha_creacion: string
        }
        Insert: {
          id?: string
          nombre_rol: string
          permisos_json: any
          activo?: boolean
          fecha_creacion?: string
        }
        Update: {
          id?: string
          nombre_rol?: string
          permisos_json?: any
          activo?: boolean
          fecha_creacion?: string
        }
      }
      usuarios: {
        Row: {
          id: string
          nombre_usuario: string
          password_hash: string
          email: string
          id_rol: string
          activo: boolean
          ultimo_acceso: string | null
          fecha_creacion: string
        }
        Insert: {
          id?: string
          nombre_usuario: string
          password_hash: string
          email: string
          id_rol: string
          activo?: boolean
          ultimo_acceso?: string | null
          fecha_creacion?: string
        }
        Update: {
          id?: string
          nombre_usuario?: string
          password_hash?: string
          email?: string
          id_rol?: string
          activo?: boolean
          ultimo_acceso?: string | null
          fecha_creacion?: string
        }
      }
      pacientes: {
        Row: {
          id: string
          nombre: string
          apellido: string
          dni: string
          fecha_nacimiento: string
          telefono: string | null
          email: string | null
          direccion: string | null
          fecha_registro: string
          activo: boolean
        }
        Insert: {
          id?: string
          nombre: string
          apellido: string
          dni: string
          fecha_nacimiento: string
          telefono?: string | null
          email?: string | null
          direccion?: string | null
          fecha_registro?: string
          activo?: boolean
        }
        Update: {
          id?: string
          nombre?: string
          apellido?: string
          dni?: string
          fecha_nacimiento?: string
          telefono?: string | null
          email?: string | null
          direccion?: string | null
          fecha_registro?: string
          activo?: boolean
        }
      }
      citas: {
        Row: {
          id: string
          id_paciente: string
          id_profesional: string
          id_tipo_servicio: string
          id_recurso_fisico: string
          fecha_hora_inicio: string
          duracion_minutos_real: number
          fecha_hora_fin: string
          estado: string
          creado_por_usuario_id: string
          fecha_creacion: string
          ultima_modificacion_fecha: string
          ultima_modificacion_por_usuario_id: string | null
          monto_facturar_calculado: number | null
          id_factura_externa: string | null
          notas_cita: string | null
        }
        Insert: {
          id?: string
          id_paciente: string
          id_profesional: string
          id_tipo_servicio: string
          id_recurso_fisico: string
          fecha_hora_inicio: string
          duracion_minutos_real: number
          fecha_hora_fin: string
          estado?: string
          creado_por_usuario_id: string
          fecha_creacion?: string
          ultima_modificacion_fecha?: string
          ultima_modificacion_por_usuario_id?: string | null
          monto_facturar_calculado?: number | null
          id_factura_externa?: string | null
          notas_cita?: string | null
        }
        Update: {
          id?: string
          id_paciente?: string
          id_profesional?: string
          id_tipo_servicio?: string
          id_recurso_fisico?: string
          fecha_hora_inicio?: string
          duracion_minutos_real?: number
          fecha_hora_fin?: string
          estado?: string
          creado_por_usuario_id?: string
          fecha_creacion?: string
          ultima_modificacion_fecha?: string
          ultima_modificacion_por_usuario_id?: string | null
          monto_facturar_calculado?: number | null
          id_factura_externa?: string | null
          notas_cita?: string | null
        }
      }
      recursos_fisicos: {
        Row: {
          id: string
          nombre_recurso: string
          tipo_recurso: string
          capacidad_simultanea: number
          activo: boolean
          fecha_creacion: string
        }
        Insert: {
          id?: string
          nombre_recurso: string
          tipo_recurso: string
          capacidad_simultanea?: number
          activo?: boolean
          fecha_creacion?: string
        }
        Update: {
          id?: string
          nombre_recurso?: string
          tipo_recurso?: string
          capacidad_simultanea?: number
          activo?: boolean
          fecha_creacion?: string
        }
      }
      tipos_servicio: {
        Row: {
          id: string
          nombre_servicio: string
          descripcion: string | null
          tipo_recurso_asociado: string
          duracion_estandar_minutos: number
          precio_base: number
          activo: boolean
          fecha_creacion: string
        }
        Insert: {
          id?: string
          nombre_servicio: string
          descripcion?: string | null
          tipo_recurso_asociado: string
          duracion_estandar_minutos: number
          precio_base?: number
          activo?: boolean
          fecha_creacion?: string
        }
        Update: {
          id?: string
          nombre_servicio?: string
          descripcion?: string | null
          tipo_recurso_asociado?: string
          duracion_estandar_minutos?: number
          precio_base?: number
          activo?: boolean
          fecha_creacion?: string
        }
      }
    }
  }
}
