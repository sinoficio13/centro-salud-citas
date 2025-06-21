"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Heart, FileText, Search, User, Calendar, Activity } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

interface Paciente {
  id: number
  nombre: string
  apellido: string
  dni: string
  fechaNacimiento: Date
  telefono: string
  email: string
}

interface RegistroAtencion {
  id: number
  fecha: Date
  profesional: string
  tipoConsulta: string
  diagnostico: string
  tratamiento: string
  escalaEva?: number
  notas: string
}

export default function HistorialesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null)
  const [registros, setRegistros] = useState<RegistroAtencion[]>([])
  const [busqueda, setBusqueda] = useState("")

  useEffect(() => {
    // Simular carga de pacientes
    const pacientesEjemplo: Paciente[] = [
      {
        id: 1,
        nombre: "María",
        apellido: "González",
        dni: "12345678",
        fechaNacimiento: new Date(1985, 2, 15),
        telefono: "0414-1234567",
        email: "maria.gonzalez@email.com",
      },
      {
        id: 2,
        nombre: "Carlos",
        apellido: "Rodríguez",
        dni: "87654321",
        fechaNacimiento: new Date(1978, 6, 22),
        telefono: "0424-7654321",
        email: "carlos.rodriguez@email.com",
      },
      {
        id: 3,
        nombre: "Ana",
        apellido: "Martínez",
        dni: "11223344",
        fechaNacimiento: new Date(1992, 10, 8),
        telefono: "0412-1122334",
        email: "ana.martinez@email.com",
      },
    ]
    setPacientes(pacientesEjemplo)
  }, [])

  useEffect(() => {
    if (pacienteSeleccionado) {
      // Simular carga de registros del paciente seleccionado
      const registrosEjemplo: RegistroAtencion[] = [
        {
          id: 1,
          fecha: new Date(2024, 11, 15),
          profesional: "Dr. Pérez",
          tipoConsulta: "Consulta General",
          diagnostico: "Hipertensión arterial leve",
          tratamiento: "Enalapril 10mg c/12h, dieta hiposódica",
          notas: "Paciente refiere cefaleas ocasionales. TA: 140/90. Se indica control en 15 días.",
        },
        {
          id: 2,
          fecha: new Date(2024, 11, 1),
          profesional: "Dr. García",
          tipoConsulta: "Consulta Especializada",
          diagnostico: "Lumbalgia mecánica",
          tratamiento: "Fisioterapia, relajantes musculares",
          escalaEva: 6,
          notas: "Dolor lumbar de 3 semanas de evolución. Se deriva a fisioterapia.",
        },
        {
          id: 3,
          fecha: new Date(2024, 10, 20),
          profesional: "Fis. López",
          tipoConsulta: "Sesión de Fisioterapia",
          diagnostico: "Lumbalgia mecánica en tratamiento",
          tratamiento: "Ejercicios de fortalecimiento, termoterapia",
          escalaEva: 4,
          notas: "Mejoría del dolor. Continúa con ejercicios en casa.",
        },
      ]
      setRegistros(registrosEjemplo)
    }
  }, [pacienteSeleccionado])

  const pacientesFiltrados = pacientes.filter(
    (paciente) =>
      busqueda === "" ||
      paciente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      paciente.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
      paciente.dni.includes(busqueda),
  )

  const calcularEdad = (fechaNacimiento: Date) => {
    const hoy = new Date()
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear()
    const mes = hoy.getMonth() - fechaNacimiento.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--
    }
    return edad
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <Heart className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Historiales Clínicos</h1>
            <p className="text-gray-600">Consultar historiales completos de pacientes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Pacientes */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Pacientes</span>
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar paciente..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {pacientesFiltrados.map((paciente) => (
                    <div
                      key={paciente.id}
                      onClick={() => setPacienteSeleccionado(paciente)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        pacienteSeleccionado?.id === paciente.id ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="font-medium">
                        {paciente.nombre} {paciente.apellido}
                      </div>
                      <div className="text-sm text-gray-600">DNI: {paciente.dni}</div>
                      <div className="text-xs text-gray-500">{calcularEdad(paciente.fechaNacimiento)} años</div>
                    </div>
                  ))}

                  {pacientesFiltrados.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No se encontraron pacientes</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Historial del Paciente Seleccionado */}
          <div className="lg:col-span-2">
            {pacienteSeleccionado ? (
              <Tabs defaultValue="historial" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">
                      {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellido}
                    </h2>
                    <p className="text-gray-600">
                      DNI: {pacienteSeleccionado.dni} • {calcularEdad(pacienteSeleccionado.fechaNacimiento)} años
                    </p>
                  </div>
                  <TabsList>
                    <TabsTrigger value="historial">Historial</TabsTrigger>
                    <TabsTrigger value="datos">Datos Personales</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="historial">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5" />
                        <span>Registros de Atención</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {registros.map((registro) => (
                          <div key={registro.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <div className="font-medium flex items-center space-x-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>{format(registro.fecha, "dd 'de' MMMM 'de' yyyy", { locale: es })}</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {registro.profesional} • {registro.tipoConsulta}
                                </div>
                              </div>
                              {registro.escalaEva && <Badge variant="outline">EVA: {registro.escalaEva}/10</Badge>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-sm text-gray-700 mb-1">Diagnóstico</h4>
                                <p className="text-sm">{registro.diagnostico}</p>
                              </div>
                              <div>
                                <h4 className="font-medium text-sm text-gray-700 mb-1">Tratamiento</h4>
                                <p className="text-sm">{registro.tratamiento}</p>
                              </div>
                            </div>

                            {registro.notas && (
                              <div className="mt-3">
                                <h4 className="font-medium text-sm text-gray-700 mb-1">Notas</h4>
                                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{registro.notas}</p>
                              </div>
                            )}
                          </div>
                        ))}

                        {registros.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No hay registros de atención para este paciente</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="datos">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <span>Datos Personales</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Nombre Completo</label>
                            <p className="text-sm mt-1">
                              {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellido}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">DNI</label>
                            <p className="text-sm mt-1">{pacienteSeleccionado.dni}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                            <p className="text-sm mt-1">
                              {format(pacienteSeleccionado.fechaNacimiento, "dd 'de' MMMM 'de' yyyy", { locale: es })} (
                              {calcularEdad(pacienteSeleccionado.fechaNacimiento)} años)
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Teléfono</label>
                            <p className="text-sm mt-1">{pacienteSeleccionado.telefono}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <p className="text-sm mt-1">{pacienteSeleccionado.email}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Registros de Atención</label>
                            <p className="text-sm mt-1">{registros.length} registros</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center text-gray-500">
                    <User className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Selecciona un paciente</p>
                    <p className="text-sm">Elige un paciente de la lista para ver su historial clínico</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
