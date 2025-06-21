"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, Database } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

interface TestResult {
  name: string
  status: "loading" | "success" | "error"
  message: string
  data?: any
}

export default function TestConnectionPage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: "Conexión a Supabase", status: "loading", message: "Verificando..." },
    { name: "Tabla de Usuarios", status: "loading", message: "Verificando..." },
    { name: "Tabla de Pacientes", status: "loading", message: "Verificando..." },
    { name: "Tabla de Citas", status: "loading", message: "Verificando..." },
    { name: "Tabla de Roles", status: "loading", message: "Verificando..." },
  ])

  useEffect(() => {
    runTests()
  }, [])

  const runTests = async () => {
    // Test 1: Conexión básica
    try {
      const { data, error } = await supabase.from("roles").select("count", { count: "exact", head: true })
      if (error) throw error

      setTests((prev) =>
        prev.map((test, i) => (i === 0 ? { ...test, status: "success", message: "Conexión exitosa" } : test)),
      )
    } catch (error) {
      setTests((prev) =>
        prev.map((test, i) => (i === 0 ? { ...test, status: "error", message: `Error: ${error}` } : test)),
      )
    }

    // Test 2: Tabla de usuarios
    try {
      const { data, error } = await supabase.from("usuarios").select("id, nombre_usuario, email").limit(5)
      if (error) throw error

      setTests((prev) =>
        prev.map((test, i) =>
          i === 1
            ? {
                ...test,
                status: "success",
                message: `${data?.length || 0} usuarios encontrados`,
                data: data,
              }
            : test,
        ),
      )
    } catch (error) {
      setTests((prev) =>
        prev.map((test, i) => (i === 1 ? { ...test, status: "error", message: `Error: ${error}` } : test)),
      )
    }

    // Test 3: Tabla de pacientes
    try {
      const { data, error } = await supabase.from("pacientes").select("id, nombre, apellido").limit(5)
      if (error) throw error

      setTests((prev) =>
        prev.map((test, i) =>
          i === 2
            ? {
                ...test,
                status: "success",
                message: `${data?.length || 0} pacientes encontrados`,
                data: data,
              }
            : test,
        ),
      )
    } catch (error) {
      setTests((prev) =>
        prev.map((test, i) => (i === 2 ? { ...test, status: "error", message: `Error: ${error}` } : test)),
      )
    }

    // Test 4: Tabla de citas
    try {
      const { data, error } = await supabase.from("citas").select("id, estado").limit(5)
      if (error) throw error

      setTests((prev) =>
        prev.map((test, i) =>
          i === 3
            ? {
                ...test,
                status: "success",
                message: `${data?.length || 0} citas encontradas`,
                data: data,
              }
            : test,
        ),
      )
    } catch (error) {
      setTests((prev) =>
        prev.map((test, i) => (i === 3 ? { ...test, status: "error", message: `Error: ${error}` } : test)),
      )
    }

    // Test 5: Tabla de roles
    try {
      const { data, error } = await supabase.from("roles").select("id, nombre_rol")
      if (error) throw error

      setTests((prev) =>
        prev.map((test, i) =>
          i === 4
            ? {
                ...test,
                status: "success",
                message: `${data?.length || 0} roles encontrados`,
                data: data,
              }
            : test,
        ),
      )
    } catch (error) {
      setTests((prev) =>
        prev.map((test, i) => (i === 4 ? { ...test, status: "error", message: `Error: ${error}` } : test)),
      )
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "loading":
        return <Badge variant="outline">Cargando...</Badge>
      case "success":
        return <Badge className="bg-green-100 text-green-800">Exitoso</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      default:
        return null
    }
  }

  const allTestsComplete = tests.every((test) => test.status !== "loading")
  const allTestsSuccess = tests.every((test) => test.status === "success")

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Database className="h-16 w-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Prueba de Conexión a Supabase</h1>
          <p className="text-gray-600">Verificando la conexión y configuración de la base de datos</p>
        </div>

        {/* Resumen */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Estado General</span>
              {allTestsComplete && (
                <Badge className={allTestsSuccess ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {allTestsSuccess ? "Todas las pruebas exitosas" : "Algunas pruebas fallaron"}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {tests.filter((t) => t.status === "success").length}
                </div>
                <div className="text-sm text-gray-500">Pruebas Exitosas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {tests.filter((t) => t.status === "error").length}
                </div>
                <div className="text-sm text-gray-500">Pruebas Fallidas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {tests.filter((t) => t.status === "loading").length}
                </div>
                <div className="text-sm text-gray-500">En Progreso</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resultados de Pruebas */}
        <div className="space-y-4">
          {tests.map((test, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <div className="font-medium">{test.name}</div>
                      <div className="text-sm text-gray-600">{test.message}</div>
                    </div>
                  </div>
                  {getStatusBadge(test.status)}
                </div>

                {/* Mostrar datos si están disponibles */}
                {test.data && test.data.length > 0 && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium mb-2">Datos de muestra:</div>
                    <div className="space-y-1">
                      {test.data.slice(0, 3).map((item: any, i: number) => (
                        <div key={i} className="text-xs text-gray-600">
                          {JSON.stringify(item, null, 2)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Acciones */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button onClick={runTests} disabled={!allTestsComplete}>
            {!allTestsComplete && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Ejecutar Pruebas Nuevamente
          </Button>
          {allTestsSuccess && (
            <Link href="/login">
              <Button>Ir al Sistema</Button>
            </Link>
          )}
        </div>

        {/* Información de Configuración */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Información de Configuración</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium">URL de Supabase:</div>
                <div className="text-gray-600 font-mono break-all">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL || "No configurada"}
                </div>
              </div>
              <div>
                <div className="font-medium">Clave Anónima:</div>
                <div className="text-gray-600 font-mono">
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Configurada ✓" : "No configurada ✗"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
