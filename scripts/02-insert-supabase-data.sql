-- Insertar datos iniciales del sistema en Supabase

-- Insertar roles del sistema
INSERT INTO roles (nombre_rol, permisos_json) VALUES
('root', '{"usuarios": {"crear": true, "leer": true, "actualizar": true, "eliminar": true}, "citas": {"crear": true, "leer": true, "actualizar": true, "eliminar": true}, "pacientes": {"crear": true, "leer": true, "actualizar": true, "eliminar": true}, "bitacora": {"leer": true}, "configuracion": {"leer": true, "actualizar": true}}'),
('recepcion', '{"citas": {"crear": true, "leer": true, "actualizar": true, "eliminar": true}, "pacientes": {"crear": true, "leer": true, "actualizar": true, "eliminar": false}, "agenda": {"leer": true}}'),
('doctor', '{"citas": {"leer": true, "actualizar": true}, "pacientes": {"leer": true}, "registros_atencion": {"crear": true, "leer": true, "actualizar": true}}'),
('fisioterapeuta', '{"citas": {"leer": true, "actualizar": true}, "pacientes": {"leer": true}, "registros_atencion": {"crear": true, "leer": true, "actualizar": true}}')
ON CONFLICT (nombre_rol) DO NOTHING;

-- Obtener IDs de roles para insertar usuarios
DO $$
DECLARE
    role_root_id UUID;
    role_recepcion_id UUID;
    role_doctor_id UUID;
    role_fisio_id UUID;
    user_admin_id UUID;
    user_recepcion_id UUID;
    user_doctor_id UUID;
    user_fisio_id UUID;
BEGIN
    -- Obtener IDs de roles
    SELECT id INTO role_root_id FROM roles WHERE nombre_rol = 'root';
    SELECT id INTO role_recepcion_id FROM roles WHERE nombre_rol = 'recepcion';
    SELECT id INTO role_doctor_id FROM roles WHERE nombre_rol = 'doctor';
    SELECT id INTO role_fisio_id FROM roles WHERE nombre_rol = 'fisioterapeuta';

    -- Insertar usuarios
    INSERT INTO usuarios (nombre_usuario, password_hash, email, id_rol) VALUES
    ('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9S2', 'admin@centrosalud.com', role_root_id),
    ('recepcion', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9S2', 'recepcion@centrosalud.com', role_recepcion_id),
    ('doctor', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9S2', 'doctor@centrosalud.com', role_doctor_id),
    ('fisio', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9S2', 'fisio@centrosalud.com', role_fisio_id)
    ON CONFLICT (nombre_usuario) DO NOTHING;

    -- Obtener IDs de usuarios para profesionales
    SELECT id INTO user_doctor_id FROM usuarios WHERE nombre_usuario = 'doctor';
    SELECT id INTO user_fisio_id FROM usuarios WHERE nombre_usuario = 'fisio';

    -- Insertar profesionales
    INSERT INTO profesionales (id_usuario, tipo_profesional, especialidad, licencia_medica) VALUES
    (user_doctor_id, 'doctor', 'Medicina General', 'MED-12345'),
    (user_fisio_id, 'fisioterapeuta', 'Fisioterapia Deportiva', 'FISIO-67890')
    ON CONFLICT DO NOTHING;
END $$;

-- Insertar recursos físicos
INSERT INTO recursos_fisicos (nombre_recurso, tipo_recurso, capacidad_simultanea) VALUES
('Consultorio 1', 'consultorio', 1),
('Consultorio 2', 'consultorio', 1),
('Consultorio 3', 'consultorio', 1),
('Área de Procedimiento', 'area_procedimiento', 1),
('Camilla Fisioterapia 1', 'camilla_fisioterapia', 1),
('Camilla Fisioterapia 2', 'camilla_fisioterapia', 1),
('Camilla Fisioterapia 3', 'camilla_fisioterapia', 1),
('Camilla Fisioterapia 4', 'camilla_fisioterapia', 1),
('Camilla Fisioterapia 5', 'camilla_fisioterapia', 1),
('Camilla Fisioterapia 6', 'camilla_fisioterapia', 1),
('Camilla Fisioterapia 7', 'camilla_fisioterapia', 1)
ON CONFLICT DO NOTHING;

-- Insertar tipos de servicio
INSERT INTO tipos_servicio (nombre_servicio, descripcion, tipo_recurso_asociado, duracion_estandar_minutos, precio_base) VALUES
('Consulta General', 'Consulta médica general', 'consultorio', 30, 50.00),
('Consulta Especializada', 'Consulta médica especializada', 'consultorio', 45, 80.00),
('Procedimiento Menor', 'Procedimiento médico menor', 'area_procedimiento', 60, 120.00),
('Sesión de Fisioterapia', 'Sesión de fisioterapia individual', 'camilla_fisioterapia', 45, 40.00),
('Terapia Grupal', 'Sesión de fisioterapia grupal', 'camilla_fisioterapia', 60, 30.00)
ON CONFLICT DO NOTHING;

-- Insertar algunos pacientes de ejemplo
INSERT INTO pacientes (nombre, apellido, dni, fecha_nacimiento, telefono, email) VALUES
('María', 'González', '12345678', '1985-03-15', '0414-1234567', 'maria.gonzalez@email.com'),
('Carlos', 'Rodríguez', '87654321', '1978-07-22', '0424-7654321', 'carlos.rodriguez@email.com'),
('Ana', 'Martínez', '11223344', '1992-11-08', '0412-1122334', 'ana.martinez@email.com'),
('Luis', 'Pérez', '55667788', '1980-12-03', '0426-5566778', 'luis.perez@email.com'),
('Carmen', 'López', '99887766', '1975-09-18', '0414-9988776', 'carmen.lopez@email.com')
ON CONFLICT (dni) DO NOTHING;
