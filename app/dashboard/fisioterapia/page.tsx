"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ArrowLeft, Users, Clock, Activity, Plus } from "lucide-react"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

interface SesionFisioterapia {
  id: number
  paciente: string
  servicio: string
  camilla: string
  fechaHora: Date
  duracion: number
  estado: "programada" | "en_curso" | "completada" | "cancelada"
  escalaEva?: number
  notas?: string
}

export default function FisioterapiaPage() {
  const { session } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [sesiones, setSesiones] = useState<SesionFisioterapia[]>([])
  const [pacientesSimultaneos, setPacientesSimultaneos] = useState(0)
  const [selectedSesion, setSelectedSesion] = useState<SesionFisioterapia | null>(null)

  useEffect(() => {
    // Simular carga de sesiones del fisioterapeuta
    const sesionesEjemplo: SesionFisioterapia[] = [
      {
        id: 1,
        paciente: "María González",
        servicio: "Sesión de Fisioterapia",
        camilla: "Camilla 1",
        fechaHora: new Date(2024, 11, 20, 9, 0),
        duracion: 45,
        estado: "en_curso",
        escalaEva: 6,
      },
      {
        id: 2,
        paciente: "Carlos Rodríguez",
        servicio: "Terapia Grupal",
        camilla: "Camilla 2",
        fechaHora: new Date(2024, 11, 20, 9, 30),
        duracion: 60,
        estado: "en_curso",
        escalaEva: 4,
      },
      {
        id: 3,
        paciente: "Ana Martínez",
        servicio: "Sesión de Fisioterapia",
        camilla: "Camilla 3",
        fechaHora: new Date(2024, 11, 20, 10, 0),
        duracion: 45,
        estado: "programada",
      },
      {
        id: 4,
        paciente: "Luis Pérez",
        servicio: "Sesión de Fisioterapia",
        camilla: "Camilla 4",
        fechaHora: new Date(2024, 11, 20, 11, 0),
        duracion: 45,
        estado: "programada",
      },
    ]
    setSesiones(sesionesEjemplo)

    // Calcular pacientes simultáneos actuales
    const ahora = new Date()
    const sesionesActivas = sesionesEjemplo.filter((sesion) => {
      const inicio = sesion.fechaHora
      const fin = new Date(inicio.getTime() + sesion.duracion * 60000)
      return sesion.estado === "en_curso" && ahora >= inicio && ahora <= fin
    })
    setPacientesSimultaneos(sesionesActivas.length)
  }, [])

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "programada":
        return "bg-blue-100 text-blue-800"
      case "en_curso":
        return "bg-yellow-100 text-yellow-800"
      case "completada":
        return "bg-green-100 text-green-800"
      case "cancelada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSesionesDelDia = (fecha: Date) => {
    return sesiones.filter((sesion) => isSameDay(sesion.fechaHora, fecha))
  }

  const iniciarSesion = (sesionId: number) => {
    setSesiones((prev) => prev.map((sesion) => (sesion.id === sesionId ? { ...sesion, estado: "en_curso" } : sesion)))
    setPacientesSimultaneos((prev) => prev + 1)
  }

  const completarSesion = (sesionId: number) => {
    setSesiones((prev) => prev.map((sesion) => (sesion.id === sesionId ? { ...sesion, estado: "completada" } : sesion)))
    setPacientesSimultaneos((prev) => Math.max(0, prev - 1))
  }

  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 })
    const end = endOfWeek(currentDate, { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <Heart className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mi Agenda - Fisioterapia</h1>
                <p className="text-sm text-gray-500">
                  {session?.user.name} - {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{pacientesSimultaneos}/3</div>
                <div className="text-xs text-gray-500">Pacientes Activos</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="text-lg font-bold">{pacientesSimultaneos}</div>
                  <div className="text-xs text-gray-500">En Sesión</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-lg font-bold">{sesiones.filter((s) => s.estado === "programada").length}</div>
                  <div className="text-xs text-gray-500">Pendientes</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-lg font-bold">{sesiones.filter((s) => s.estado === "completada").length}</div>
                  <div className="text-xs text-gray-500">Completadas</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-600" />
                <div>
                  <div className="text-lg font-bold">
                    {sesiones.filter((s) => s.escalaEva).reduce((acc, s) => acc + (s.escalaEva || 0), 0) /
                      sesiones.filter((s) => s.escalaEva).length || 0}
                  </div>
                  <div className="text-xs text-gray-500">EVA Promedio</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerta de Capacidad */}
        {pacientesSimultaneos >= 3 && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="font-medium text-yellow-800">Capacidad Máxima Alcanzada</div>
                  <div className="text-sm text-yellow-600">
                    Estás atendiendo el máximo de 3 pacientes simultáneos permitidos
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Sesiones del Día */}
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Sesiones de Hoy</span>
                <Button size="sm" disabled={pacientesSimultaneos >= 3}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Sesión
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getSesionesDelDia(new Date()).map((sesion) => (
                  <div
                    key={sesion.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="font-medium">{format(sesion.fechaHora, "HH:mm")}</div>
                        <div className="text-xs text-gray-500">{sesion.duracion}min</div>
                      </div>
                      <div>
                        <div className="font-medium">{sesion.paciente}</div>
                        <div className="text-sm text-gray-600">{sesion.servicio}</div>
                        <div className="text-xs text-gray-500">{sesion.camilla}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {sesion.escalaEva && (
                        <div className="text-center">
                          <div className="text-sm font-medium">EVA: {sesion.escalaEva}</div>
                          <div className="text-xs text-gray-500">Dolor</div>
                        </div>
                      )}

                      <Badge className={getEstadoColor(sesion.estado)}>
                        {sesion.estado === "programada" && "Programada"}
                        {sesion.estado === "en_curso" && "En Curso"}
                        {sesion.estado === "completada" && "Completada"}
                        {sesion.estado === "cancelada" && "Cancelada"}
                      </Badge>

                      <div className="flex space-x-2">
                        {sesion.estado === "programada" && (
                          <Button
                            size="sm"
                            onClick={() => iniciarSesion(sesion.id)}
                            disabled={pacientesSimultaneos >= 3}
                          >
                            Iniciar
                          </Button>
                        )}
                        {sesion.estado === "en_curso" && (
                          <Button size="sm" variant="outline" onClick={() => completarSesion(sesion.id)}>
                            Completar
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => setSelectedSesion(sesion)}>
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {getSesionesDelDia(new Date()).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No tienes sesiones programadas para hoy</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Vista Semanal Simplificada */}
          <Card>
            <CardHeader>
              <CardTitle>Vista Semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {getWeekDays().map((dia, index) => (
                  <div key={index} className="text-center">
                    <div className="font-medium text-sm mb-2">{format(dia, "EEE", { locale: es })}</div>
                    <div className="text-lg font-bold mb-2">{format(dia, "d")}</div>
                    <div className="space-y-1">
                      {getSesionesDelDia(dia).map((sesion) => (
                        <div
                          key={sesion.id}
                          className={`text-xs p-1 rounded ${
                            sesion.estado === "completada"
                              ? "bg-green-100 text-green-800"
                              : sesion.estado === "en_curso"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {format(sesion.fechaHora, "HH:mm")}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modal de Detalles (simplificado) */}
        {selectedSesion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Detalles de la Sesión</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-medium">Paciente</div>
                  <div className="text-gray-600">{selectedSesion.paciente}</div>
                </div>
                <div>
                  <div className="font-medium">Servicio</div>
                  <div className="text-gray-600">{selectedSesion.servicio}</div>
                </div>
                <div>
                  <div className="font-medium">Horario</div>
                  <div className="text-gray-600">
                    {format(selectedSesion.fechaHora, "dd/MM/yyyy HH:mm")} ({selectedSesion.duracion} min)
                  </div>
                </div>
                <div>
                  <div className="font-medium">Camilla</div>
                  <div className="text-gray-600">{selectedSesion.camilla}</div>
                </div>
                {selectedSesion.escalaEva && (
                  <div>
                    <div className="font-medium">Escala EVA</div>
                    <div className="text-gray-600">{selectedSesion.escalaEva}/10</div>
                  </div>
                )}
                <div className="flex space-x-2">
                  <Button className="flex-1" onClick={() => setSelectedSesion(null)}>
                    Cerrar
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Editar Notas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
