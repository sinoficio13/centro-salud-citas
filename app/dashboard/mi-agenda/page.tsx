"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, Activity } from "lucide-react"
import Link from "next/link"

export default function MiAgendaPage() {
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
          <Heart className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mi Agenda - Doctor</h1>
            <p className="text-gray-600">Ver mis citas programadas y registrar atenciones</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-6 w-6" />
              <span>Módulo en Desarrollo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Este módulo permitirá a los doctores gestionar su agenda personal y registrar atenciones.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• Vista de citas programadas</p>
              <p>• Registro de notas clínicas</p>
              <p>• Escala EVA y diagnósticos</p>
              <p>• Historial de pacientes</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
