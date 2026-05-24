const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'database.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al abrir la base de datos SQLite:', err.message);
  } else {
    console.log('Conectado exitosamente a la base de datos SQLite.');
    initDatabase();
  }
});

// Promisify database operations
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

function initDatabase() {
  db.serialize(() => {
    // 1. Tabla de Usuarios
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Tabla de Reuniones
    db.run(`
      CREATE TABLE IF NOT EXISTS meetings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        type TEXT NOT NULL, -- ORDINARIA, EXTRAORDINARIA
        date DATETIME NOT NULL,
        description TEXT,
        attendees TEXT, -- JSON string array
        act_file_path TEXT,
        status TEXT NOT NULL DEFAULT 'PENDIENTE', -- COMPLETADA, PENDIENTE, ATRASADA
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Tabla de Compromisos
    db.run(`
      CREATE TABLE IF NOT EXISTS commitments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        meeting_id INTEGER,
        description TEXT NOT NULL,
        responsible_name TEXT NOT NULL,
        due_date DATETIME NOT NULL,
        status TEXT NOT NULL DEFAULT 'PENDIENTE', -- PENDIENTE, COMPLETADO
        closed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(meeting_id) REFERENCES meetings(id) ON DELETE CASCADE
      )
    `);

    // 4. Tabla de Inspecciones
    db.run(`
      CREATE TABLE IF NOT EXISTS inspections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        planned_date DATETIME NOT NULL,
        conducted_date DATETIME,
        inspector_name TEXT NOT NULL,
        report_file_path TEXT,
        status TEXT NOT NULL DEFAULT 'PENDIENTE', -- COMPLETADA, PENDIENTE, ATRASADA
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 5. Tabla de Hallazgos
    db.run(`
      CREATE TABLE IF NOT EXISTS findings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        inspection_id INTEGER,
        description TEXT NOT NULL,
        risk_level TEXT NOT NULL, -- BAJO, MEDIO, ALTO, CRITICO
        corrective_measure TEXT NOT NULL,
        due_date DATETIME NOT NULL,
        status TEXT NOT NULL DEFAULT 'ABIERTO', -- ABIERTO, CERRADO
        evidence_file_path TEXT,
        closed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(inspection_id) REFERENCES inspections(id) ON DELETE CASCADE
      )
    `);

    // 6. Tabla de Capacitaciones
    db.run(`
      CREATE TABLE IF NOT EXISTS trainings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        topic TEXT NOT NULL,
        planned_date DATETIME NOT NULL,
        conducted_date DATETIME,
        hours INTEGER NOT NULL,
        attendee_count INTEGER DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'PENDIENTE', -- COMPLETADA, PENDIENTE, ATRASADA
        attendance_list_file_path TEXT,
        photo_file_path TEXT,
        material_file_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 7. Tabla de Acreditaciones/Certificados por Trabajador
    db.run(`
      CREATE TABLE IF NOT EXISTS training_employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        training_id INTEGER,
        employee_name TEXT NOT NULL,
        employee_run TEXT NOT NULL, -- Cédula de identidad / ID
        certificate_file_path TEXT,
        status TEXT NOT NULL DEFAULT 'APROBADO',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(training_id) REFERENCES trainings(id) ON DELETE CASCADE
      )
    `);

    // 8. Tabla de Investigación de Accidentes
    db.run(`
      CREATE TABLE IF NOT EXISTS accidents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_name TEXT NOT NULL,
        date DATETIME NOT NULL,
        accident_type TEXT NOT NULL, -- LEVE, GRAVE, FATAL
        description TEXT NOT NULL,
        root_cause_method TEXT DEFAULT '5_WHYS', -- 5_WHYS, CAUSE_TREE
        root_cause_analysis TEXT NOT NULL, -- JSON string de las preguntas/árbol
        corrective_measures TEXT NOT NULL, -- JSON string de medidas tomadas
        status TEXT NOT NULL DEFAULT 'ABIERTO', -- ABIERTO, CERRADO
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 9. Tabla de Plan de Trabajo Anual (Cronograma)
    db.run(`
      CREATE TABLE IF NOT EXISTS annual_plan (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_name TEXT NOT NULL,
        month INTEGER NOT NULL, -- 1 a 12
        type TEXT NOT NULL, -- REUNION, INSPECCION, CAPACITACION, AUDITORIA, OTRO
        status TEXT NOT NULL DEFAULT 'PENDIENTE', -- COMPLETADO, PENDIENTE, ATRASADO
        responsible TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, () => {
      // Una vez creadas las tablas, sembramos datos iniciales si están vacías
      seedData();
    });
  });
}

function seedData() {
  db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
    if (err) return;
    if (row.count > 0) {
      console.log('La base de datos ya contiene registros. Omitiendo la siembra de datos semilla.');
      return;
    }

    console.log('Sembrando datos de prueba realistas...');

    // 1. Insertar Usuario Administrador
    db.run(`
      INSERT INTO users (name, email, role, password_hash)
      VALUES ('Prevencionista CPHS', 'prevencionista@cphs.cl', 'ADMIN', 'admin123')
    `);

    // 2. Insertar Reuniones (Ordinarias de Ene, Feb, Mar, Abr, May)
    const meetings = [
      { id: 1, title: 'Constitución del Comité Paritario 2026', type: 'EXTRAORDINARIA', date: '2026-01-15 10:00:00', description: 'Reunión inicial para constituir los cargos del comité, asignar presidente y secretario, y establecer el cronograma anual.', attendees: JSON.stringify(['Juan Pérez', 'María Gómez', 'Pedro Silva', 'Ana López', 'Prevencionista CPHS']), act_file_path: 'uploads/acta_constitucion_2026.pdf', status: 'COMPLETADA' },
      { id: 2, title: 'Reunión Ordinaria Mensual - Febrero', type: 'ORDINARIA', date: '2026-02-18 15:00:00', description: 'Revisión del plan de trabajo anual y aprobación del cronograma de inspecciones de terreno.', attendees: JSON.stringify(['Juan Pérez', 'María Gómez', 'Ana López', 'Prevencionista CPHS']), act_file_path: 'uploads/acta_febrero_2026.pdf', status: 'COMPLETADA' },
      { id: 3, title: 'Reunión Ordinaria Mensual - Marzo', type: 'ORDINARIA', date: '2026-03-18 15:00:00', description: 'Análisis del resultado de la capacitación de extintores y revisión de hallazgos en talleres.', attendees: JSON.stringify(['Juan Pérez', 'María Gómez', 'Pedro Silva', 'Ana López', 'Prevencionista CPHS']), act_file_path: 'uploads/acta_marzo_2026.pdf', status: 'COMPLETADA' },
      { id: 4, title: 'Reunión Ordinaria Mensual - Abril', type: 'ORDINARIA', date: '2026-04-15 15:00:00', description: 'Análisis del accidente leve ocurrido en bodega y seguimiento del plan de acción correctivo de los 5 Porqués.', attendees: JSON.stringify(['Juan Pérez', 'María Gómez', 'Pedro Silva', 'Prevencionista CPHS']), act_file_path: 'uploads/acta_abril_2026.pdf', status: 'COMPLETADA' },
      { id: 5, title: 'Reunión Ordinaria Mensual - Mayo', type: 'ORDINARIA', date: '2026-05-13 15:00:00', description: 'Coordinación de la capacitación de primeros auxilios y revisión de estado de hallazgos críticos.', attendees: JSON.stringify(['Juan Pérez', 'María Gómez', 'Pedro Silva', 'Ana López', 'Prevencionista CPHS']), act_file_path: null, status: 'COMPLETADA' },
      { id: 6, title: 'Reunión Ordinaria Mensual - Junio', type: 'ORDINARIA', date: '2026-06-17 15:00:00', description: 'Coordinación del simulacro general y evaluación de EPP en bodegas de despacho.', attendees: JSON.stringify([]), act_file_path: null, status: 'PENDIENTE' }
    ];

    meetings.forEach(m => {
      db.run(`INSERT INTO meetings (id, title, type, date, description, attendees, act_file_path, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [m.id, m.title, m.type, m.date, m.description, m.attendees, m.act_file_path, m.status]);
    });

    // 3. Insertar Compromisos asociados a las reuniones
    const commitments = [
      { id: 1, meeting_id: 1, description: 'Presentar el Acta de Constitución a la Inspección del Trabajo', responsible_name: 'María Gómez', due_date: '2026-01-30 18:00:00', status: 'COMPLETADO', closed_at: '2026-01-25 10:00:00' },
      { id: 2, meeting_id: 2, description: 'Diseñar la lista de verificación para la inspección de extintores', responsible_name: 'Pedro Silva', due_date: '2026-02-28 18:00:00', status: 'COMPLETADO', closed_at: '2026-02-26 12:00:00' },
      { id: 3, meeting_id: 3, description: 'Gestionar recargas de los 4 extintores vencidos detectados en Taller', responsible_name: 'Juan Pérez', due_date: '2026-03-31 18:00:00', status: 'COMPLETADO', closed_at: '2026-03-29 16:30:00' },
      { id: 4, meeting_id: 4, description: 'Comprar e instalar el resguardo de seguridad en la sierra de banco', responsible_name: 'Pedro Silva', due_date: '2026-04-30 18:00:00', status: 'COMPLETADO', closed_at: '2026-04-28 11:00:00' },
      { id: 5, meeting_id: 4, description: 'Dictar charla sobre cultura de reporte preventivo de incidentes', responsible_name: 'Prevencionista CPHS', due_date: '2026-05-15 18:00:00', status: 'COMPLETADO', closed_at: '2026-05-12 10:00:00' },
      { id: 6, meeting_id: 5, description: 'Coordinar con la Mutual de Seguridad el temario del curso de Primeros Auxilios', responsible_name: 'María Gómez', due_date: '2026-05-30 18:00:00', status: 'PENDIENTE', closed_at: null },
      { id: 7, meeting_id: 5, description: 'Elaborar el informe trimestral de accidentabilidad del CPHS', responsible_name: 'Prevencionista CPHS', due_date: '2026-06-10 18:00:00', status: 'PENDIENTE', closed_at: null }
    ];

    commitments.forEach(c => {
      db.run(`INSERT INTO commitments (id, meeting_id, description, responsible_name, due_date, status, closed_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [c.id, c.meeting_id, c.description, c.responsible_name, c.due_date, c.status, c.closed_at]);
    });

    // 4. Insertar Inspecciones
    const inspections = [
      { id: 1, title: 'Inspección de Extintores y Red Húmeda - Zona Talleres', planned_date: '2026-03-10 09:00:00', conducted_date: '2026-03-10 11:30:00', inspector_name: 'Pedro Silva', report_file_path: 'uploads/informe_inspeccion_extintores.pdf', status: 'COMPLETADA' },
      { id: 2, title: 'Inspección de EPP - Bodegas de Despacho y Almacén', planned_date: '2026-04-12 10:00:00', conducted_date: '2026-04-12 12:00:00', inspector_name: 'Juan Pérez', report_file_path: 'uploads/informe_inspeccion_epp.pdf', status: 'COMPLETADA' },
      { id: 3, title: 'Inspección General de Instalaciones Eléctricas', planned_date: '2026-05-10 14:00:00', conducted_date: '2026-05-10 16:30:00', inspector_name: 'Prevencionista CPHS', report_file_path: null, status: 'COMPLETADA' },
      { id: 4, title: 'Inspección Mensual programada - Ergonomía en Oficinas', planned_date: '2026-06-15 10:00:00', conducted_date: null, inspector_name: 'Ana López', report_file_path: null, status: 'PENDIENTE' }
    ];

    inspections.forEach(i => {
      db.run(`INSERT INTO inspections (id, title, planned_date, conducted_date, inspector_name, report_file_path, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [i.id, i.title, i.planned_date, i.conducted_date, i.inspector_name, i.report_file_path, i.status]);
    });

    // 5. Insertar Hallazgos
    const findings = [
      { id: 1, inspection_id: 1, description: 'Extintor N° 4 en Taller Mecánico se encuentra vencido y sin presión.', risk_level: 'ALTO', corrective_measure: 'Recargar el extintor y colocar sello de inspección vigente.', due_date: '2026-03-20 18:00:00', status: 'CERRADO', evidence_file_path: 'uploads/evidencia_extintor_vencido.jpg', closed_at: '2026-03-19 14:00:00' },
      { id: 2, inspection_id: 1, description: 'Gabinete de red húmeda obstruido por cajas plásticas de herramientas.', risk_level: 'MEDIO', corrective_measure: 'Despejar el área de acceso a la red húmeda e instruir a los operarios.', due_date: '2026-03-15 18:00:00', status: 'CERRADO', evidence_file_path: null, closed_at: '2026-03-11 09:30:00' },
      { id: 3, inspection_id: 2, description: 'Operario de apiladora opera en pasillo principal sin zapatos de seguridad.', risk_level: 'CRITICO', corrective_measure: 'Entrega inmediata de calzado y amonestación preventiva según RIOHS.', due_date: '2026-04-13 18:00:00', status: 'CERRADO', evidence_file_path: 'uploads/evidencia_falta_zapatos.jpg', closed_at: '2026-04-12 11:30:00' },
      { id: 4, inspection_id: 3, description: 'Tablero eléctrico auxiliar de mantención con cables expuestos sin tapa de protección.', risk_level: 'CRITICO', corrective_measure: 'Instalar acrílico de aislamiento y tapa metálica del gabinete eléctrico.', due_date: '2026-05-18 18:00:00', status: 'ABIERTO', evidence_file_path: 'uploads/evidencia_tablero_expuesto.jpg', closed_at: null },
      { id: 5, inspection_id: 3, description: 'Falta señalización de salida de emergencia en pasillo del sector B.', risk_level: 'BAJO', corrective_measure: 'Adquirir y fijar letrero fotoluminiscente de evacuación.', due_date: '2026-05-30 18:00:00', status: 'ABIERTO', evidence_file_path: null, closed_at: null }
    ];

    findings.forEach(f => {
      db.run(`INSERT INTO findings (id, inspection_id, description, risk_level, corrective_measure, due_date, status, evidence_file_path, closed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [f.id, f.inspection_id, f.description, f.risk_level, f.corrective_measure, f.due_date, f.status, f.evidence_file_path, f.closed_at]);
    });

    // 6. Insertar Capacitaciones
    const trainings = [
      { id: 1, topic: 'USO DE EXTINTORES', planned_date: '2026-03-25 15:00:00', conducted_date: '2026-03-25 17:00:00', hours: 2, attendee_count: 42, status: 'COMPLETADA', attendance_list_file_path: 'uploads/lista_extintores_2026.pdf', photo_file_path: 'uploads/difusion_extintores.jpg', material_file_path: 'uploads/manual_extintores.pdf' },
      { id: 2, topic: 'PLAN DE EMERGENCIA VP', planned_date: '2026-04-18 09:00:00', conducted_date: '2026-04-18 13:00:00', hours: 4, attendee_count: 20, status: 'COMPLETADA', attendance_list_file_path: 'uploads/lista_emergencia_2026.pdf', photo_file_path: 'uploads/difusion_emergencia.jpg', material_file_path: null },
      { id: 3, topic: 'CURSO HOMBRE NUEVO', planned_date: '2026-05-20 08:30:00', conducted_date: '2026-05-20 16:30:00', hours: 8, attendee_count: 20, status: 'COMPLETADA', attendance_list_file_path: 'uploads/lista_hombre_nuevo.pdf', photo_file_path: null, material_file_path: null },
      { id: 4, topic: 'REGLAMENTO DE TRANSITO VP', planned_date: '2026-06-22 14:00:00', conducted_date: null, hours: 2, attendee_count: 0, status: 'PENDIENTE', attendance_list_file_path: null, photo_file_path: null, material_file_path: null }
    ];

    trainings.forEach(t => {
      db.run(`INSERT INTO trainings (id, topic, planned_date, conducted_date, hours, attendee_count, status, attendance_list_file_path, photo_file_path, material_file_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [t.id, t.topic, t.planned_date, t.conducted_date, t.hours, t.attendee_count, t.status, t.attendance_list_file_path, t.photo_file_path, t.material_file_path]);
    });

    // 7. Insertar Acreditaciones / Certificados individuales de Trabajadores
    const workersList = [
      { run: '17.912.080-1', name: 'Raúl Eduardo Canumán' },
      { run: '13.308.510-6', name: 'Raúl Humberto Marquez' },
      { run: '8.889.729-3', name: 'Roberto Hernan Soto' },
      { run: '13.343.487-9', name: 'Gonzalo Javier Jara' },
      { run: '11.939.077-k', name: 'Jose Antonio Lazo' },
      { run: '16.450.297-k', name: 'Victor Manuel Gahona' },
      { run: '15.053.206-k', name: 'Jaime Guillermo Ledezma' },
      { run: '10.177.916-5', name: 'Sergio Hernan Rodriguez' },
      { run: '16.552.066-1', name: 'Cristian Antonio Valdivia' },
      { run: '13.668.078-1', name: 'Alvaro Gabriel Zuñiga' },
      { run: '24.709.674-4', name: 'Jorge Eduardo Padilla' },
      { run: '18.506.539-1', name: 'Christian Vladimir Nuñez' },
      { run: '24.520.937-1', name: 'Fernando Callata' },
      { run: '15.062.226-3', name: 'Augusto Patricio Garrido' },
      { run: '20.285.671-3', name: 'Vicente Joaquin Perez' },
      { run: '18.512.091-0', name: 'Jaime Esteban Olivares' },
      { run: '12.527.718-7', name: 'Marcelo David Sepulveda' },
      { run: '10.780.852-3', name: 'Nadia Katherine Mora' },
      { run: '15.166.603-5', name: 'Franco Antonio Cerda' },
      { run: '24.275.965-6', name: 'Everth Lazcano' },
      { run: '17.363.534-6', name: 'Cristian Sebastián Muñoz' },
      { run: '25.574.995-1', name: 'Marco Antonio Hurtado' },
      { run: '25.999.182-k', name: 'Maria Mercedes Diaz' },
      { run: '17.161.426-0', name: 'Mario Andres Ruz' },
      { run: '13.431.732-9', name: 'Rene Patricio Carvajal' },
      { run: '20.260.272-k', name: 'Brandon Lukas Fernandez' },
      { run: '15.596.126-0', name: 'Wilson Marcelo Diaz' },
      { run: '18.483.076-0', name: 'Camila Belen Nava' },
      { run: '8.942.885-8', name: 'Luis Alejandro Lillo' },
      { run: '20.093.748-1', name: 'Kevin Yerko Quispe' },
      { run: '20.428.316-8', name: 'Hector Yusseff Missene' },
      { run: '20.947.050-0', name: 'David Andres Diaz' },
      { run: '21.151.926-6', name: 'Diego Andres Salgado' },
      { run: '20.212.924-2', name: 'Andrés Sebastian Miranda' },
      { run: '19.204.801-k', name: 'Javiera Macarena Marañado' },
      { run: '25.203.659-8', name: 'Maiker Huarachi' },
      { run: '17.422.196-0', name: 'Fabian Andres Soto' },
      { run: '26.432.139-5', name: 'Maria Alejandra Perez' },
      { run: '13.776.212-9', name: 'Marlen Andrea Silva' },
      { run: '18.754.714-8', name: 'Paola Tatiana Zepeda' },
      { run: '15.166.505-5', name: 'Lucas Brian Pizarro' },
      { run: '19.505.005-8', name: 'Brian Sebastian Araya' }
    ];

    workersList.forEach((w, idx) => {
      // Todos hacen Uso de Extintores
      db.run(`INSERT INTO training_employees (training_id, employee_name, employee_run, certificate_file_path, status) VALUES (?, ?, ?, ?, ?)`,
        [1, w.name, w.run, 'uploads/cert_extintores.pdf', 'APROBADO']);

      // Los primeros 20 hacen Plan de Emergencia
      if (idx < 20) {
        db.run(`INSERT INTO training_employees (training_id, employee_name, employee_run, certificate_file_path, status) VALUES (?, ?, ?, ?, ?)`,
          [2, w.name, w.run, 'uploads/cert_emergencia.pdf', 'APROBADO']);
      }

      // Los siguientes 20 hacen Hombre Nuevo
      if (idx >= 20 && idx < 40) {
        db.run(`INSERT INTO training_employees (training_id, employee_name, employee_run, certificate_file_path, status) VALUES (?, ?, ?, ?, ?)`,
          [3, w.name, w.run, 'uploads/cert_hombre_nuevo.pdf', 'APROBADO']);
      }
    });

    // 8. Insertar Accidentes (Investigación - 5 Porqués)
    const accidents = [
      {
        id: 1,
        employee_name: 'Juan Pérez',
        date: '2026-04-14 10:15:00',
        accident_type: 'LEVE',
        description: 'El operario sufrió un corte profundo en la palma de la mano izquierda mientras operaba la sierra de banco del taller mecánico, al intentar retirar una pieza de madera excedente.',
        root_cause_method: '5_WHYS',
        root_cause_analysis: JSON.stringify([
          '¿Por qué se cortó la mano? Porque entró en contacto directo con el disco de sierra en rotación.',
          '¿Por qué hizo contacto directo? Porque intentó remover madera residual sin detener la máquina y sin usar empujador.',
          '¿Por qué no detuvo la máquina ni usó empujador? Porque quería agilizar la tarea y la máquina no poseía la guarda de protección.',
          '¿Por qué no poseía la guarda de protección? Porque se fracturó la semana anterior y el equipo no fue bloqueado ni etiquetado.',
          '¿Por qué no se bloqueó ni se reportó el daño? Porque no se realizó la inspección pre-operacional diaria ni existe una cultura arraigada de detención de tareas inseguras.'
        ]),
        corrective_measures: JSON.stringify([
          { measure: 'Diseñar y fabricar protector acrílico y empujador plástico para sierra', due_date: '2026-04-20', status: 'COMPLETADA', date_closed: '2026-04-18' },
          { measure: 'Implementar lista de chequeo pre-operacional para equipos del taller', due_date: '2026-04-25', status: 'COMPLETADA', date_closed: '2026-04-24' },
          { measure: 'Realizar capacitación flash a operarios sobre Bloqueo y Etiquetado (LOTO)', due_date: '2026-04-30', status: 'COMPLETADA', date_closed: '2026-04-28' }
        ]),
        status: 'CERRADO'
      }
    ];

    accidents.forEach(a => {
      db.run(`INSERT INTO accidents (id, employee_name, date, accident_type, description, root_cause_method, root_cause_analysis, corrective_measures, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [a.id, a.employee_name, a.date, a.accident_type, a.description, a.root_cause_method, a.root_cause_analysis, a.corrective_measures, a.status]);
    });

    // 9. Insertar Cronograma Anual
    const plan = [
      { task_name: 'Constitución Legal del CPHS 2026', month: 1, type: 'REUNION', status: 'COMPLETADO', responsible: 'Gerente General' },
      { task_name: 'Planificación e inicio de cronograma de trabajo anual', month: 2, type: 'OTRO', status: 'COMPLETADO', responsible: 'Prevencionista CPHS' },
      { task_name: 'Reunión Ordinaria Mensual - Febrero', month: 2, type: 'REUNION', status: 'COMPLETADO', responsible: 'Secretario CPHS' },
      { task_name: 'Inspección de Extintores y Red Húmeda - Zona Talleres', month: 3, type: 'INSPECCION', status: 'COMPLETADO', responsible: 'Pedro Silva' },
      { task_name: 'Capacitación: Uso y Manejo de Extintores', month: 3, type: 'CAPACITACION', status: 'COMPLETADO', responsible: 'Prevencionista CPHS' },
      { task_name: 'Reunión Ordinaria Mensual - Marzo', month: 3, type: 'REUNION', status: 'COMPLETADO', responsible: 'Secretario CPHS' },
      { task_name: 'Inspección de EPP - Bodegas de Despacho', month: 4, type: 'INSPECCION', status: 'COMPLETADO', responsible: 'Juan Pérez' },
      { task_name: 'Reunión Ordinaria Mensual - Abril', month: 4, type: 'REUNION', status: 'COMPLETADO', responsible: 'Secretario CPHS' },
      { task_name: 'Inspección de Instalaciones Eléctricas de la Planta', month: 5, type: 'INSPECCION', status: 'COMPLETADO', responsible: 'Prevencionista CPHS' },
      { task_name: 'Capacitación: Curso RCP y Primeros Auxilios', month: 5, type: 'CAPACITACION', status: 'COMPLETADO', responsible: 'María Gómez' },
      { task_name: 'Reunión Ordinaria Mensual - Mayo', month: 5, type: 'REUNION', status: 'COMPLETADO', responsible: 'Secretario CPHS' },
      { task_name: 'Inspección de Ergonomía y Puestos de Trabajo', month: 6, type: 'INSPECCION', status: 'PENDIENTE', responsible: 'Ana López' },
      { task_name: 'Reunión Ordinaria Mensual - Junio', month: 6, type: 'REUNION', status: 'PENDIENTE', responsible: 'Secretario CPHS' },
      { task_name: 'Reunión Ordinaria Mensual - Julio', month: 7, type: 'REUNION', status: 'PENDIENTE', responsible: 'Secretario CPHS' },
      { task_name: 'Capacitación: Ergonomía e Higiene Postural', month: 8, type: 'CAPACITACION', status: 'PENDIENTE', responsible: 'Prevencionista CPHS' },
      { task_name: 'Reunión Ordinaria Mensual - Agosto', month: 8, type: 'REUNION', status: 'PENDIENTE', responsible: 'Secretario CPHS' },
      { task_name: 'Reunión Ordinaria Mensual - Septiembre', month: 9, type: 'REUNION', status: 'PENDIENTE', responsible: 'Secretario CPHS' },
      { task_name: 'Simulacro General de Evacuación por Incendio', month: 10, type: 'AUDITORIA', status: 'PENDIENTE', responsible: 'Comité Paritario Completo' },
      { task_name: 'Reunión Ordinaria Mensual - Octubre', month: 10, type: 'REUNION', status: 'PENDIENTE', responsible: 'Secretario CPHS' },
      { task_name: 'Inspección de Terreno y Sustancias Químicas', month: 11, type: 'INSPECCION', status: 'PENDIENTE', responsible: 'Ana López' },
      { task_name: 'Reunión Ordinaria Mensual - Noviembre', month: 11, type: 'REUNION', status: 'PENDIENTE', responsible: 'Secretario CPHS' },
      { task_name: 'Evaluación Anual de Desempeño y Cumplimiento', month: 12, type: 'AUDITORIA', status: 'PENDIENTE', responsible: 'Presidente CPHS' },
      { task_name: 'Reunión Ordinaria Mensual - Diciembre', month: 12, type: 'REUNION', status: 'PENDIENTE', responsible: 'Secretario CPHS' }
    ];

    plan.forEach(p => {
      db.run(`INSERT INTO annual_plan (task_name, month, type, status, responsible) VALUES (?, ?, ?, ?, ?)`,
        [p.task_name, p.month, p.type, p.status, p.responsible]);
    });

    console.log('Base de datos SQLite sembrada exitosamente con datos reglamentarios.');
  });
}

module.exports = {
  db,
  query,
  run,
  get
};
