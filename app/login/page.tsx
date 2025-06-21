"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Heart } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { signIn, session, status } = useAuth()

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/dashboard")
    }
  }, [status, session, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn(username, password)

      if (result.success) {
        router.push("/dashboard")
      } else {
        setError(result.error || "Error al iniciar sesión")
      }
    } catch (error) {
      setError("Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  // Mostrar loading si está verificando sesión
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Heart className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Centro de Salud</h1>
          <p className="text-gray-600 mb-4">Sistema de Gestión de Citas</p>
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-gray-500">Verificando sesión...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Heart className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Centro de Salud</CardTitle>
          <CardDescription>Sistema de Gestión de Citas</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
                placeholder="Ingrese su usuario"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="Ingrese su contraseña"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground space-y-2">
            <p className="font-medium">Usuarios de prueba:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p>
                  <strong>admin</strong> / admin123
                </p>
                <p className="text-red-600">Administrador</p>
              </div>
              <div>
                <p>
                  <strong>recepcion</strong> / recepcion123
                </p>
                <p className="text-blue-600">Recepción</p>
              </div>
              <div>
                <p>
                  <strong>doctor</strong> / doctor123
                </p>
                <p className="text-green-600">Doctor</p>
              </div>
              <div>
                <p>
                  <strong>fisio</strong> / fisio123
                </p>
                <p className="text-purple-600">Fisioterapeuta</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
