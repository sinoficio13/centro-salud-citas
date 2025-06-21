# 🏥 Centro de Salud - Sistema de Gestión de Citas

Sistema integral para la gestión de citas médicas y fisioterapia con Supabase.

## 🌟 Características

- ✅ **Autenticación real** con Supabase
- ✅ **Base de datos en la nube** 
- ✅ **Gestión de citas** con drag & drop
- ✅ **Múltiples roles** (Admin, Recepción, Doctor, Fisioterapeuta)
- ✅ **Agenda visual** por semanas
- ✅ **Bitácora de auditoría**
- ✅ **Responsive design**

## 🚀 Demo en Vivo

🔗 **[Ver Demo](https://tu-app.vercel.app)**

## 👥 Usuarios de Prueba

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin` | `admin123` | Administrador |
| `recepcion` | `recepcion123` | Recepción |
| `doctor` | `doctor123` | Doctor |
| `fisio` | `fisio123` | Fisioterapeuta |

## 🛠️ Tecnologías

- **Frontend:** Next.js 15, React 19, TypeScript
- **UI:** Tailwind CSS, Radix UI, Lucide Icons
- **Backend:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth + bcrypt
- **Despliegue:** Vercel

## 📦 Instalación Local

\`\`\`bash
# Clonar repositorio
git clone https://github.com/tu-usuario/centro-salud-citas.git
cd centro-salud-citas

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Iniciar servidor de desarrollo
npm run dev
\`\`\`

## ⚙️ Variables de Entorno

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
\`\`\`

## 🗄️ Base de Datos

La base de datos se configura automáticamente en Supabase con:
- Tablas de usuarios, pacientes, citas, recursos
- Datos de ejemplo
- Políticas de seguridad RLS
- Índices optimizados

## 📱 Funcionalidades por Rol

### 👑 Administrador
- Gestión completa de usuarios
- Configuración del sistema
- Bitácora de auditoría
- Acceso a todos los módulos

### 📋 Recepción
- Gestión de citas
- Registro de pacientes
- Vista de agenda general

### 👨‍⚕️ Doctor
- Mi agenda personal
- Registros de atención
- Historiales clínicos

### 🏃‍♂️ Fisioterapeuta
- Agenda de fisioterapia
- Gestión de hasta 3 pacientes simultáneos
- Escala EVA y seguimiento

## 🔧 Desarrollo

\`\`\`bash
# Modo desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar en producción
npm start

# Linting
npm run lint
\`\`\`

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles.
