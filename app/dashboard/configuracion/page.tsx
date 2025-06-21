"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Heart, Settings, Building, Clock, Stethoscope } from "lucide-react"
import Link from "next/link"

export default function ConfiguracionPage() {
  const [recursos, setRecursos] = useState([
    { id: 1, nombre: "Consultorio 1", tipo: "consultorio", activo: true },
    { id: 2, nombre: "Consultorio 2", tipo: "consultorio", activo: true },
    { id: 3, nombre: "Camilla Fisio 1", tipo: "camilla_fisioterapia", activo: true },
    { id: 4, nombre: "Camilla Fisio 2", tipo: "camilla_fisioterapia", activo: true },
  ])

  const [servicios, setServicios] = useState([
    { id: 1, nombre: "Consulta General", duracion: 30, precio: 50.0, activo: true },
    { id: 2, nombre: "Consulta Especializada", duracion: 45, precio: 80.0, activo: true },
    { id: 3, nombre: "Sesión de Fisioterapia", duracion: 45, precio: 40.0, activo: true },
  ])

  const [horarios, setHorarios] = useState({
    apertura: "08:00",
    cierre: "18:00",
    descanso_inicio: "12:00",
    descanso_fin: "13:00",
  })

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
          <Heart className="h-8 w-8 text-gray-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
            <p className="text-gray-600">Configurar recursos, servicios y parámetros del centro</p>
          </div>
        </div>

        <Tabs defaultValue="recursos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recursos">Recursos</TabsTrigger>
            <TabsTrigger value="servicios">Servicios</TabsTrigger>
            <TabsTrigger value="horarios">Horarios</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>

          {/* Recursos Físicos */}
          <TabsContent value="recursos">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>Recursos Físicos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="nombre-recurso">Nombre del Recurso</Label>
                      <Input id="nombre-recurso" placeholder="Ej: Consultorio 3" />
                    </div>
                    <div>
                      <Label htmlFor="tipo-recurso">Tipo</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option value="consultorio">Consultorio</option>
                        <option value="camilla_fisioterapia">Camilla Fisioterapia</option>
                        <option value="area_procedimiento">Área de Procedimiento</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <Button>Agregar Recurso</Button>
                    </div>
                  </div>

                  <div className="border rounded-lg">
                    <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 font-medium">
                      <div>Nombre</div>
                      <div>Tipo</div>
                      <div>Estado</div>
                      <div>Acciones</div>
                    </div>
                    {recursos.map((recurso) => (
                      <div key={recurso.id} className="grid grid-cols-4 gap-4 p-4 border-t">
                        <div>{recurso.nombre}</div>
                        <div className="capitalize">{recurso.tipo.replace("_", " ")}</div>
                        <div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              recurso.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {recurso.activo ? "Activo" : "Inactivo"}
                          </span>
                        </div>
                        <div className="space-x-2">
                          <Button size="sm" variant="outline">
                            Editar
                          </Button>
                          <Button size="sm" variant="outline">
                            {recurso.activo ? "Desactivar" : "Activar"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Servicios */}
          <TabsContent value="servicios">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Stethoscope className="h-5 w-5" />
                  <span>Tipos de Servicio</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="nombre-servicio">Nombre del Servicio</Label>
                      <Input id="nombre-servicio" placeholder="Ej: Consulta Cardiología" />
                    </div>
                    <div>
                      <Label htmlFor="duracion-servicio">Duración (min)</Label>
                      <Input id="duracion-servicio" type="number" placeholder="30" />
                    </div>
                    <div>
                      <Label htmlFor="precio-servicio">Precio ($)</Label>
                      <Input id="precio-servicio" type="number" step="0.01" placeholder="50.00" />
                    </div>
                    <div className="flex items-end">
                      <Button>Agregar Servicio</Button>
                    </div>
                  </div>

                  <div className="border rounded-lg">
                    <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 font-medium">
                      <div>Nombre</div>
                      <div>Duración</div>
                      <div>Precio</div>
                      <div>Estado</div>
                      <div>Acciones</div>
                    </div>
                    {servicios.map((servicio) => (
                      <div key={servicio.id} className="grid grid-cols-5 gap-4 p-4 border-t">
                        <div>{servicio.nombre}</div>
                        <div>{servicio.duracion} min</div>
                        <div>${servicio.precio}</div>
                        <div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              servicio.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {servicio.activo ? "Activo" : "Inactivo"}
                          </span>
                        </div>
                        <div className="space-x-2">
                          <Button size="sm" variant="outline">
                            Editar
                          </Button>
                          <Button size="sm" variant="outline">
                            {servicio.activo ? "Desactivar" : "Activar"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Horarios */}
          <TabsContent value="horarios">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Horarios de Atención</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Horario General</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="apertura">Hora de Apertura</Label>
                          <Input
                            id="apertura"
                            type="time"
                            value={horarios.apertura}
                            onChange={(e) => setHorarios((prev) => ({ ...prev, apertura: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cierre">Hora de Cierre</Label>
                          <Input
                            id="cierre"
                            type="time"
                            value={horarios.cierre}
                            onChange={(e) => setHorarios((prev) => ({ ...prev, cierre: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Horario de Descanso</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="descanso-inicio">Inicio Descanso</Label>
                          <Input
                            id="descanso-inicio"
                            type="time"
                            value={horarios.descanso_inicio}
                            onChange={(e) => setHorarios((prev) => ({ ...prev, descanso_inicio: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="descanso-fin">Fin Descanso</Label>
                          <Input
                            id="descanso-fin"
                            type="time"
                            value={horarios.descanso_fin}
                            onChange={(e) => setHorarios((prev) => ({ ...prev, descanso_fin: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>Guardar Horarios</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuración General */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Configuración General</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Información del Centro</h3>
                      <div>
                        <Label htmlFor="nombre-centro">Nombre del Centro</Label>
                        <Input id="nombre-centro" defaultValue="Centro de Salud Integral" />
                      </div>
                      <div>
                        <Label htmlFor="direccion">Dirección</Label>
                        <Input id="direccion" placeholder="Dirección del centro" />
                      </div>
                      <div>
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input id="telefono" placeholder="Teléfono de contacto" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Configuraciones del Sistema</h3>
                      <div>
                        <Label htmlFor="max-fisio">Máximo Pacientes Simultáneos (Fisioterapia)</Label>
                        <Input id="max-fisio" type="number" defaultValue="3" />
                      </div>
                      <div>
                        <Label htmlFor="duracion-slot">Duración de Slot por Defecto (min)</Label>
                        <Input id="duracion-slot" type="number" defaultValue="30" />
                      </div>
                      <div>
                        <Label htmlFor="anticipacion">Días de Anticipación para Citas</Label>
                        <Input id="anticipacion" type="number" defaultValue="30" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>Guardar Configuración</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
