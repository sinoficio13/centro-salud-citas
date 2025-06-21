"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Heart, Loader2, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

export default function HomePage() {
  const { session, status } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Aún cargando

    if (session) {
      // Si hay sesión, redirigir al dashboard
      router.push("/dashboard")
    }
    // Si no hay sesión, mostrar la página de inicio
  }, [session, status, router])

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
            <span className="text-sm text-gray-500">Cargando...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
          <Heart className="h-10 w-10 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Centro de Salud</h1>
        <p className="text-xl text-gray-600 mb-8">Sistema de Gestión de Citas</p>
        <p className="text-gray-500 mb-8">
          Bienvenido al sistema integral para la gestión de citas médicas y fisioterapia
        </p>
        <div className="space-y-4">
          <Link href="/login">
            <Button size="lg" className="w-full text-lg">
              Iniciar Sesión
            </Button>
          </Link>
          <Link href="/test-connection">
            <Button variant="outline" size="lg" className="w-full text-lg">
              <Database className="h-5 w-5 mr-2" />
              Probar Conexión BD
            </Button>
          </Link>
          <p className="text-sm text-gray-500">Accede con tus credenciales para gestionar citas y pacientes</p>
        </div>
      </div>
    </div>
  )
}
