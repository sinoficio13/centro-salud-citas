"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Heart, FileText, Search, Filter, Download } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface RegistroBitacora {
  id: number
  usuario: string
  fecha: Date
  accion: string
  entidad: string
  detalles: string
  ip: string
  resultado: "exitoso" | "fallido" | "advertencia"
}

export default function BitacoraPage() {
  const [registros, setRegistros] = useState<RegistroBitacora[]>([])
  const [filtros, setFiltros] = useState({
    usuario: "",
    accion: "",
    entidad: "",
    fecha_desde: "",
    fecha_hasta: "",
  })
  const [busqueda, setBusqueda] = useState("")

  useEffect(() => {
    // Simular carga de registros de bitácora
    const registrosEjemplo: RegistroBitacora[] = [
      {
        id: 1,
        usuario: "admin",
        fecha: new Date(2024, 11, 20, 9, 15),
        accion: "LOGIN",
        entidad: "USUARIO",
        detalles: "Inicio de sesión exitoso",
        ip: "192.168.1.100",
        resultado: "exitoso",
      },
      {
        id: 2,
        usuario: "recepcion",
        fecha: new Date(2024, 11, 20, 9, 30),
        accion: "CREAR_CITA",
        entidad: "CITA",
        detalles: "Nueva cita creada para paciente María González",
        ip: "192.168.1.101",
        resultado: "exitoso",
      },
      {
        id: 3,
        usuario: "doctor",
        fecha: new Date(2024, 11, 20, 10, 0),
        accion: "ACTUALIZAR_REGISTRO",
        entidad: "REGISTRO_ATENCION",
        detalles: "Registro de atención actualizado - Paciente: Carlos Rodríguez",
        ip: "192.168.1.102",
        resultado: "exitoso",
      },
      {
        id: 4,
        usuario: "fisio",
        fecha: new Date(2024, 11, 20, 10, 15),
        accion: "LOGIN_FALLIDO",
        entidad: "USUARIO",
        detalles: "Intento de inicio de sesión con credenciales incorrectas",
        ip: "192.168.1.103",
        resultado: "fallido",
      },
      {
        id: 5,
        usuario: "admin",
        fecha: new Date(2024, 11, 20, 11, 0),
        accion: "CREAR_USUARIO",
        entidad: "USUARIO",
        detalles: "Nuevo usuario creado: Dr. Martínez",
        ip: "192.168.1.100",
        resultado: "exitoso",
      },
    ]
    setRegistros(registrosEjemplo)
  }, [])

  const getResultadoColor = (resultado: string) => {
    switch (resultado) {
      case "exitoso":
        return "bg-green-100 text-green-800"
      case "fallido":
        return "bg-red-100 text-red-800"
      case "advertencia":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAccionColor = (accion: string) => {
    if (accion.includes("LOGIN")) return "bg-blue-100 text-blue-800"
    if (accion.includes("CREAR")) return "bg-green-100 text-green-800"
    if (accion.includes("ACTUALIZAR")) return "bg-yellow-100 text-yellow-800"
    if (accion.includes("ELIMINAR")) return "bg-red-100 text-red-800"
    return "bg-gray-100 text-gray-800"
  }

  const registrosFiltrados = registros.filter((registro) => {
    const matchBusqueda =
      busqueda === "" ||
      registro.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
      registro.accion.toLowerCase().includes(busqueda.toLowerCase()) ||
      registro.detalles.toLowerCase().includes(busqueda.toLowerCase())

    const matchUsuario = filtros.usuario === "" || registro.usuario === filtros.usuario
    const matchAccion = filtros.accion === "" || registro.accion.includes(filtros.accion)
    const matchEntidad = filtros.entidad === "" || registro.entidad === filtros.entidad

    return matchBusqueda && matchUsuario && matchAccion && matchEntidad
  })

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
              <h1 className="text-3xl font-bold text-gray-900">Bitácora de Auditoría</h1>
              <p className="text-gray-600">Registro de todas las actividades del sistema</p>
            </div>
          </div>
          <Button className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </Button>
        </div>

        {/* Filtros y Búsqueda */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar en registros..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select
                value={filtros.usuario}
                onValueChange={(value) => setFiltros((prev) => ({ ...prev, usuario: value === "all" ? "" : value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Usuario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="admin">admin</SelectItem>
                  <SelectItem value="recepcion">recepcion</SelectItem>
                  <SelectItem value="doctor">doctor</SelectItem>
                  <SelectItem value="fisio">fisio</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filtros.accion}
                onValueChange={(value) => setFiltros((prev) => ({ ...prev, accion: value === "all" ? "" : value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Acción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="LOGIN">Login</SelectItem>
                  <SelectItem value="CREAR">Crear</SelectItem>
                  <SelectItem value="ACTUALIZAR">Actualizar</SelectItem>
                  <SelectItem value="ELIMINAR">Eliminar</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filtros.entidad}
                onValueChange={(value) => setFiltros((prev) => ({ ...prev, entidad: value === "all" ? "" : value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Entidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="USUARIO">Usuario</SelectItem>
                  <SelectItem value="CITA">Cita</SelectItem>
                  <SelectItem value="PACIENTE">Paciente</SelectItem>
                  <SelectItem value="REGISTRO_ATENCION">Registro Atención</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setFiltros({ usuario: "", accion: "", entidad: "", fecha_desde: "", fecha_hasta: "" })
                  setBusqueda("")
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {registros.filter((r) => r.resultado === "exitoso").length}
                </div>
                <div className="text-sm text-gray-500">Acciones Exitosas</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {registros.filter((r) => r.resultado === "fallido").length}
                </div>
                <div className="text-sm text-gray-500">Acciones Fallidas</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {registros.filter((r) => r.accion.includes("LOGIN")).length}
                </div>
                <div className="text-sm text-gray-500">Inicios de Sesión</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(registros.map((r) => r.usuario)).size}
                </div>
                <div className="text-sm text-gray-500">Usuarios Activos</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Registros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Registros de Actividad ({registrosFiltrados.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Fecha/Hora</th>
                    <th className="text-left p-3">Usuario</th>
                    <th className="text-left p-3">Acción</th>
                    <th className="text-left p-3">Entidad</th>
                    <th className="text-left p-3">Detalles</th>
                    <th className="text-left p-3">IP</th>
                    <th className="text-left p-3">Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  {registrosFiltrados.map((registro) => (
                    <tr key={registro.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="text-sm">
                          <div>{format(registro.fecha, "dd/MM/yyyy")}</div>
                          <div className="text-gray-500">{format(registro.fecha, "HH:mm:ss")}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">{registro.usuario}</Badge>
                      </td>
                      <td className="p-3">
                        <Badge className={getAccionColor(registro.accion)}>{registro.accion}</Badge>
                      </td>
                      <td className="p-3">
                        <span className="text-sm text-gray-600">{registro.entidad}</span>
                      </td>
                      <td className="p-3">
                        <div className="text-sm max-w-xs truncate" title={registro.detalles}>
                          {registro.detalles}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-xs text-gray-500 font-mono">{registro.ip}</span>
                      </td>
                      <td className="p-3">
                        <Badge className={getResultadoColor(registro.resultado)}>{registro.resultado}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {registrosFiltrados.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No se encontraron registros con los filtros aplicados</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
