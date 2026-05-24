const express = require('express');
const router = express.Router();
const db = require('../database/db');
const upload = require('../middlewares/upload');

// Helper para convertir rutas relativas de uploads a URLs
const getFileUrl = (req, filePath) => {
  if (!filePath) return null;
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}/${filePath.replace(/\\/g, '/')}`;
};

// =============================================================
// ENDPOINT: Autenticación de Administrador (Servidor Privado)
// =============================================================
router.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username && username.toLowerCase() === 'admin' && password === 'cphs26') {
    return res.json({ 
      success: true, 
      role: 'ADMIN', 
      token: 'cphs-secure-jwt-simulation-token-2026' 
    });
  }
  return res.status(401).json({ 
    error: 'Credenciales inválidas. Intente nuevamente.' 
  });
});

// =============================================================
// MIDDLEWARE: Control de Acceso Basado en Roles (RBAC) Seguro
// =============================================================
const authorizeRole = (allowedRole) => {
  return (req, res, next) => {
    const userRole = req.headers['x-user-role'] || 'PUBLIC';
    if (userRole !== allowedRole) {
      return res.status(403).json({ 
        error: 'Acceso Denegado: Su rol de usuario (Público/Trabajador) no tiene permisos para realizar modificaciones.' 
      });
    }
    next();
  };
};

// -------------------------------------------------------------
// 1. DASHBOARD ENDPOINTS
// -------------------------------------------------------------

router.get('/dashboard/stats', async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1; // 1-12
    const currentYear = new Date().getFullYear();

    // 1. Calcular cumplimiento del mes actual en el Plan Anual
    const monthStats = await db.get(
      `SELECT COUNT(*) as total, SUM(CASE WHEN status = 'COMPLETADO' THEN 1 ELSE 0 END) as completed 
       FROM annual_plan WHERE month = ?`, [currentMonth]
    );
    const complianceMonth = monthStats.total > 0 
      ? Math.round((monthStats.completed / monthStats.total) * 100) 
      : 0;

    // 2. Calcular cumplimiento del año acumulado (hasta el mes actual)
    const yearStats = await db.get(
      `SELECT COUNT(*) as total, SUM(CASE WHEN status = 'COMPLETADO' THEN 1 ELSE 0 END) as completed 
       FROM annual_plan WHERE month <= ?`, [currentMonth]
    );
    const complianceYear = yearStats.total > 0 
      ? Math.round((yearStats.completed / yearStats.total) * 100) 
      : 0;

    // 3. Contadores de Reuniones
    const meetingCounts = await db.query(
      `SELECT status, COUNT(*) as count FROM meetings GROUP BY status`
    );
    const meetings = { completadas: 0, pendientes: 0, atrasadas: 0 };
    meetingCounts.forEach(r => {
      if (r.status === 'COMPLETADA') meetings.completadas = r.count;
      if (r.status === 'PENDIENTE') meetings.pendientes = r.count;
      if (r.status === 'ATRASADA') meetings.atrasadas = r.count;
    });

    // 4. Contadores de Inspecciones
    const inspectionCounts = await db.query(
      `SELECT status, COUNT(*) as count FROM inspections GROUP BY status`
    );
    const inspections = { completadas: 0, pendientes: 0, atrasadas: 0 };
    inspectionCounts.forEach(r => {
      if (r.status === 'COMPLETADA') inspections.completadas = r.count;
      if (r.status === 'PENDIENTE') inspections.pendientes = r.count;
      if (r.status === 'ATRASADA') inspections.atrasadas = r.count;
    });

    // 5. Contadores de Capacitaciones
    const trainingCounts = await db.query(
      `SELECT status, COUNT(*) as count FROM trainings GROUP BY status`
    );
    const trainings = { completadas: 0, pendientes: 0, atrasadas: 0 };
    trainingCounts.forEach(r => {
      if (r.status === 'COMPLETADA') trainings.completadas = r.count;
      if (r.status === 'PENDIENTE') trainings.pendientes = r.count;
      if (r.status === 'ATRASADA') trainings.atrasadas = r.count;
    });

    // 6. Horas hombre acumuladas de formación
    const hhStats = await db.get(
      `SELECT SUM(hours * attendee_count) as total_hh FROM trainings WHERE status = 'COMPLETADA'`
    );

    res.json({
      complianceMonth,
      complianceYear,
      meetings,
      inspections,
      trainings,
      totalHoursHomme: hhStats.total_hh || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas del dashboard: ' + error.message });
  }
});

router.get('/dashboard/alerts', async (req, res) => {
  try {
    // 1. Compromisos próximos a vencer (pendientes y con fecha límite <= 15 días)
    const upcomingCommitments = await db.query(
      `SELECT c.*, m.title as meeting_title 
       FROM commitments c
       LEFT JOIN meetings m ON c.meeting_id = m.id
       WHERE c.status = 'PENDIENTE' 
       ORDER BY c.due_date ASC LIMIT 5`
    );

    // 2. Hallazgos críticos o altos abiertos
    const openCriticalFindings = await db.query(
      `SELECT f.*, i.title as inspection_title 
       FROM findings f
       LEFT JOIN inspections i ON f.inspection_id = i.id
       WHERE f.status = 'ABIERTO' AND f.risk_level IN ('CRITICO', 'ALTO')
       ORDER BY f.due_date ASC`
    );

    // 3. Tareas del plan de trabajo mensual que estén pendientes
    const currentMonth = new Date().getMonth() + 1;
    const pendingMonthTasks = await db.query(
      `SELECT * FROM annual_plan WHERE month = ? AND status = 'PENDIENTE'`, [currentMonth]
    );

    res.json({
      upcomingCommitments,
      openCriticalFindings,
      pendingMonthTasks
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener alertas: ' + error.message });
  }
});

// -------------------------------------------------------------
// 2. MÓDULO DE REUNIONES Y COMPROMISOS (PROTEGIDO POR RBAC)
// -------------------------------------------------------------

router.get('/meetings', async (req, res) => {
  try {
    const meetings = await db.query(`SELECT * FROM meetings ORDER BY date DESC`);
    const meetingsWithUrls = meetings.map(m => ({
      ...m,
      attendees: JSON.parse(m.attendees || '[]'),
      act_file_url: getFileUrl(req, m.act_file_path)
    }));
    res.json(meetingsWithUrls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/meetings/:id', async (req, res) => {
  try {
    const meeting = await db.get(`SELECT * FROM meetings WHERE id = ?`, [req.params.id]);
    if (!meeting) return res.status(404).json({ error: 'Reunión no encontrada' });

    meeting.attendees = JSON.parse(meeting.attendees || '[]');
    meeting.act_file_url = getFileUrl(req, meeting.act_file_path);

    const commitments = await db.query(`SELECT * FROM commitments WHERE meeting_id = ?`, [req.params.id]);
    
    res.json({ meeting, commitments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/meetings', authorizeRole('ADMIN'), upload.single('acta'), async (req, res) => {
  try {
    const { title, type, date, description, attendees } = req.body;
    const act_file_path = req.file ? `uploads/${req.file.filename}` : null;
    const status = act_file_path ? 'COMPLETADA' : 'PENDIENTE';

    // Insertar reunión
    const result = await db.run(
      `INSERT INTO meetings (title, type, date, description, attendees, act_file_path, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, type, date, description, attendees || JSON.stringify([]), act_file_path, status]
    );

    // Si viene en el body algún compromiso inicial, podemos parsearlo y crearlo
    if (req.body.commitments) {
      const initialCommitments = JSON.parse(req.body.commitments);
      for (const c of initialCommitments) {
        await db.run(
          `INSERT INTO commitments (meeting_id, description, responsible_name, due_date, status)
           VALUES (?, ?, ?, ?, 'PENDIENTE')`,
          [result.id, c.description, c.responsible, c.due_date]
        );
      }
    }

    res.status(201).json({ id: result.id, message: 'Reunión registrada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/meetings/:id/upload-act', authorizeRole('ADMIN'), upload.single('acta'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se ha subido ningún archivo' });
    
    const act_file_path = `uploads/${req.file.filename}`;
    await db.run(
      `UPDATE meetings SET act_file_path = ?, status = 'COMPLETADA' WHERE id = ?`,
      [act_file_path, req.params.id]
    );

    res.json({ 
      message: 'Acta cargada y reunión marcada como Completada',
      act_file_url: getFileUrl(req, act_file_path)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/meetings/:id/commitments', authorizeRole('ADMIN'), async (req, res) => {
  try {
    const { description, responsible_name, due_date } = req.body;
    const result = await db.run(
      `INSERT INTO commitments (meeting_id, description, responsible_name, due_date, status) 
       VALUES (?, ?, ?, ?, 'PENDIENTE')`,
      [req.params.id, description, responsible_name, due_date]
    );
    res.status(201).json({ id: result.id, message: 'Compromiso agregado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/commitments/:id', authorizeRole('ADMIN'), async (req, res) => {
  try {
    const { status } = req.body;
    const closed_at = status === 'COMPLETADO' ? new Date().toISOString() : null;
    
    await db.run(
      `UPDATE commitments SET status = ?, closed_at = ? WHERE id = ?`,
      [status, closed_at, req.params.id]
    );
    res.json({ message: 'Compromiso actualizado con éxito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// 3. MÓDULO DE INSPECCIONES Y HALLAZGOS (PROTEGIDO POR RBAC)
// -------------------------------------------------------------

router.get('/inspections', async (req, res) => {
  try {
    const inspections = await db.query(`SELECT * FROM inspections ORDER BY planned_date DESC`);
    const extendedInspections = [];

    for (const insp of inspections) {
      const findings = await db.query(`SELECT * FROM findings WHERE inspection_id = ?`, [insp.id]);
      const findingsWithUrls = findings.map(f => ({
        ...f,
        evidence_file_url: getFileUrl(req, f.evidence_file_path)
      }));

      extendedInspections.push({
        ...insp,
        report_file_url: getFileUrl(req, insp.report_file_path),
        findings: findingsWithUrls
      });
    }

    res.json(extendedInspections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/inspections', authorizeRole('ADMIN'), upload.single('report'), async (req, res) => {
  try {
    const { title, planned_date, conducted_date, inspector_name } = req.body;
    const report_file_path = req.file ? `uploads/${req.file.filename}` : null;
    const status = conducted_date ? 'COMPLETADA' : 'PENDIENTE';

    const result = await db.run(
      `INSERT INTO inspections (title, planned_date, conducted_date, inspector_name, report_file_path, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, planned_date, conducted_date || null, inspector_name, report_file_path, status]
    );

    res.status(201).json({ id: result.id, message: 'Inspección programada con éxito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/inspections/:id/findings', authorizeRole('ADMIN'), upload.single('evidence'), async (req, res) => {
  try {
    const { description, risk_level, due_date, corrective_measure } = req.body;
    const evidence_file_path = req.file ? `uploads/${req.file.filename}` : null;

    const result = await db.run(
      `INSERT INTO findings (inspection_id, description, risk_level, corrective_measure, due_date, status, evidence_file_path) 
       VALUES (?, ?, ?, ?, ?, 'ABIERTO', ?)`,
      [req.params.id, description, risk_level, corrective_measure, due_date, evidence_file_path]
    );

    res.status(201).json({ id: result.id, message: 'Hallazgo registrado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/findings/:id/close', authorizeRole('ADMIN'), async (req, res) => {
  try {
    const closed_at = new Date().toISOString();
    await db.run(
      `UPDATE findings SET status = 'CERRADO', closed_at = ? WHERE id = ?`,
      [closed_at, req.params.id]
    );
    res.json({ message: 'Hallazgo marcado como Cerrado con Éxito.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// 4. MÓDULO DE CAPACITACIONES Y CERTIFICADOS (PROTEGIDO POR RBAC)
// -------------------------------------------------------------

router.get('/trainings', async (req, res) => {
  try {
    const trainings = await db.query(`SELECT * FROM trainings ORDER BY planned_date DESC`);
    const extendedTrainings = [];

    for (const t of trainings) {
      const attendees = await db.query(`SELECT * FROM training_employees WHERE training_id = ?`, [t.id]);
      const attendeesWithUrls = attendees.map(a => ({
        ...a,
        certificate_file_url: getFileUrl(req, a.certificate_file_path)
      }));

      extendedTrainings.push({
        ...t,
        attendance_list_file_url: getFileUrl(req, t.attendance_list_file_path),
        photo_file_url: getFileUrl(req, t.photo_file_path),
        material_file_url: getFileUrl(req, t.material_file_path),
        attendees: attendeesWithUrls
      });
    }

    res.json(extendedTrainings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Creación de una capacitación
router.post('/trainings', authorizeRole('ADMIN'), upload.fields([
  { name: 'attendance_list', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'material', maxCount: 1 }
]), async (req, res) => {
  try {
    const { topic, planned_date, conducted_date, hours } = req.body;
    
    const attendance_list_file_path = req.files && req.files['attendance_list'] ? `uploads/${req.files['attendance_list'][0].filename}` : null;
    const photo_file_path = req.files && req.files['photo'] ? `uploads/${req.files['photo'][0].filename}` : null;
    const material_file_path = req.files && req.files['material'] ? `uploads/${req.files['material'][0].filename}` : null;
    
    const status = conducted_date ? 'COMPLETADA' : 'PENDIENTE';

    const result = await db.run(
      `INSERT INTO trainings (topic, planned_date, conducted_date, hours, status, attendance_list_file_path, photo_file_path, material_file_path) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [topic, planned_date, conducted_date || null, hours, status, attendance_list_file_path, photo_file_path, material_file_path]
    );

    res.status(201).json({ id: result.id, message: 'Capacitación registrada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Registrar un trabajador y subir su certificado de capacitación
router.post('/trainings/:id/employees', authorizeRole('ADMIN'), upload.single('certificate'), async (req, res) => {
  try {
    const { employee_name, employee_run, status } = req.body;
    const certificate_file_path = req.file ? `uploads/${req.file.filename}` : null;

    // Registrar trabajador
    await db.run(
      `INSERT INTO training_employees (training_id, employee_name, employee_run, certificate_file_path, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [req.params.id, employee_name, employee_run, certificate_file_path, status || 'APROBADO']
    );

    // Actualizar recuento de asistentes en la capacitación matriz
    await db.run(
      `UPDATE trainings SET attendee_count = (SELECT COUNT(*) FROM training_employees WHERE training_id = ?) WHERE id = ?`,
      [req.params.id, req.params.id]
    );

    res.status(201).json({ message: 'Trabajador y certificado registrados correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscador de certificados unificado
router.get('/certificates', async (req, res) => {
  try {
    const { search } = req.query;
    let queryStr = `
      SELECT te.*, t.topic as training_topic, t.conducted_date as training_date 
      FROM training_employees te
      LEFT JOIN trainings t ON te.training_id = t.id
    `;
    let params = [];

    if (search) {
      queryStr += ` WHERE te.employee_name LIKE ? OR te.employee_run LIKE ? OR t.topic LIKE ?`;
      const searchParam = `%${search}%`;
      params = [searchParam, searchParam, searchParam];
    }

    queryStr += ` ORDER BY t.conducted_date DESC`;

    const certs = await db.query(queryStr, params);
    const certsWithUrls = certs.map(c => ({
      ...c,
      certificate_file_url: getFileUrl(req, c.certificate_file_path)
    }));

    res.json(certsWithUrls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// 5. MÓDULO DE INVESTIGACIÓN DE ACCIDENTES (5 PORQUÉS - PROTEGIDO)
// -------------------------------------------------------------

router.get('/accidents', async (req, res) => {
  try {
    const accidents = await db.query(`SELECT * FROM accidents ORDER BY date DESC`);
    const parsedAccidents = accidents.map(a => ({
      ...a,
      root_cause_analysis: JSON.parse(a.root_cause_analysis || '[]'),
      corrective_measures: JSON.parse(a.corrective_measures || '[]')
    }));
    res.json(parsedAccidents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/accidents', authorizeRole('ADMIN'), async (req, res) => {
  try {
    const { employee_name, date, accident_type, description, root_cause_analysis, corrective_measures } = req.body;

    const result = await db.run(
      `INSERT INTO accidents (employee_name, date, accident_type, description, root_cause_analysis, corrective_measures, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'ABIERTO')`,
      [
        employee_name, 
        date, 
        accident_type, 
        description, 
        JSON.stringify(root_cause_analysis || []), 
        JSON.stringify(corrective_measures || [])
      ]
    );

    // Sumar este accidente al Plan Anual como una tarea de investigación realizada si aplica
    const currentMonth = new Date(date).getMonth() + 1;
    await db.run(
      `INSERT INTO annual_plan (task_name, month, type, status, responsible) 
       VALUES (?, ?, 'AUDITORIA', 'COMPLETADO', 'Comité Paritario')`,
      [`Investigación de accidente de ${employee_name}`, currentMonth]
    );

    res.status(201).json({ id: result.id, message: 'Investigación de accidente guardada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/accidents/:id/status', authorizeRole('ADMIN'), async (req, res) => {
  try {
    const { status, corrective_measures } = req.body;
    
    if (corrective_measures) {
      await db.run(
        `UPDATE accidents SET status = ?, corrective_measures = ? WHERE id = ?`,
        [status, JSON.stringify(corrective_measures), req.params.id]
      );
    } else {
      await db.run(
        `UPDATE accidents SET status = ? WHERE id = ?`,
        [status, req.params.id]
      );
    }

    res.json({ message: 'Estado de la investigación actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// 6. MÓDULO DE CRONOGRAMA ANUAL (PLAN DE TRABAJO GANTT - PROTEGIDO)
// -------------------------------------------------------------

router.get('/annual-plan', async (req, res) => {
  try {
    const plan = await db.query(`SELECT * FROM annual_plan ORDER BY month ASC, id ASC`);
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/annual-plan/:id/status', authorizeRole('ADMIN'), async (req, res) => {
  try {
    const { status } = req.body;
    await db.run(
      `UPDATE annual_plan SET status = ? WHERE id = ?`,
      [status, req.params.id]
    );
    res.json({ message: 'Estado del plan anual actualizado con éxito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
