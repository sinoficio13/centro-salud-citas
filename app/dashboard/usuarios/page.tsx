"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, Shield } from "lucide-react"
import Link from "next/link"

export default function UsuariosPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <Heart className="h-8 w-8 text-red-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="text-gray-600">Crear, editar y gestionar usuarios del sistema</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-6 w-6" />
              <span>Módulo de Administración</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Este módulo permite al administrador gestionar todos los usuarios del sistema.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• Crear nuevos usuarios</p>
              <p>• Asignar roles y permisos</p>
              <p>• Gestionar profesionales</p>
              <p>• Control de acceso</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
