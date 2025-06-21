"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function ReportesPage() {
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
          <Heart className="h-8 w-8 text-indigo-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reportes y Estadísticas</h1>
            <p className="text-gray-600">Ver estadísticas y reportes del centro</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6" />
              <span>Dashboard de Reportes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Este módulo proporcionará reportes detallados y estadísticas del centro de salud.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• Estadísticas de citas</p>
              <p>• Rendimiento por profesional</p>
              <p>• Ocupación de recursos</p>
              <p>• Reportes financieros</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
