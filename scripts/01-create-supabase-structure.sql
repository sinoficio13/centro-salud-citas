-- Crear la estructura completa de la base de datos para Supabase

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de Roles
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_rol VARCHAR(50) NOT NULL UNIQUE,
    permisos_json JSONB NOT NULL,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_usuario VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    id_rol UUID REFERENCES roles(id),
    activo BOOLEAN DEFAULT true,
    ultimo_acceso TIMESTAMP WITH TIME ZONE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Pacientes
CREATE TABLE IF NOT EXISTS pacientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(20) NOT NULL UNIQUE,
    fecha_nacimiento DATE NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(255),
    direccion TEXT,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    activo BOOLEAN DEFAULT true
);

-- Tabla de Profesionales
CREATE TABLE IF NOT EXISTS profesionales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_usuario UUID REFERENCES usuarios(id),
    tipo_profesional VARCHAR(50) NOT NULL, -- 'doctor', 'fisioterapeuta'
    especialidad VARCHAR(100),
    licencia_medica VARCHAR(50),
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Horarios de Profesionales
CREATE TABLE IF NOT EXISTS horarios_profesional (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_profesional UUID REFERENCES profesionales(id),
    dia_semana INTEGER NOT NULL, -- 0=Domingo, 1=Lunes, etc.
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    duracion_descanso_minutos INTEGER DEFAULT 0,
    activo BOOLEAN DEFAULT true
);

-- Tabla de Recursos Físicos
CREATE TABLE IF NOT EXISTS recursos_fisicos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_recurso VARCHAR(100) NOT NULL,
    tipo_recurso VARCHAR(50) NOT NULL, -- 'consultorio', 'area_procedimiento', 'camilla_fisioterapia'
    capacidad_simultanea INTEGER DEFAULT 1,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Tipos de Servicio
CREATE TABLE IF NOT EXISTS tipos_servicio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_servicio VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo_recurso_asociado VARCHAR(50) NOT NULL,
    duracion_estandar_minutos INTEGER NOT NULL,
    precio_base DECIMAL(10,2) DEFAULT 0.00,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Citas
CREATE TABLE IF NOT EXISTS citas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_paciente UUID REFERENCES pacientes(id),
    id_profesional UUID REFERENCES profesionales(id),
    id_tipo_servicio UUID REFERENCES tipos_servicio(id),
    id_recurso_fisico UUID REFERENCES recursos_fisicos(id),
    fecha_hora_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    duracion_minutos_real INTEGER NOT NULL,
    fecha_hora_fin TIMESTAMP WITH TIME ZONE NOT NULL,
    estado VARCHAR(50) DEFAULT 'programada', -- 'programada', 'en_curso', 'completada', 'cancelada', 'reprogramada'
    creado_por_usuario_id UUID REFERENCES usuarios(id),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ultima_modificacion_fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ultima_modificacion_por_usuario_id UUID REFERENCES usuarios(id),
    monto_facturar_calculado DECIMAL(10,2),
    id_factura_externa VARCHAR(100),
    notas_cita TEXT
);

-- Tabla de Registros de Atención
CREATE TABLE IF NOT EXISTS registros_atencion (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_cita UUID REFERENCES citas(id),
    id_paciente UUID REFERENCES pacientes(id),
    id_profesional UUID REFERENCES profesionales(id),
    fecha_hora_atencion TIMESTAMP WITH TIME ZONE NOT NULL,
    tipo_registro VARCHAR(50) NOT NULL, -- 'consulta', 'procedimiento', 'fisioterapia'
    notas_observaciones TEXT,
    escala_eva INTEGER CHECK (escala_eva >= 0 AND escala_eva <= 10),
    diagnostico TEXT,
    tratamiento TEXT,
    recomendaciones TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    creado_por_usuario_id UUID REFERENCES usuarios(id)
);

-- Tabla de Bitácora de Actividad
CREATE TABLE IF NOT EXISTS bitacora_actividad (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_usuario UUID REFERENCES usuarios(id),
    fecha_hora_accion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tipo_accion VARCHAR(100) NOT NULL,
    entidad_afectada VARCHAR(100) NOT NULL,
    id_entidad_afectada UUID NOT NULL,
    detalles_cambio_json JSONB,
    ip_address INET,
    user_agent TEXT
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_citas_fecha_hora ON citas(fecha_hora_inicio);
CREATE INDEX IF NOT EXISTS idx_citas_profesional ON citas(id_profesional);
CREATE INDEX IF NOT EXISTS idx_citas_paciente ON citas(id_paciente);
CREATE INDEX IF NOT EXISTS idx_citas_estado ON citas(estado);
CREATE INDEX IF NOT EXISTS idx_bitacora_fecha ON bitacora_actividad(fecha_hora_accion);
CREATE INDEX IF NOT EXISTS idx_bitacora_usuario ON bitacora_actividad(id_usuario);
CREATE INDEX IF NOT EXISTS idx_registros_paciente ON registros_atencion(id_paciente);

-- Habilitar Row Level Security (RLS)
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profesionales ENABLE ROW LEVEL SECURITY;
ALTER TABLE horarios_profesional ENABLE ROW LEVEL SECURITY;
ALTER TABLE recursos_fisicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tipos_servicio ENABLE ROW LEVEL SECURITY;
ALTER TABLE citas ENABLE ROW LEVEL SECURITY;
ALTER TABLE registros_atencion ENABLE ROW LEVEL SECURITY;
ALTER TABLE bitacora_actividad ENABLE ROW LEVEL SECURITY;

-- Políticas básicas de RLS (permitir todo por ahora, se pueden refinar después)
CREATE POLICY "Allow all operations" ON roles FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON usuarios FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON pacientes FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON profesionales FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON horarios_profesional FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON recursos_fisicos FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON tipos_servicio FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON citas FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON registros_atencion FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON bitacora_actividad FOR ALL USING (true);
