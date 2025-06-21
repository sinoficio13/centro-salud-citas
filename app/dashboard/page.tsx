"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, UserCheck, Settings, BarChart3, Clock, Heart, Activity, FileText, Shield } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

interface DashboardStats {
  citasHoy: number
  citasPendientes: number
  pacientesActivos: number
  profesionalesActivos: number
}

export default function DashboardPage() {
  const { session, status, signOut } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    citasHoy: 0,
    citasPendientes: 0,
    pacientesActivos: 0,
    profesionalesActivos: 0,
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") {
      // Simular carga de estadísticas
      setStats({
        citasHoy: 12,
        citasPendientes: 8,
        pacientesActivos: 156,
        profesionalesActivos: 8,
      })
    }
  }, [status])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const userRole = session.user.role
  const userName = session.user.name

  const getRoleColor = (role: string) => {
    switch (role) {
      case "root":
        return "bg-red-100 text-red-800"
      case "recepcion":
        return "bg-blue-100 text-blue-800"
      case "doctor":
        return "bg-green-100 text-green-800"
      case "fisioterapeuta":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "root":
        return "Administrador"
      case "recepcion":
        return "Recepción"
      case "doctor":
        return "Doctor"
      case "fisioterapeuta":
        return "Fisioterapeuta"
      default:
        return role
    }
  }

  const handleSignOut = () => {
    signOut()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Centro de Salud</h1>
                <p className="text-sm text-gray-500">Sistema de Gestión de Citas</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <Badge className={getRoleColor(userRole)}>{getRoleDisplayName(userRole)}</Badge>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.citasHoy}</div>
              <p className="text-xs text-muted-foreground">+2 desde ayer</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Citas Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.citasPendientes}</div>
              <p className="text-xs text-muted-foreground">Para esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pacientes Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pacientesActivos}</div>
              <p className="text-xs text-muted-foreground">+12 este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profesionales</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.profesionalesActivos}</div>
              <p className="text-xs text-muted-foreground">Activos hoy</p>
            </CardContent>
          </Card>
        </div>

        {/* Módulos por Rol */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Módulos para Root */}
          {userRole === "root" && (
            <>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-red-600" />
                    <span>Gestión de Usuarios</span>
                  </CardTitle>
                  <CardDescription>Crear, editar y gestionar usuarios del sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/usuarios">
                    <Button className="w-full">Acceder</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-gray-600" />
                    <span>Configuración</span>
                  </CardTitle>
                  <CardDescription>Configurar recursos, servicios y parámetros del sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/configuracion">
                    <Button className="w-full">Acceder</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>Bitácora de Auditoría</span>
                  </CardTitle>
                  <CardDescription>Revisar todas las actividades del sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/bitacora">
                    <Button className="w-full">Acceder</Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          )}

          {/* Módulos para Recepción */}
          {(userRole === "root" || userRole === "recepcion") && (
            <>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span>Agenda General</span>
                  </CardTitle>
                  <CardDescription>Ver y gestionar todas las citas del centro</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/agenda">
                    <Button className="w-full">Acceder</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <span>Gestión de Pacientes</span>
                  </CardTitle>
                  <CardDescription>Registrar y gestionar información de pacientes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/pacientes">
                    <Button className="w-full">Acceder</Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          )}

          {/* Módulos para Doctor */}
          {(userRole === "root" || userRole === "doctor") && (
            <>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    <span>Mi Agenda</span>
                  </CardTitle>
                  <CardDescription>Ver mis citas programadas y registrar atenciones</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/mi-agenda">
                    <Button className="w-full">Acceder</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>Historiales Clínicos</span>
                  </CardTitle>
                  <CardDescription>Consultar historiales completos de pacientes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/historiales">
                    <Button className="w-full">Acceder</Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          )}

          {/* Módulos para Fisioterapeuta */}
          {(userRole === "root" || userRole === "fisioterapeuta") && (
            <>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-purple-600" />
                    <span>Mi Agenda Fisioterapia</span>
                  </CardTitle>
                  <CardDescription>Ver mis sesiones y gestionar hasta 3 pacientes simultáneos</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/fisioterapia">
                    <Button className="w-full">Acceder</Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          )}

          {/* Módulo de Reportes (para todos) */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                <span>Reportes</span>
              </CardTitle>
              <CardDescription>Ver estadísticas y reportes del centro</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/reportes">
                <Button className="w-full">Acceder</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
