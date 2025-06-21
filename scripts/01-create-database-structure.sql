-- Crear la estructura completa de la base de datos para el Sistema de Gestión de Citas

-- Tabla de Roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE,
    permisos_json JSONB NOT NULL,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    id_rol INTEGER REFERENCES roles(id),
    activo BOOLEAN DEFAULT true,
    ultimo_acceso TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Pacientes
CREATE TABLE pacientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(20) NOT NULL UNIQUE,
    fecha_nacimiento DATE NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(255),
    direccion TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT true
);

-- Tabla de Profesionales
CREATE TABLE profesionales (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuarios(id),
    tipo_profesional VARCHAR(50) NOT NULL, -- 'doctor', 'fisioterapeuta'
    especialidad VARCHAR(100),
    licencia_medica VARCHAR(50),
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Horarios de Profesionales
CREATE TABLE horarios_profesional (
    id SERIAL PRIMARY KEY,
    id_profesional INTEGER REFERENCES profesionales(id),
    dia_semana INTEGER NOT NULL, -- 0=Domingo, 1=Lunes, etc.
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    duracion_descanso_minutos INTEGER DEFAULT 0,
    activo BOOLEAN DEFAULT true
);

-- Tabla de Recursos Físicos
CREATE TABLE recursos_fisicos (
    id SERIAL PRIMARY KEY,
    nombre_recurso VARCHAR(100) NOT NULL,
    tipo_recurso VARCHAR(50) NOT NULL, -- 'consultorio', 'area_procedimiento', 'camilla_fisioterapia'
    capacidad_simultanea INTEGER DEFAULT 1,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Tipos de Servicio
CREATE TABLE tipos_servicio (
    id SERIAL PRIMARY KEY,
    nombre_servicio VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo_recurso_asociado VARCHAR(50) NOT NULL,
    duracion_estandar_minutos INTEGER NOT NULL,
    precio_base DECIMAL(10,2) DEFAULT 0.00,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Citas
CREATE TABLE citas (
    id SERIAL PRIMARY KEY,
    id_paciente INTEGER REFERENCES pacientes(id),
    id_profesional INTEGER REFERENCES profesionales(id),
    id_tipo_servicio INTEGER REFERENCES tipos_servicio(id),
    id_recurso_fisico INTEGER REFERENCES recursos_fisicos(id),
    fecha_hora_inicio TIMESTAMP NOT NULL,
    duracion_minutos_real INTEGER NOT NULL,
    fecha_hora_fin TIMESTAMP NOT NULL,
    estado VARCHAR(50) DEFAULT 'programada', -- 'programada', 'en_curso', 'completada', 'cancelada', 'reprogramada'
    creado_por_usuario_id INTEGER REFERENCES usuarios(id),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_modificacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_modificacion_por_usuario_id INTEGER REFERENCES usuarios(id),
    monto_facturar_calculado DECIMAL(10,2),
    id_factura_externa VARCHAR(100),
    notas_cita TEXT
);

-- Tabla de Registros de Atención
CREATE TABLE registros_atencion (
    id SERIAL PRIMARY KEY,
    id_cita INTEGER REFERENCES citas(id),
    id_paciente INTEGER REFERENCES pacientes(id),
    id_profesional INTEGER REFERENCES profesionales(id),
    fecha_hora_atencion TIMESTAMP NOT NULL,
    tipo_registro VARCHAR(50) NOT NULL, -- 'consulta', 'procedimiento', 'fisioterapia'
    notas_observaciones TEXT,
    escala_eva INTEGER CHECK (escala_eva >= 0 AND escala_eva <= 10),
    diagnostico TEXT,
    tratamiento TEXT,
    recomendaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creado_por_usuario_id INTEGER REFERENCES usuarios(id)
);

-- Tabla de Bitácora de Actividad
CREATE TABLE bitacora_actividad (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuarios(id),
    fecha_hora_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo_accion VARCHAR(100) NOT NULL,
    entidad_afectada VARCHAR(100) NOT NULL,
    id_entidad_afectada INTEGER NOT NULL,
    detalles_cambio_json JSONB,
    ip_address INET,
    user_agent TEXT
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_citas_fecha_hora ON citas(fecha_hora_inicio);
CREATE INDEX idx_citas_profesional ON citas(id_profesional);
CREATE INDEX idx_citas_paciente ON citas(id_paciente);
CREATE INDEX idx_citas_estado ON citas(estado);
CREATE INDEX idx_bitacora_fecha ON bitacora_actividad(fecha_hora_accion);
CREATE INDEX idx_bitacora_usuario ON bitacora_actividad(id_usuario);
CREATE INDEX idx_registros_paciente ON registros_atencion(id_paciente);
