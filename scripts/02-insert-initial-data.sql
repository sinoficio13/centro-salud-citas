-- Insertar datos iniciales del sistema

-- Insertar roles del sistema
INSERT INTO roles (nombre_rol, permisos_json) VALUES
('root', '{"usuarios": {"crear": true, "leer": true, "actualizar": true, "eliminar": true}, "citas": {"crear": true, "leer": true, "actualizar": true, "eliminar": true}, "pacientes": {"crear": true, "leer": true, "actualizar": true, "eliminar": true}, "bitacora": {"leer": true}, "configuracion": {"leer": true, "actualizar": true}}'),
('recepcion', '{"citas": {"crear": true, "leer": true, "actualizar": true, "eliminar": true}, "pacientes": {"crear": true, "leer": true, "actualizar": true, "eliminar": false}, "agenda": {"leer": true}}'),
('doctor', '{"citas": {"leer": true, "actualizar": true}, "pacientes": {"leer": true}, "registros_atencion": {"crear": true, "leer": true, "actualizar": true}}'),
('fisioterapeuta', '{"citas": {"leer": true, "actualizar": true}, "pacientes": {"leer": true}, "registros_atencion": {"crear": true, "leer": true, "actualizar": true}}');

-- Insertar usuario root inicial
INSERT INTO usuarios (nombre_usuario, password_hash, email, id_rol) VALUES
('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9S2', 'admin@centrosalud.com', 1); -- password: admin123

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
('Camilla Fisioterapia 7', 'camilla_fisioterapia', 1);

-- Insertar tipos de servicio
INSERT INTO tipos_servicio (nombre_servicio, descripcion, tipo_recurso_asociado, duracion_estandar_minutos, precio_base) VALUES
('Consulta General', 'Consulta médica general', 'consultorio', 30, 50.00),
('Consulta Especializada', 'Consulta médica especializada', 'consultorio', 45, 80.00),
('Procedimiento Menor', 'Procedimiento médico menor', 'area_procedimiento', 60, 120.00),
('Sesión de Fisioterapia', 'Sesión de fisioterapia individual', 'camilla_fisioterapia', 45, 40.00),
('Terapia Grupal', 'Sesión de fisioterapia grupal', 'camilla_fisioterapia', 60, 30.00);

-- Insertar algunos pacientes de ejemplo
INSERT INTO pacientes (nombre, apellido, dni, fecha_nacimiento, telefono, email) VALUES
('María', 'González', '12345678', '1985-03-15', '0414-1234567', 'maria.gonzalez@email.com'),
('Carlos', 'Rodríguez', '87654321', '1978-07-22', '0424-7654321', 'carlos.rodriguez@email.com'),
('Ana', 'Martínez', '11223344', '1992-11-08', '0412-1122334', 'ana.martinez@email.com');
