"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Filter, ChevronLeft, ChevronRight, ArrowLeft, Heart, Loader2 } from "lucide-react"
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"
import { getCitas, actualizarCita } from "@/lib/auth-supabase"

interface Cita {
  id: string
  paciente: string
  profesional: string
  servicio: string
  recurso: string
  fechaHora: Date
  duracion: number
  estado: "programada" | "en_curso" | "completada" | "cancelada"
}

export default function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [citas, setCitas] = useState<Cita[]>([])
  const [loading, setLoading] = useState(true)
  const [filtros, setFiltros] = useState({
    profesional: "",
    recurso: "",
    estado: "",
  })

  useEffect(() => {
    cargarCitas()
  }, [currentDate])

  const cargarCitas = async () => {
    try {
      setLoading(true)
      const start = startOfWeek(currentDate, { weekStartsOn: 1 })
      const end = endOfWeek(currentDate, { weekStartsOn: 1 })

      const citasData = await getCitas(start.toISOString(), end.toISOString())

      const citasFormateadas: Cita[] = citasData.map((cita: any) => ({
        id: cita.id,
        paciente: `${cita.pacientes?.nombre} ${cita.pacientes?.apellido}`,
        profesional: cita.usuarios?.nombre_usuario || "Sin asignar",
        servicio: cita.tipos_servicio?.nombre_servicio || "Sin servicio",
        recurso: cita.recursos_fisicos?.nombre_recurso || "Sin recurso",
        fechaHora: new Date(cita.fecha_hora_inicio),
        duracion: cita.duracion_minutos_real,
        estado: cita.estado as "programada" | "en_curso" | "completada" | "cancelada",
      }))

      setCitas(citasFormateadas)
    } catch (error) {
      console.error("Error al cargar citas:", error)
    } finally {
      setLoading(false)
    }
  }

  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 })
    const end = endOfWeek(currentDate, { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }

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

  const getCitasDelDia = (fecha: Date) => {
    return citas.filter((cita) => isSameDay(cita.fechaHora, fecha))
  }

  const handleDragStart = (e: React.DragEvent, cita: Cita) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(cita))
  }

  const handleDrop = async (e: React.DragEvent, nuevaFecha: Date, nuevaHora: string) => {
    e.preventDefault()
    try {
      const citaData = JSON.parse(e.dataTransfer.getData("text/plain"))

      const nuevaFechaHora = new Date(
        nuevaFecha.getFullYear(),
        nuevaFecha.getMonth(),
        nuevaFecha.getDate(),
        Number.parseInt(nuevaHora),
        0,
      )

      // Actualizar en Supabase
      await actualizarCita(citaData.id, {
        fecha_hora_inicio: nuevaFechaHora.toISOString(),
        fecha_hora_fin: new Date(nuevaFechaHora.getTime() + citaData.duracion * 60000).toISOString(),
      })

      // Actualizar el estado local
      setCitas((prev) => prev.map((cita) => (cita.id === citaData.id ? { ...cita, fechaHora: nuevaFechaHora } : cita)))
    } catch (error) {
      console.error("Error al mover cita:", error)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const cambiarEstadoCita = async (citaId: string, nuevoEstado: string) => {
    try {
      await actualizarCita(citaId, { estado: nuevoEstado })

      setCitas((prev) => prev.map((cita) => (cita.id === citaId ? { ...cita, estado: nuevoEstado as any } : cita)))
    } catch (error) {
      console.error("Error al cambiar estado de cita:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando agenda...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <Heart className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agenda General</h1>
              <p className="text-gray-600">Gestión de citas del centro de salud</p>
            </div>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nueva Cita</span>
          </Button>
        </div>

        {/* Controles de Vista */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              {/* Navegación de Fecha */}
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(addDays(currentDate, -7))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-semibold">{format(currentDate, "MMMM yyyy", { locale: es })}</h2>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(addDays(currentDate, 7))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={cargarCitas}>
                  Actualizar
                </Button>
              </div>

              {/* Filtros */}
              <div className="flex items-center space-x-2">
                <Select
                  value={filtros.profesional}
                  onValueChange={(value) => setFiltros((prev) => ({ ...prev, profesional: value }))}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Profesional" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="admin">admin</SelectItem>
                    <SelectItem value="doctor">doctor</SelectItem>
                    <SelectItem value="fisio">fisio</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vista Semanal */}
        <div className="grid grid-cols-8 gap-4">
          {/* Columna de Horas */}
          <div className="space-y-2">
            <div className="h-16"></div> {/* Espacio para el header */}
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="h-16 flex items-center justify-center text-sm text-gray-500 border-r">
                {String(8 + i).padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {/* Columnas de Días */}
          {getWeekDays().map((dia, index) => (
            <div key={index} className="space-y-2">
              {/* Header del Día */}
              <Card className="h-16">
                <CardContent className="p-3 text-center">
                  <div className="text-sm font-medium text-gray-900">{format(dia, "EEE", { locale: es })}</div>
                  <div className="text-lg font-bold text-gray-900">{format(dia, "d")}</div>
                </CardContent>
              </Card>

              {/* Slots de Tiempo */}
              {Array.from({ length: 12 }, (_, i) => {
                const hora = String(8 + i).padStart(2, "0")
                const citasEnEsteSlot = getCitasDelDia(dia).filter((cita) => cita.fechaHora.getHours() === 8 + i)

                return (
                  <div
                    key={i}
                    className="h-16 border border-gray-200 rounded-lg p-1 bg-white hover:bg-gray-50 transition-colors"
                    onDrop={(e) => handleDrop(e, dia, hora)}
                    onDragOver={handleDragOver}
                  >
                    {citasEnEsteSlot.map((cita) => (
                      <div
                        key={cita.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, cita)}
                        className="bg-blue-100 border border-blue-200 rounded p-1 text-xs cursor-move hover:bg-blue-200 transition-colors group"
                      >
                        <div className="font-medium truncate">{cita.paciente}</div>
                        <div className="text-gray-600 truncate">{cita.servicio}</div>
                        <div className="flex items-center justify-between">
                          <Badge className={`text-xs ${getEstadoColor(cita.estado)}`}>{cita.estado}</Badge>
                          <div className="hidden group-hover:flex space-x-1">
                            {cita.estado === "programada" && (
                              <button
                                onClick={() => cambiarEstadoCita(cita.id, "en_curso")}
                                className="text-xs bg-yellow-500 text-white px-1 rounded"
                              >
                                Iniciar
                              </button>
                            )}
                            {cita.estado === "en_curso" && (
                              <button
                                onClick={() => cambiarEstadoCita(cita.id, "completada")}
                                className="text-xs bg-green-500 text-white px-1 rounded"
                              >
                                Completar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {citas.filter((c) => c.estado === "programada").length}
              </div>
              <div className="text-sm text-gray-500">Programadas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {citas.filter((c) => c.estado === "en_curso").length}
              </div>
              <div className="text-sm text-gray-500">En Curso</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {citas.filter((c) => c.estado === "completada").length}
              </div>
              <div className="text-sm text-gray-500">Completadas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {citas.filter((c) => c.estado === "cancelada").length}
              </div>
              <div className="text-sm text-gray-500">Canceladas</div>
            </CardContent>
          </Card>
        </div>

        {/* Leyenda */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Leyenda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-100 text-blue-800">Programada</Badge>
                <span className="text-sm text-gray-600">Cita programada</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-yellow-100 text-yellow-800">En Curso</Badge>
                <span className="text-sm text-gray-600">Cita en progreso</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800">Completada</Badge>
                <span className="text-sm text-gray-600">Cita finalizada</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-red-100 text-red-800">Cancelada</Badge>
                <span className="text-sm text-gray-600">Cita cancelada</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
