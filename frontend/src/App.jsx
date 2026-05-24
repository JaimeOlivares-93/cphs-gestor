import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  Calendar, 
  ClipboardList, 
  GraduationCap, 
  FileCheck, 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  Plus, 
  Search, 
  Download, 
  FileText, 
  Camera, 
  Check, 
  X, 
  Award,
  ChevronRight,
  Eye,
  Lock,
  Edit,
  ArrowLeft,
  LogOut
} from 'lucide-react';
import { supabase } from './supabaseClient';

const REAL_WORKERS = [
  { run: '17.912.080-1', name: 'Raúl Eduardo', lastName: 'Canumán' },
  { run: '13.308.510-6', name: 'Raúl Humberto', lastName: 'Marquez' },
  { run: '8.889.729-3', name: 'Roberto Hernan', lastName: 'Soto' },
  { run: '13.343.487-9', name: 'Gonzalo Javier', lastName: 'Jara' },
  { run: '11.939.077-k', name: 'Jose Antonio', lastName: 'Lazo' },
  { run: '16.450.297-k', name: 'Victor Manuel', lastName: 'Gahona' },
  { run: '15.053.206-k', name: 'Jaime Guillermo', lastName: 'Ledezma' },
  { run: '10.177.916-5', name: 'Sergio Hernan', lastName: 'Rodriguez' },
  { run: '16.552.066-1', name: 'Cristian Antonio', lastName: 'Valdivia' },
  { run: '13.668.078-1', name: 'Alvaro Gabriel', lastName: 'Zuñiga' },
  { run: '24.709.674-4', name: 'Jorge Eduardo', lastName: 'Padilla' },
  { run: '18.506.539-1', name: 'Christian Vladimir', lastName: 'Nuñez' },
  { run: '24.520.937-1', name: 'Fernando', lastName: 'Callata' },
  { run: '15.062.226-3', name: 'Augusto Patricio', lastName: 'Garrido' },
  { run: '20.285.671-3', name: 'Vicente Joaquin', lastName: 'Perez' },
  { run: '18.512.091-0', name: 'Jaime Esteban', lastName: 'Olivares' },
  { run: '12.527.718-7', name: 'Marcelo David', lastName: 'Sepulveda' },
  { run: '10.780.852-3', name: 'Nadia Katherine', lastName: 'Mora' },
  { run: '15.166.603-5', name: 'Franco Antonio', lastName: 'Cerda' },
  { run: '24.275.965-6', name: 'Everth', lastName: 'Lazcano' },
  { run: '17.363.534-6', name: 'Cristian Sebastián', lastName: 'Muñoz' },
  { run: '25.574.995-1', name: 'Marco Antonio', lastName: 'Hurtado' },
  { run: '25.999.182-k', name: 'Maria Mercedes', lastName: 'Diaz' },
  { run: '17.161.426-0', name: 'Mario Andres', lastName: 'Ruz' },
  { run: '13.431.732-9', name: 'Rene Patricio', lastName: 'Carvajal' },
  { run: '20.260.272-k', name: 'Brandon Lukas', lastName: 'Fernandez' },
  { run: '15.596.126-0', name: 'Wilson Marcelo', lastName: 'Diaz' },
  { run: '18.483.076-0', name: 'Camila Belen', lastName: 'Nava' },
  { run: '8.942.885-8', name: 'Luis Alejandro', lastName: 'Lillo' },
  { run: '20.093.748-1', name: 'Kevin Yerko', lastName: 'Quispe' },
  { run: '20.428.316-8', name: 'Hector Yusseff', lastName: 'Missene' },
  { run: '20.947.050-0', name: 'David Andres', lastName: 'Diaz' },
  { run: '21.151.926-6', name: 'Diego Andres', lastName: 'Salgado' },
  { run: '20.212.924-2', name: 'Andrés Sebastian', lastName: 'Miranda' },
  { run: '19.204.801-k', name: 'Javiera Macarena', lastName: 'Marañado' },
  { run: '25.203.659-8', name: 'Maiker', lastName: 'Huarachi' },
  { run: '17.422.196-0', name: 'Fabian Andres', lastName: 'Soto' },
  { run: '26.432.139-5', name: 'Maria Alejandra', lastName: 'Perez' },
  { run: '13.776.212-9', name: 'Marlen Andrea', lastName: 'Silva' },
  { run: '18.754.714-8', name: 'Paola Tatiana', lastName: 'Zepeda' },
  { run: '15.166.505-5', name: 'Lucas Brian', lastName: 'Pizarro' },
  { run: '19.505.005-8', name: 'Brian Sebastian', lastName: 'Araya' }
];

const generatedCertificates = [];
let certId = 1;
REAL_WORKERS.forEach((w, idx) => {
  const fullName = `${w.name} ${w.lastName}`;
  
  // Todos hacen el curso de Extintores
  generatedCertificates.push({
    id: certId++,
    training_id: 1,
    employee_name: fullName,
    employee_run: w.run,
    certificate_file_path: 'mock_cert_extintores.pdf',
    status: 'APROBADO',
    training_topic: 'USO DE EXTINTORES',
    training_date: '2026-03-25'
  });

  // Los primeros 20 hacen Plan de Emergencia
  if (idx < 20) {
    generatedCertificates.push({
      id: certId++,
      training_id: 2,
      employee_name: fullName,
      employee_run: w.run,
      certificate_file_path: 'mock_cert_emergencia.pdf',
      status: 'APROBADO',
      training_topic: 'PLAN DE EMERGENCIA VP',
      training_date: '2026-04-18'
    });
  }

  // Los siguientes 20 hacen Hombre Nuevo
  if (idx >= 20 && idx < 40) {
    generatedCertificates.push({
      id: certId++,
      training_id: 3,
      employee_name: fullName,
      employee_run: w.run,
      certificate_file_path: 'mock_cert_hombre_nuevo.pdf',
      status: 'APROBADO',
      training_topic: 'CURSO HOMBRE NUEVO',
      training_date: '2026-05-20'
    });
  }
});

const INITIAL_SEED_DATA = {
  meetings: [
    { id: 1, title: 'Constitución del Comité Paritario 2026', type: 'EXTRAORDINARIA', date: '2026-01-15', description: 'Reunión inicial para constituir los cargos del comité, asignar presidente y secretario, y establecer el cronograma anual.', attendees: ['Juan Pérez', 'María Gómez', 'Pedro Silva', 'Ana López', 'Prevencionista CPHS'], act_file_path: 'mock_acta_constitucion.pdf', status: 'COMPLETADA' },
    { id: 2, title: 'Reunión Ordinaria Mensual - Febrero', type: 'ORDINARIA', date: '2026-02-18', description: 'Revisión del plan de trabajo anual y aprobación del cronograma de inspecciones de terreno.', attendees: ['Juan Pérez', 'María Gómez', 'Ana López', 'Prevencionista CPHS'], act_file_path: 'mock_acta_febrero.pdf', status: 'COMPLETADA' },
    { id: 3, title: 'Reunión Ordinaria Mensual - Marzo', type: 'ORDINARIA', date: '2026-03-18', description: 'Análisis del resultado de la capacitación de extintores y revisión de hallazgos en talleres.', attendees: ['Juan Pérez', 'María Gómez', 'Pedro Silva', 'Ana López', 'Prevencionista CPHS'], act_file_path: 'mock_acta_marzo.pdf', status: 'COMPLETADA' },
    { id: 4, title: 'Reunión Ordinaria Mensual - Abril', type: 'ORDINARIA', date: '2026-04-15', description: 'Análisis del accidente leve ocurrido en bodega y seguimiento del plan de acción correctivo de los 5 Porqués.', attendees: ['Juan Pérez', 'María Gómez', 'Pedro Silva', 'Prevencionista CPHS'], act_file_path: 'mock_acta_abril.pdf', status: 'COMPLETADA' },
    { id: 5, title: 'Reunión Ordinaria Mensual - Mayo', type: 'ORDINARIA', date: '2026-05-13', description: 'Coordinación de la capacitación de primeros auxilios y revisión de estado de hallazgos críticos.', attendees: ['Juan Pérez', 'María Gómez', 'Pedro Silva', 'Ana López', 'Prevencionista CPHS'], act_file_path: null, status: 'COMPLETADA' },
    { id: 6, title: 'Reunión Ordinaria Mensual - Junio', type: 'ORDINARIA', date: '2026-06-17', description: 'Coordinación del simulacro general y evaluación de EPP en bodegas de despacho.', attendees: [], act_file_path: null, status: 'PENDIENTE' }
  ],
  commitments: [
    { id: 1, meeting_id: 1, description: 'Presentar el Acta de Constitución a la Inspección del Trabajo', responsible_name: 'María Gómez', due_date: '2026-01-30', status: 'COMPLETADO', closed_at: '2026-01-25' },
    { id: 2, meeting_id: 2, description: 'Diseñar la lista de verificación para la inspección de extintores', responsible_name: 'Pedro Silva', due_date: '2026-02-28', status: 'COMPLETADO', closed_at: '2026-02-26' },
    { id: 3, meeting_id: 3, description: 'Gestionar recargas de los 4 extintores vencidos detectados en Taller', responsible_name: 'Juan Pérez', due_date: '2026-03-31', status: 'COMPLETADO', closed_at: '2026-03-29' },
    { id: 4, meeting_id: 4, description: 'Comprar e instalar el resguardo de seguridad en la sierra de banco', responsible_name: 'Pedro Silva', due_date: '2026-04-30', status: 'COMPLETADO', closed_at: '2026-04-28' },
    { id: 5, meeting_id: 4, description: 'Dictar charla sobre cultura de reporte preventivo de incidentes', responsible_name: 'Prevencionista CPHS', due_date: '2026-05-15', status: 'COMPLETADO', closed_at: '2026-05-12' },
    { id: 6, meeting_id: 5, description: 'Coordinar con la Mutual de Seguridad el temario del curso de Primeros Auxilios', responsible_name: 'María Gómez', due_date: '2026-05-30', status: 'PENDIENTE', closed_at: null },
    { id: 7, meeting_id: 5, description: 'Elaborar el informe trimestral de accidentabilidad del CPHS', responsible_name: 'Prevencionista CPHS', due_date: '2026-06-10', status: 'PENDIENTE', closed_at: null }
  ],
  inspections: [
    { id: 1, title: 'Inspección de Extintores y Red Húmeda - Zona Talleres', planned_date: '2026-03-10', conducted_date: '2026-03-10', inspector_name: 'Pedro Silva', report_file_path: 'mock_informe_extintores.pdf', status: 'COMPLETADA' },
    { id: 2, title: 'Inspección de EPP - Bodegas de Despacho y Almacén', planned_date: '2026-04-12', conducted_date: '2026-04-12', inspector_name: 'Juan Pérez', report_file_path: 'mock_informe_epp.pdf', status: 'COMPLETADA' },
    { id: 3, title: 'Inspección General de Instalaciones Eléctricas', planned_date: '2026-05-10', conducted_date: '2026-05-10', inspector_name: 'Prevencionista CPHS', report_file_path: null, status: 'COMPLETADA' },
    { id: 4, title: 'Inspección Mensual programada - Ergonomía en Oficinas', planned_date: '2026-06-15', conducted_date: null, inspector_name: 'Ana López', report_file_path: null, status: 'PENDIENTE' }
  ],
  findings: [
    { id: 1, inspection_id: 1, description: 'Extintor N° 4 en Taller Mecánico se encuentra vencido y sin presión.', risk_level: 'ALTO', corrective_measure: 'Recargar el extintor y colocar sello de inspección vigente.', due_date: '2026-03-20', status: 'CERRADO', evidence_file_path: 'mock_extintor.png', closed_at: '2026-03-19' },
    { id: 2, inspection_id: 1, description: 'Gabinete de red húmeda obstruido por cajas plásticas de herramientas.', risk_level: 'MEDIO', corrective_measure: 'Despejar el área de acceso a la red húmeda e instruir a los operarios.', due_date: '2026-03-15', status: 'CERRADO', evidence_file_path: null, closed_at: '2026-03-11' },
    { id: 3, inspection_id: 2, description: 'Operario de apiladora opera en pasillo principal sin zapatos de seguridad.', risk_level: 'CRITICO', corrective_measure: 'Entrega inmediata de calzado y amonestación preventiva según RIOHS.', due_date: '2026-04-13', status: 'CERRADO', evidence_file_path: 'mock_zapatos.png', closed_at: '2026-04-12' },
    { id: 4, inspection_id: 3, description: 'Tablero eléctrico auxiliar de mantención con cables expuestos sin tapa de protección.', risk_level: 'CRITICO', corrective_measure: 'Instalar acrílico de aislamiento y tapa metálica del gabinete eléctrico.', due_date: '2026-05-18', status: 'ABIERTO', evidence_file_path: 'mock_tablero.png', closed_at: null },
    { id: 5, inspection_id: 3, description: 'Falta señalización de salida de emergencia en pasillo del sector B.', risk_level: 'BAJO', corrective_measure: 'Adquirir y fijar letrero fotoluminiscente de evacuación.', due_date: '2026-05-30', status: 'ABIERTO', evidence_file_path: null, closed_at: null }
  ],
  trainings: [
    { id: 1, topic: 'USO DE EXTINTORES', category: 'SEGURIDAD', planned_date: '2026-03-25', conducted_date: '2026-03-25', hours: 2, attendee_count: 42, status: 'COMPLETADA', attendance_list_file_path: 'mock_lista_ext.pdf', photo_file_path: 'mock_foto_ext.jpg', material_file_path: 'mock_manual_ext.pdf' },
    { id: 2, topic: 'PLAN DE EMERGENCIA VP', category: 'SEGURIDAD', planned_date: '2026-04-18', conducted_date: '2026-04-18', hours: 4, attendee_count: 20, status: 'COMPLETADA', attendance_list_file_path: 'mock_lista_rcp.pdf', photo_file_path: 'mock_foto_rcp.jpg', material_file_path: null },
    { id: 3, topic: 'CURSO HOMBRE NUEVO', category: 'NORMATIVA', planned_date: '2026-05-20', conducted_date: '2026-05-20', hours: 8, attendee_count: 20, status: 'COMPLETADA', attendance_list_file_path: 'mock_lista_hombre_nuevo.pdf', photo_file_path: null, material_file_path: null },
    { id: 4, topic: 'REGLAMENTO DE TRANSITO VP', category: 'NORMATIVA', planned_date: '2026-06-22', conducted_date: null, hours: 2, attendee_count: 0, status: 'PENDIENTE', attendance_list_file_path: null, photo_file_path: null, material_file_path: null }
  ],
  training_employees: generatedCertificates,
  accidents: [
    {
      id: 1,
      employee_name: 'Juan Pérez',
      date: '2026-04-14 10:15',
      accident_type: 'LEVE',
      description: 'El operario sufrió un corte profundo en la palma de la mano izquierda mientras operaba la sierra de banco del taller mecánico, al intentar retirar una pieza de madera excedente.',
      root_cause_method: '5_WHYS',
      root_cause_analysis: [
        '¿Por qué se cortó la mano? Porque entró en contacto directo con el disco de sierra en rotación.',
        '¿Por qué hizo contacto directo? Porque intentó remover madera residual sin detener la máquina y sin usar empujador.',
        '¿Por qué no detuvo la máquina ni usó empujador? Porque quería agilizar la tarea y la máquina no poseía la guarda de protección.',
        '¿Por qué no poseía la guarda de protección? Porque se fracturó la semana anterior y el equipo no fue bloqueado ni etiquetado.',
        '¿Por qué no se bloqueó ni se reportó el daño? Porque no se realizó la inspección pre-operacional diaria ni existe una cultura arraigada de detención de tareas inseguras.'
      ],
      corrective_measures: [
        { measure: 'Diseñar y fabricar protector acrílico y empujador plástico para sierra', due_date: '2026-04-20', status: 'COMPLETADA', date_closed: '2026-04-18' },
        { measure: 'Implementar lista de chequeo pre-operacional para equipos del taller', due_date: '2026-04-25', status: 'COMPLETADA', date_closed: '2026-04-24' },
        { measure: 'Realizar capacitación flash a operarios sobre Bloqueo y Etiquetado (LOTO)', due_date: '2026-04-30', status: 'COMPLETADA', date_closed: '2026-04-28' }
      ],
      status: 'CERRADO'
    }
  ],
  annual_plan: [
    { id: 1, task_name: 'Constitución Legal del CPHS 2026', month: 1, type: 'REUNION', status: 'COMPLETADO', responsible: 'Gerente General' },
    { id: 2, task_name: 'Planificación e inicio de cronograma de trabajo anual', month: 2, type: 'OTRO', status: 'COMPLETADO', responsible: 'Prevencionista CPHS' },
    { id: 3, task_name: 'Reunión Ordinaria Mensual - Febrero', month: 2, type: 'REUNION', status: 'COMPLETADO', responsible: 'Secretario CPHS' },
    { id: 4, task_name: 'Inspección de Extintores y Red Húmeda - Zona Talleres', month: 3, type: 'INSPECCION', status: 'COMPLETADO', responsible: 'Pedro Silva' },
    { id: 5, task_name: 'Capacitación: Uso y Manejo de Extintores', month: 3, type: 'CAPACITACION', status: 'COMPLETADO', responsible: 'Prevencionista CPHS' },
    { id: 6, task_name: 'Reunión Ordinaria Mensual - Marzo', month: 3, type: 'REUNION', status: 'COMPLETADO', responsible: 'Secretario CPHS' },
    { id: 7, task_name: 'Inspección de EPP - Bodegas de Despacho', month: 4, type: 'INSPECCION', status: 'COMPLETADO', responsible: 'Juan Pérez' },
    { id: 8, task_name: 'Reunión Ordinaria Mensual - Abril', month: 4, type: 'REUNION', status: 'COMPLETADO', responsible: 'Secretario CPHS' },
    { id: 9, task_name: 'Inspección de Instalaciones Eléctricas de la Planta', month: 5, type: 'INSPECCION', status: 'COMPLETADO', responsible: 'Prevencionista CPHS' },
    { id: 10, task_name: 'Capacitación: Curso RCP y Primeros Auxilios', month: 5, type: 'CAPACITACION', status: 'COMPLETADO', responsible: 'María Gómez' },
    { id: 11, task_name: 'Reunión Ordinaria Mensual - Mayo', month: 5, type: 'REUNION', status: 'COMPLETADO', responsible: 'Secretario CPHS' },
    { id: 12, task_name: 'Inspección de Ergonomía y Puestos de Trabajo', month: 6, type: 'INSPECCION', status: 'PENDIENTE', responsible: 'Ana López' },
    { id: 13, task_name: 'Reunión Ordinaria Mensual - Junio', month: 6, type: 'REUNION', status: 'PENDIENTE', responsible: 'Secretario CPHS' },
    { id: 14, task_name: 'Reunión Ordinaria Mensual - Julio', month: 7, type: 'REUNION', status: 'PENDIENTE', responsible: 'Secretario CPHS' },
    { id: 15, task_name: 'Capacitación: Ergonomía e Higiene Postural', month: 8, type: 'CAPACITACION', status: 'PENDIENTE', responsible: 'Prevencionista CPHS' },
    { id: 16, task_name: 'Reunión Ordinaria Mensual - Agosto', month: 8, type: 'REUNION', status: 'PENDIENTE', responsible: 'Secretario CPHS' },
    { id: 17, task_name: 'Reunión Ordinaria Mensual - Septiembre', month: 9, type: 'REUNION', status: 'PENDIENTE', responsible: 'Secretario CPHS' },
    { id: 18, task_name: 'Simulacro General de Evacuación por Incendio', month: 10, type: 'AUDITORIA', status: 'PENDIENTE', responsible: 'Comité Paritario' },
    { id: 19, task_name: 'Reunión Ordinaria Mensual - Octubre', month: 10, type: 'REUNION', status: 'PENDIENTE', responsible: 'Secretario CPHS' },
    { id: 20, task_name: 'Inspección de Terreno y Sustancias Químicas', month: 11, type: 'INSPECCION', status: 'PENDIENTE', responsible: 'Ana López' },
    { id: 21, task_name: 'Reunión Ordinaria Mensual - Noviembre', month: 11, type: 'REUNION', status: 'PENDIENTE', responsible: 'Secretario CPHS' },
    { id: 22, task_name: 'Evaluación Anual de Desempeño y Cumplimiento', month: 12, type: 'AUDITORIA', status: 'PENDIENTE', responsible: 'Presidente CPHS' },
    { id: 23, task_name: 'Reunión Ordinaria Mensual - Diciembre', month: 12, type: 'REUNION', status: 'PENDIENTE', responsible: 'Secretario CPHS' }
  ]
};

const BASE_API_URL = 'http://localhost:5000/api';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [apiMode, setApiMode] = useState(false);
  const [cloudMode, setCloudMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // NUEVO: Enrutamiento Principal Condicional (Welcome Portal)
  // ==========================================
  const [currentScreen, setCurrentScreen] = useState(() => {
    const cached = localStorage.getItem('cphs_screen_production_v4');
    return cached || 'welcome'; // 'welcome' o 'app'
  });

  useEffect(() => {
    localStorage.setItem('cphs_screen_production_v4', currentScreen);
  }, [currentScreen]);

  // ==========================================
  // NUEVO: Control de Acceso Basado en Roles (RBAC)
  // ==========================================
  const [userRole, setUserRole] = useState(() => {
    const cached = localStorage.getItem('cphs_role_production_v4');
    return cached || 'PUBLIC'; 
  });

  useEffect(() => {
    localStorage.setItem('cphs_role_production_v4', userRole);
  }, [userRole]);

  // ==========================================
  // NUEVO: Estados del Portal de Acceso (Login)
  // ==========================================
  const [loginUser, setLoginUser] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ==========================================
  // NUEVO: Trabajador del Mes
  // ==========================================
  const [workerOfMonth, setWorkerOfMonth] = useState(() => {
    const cached = localStorage.getItem('cphs_prod_worker_month_v4');
    if (cached) return JSON.parse(cached);
    return {
      name: 'Carlos Mendoza',
      role: 'Operario de Bodega y Despacho',
      reason: 'Reportó diligentemente 12 condiciones de riesgo y mantuvo asistencia del 100% en charlas de seguridad de EPP en el Taller.',
      avatar: 'C'
    };
  });

  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [workerForm, setWorkerForm] = useState({ name: workerOfMonth.name, role: workerOfMonth.role, reason: workerOfMonth.reason });

  useEffect(() => {
    localStorage.setItem('cphs_prod_worker_month_v4', JSON.stringify(workerOfMonth));
  }, [workerOfMonth]);

  const handleSaveWorkerOfMonth = (e) => {
    e.preventDefault();
    const updated = {
      name: workerForm.name,
      role: workerForm.role,
      reason: workerForm.reason,
      avatar: workerForm.name ? workerForm.name.charAt(0).toUpperCase() : 'W'
    };
    setWorkerOfMonth(updated);
    setShowWorkerModal(false);
  };

  // Entities States
  const [meetings, setMeetings] = useState([]);
  const [commitments, setCommitments] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [findings, setFindings] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [accidents, setAccidents] = useState([]);
  const [annualPlan, setAnnualPlan] = useState([]);

  // Search / Selection states
  const [certSearchQuery, setCertSearchQuery] = useState('');
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [selectedAccident, setSelectedAccident] = useState(null);
  const [activeCertificatePdf, setActiveCertificatePdf] = useState(null);

  // Filter states for trainings
  const [trainingCategoryFilter, setTrainingCategoryFilter] = useState('ALL');

  // Modal / Form trigger states
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [showFindingModal, setShowFindingModal] = useState(false);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [showAttendeeModal, setShowAttendeeModal] = useState(false);
  const [showAccidentModal, setShowAccidentModal] = useState(false);

  // File path Base64 states (for simulation fallback)
  const [meetingFileBase64, setMeetingFileBase64] = useState(null);
  const [findingFileBase64, setFindingFileBase64] = useState(null);

  // Raw file objects for API Multipart Upload
  const [meetingRawFile, setMeetingRawFile] = useState(null);
  const [findingRawFile, setFindingRawFile] = useState(null);

  // Form Fields State
  const [meetingForm, setMeetingForm] = useState({ title: '', type: 'ORDINARIA', date: '', description: '', attendees: '' });
  const [inspectionForm, setInspectionForm] = useState({ title: '', planned_date: '', conducted_date: '', inspector_name: '' });
  const [findingForm, setFindingForm] = useState({ description: '', risk_level: 'MEDIO', due_date: '', corrective_measure: '' });
  const [trainingForm, setTrainingForm] = useState({ topic: '', category: 'SEGURIDAD', planned_date: '', conducted_date: '', hours: 1 });
  const [attendeeForm, setAttendeeForm] = useState({ employee_name: '', employee_run: '', status: 'APROBADO' });
  const [accidentForm, setAccidentForm] = useState({
    employee_name: '', date: '', accident_type: 'LEVE', description: '',
    why1: '', why2: '', why3: '', why4: '', why5: '',
    measure1: '', measure1Date: '', measure2: '', measure2Date: ''
  });

  // Common Headers for request signing (RBAC integration)
  const getRequestHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'x-user-role': userRole
    };
  };

  const getMultipartHeaders = () => {
    return {
      'x-user-role': userRole
    };
  };

  // ==========================================
  // NUEVO: Manejadores de Autenticación y Logout
  // ==========================================
  const handlePublicIngress = () => {
    setUserRole('PUBLIC');
    setCurrentScreen('app');
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const response = await fetch(`${BASE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: loginUser,
          password: loginPassword
        })
      });

      if (response.ok) {
        const data = await response.json();
        setUserRole(data.role || 'ADMIN');
        setCurrentScreen('app');
        setLoginUser('');
        setLoginPassword('');
      } else {
        const errData = await response.json();
        setLoginError(errData.error || 'Credenciales inválidas. Verifique el usuario y la contraseña.');
      }
    } catch (err) {
      console.warn('Fallo de conexión al backend. Usando autenticación de respaldo local.', err);
      // Simular retardo de red de 600ms para realismo premium
      await new Promise(resolve => setTimeout(resolve, 600));
      const encodedPassword = btoa(loginPassword);
      if (loginUser.toLowerCase() === 'admin' && encodedPassword === 'Y3BoczI2') {
        setUserRole('ADMIN');
        setCurrentScreen('app');
        setLoginUser('');
        setLoginPassword('');
      } else {
        setLoginError('Credenciales inválidas. Verifique el usuario y la contraseña.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentScreen('welcome');
    setUserRole('PUBLIC');
    setSelectedMeeting(null);
    setSelectedInspection(null);
    setSelectedTraining(null);
    setSelectedAccident(null);
  };

  // INITIAL DATA SYNC
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        if (supabase) {
          setCloudMode(true);
          setApiMode(true);

          // Fetch all tables from Supabase
          const [resMeet, resInsp, resTrain, resAcc, resPlan, resCert] = await Promise.all([
            supabase.from('meetings').select('*').order('date', { ascending: false }),
            supabase.from('inspections').select('*, findings(*)').order('planned_date', { ascending: false }),
            supabase.from('trainings').select('*').order('planned_date', { ascending: false }),
            supabase.from('accidents').select('*').order('date', { ascending: false }),
            supabase.from('annual_plan').select('*').order('month', { ascending: true }),
            supabase.from('training_employees').select('*').order('created_at', { ascending: false })
          ]);

          if (resMeet.error) throw resMeet.error;
          if (resInsp.error) throw resInsp.error;
          if (resTrain.error) throw resTrain.error;
          if (resAcc.error) throw resAcc.error;
          if (resPlan.error) throw resPlan.error;
          if (resCert.error) throw resCert.error;

          // Parse JSON fields in meetings (attendees) if NoSQL-like or string
          const parsedMeetings = (resMeet.data || []).map(m => ({
            ...m,
            attendees: typeof m.attendees === 'string' ? JSON.parse(m.attendees) : (m.attendees || [])
          }));
          setMeetings(parsedMeetings);

          // Get commitments associated with meetings
          const { data: resComs, error: comError } = await supabase.from('commitments').select('*').order('due_date', { ascending: true });
          if (comError) throw comError;
          setCommitments(resComs || []);

          // Process inspections & findings
          setInspections(resInsp.data || []);
          let allFindings = [];
          (resInsp.data || []).forEach(insp => {
            if (insp.findings) {
              allFindings = [...allFindings, ...insp.findings];
            }
          });
          setFindings(allFindings);

          // Process trainings
          setTrainings(resTrain.data || []);

          // Process accidents
          const parsedAccidents = (resAcc.data || []).map(a => ({
            ...a,
            root_cause_analysis: typeof a.root_cause_analysis === 'string' ? JSON.parse(a.root_cause_analysis) : (a.root_cause_analysis || []),
            corrective_measures: typeof a.corrective_measures === 'string' ? JSON.parse(a.corrective_measures) : (a.corrective_measures || [])
          }));
          setAccidents(parsedAccidents);

          // Process annual plan
          setAnnualPlan(resPlan.data || []);

          // Process certificates
          const parsedCerts = (resCert.data || []).map(c => {
            const trainingMat = (resTrain.data || []).find(t => t.id === c.training_id);
            return {
              ...c,
              training_topic: trainingMat ? trainingMat.topic : 'Capacitación',
              training_date: trainingMat?.conducted_date ? trainingMat.conducted_date.split('T')[0] : ''
            };
          });
          setCertificates(parsedCerts || []);
          
          return;
        }

        // Si no hay Supabase, intentar conectar a la API Express local tradicional
        const testRes = await fetch(`${BASE_API_URL}/dashboard/stats`);
        if (testRes.ok) {
          const [resMeet, resInsp, resTrain, resAcc, resPlan, resCert] = await Promise.all([
            fetch(`${BASE_API_URL}/meetings`),
            fetch(`${BASE_API_URL}/inspections`),
            fetch(`${BASE_API_URL}/trainings`),
            fetch(`${BASE_API_URL}/accidents`),
            fetch(`${BASE_API_URL}/annual-plan`),
            fetch(`${BASE_API_URL}/certificates`)
          ]);

          setMeetings(await resMeet.json());
          setInspections(await resInsp.json());
          setTrainings(await resTrain.json());
          setAccidents(await resAcc.json());
          setAnnualPlan(await resPlan.json());
          setCertificates(await resCert.json());

          const loadedMeetings = await resMeet.clone().json();
          let allComs = [];
          for (let m of loadedMeetings) {
            const detail = await fetch(`${BASE_API_URL}/meetings/${m.id}`);
            const data = await detail.json();
            if (data.commitments) allComs = [...allComs, ...data.commitments];
          }
          setCommitments(allComs);

          const loadedInspections = await resInsp.clone().json();
          let allFindings = [];
          loadedInspections.forEach(i => {
            if (i.findings) allFindings = [...allFindings, ...i.findings];
          });
          setFindings(allFindings);
          setApiMode(true);
        } else {
          throw new Error("API Offline");
        }
      } catch (err) {
        console.warn("Conexión de red no disponible, usando fallback local.", err);
        setApiMode(false);
        const cached = localStorage.getItem('cphs_store_responsive_v4');
        if (cached) {
          const parsed = JSON.parse(cached);
          setMeetings(parsed.meetings || INITIAL_SEED_DATA.meetings);
          setCommitments(parsed.commitments || INITIAL_SEED_DATA.commitments);
          setInspections(parsed.inspections || INITIAL_SEED_DATA.inspections);
          setFindings(parsed.findings || INITIAL_SEED_DATA.findings);
          setTrainings(parsed.trainings || INITIAL_SEED_DATA.trainings);
          setCertificates(parsed.training_employees || parsed.certificates || INITIAL_SEED_DATA.training_employees);
          setAccidents(parsed.accidents || INITIAL_SEED_DATA.accidents);
          setAnnualPlan(parsed.annual_plan || INITIAL_SEED_DATA.annual_plan);
        } else {
          setMeetings(INITIAL_SEED_DATA.meetings);
          setCommitments(INITIAL_SEED_DATA.commitments);
          setInspections(INITIAL_SEED_DATA.inspections);
          setFindings(INITIAL_SEED_DATA.findings);
          setTrainings(INITIAL_SEED_DATA.trainings);
          setCertificates(INITIAL_SEED_DATA.training_employees);
          setAccidents(INITIAL_SEED_DATA.accidents);
          setAnnualPlan(INITIAL_SEED_DATA.annual_plan);
          triggerSaveState(INITIAL_SEED_DATA);
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const triggerSaveState = (updatedFields) => {
    if (apiMode) return;
    const currentStore = {
      meetings: updatedFields.meetings || meetings,
      commitments: updatedFields.commitments || commitments,
      inspections: updatedFields.inspections || inspections,
      findings: updatedFields.findings || findings,
      trainings: updatedFields.trainings || trainings,
      training_employees: updatedFields.certificates || certificates,
      accidents: updatedFields.accidents || accidents,
      annual_plan: updatedFields.annualPlan || annualPlan
    };
    localStorage.setItem('cphs_store_responsive_v4', JSON.stringify(currentStore));
  };

  // SAFE FILE UPLOAD BASE64 LOADER (For fallback)
  const handleSafeFileBase64 = (e, setBase64, setRawFile) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("⚠️ Límite de seguridad superado: El archivo excede el tamaño máximo permitido de 5 MB.");
      e.target.value = null;
      return;
    }

    const allowedMimes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedMimes.includes(file.type)) {
      alert("⚠️ Formato denegado por seguridad: Solo se admiten documentos PDF e imágenes (PNG/JPG/WebP).");
      e.target.value = null;
      return;
    }

    setRawFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64(reader.result); 
    };
    reader.readAsDataURL(file);
  };

  // METRICAS EN TIEMPO REAL
  const stats = useMemo(() => {
    const currentMonth = new Date().getMonth() + 1;
    
    const monthTasks = annualPlan.filter(t => t.month === currentMonth);
    const completedMonthTasks = monthTasks.filter(t => t.status === 'COMPLETADO');
    const complianceMonth = monthTasks.length > 0 ? Math.round((completedMonthTasks.length / monthTasks.length) * 100) : 0;

    const yearTasks = annualPlan.filter(t => t.month <= currentMonth);
    const completedYearTasks = yearTasks.filter(t => t.status === 'COMPLETADO');
    const complianceYear = yearTasks.length > 0 ? Math.round((completedYearTasks.length / yearTasks.length) * 100) : 0;

    const meetCom = meetings.filter(m => m.status === 'COMPLETADA').length;
    const inspCom = inspections.filter(i => i.status === 'COMPLETADA').length;
    const trainCom = trainings.filter(t => t.status === 'COMPLETADA').length;

    let totalHH = 0;
    trainings.forEach(t => {
      if (t.status === 'COMPLETADA') {
        const count = certificates.filter(c => c.training_id === t.id).length || t.attendee_count || 0;
        totalHH += (t.hours * count);
      }
    });

    const completedComs = commitments.filter(c => c.status === 'COMPLETADO').length;
    const totalComs = commitments.length;

    return {
      complianceMonth,
      complianceYear,
      meetings: meetCom,
      inspections: inspCom,
      trainings: trainCom,
      totalHoursHomme: totalHH,
      commitments: { completed: completedComs, total: totalComs }
    };
  }, [meetings, commitments, inspections, trainings, certificates, annualPlan]);

  const alerts = useMemo(() => {
    const upcomingCommitments = commitments.filter(c => c.status === 'PENDIENTE').slice(0, 4);
    const criticalFindings = findings.filter(f => f.status === 'ABIERTO' && (f.risk_level === 'CRITICO' || f.risk_level === 'ALTO'));
    return { upcomingCommitments, criticalFindings };
  }, [commitments, findings]);

  const filteredCertificates = useMemo(() => {
    if (!certSearchQuery) return certificates;
    const q = certSearchQuery.toLowerCase();
    return certificates.filter(c => 
      c.employee_name.toLowerCase().includes(q) || 
      c.employee_run.toLowerCase().includes(q) ||
      (c.training_topic && c.training_topic.toLowerCase().includes(q))
    );
  }, [certificates, certSearchQuery]);

  const categorizedTrainings = useMemo(() => {
    if (trainingCategoryFilter === 'ALL') return trainings;
    return trainings.filter(t => t.category === trainingCategoryFilter);
  }, [trainings, trainingCategoryFilter]);

  // ACTIONS (Protegidas por Roles en la vista)
  // ACTIONS (Protegidas por Roles en la vista)
  const toggleAnnualTask = async (taskId) => {
    if (userRole !== 'ADMIN') return;
    const updatedPlan = annualPlan.map(t => {
      if (t.id === taskId) return { ...t, status: t.status === 'COMPLETADO' ? 'PENDIENTE' : 'COMPLETADO' };
      return t;
    });
    setAnnualPlan(updatedPlan);
    triggerSaveState({ annualPlan: updatedPlan });

    if (cloudMode && supabase) {
      const task = updatedPlan.find(t => t.id === taskId);
      await supabase.from('annual_plan').update({ status: task.status }).eq('id', taskId);
    } else if (apiMode) {
      const task = updatedPlan.find(t => t.id === taskId);
      await fetch(`${BASE_API_URL}/annual-plan/${taskId}/status`, {
        method: 'PUT',
        headers: getRequestHeaders(),
        body: JSON.stringify({ status: task.status })
      });
    }
  };

  const toggleCommitment = async (comId) => {
    if (userRole !== 'ADMIN') return;
    const updatedCommitments = commitments.map(c => {
      if (c.id === comId) {
        const nextStatus = c.status === 'COMPLETADO' ? 'PENDIENTE' : 'COMPLETADO';
        return { 
          ...c, status: nextStatus,
          closed_at: nextStatus === 'COMPLETADO' ? new Date().toISOString().split('T')[0] : null
        };
      }
      return c;
    });
    setCommitments(updatedCommitments);
    triggerSaveState({ commitments: updatedCommitments });

    if (cloudMode && supabase) {
      const target = updatedCommitments.find(c => c.id === comId);
      await supabase.from('commitments').update({ status: target.status, closed_at: target.closed_at }).eq('id', comId);
    } else if (apiMode) {
      const target = updatedCommitments.find(c => c.id === comId);
      await fetch(`${BASE_API_URL}/commitments/${comId}`, {
        method: 'PUT',
        headers: getRequestHeaders(),
        body: JSON.stringify({ status: target.status })
      });
    }
  };

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    if (userRole !== 'ADMIN') return;
    const newId = meetings.length + 1;
    const newMeeting = {
      id: newId,
      title: meetingForm.title,
      type: meetingForm.type,
      date: meetingForm.date,
      description: meetingForm.description,
      attendees: meetingForm.attendees ? meetingForm.attendees.split(',').map(a => a.trim()) : [],
      act_file_path: meetingFileBase64 || 'mock_acta.pdf',
      status: 'COMPLETADA'
    };

    const updatedMeetings = [newMeeting, ...meetings];
    setMeetings(updatedMeetings);

    let updatedCommitments = [...commitments];
    if (meetingForm.title) {
      const initialCommitment = {
        id: commitments.length + 1,
        meeting_id: newId,
        description: `Elaborar plan de seguimiento para la sesión: ${meetingForm.title}`,
        responsible_name: 'Presidente CPHS',
        due_date: new Date(Date.now() + 15*24*60*60*1000).toISOString().split('T')[0],
        status: 'PENDIENTE',
        closed_at: null
      };
      updatedCommitments = [initialCommitment, ...commitments];
      setCommitments(updatedCommitments);
    }

    triggerSaveState({ meetings: updatedMeetings, commitments: updatedCommitments });

    if (cloudMode && supabase) {
      let act_file_path = 'mock_acta.pdf';
      if (meetingRawFile) {
        const fileExt = meetingRawFile.name.split('.').pop();
        const fileName = `meeting-${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('cphs-files')
          .upload(fileName, meetingRawFile);
        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('cphs-files')
            .getPublicUrl(fileName);
          act_file_path = publicUrlData.publicUrl;
        }
      }
      
      const { data: meetData, error: meetError } = await supabase.from('meetings').insert([{
        title: meetingForm.title,
        type: meetingForm.type,
        date: meetingForm.date,
        description: meetingForm.description,
        attendees: meetingForm.attendees ? meetingForm.attendees.split(',').map(a => a.trim()) : [],
        act_file_path: act_file_path,
        status: 'COMPLETADA'
      }]).select();

      if (meetError) {
        console.error("Error al guardar reunión en Supabase:", meetError);
      } else if (meetData && meetData[0] && meetingForm.title) {
        const mId = meetData[0].id;
        await supabase.from('commitments').insert([{
          meeting_id: mId,
          description: `Elaborar plan de seguimiento para la sesión: ${meetingForm.title}`,
          responsible_name: 'Presidente CPHS',
          due_date: new Date(Date.now() + 15*24*60*60*1000).toISOString().split('T')[0],
          status: 'PENDIENTE',
          closed_at: null
        }]);
      }
      window.location.reload();
      return;
    } else if (apiMode) {
      const fd = new FormData();
      fd.append('title', meetingForm.title);
      fd.append('type', meetingForm.type);
      fd.append('date', meetingForm.date);
      fd.append('description', meetingForm.description);
      fd.append('attendees', JSON.stringify(newMeeting.attendees));
      if (meetingRawFile) {
        fd.append('acta', meetingRawFile);
      }
      await fetch(`${BASE_API_URL}/meetings`, { 
        method: 'POST', 
        headers: getMultipartHeaders(),
        body: fd 
      });
      window.location.reload();
    }

    setMeetingForm({ title: '', type: 'ORDINARIA', date: '', description: '', attendees: '' });
    setMeetingFileBase64(null);
    setMeetingRawFile(null);
    setShowMeetingModal(false);
    setSelectedMeeting(newMeeting);
  };

  const handleCreateInspection = async (e) => {
    e.preventDefault();
    if (userRole !== 'ADMIN') return;
    const newId = inspections.length + 1;
    const newInsp = {
      id: newId,
      title: inspectionForm.title,
      planned_date: inspectionForm.planned_date,
      conducted_date: inspectionForm.conducted_date || null,
      inspector_name: inspectionForm.inspector_name,
      report_file_path: inspectionForm.conducted_date ? 'mock_report.pdf' : null,
      status: inspectionForm.conducted_date ? 'COMPLETADA' : 'PENDIENTE'
    };

    const updatedInsps = [newInsp, ...inspections];
    setInspections(updatedInsps);
    triggerSaveState({ inspections: updatedInsps });

    if (cloudMode && supabase) {
      const { data: inspData, error: inspError } = await supabase.from('inspections').insert([{
        title: inspectionForm.title,
        planned_date: inspectionForm.planned_date,
        conducted_date: inspectionForm.conducted_date || null,
        inspector_name: inspectionForm.inspector_name,
        report_file_path: inspectionForm.conducted_date ? 'mock_report.pdf' : null,
        status: inspectionForm.conducted_date ? 'COMPLETADA' : 'PENDIENTE'
      }]).select();

      if (inspError) console.error("Error al registrar inspección en Supabase:", inspError);
      window.location.reload();
      return;
    } else if (apiMode) {
      await fetch(`${BASE_API_URL}/inspections`, {
        method: 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify(newInsp)
      });
      window.location.reload();
    }

    setInspectionForm({ title: '', planned_date: '', conducted_date: '', inspector_name: '' });
    setShowInspectionModal(false);
    setSelectedInspection(newInsp);
  };

  const handleCreateFinding = async (e) => {
    e.preventDefault();
    if (userRole !== 'ADMIN') return;
    if (!selectedInspection) return;

    const newId = findings.length + 1;
    const newFinding = {
      id: newId,
      inspection_id: selectedInspection.id,
      description: findingForm.description,
      risk_level: findingForm.risk_level,
      corrective_measure: findingForm.corrective_measure,
      due_date: findingForm.due_date,
      status: 'ABIERTO',
      evidence_file_path: findingFileBase64 || 'mock_evidence.jpg', 
      closed_at: null
    };

    const updatedFindings = [newFinding, ...findings];
    setFindings(updatedFindings);
    triggerSaveState({ findings: updatedFindings });

    if (cloudMode && supabase) {
      let evidence_file_path = 'mock_evidence.jpg';
      if (findingRawFile) {
        const fileExt = findingRawFile.name.split('.').pop();
        const fileName = `finding-${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('cphs-files')
          .upload(fileName, findingRawFile);
        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('cphs-files')
            .getPublicUrl(fileName);
          evidence_file_path = publicUrlData.publicUrl;
        }
      }

      const { data: findData, error: findError } = await supabase.from('findings').insert([{
        inspection_id: selectedInspection.id,
        description: findingForm.description,
        risk_level: findingForm.risk_level,
        corrective_measure: findingForm.corrective_measure,
        due_date: findingForm.due_date,
        status: 'ABIERTO',
        evidence_file_path: evidence_file_path,
        closed_at: null
      }]);

      if (findError) console.error("Error al registrar hallazgo en Supabase:", findError);
      window.location.reload();
      return;
    } else if (apiMode) {
      const fd = new FormData();
      fd.append('description', findingForm.description);
      fd.append('risk_level', findingForm.risk_level);
      fd.append('corrective_measure', findingForm.corrective_measure);
      fd.append('due_date', findingForm.due_date);
      if (findingRawFile) {
        fd.append('evidence', findingRawFile);
      }
      await fetch(`${BASE_API_URL}/inspections/${selectedInspection.id}/findings`, {
        method: 'POST',
        headers: getMultipartHeaders(),
        body: fd
      });
      window.location.reload();
    }

    setFindingForm({ description: '', risk_level: 'MEDIO', due_date: '', corrective_measure: '' });
    setFindingFileBase64(null);
    setFindingRawFile(null);
    setShowFindingModal(false);
  };

  const handleCloseFinding = async (findingId) => {
    if (userRole !== 'ADMIN') return;
    const updatedFindings = findings.map(f => {
      if (f.id === findingId) return { ...f, status: 'CERRADO', closed_at: new Date().toISOString().split('T')[0] };
      return f;
    });
    setFindings(updatedFindings);
    triggerSaveState({ findings: updatedFindings });

    if (cloudMode && supabase) {
      const closedAt = new Date().toISOString();
      await supabase.from('findings').update({ status: 'CERRADO', closed_at: closedAt }).eq('id', findingId);
    } else if (apiMode) {
      await fetch(`${BASE_API_URL}/findings/${findingId}/close`, { 
        method: 'PUT',
        headers: getRequestHeaders()
      });
    }
  };

  const handleCreateTraining = async (e) => {
    e.preventDefault();
    if (userRole !== 'ADMIN') return;
    const newId = trainings.length + 1;
    const newTraining = {
      id: newId,
      topic: trainingForm.topic,
      category: trainingForm.category,
      planned_date: trainingForm.planned_date,
      conducted_date: trainingForm.conducted_date || null,
      hours: Number(trainingForm.hours),
      attendee_count: 0,
      status: trainingForm.conducted_date ? 'COMPLETADA' : 'PENDIENTE',
      attendance_list_file_path: 'mock_asist.pdf',
      photo_file_path: 'mock_photo.jpg',
      material_file_path: null
    };

    const updatedTrainings = [newTraining, ...trainings];
    setTrainings(updatedTrainings);
    triggerSaveState({ trainings: updatedTrainings });

    if (cloudMode && supabase) {
      const { data: trainData, error: trainError } = await supabase.from('trainings').insert([{
        topic: trainingForm.topic,
        category: trainingForm.category,
        planned_date: trainingForm.planned_date,
        conducted_date: trainingForm.conducted_date || null,
        hours: Number(trainingForm.hours),
        attendee_count: 0,
        status: trainingForm.conducted_date ? 'COMPLETADA' : 'PENDIENTE',
        attendance_list_file_path: 'mock_asist.pdf',
        photo_file_path: 'mock_photo.jpg',
        material_file_path: null
      }]).select();

      if (trainError) console.error("Error al registrar capacitación en Supabase:", trainError);
      window.location.reload();
      return;
    } else if (apiMode) {
      await fetch(`${BASE_API_URL}/trainings`, {
        method: 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify(newTraining)
      });
      window.location.reload();
    }

    setTrainingForm({ topic: '', category: 'SEGURIDAD', planned_date: '', conducted_date: '', hours: 1 });
    setShowTrainingModal(false);
    setSelectedTraining(newTraining);
  };

  const handleAddAttendee = async (e) => {
    e.preventDefault();
    if (userRole !== 'ADMIN') return;
    if (!selectedTraining) return;

    const newId = certificates.length + 1;
    const newCert = {
      id: newId,
      training_id: selectedTraining.id,
      employee_name: attendeeForm.employee_name,
      employee_run: attendeeForm.employee_run,
      certificate_file_path: 'mock_cert.pdf',
      status: attendeeForm.status,
      training_topic: selectedTraining.topic,
      training_date: selectedTraining.conducted_date || new Date().toISOString().split('T')[0]
    };

    const updatedCerts = [newCert, ...certificates];
    setCertificates(updatedCerts);

    const updatedTrainings = trainings.map(t => {
      if (t.id === selectedTraining.id) return { ...t, attendee_count: (t.attendee_count || 0) + 1 };
      return t;
    });
    setTrainings(updatedTrainings);

    triggerSaveState({ certificates: updatedCerts, trainings: updatedTrainings });

    if (cloudMode && supabase) {
      const { data: certData, error: certError } = await supabase.from('training_employees').insert([{
        training_id: selectedTraining.id,
        employee_name: attendeeForm.employee_name,
        employee_run: attendeeForm.employee_run,
        certificate_file_path: 'mock_cert.pdf',
        status: attendeeForm.status
      }]);

      if (certError) {
        console.error("Error al registrar trabajador en Supabase:", certError);
      } else {
        await supabase.from('trainings')
          .update({ attendee_count: (selectedTraining.attendee_count || 0) + 1 })
          .eq('id', selectedTraining.id);
      }
      window.location.reload();
      return;
    } else if (apiMode) {
      await fetch(`${BASE_API_URL}/trainings/${selectedTraining.id}/employees`, {
        method: 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify(newCert)
      });
      window.location.reload();
    }

    setAttendeeForm({ employee_name: '', employee_run: '', status: 'APROBADO' });
    setShowAttendeeModal(false);
  };

  const handleCreateAccident = async (e) => {
    e.preventDefault();
    if (userRole !== 'ADMIN') return;
    const newId = accidents.length + 1;
    
    const whyAnalysis = [
      accidentForm.why1, accidentForm.why2, accidentForm.why3, accidentForm.why4, accidentForm.why5
    ].filter(Boolean);

    const correctiveActions = [];
    if (accidentForm.measure1) {
      correctiveActions.push({ 
        measure: accidentForm.measure1, 
        due_date: accidentForm.measure1Date || '2026-06-30', 
        status: 'PENDIENTE', date_closed: null 
      });
    }

    const newAcc = {
      id: newId,
      employee_name: accidentForm.employee_name,
      date: accidentForm.date,
      accident_type: accidentForm.accident_type,
      description: accidentForm.description,
      root_cause_method: '5_WHYS',
      root_cause_analysis: whyAnalysis,
      corrective_measures: correctiveActions,
      status: 'ABIERTO'
    };

    const updatedAccs = [newAcc, ...accidents];
    setAccidents(updatedAccs);

    const eventMonth = new Date(accidentForm.date).getMonth() + 1;
    const newTask = {
      id: annualPlan.length + 1,
      task_name: `Investigación Accidente: ${accidentForm.employee_name}`,
      month: eventMonth || 5,
      type: 'AUDITORIA',
      status: 'COMPLETADO',
      responsible: 'Comité Paritario'
    };
    const updatedPlan = [...annualPlan, newTask];
    setAnnualPlan(updatedPlan);

    triggerSaveState({ accidents: updatedAccs, annualPlan: updatedPlan });

    if (cloudMode && supabase) {
      const { data: accData, error: accError } = await supabase.from('accidents').insert([{
        employee_name: accidentForm.employee_name,
        date: accidentForm.date,
        accident_type: accidentForm.accident_type,
        description: accidentForm.description,
        root_cause_method: '5_WHYS',
        root_cause_analysis: whyAnalysis,
        corrective_measures: correctiveActions,
        status: 'ABIERTO'
      }]).select();

      if (accError) {
        console.error("Error al registrar accidente en Supabase:", accError);
      } else {
        const eventMonth = new Date(accidentForm.date).getMonth() + 1;
        await supabase.from('annual_plan').insert([{
          task_name: `Investigación Accidente: ${accidentForm.employee_name}`,
          month: eventMonth || 5,
          type: 'AUDITORIA',
          status: 'COMPLETADO',
          responsible: 'Comité Paritario'
        }]);
      }
      window.location.reload();
      return;
    } else if (apiMode) {
      await fetch(`${BASE_API_URL}/accidents`, {
        method: 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify(newAcc)
      });
      window.location.reload();
    }

    setAccidentForm({
      employee_name: '', date: '', accident_type: 'LEVE', description: '',
      why1: '', why2: '', why3: '', why4: '', why5: '',
      measure1: '', measure1Date: '', measure2: '', measure2Date: ''
    });
    setShowAccidentModal(false);
    setSelectedAccident(newAcc);
  };

  const toggleAccidentMeasure = async (accId, measureIndex) => {
    if (userRole !== 'ADMIN') return;
    const updatedAccidents = accidents.map(a => {
      if (a.id === accId) {
        const nextMeasures = a.corrective_measures.map((m, idx) => {
          if (idx === measureIndex) {
            const nextStatus = m.status === 'COMPLETADA' ? 'PENDIENTE' : 'COMPLETADA';
            return {
              ...m, status: nextStatus,
              date_closed: nextStatus === 'COMPLETADA' ? new Date().toISOString().split('T')[0] : null
            };
          }
          return m;
        });
        
        const allClosed = nextMeasures.every(m => m.status === 'COMPLETADA');
        return {
          ...a, corrective_measures: nextMeasures,
          status: allClosed ? 'CERRADO' : 'ABIERTO'
        };
      }
      return a;
    });

    setAccidents(updatedAccidents);
    triggerSaveState({ accidents: updatedAccidents });

    if (cloudMode && supabase) {
      const target = updatedAccidents.find(a => a.id === accId);
      await supabase.from('accidents').update({ 
        status: target.status, 
        corrective_measures: target.corrective_measures 
      }).eq('id', accId);
    } else if (apiMode) {
      const target = updatedAccidents.find(a => a.id === accId);
      await fetch(`${BASE_API_URL}/accidents/${accId}/status`, {
        method: 'PUT',
        headers: getRequestHeaders(),
        body: JSON.stringify({ 
          status: target.status, 
          corrective_measures: target.corrective_measures 
        })
      });
    }
  };

  if (currentScreen === 'welcome') {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Background light meshes */}
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-4xl flex flex-col items-center space-y-8 relative z-10 py-6">
            
            {/* Brand Header */}
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    <img src="/logo.png" alt="RFP Logística" className="h-16 md:h-20 object-contain drop-shadow-[0_10px_15px_rgba(6,182,212,0.15)]" />
                </div>
                <div className="space-y-1">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight font-sans">CPHS Móvil</h1>
                    <p className="text-xs md:text-sm text-slate-400 font-semibold uppercase tracking-wider font-sans">
                        Gestor de Higiene, Seguridad y Cumplimiento Legal
                    </p>
                </div>
            </div>

            {/* Dual Path Selector Card */}
            <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                
                {/* PATH 1: PUBLIC WORKER */}
                <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6 bg-gradient-to-b from-[#0f172a]/80 to-[#070b19]/90 border border-slate-800/80 shadow-2xl">
                    <div className="space-y-4">
                        <div className="w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                            <Eye className="w-5.5 h-5.5" />
                        </div>
                        <div>
                            <h3 className="text-lg md:text-xl font-bold text-white font-sans">Consulta de Colaboradores</h3>
                            <p className="text-xs md:text-sm text-slate-400 mt-1.5 leading-relaxed font-sans font-light">
                                Acceso directo sin claves para todo el personal. Revise estadísticas de seguridad en tiempo real, actas legales firmadas, busque capacitaciones y previsualice su diploma de acreditación oficial.
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={handlePublicIngress}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-extrabold text-xs md:text-sm shadow-lg shadow-emerald-500/10 hover:opacity-90 active:scale-[0.99] transition-all font-sans uppercase tracking-wider block"
                    >
                        Ver Panel de Cumplimiento
                    </button>
                </div>

                {/* PATH 2: ADMIN LOGIN */}
                <div className="glass-card rounded-3xl p-6 md:p-8 space-y-5 bg-gradient-to-b from-[#0f172a]/80 to-[#070b19]/90 border border-slate-800/80 shadow-2xl flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                            <Lock className="w-5.5 h-5.5" />
                        </div>
                        <div>
                            <h3 className="text-lg md:text-xl font-bold text-white font-sans">Administración CPHS</h3>
                            <p className="text-xs text-slate-400 mt-1 font-sans font-light">
                                Ingrese credenciales autorizadas del comité para habilitar edición, carga de evidencias de hallazgos y gestión del Trabajador del Mes.
                            </p>
                        </div>
                    </div>

                    {/* Error Banner */}
                    {loginError && (
                        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold animate-fade-in flex items-center space-x-1.5 leading-snug">
                            <AlertTriangle className="w-4.5 h-4.5 shrink-0 text-rose-500" />
                            <span className="font-sans">{loginError}</span>
                        </div>
                    )}

                    <form onSubmit={handleAdminLogin} className="space-y-3 pt-1">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Usuario</label>
                            <input 
                                type="text" required placeholder="Ej: Admin"
                                value={loginUser}
                                onChange={(e) => setLoginUser(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800/85 text-slate-100 text-xs md:text-sm focus:outline-none focus:border-emerald-500/50"
                            />
                        </div>

                        <div className="space-y-1 relative">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contraseña</label>
                            <input 
                                type={showPassword ? "text" : "password"} required placeholder="••••••••"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                className="w-full px-4 py-2.5 pr-10 rounded-xl bg-slate-950/80 border border-slate-800/85 text-slate-100 text-xs md:text-sm focus:outline-none focus:border-emerald-500/50"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-7 text-slate-500 hover:text-slate-300"
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                        </div>

                        <button 
                            type="submit"
                            disabled={loginLoading}
                            className="w-full mt-3 py-3 rounded-2xl bg-slate-900 hover:bg-slate-850 text-emerald-400 font-extrabold text-xs md:text-sm border border-emerald-500/20 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 font-sans uppercase tracking-wider"
                        >
                            {loginLoading ? (
                                <div className="w-4.5 h-4.5 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin"></div>
                            ) : (
                                <>
                                    <Shield className="w-4.5 h-4.5" />
                                    <span>Acceso Restringido</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

            </div>
            
            {/* Portal Footer Info */}
            <p className="text-[10px] text-slate-500 font-bold font-sans tracking-wide">
                Comité Paritario de Higiene y Seguridad • Planta Industrial 2026
            </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-100 font-sans">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 border-r border-slate-800 bg-[#070b19] flex-col justify-between shrink-0">
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center justify-center bg-slate-950/40">
            <img src="/logo.png" alt="RFP Logística" className="h-9 object-contain max-w-full drop-shadow-sm" />
          </div>

          <nav className="p-4 space-y-1">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
              { id: 'meetings', name: 'Reuniones Mensuales', icon: Calendar },
              { id: 'inspections', name: 'Inspecciones y Hallazgos', icon: ClipboardList },
              { id: 'trainings', name: 'Capacitaciones', icon: GraduationCap },
              { id: 'certificates', name: 'Certificados', icon: FileCheck },
              { id: 'accidents', name: 'Investigación Acc.', icon: Activity },
              { id: 'cronogram', name: 'Plan Anual Gantt', icon: Clock }
            ].map(item => {
              const IconComp = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSelectedMeeting(null);
                    setSelectedInspection(null);
                    setSelectedTraining(null);
                    setSelectedAccident(null);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm ${
                    active 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <IconComp className="w-5 h-5 shrink-0" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 bg-[#040813] space-y-3">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">ROL PREVISUALIZACIÓN</label>
            <div className="flex bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
              <button 
                onClick={() => setUserRole('ADMIN')}
                className={`flex-1 text-[9px] font-bold py-1.5 rounded-md transition-all ${userRole === 'ADMIN' ? 'bg-emerald-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Admin
              </button>
              <button 
                onClick={() => setUserRole('PUBLIC')}
                className={`flex-1 text-[9px] font-bold py-1.5 rounded-md transition-all ${userRole === 'PUBLIC' ? 'bg-[#334155] text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Público
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
            <div className={`w-2.5 h-2.5 rounded-full ${apiMode ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`}></div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-slate-300 truncate">{apiMode ? 'API Relacional Activa' : 'Modo Demo Local'}</p>
              <p className="text-[10px] text-slate-500">Auto-guardado activo</p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 font-bold text-[10px] active:scale-[0.99] transition-all font-sans uppercase tracking-wider"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col min-h-screen pb-20 md:pb-8 overflow-y-auto">
        
        {/* Header */}
        <header className="h-16 border-b border-slate-800/80 bg-[#070b19]/60 backdrop-blur-md px-4 md:px-8 flex items-center justify-between shrink-0 sticky top-0 z-40">
          <div className="flex items-center space-x-2.5 md:space-x-0">
            <div className="flex md:hidden items-center justify-center mr-2">
              <img src="/logo.png" alt="RFP Logística" className="h-6 object-contain drop-shadow-sm" />
            </div>
            <div className="overflow-hidden">
              <span className="text-[9px] md:text-xs font-bold text-emerald-500 uppercase tracking-widest block font-sans">Prevención de Riesgos</span>
              <h2 className="text-[10px] md:text-sm font-semibold text-slate-300 truncate">CPHS - Higiene, Seguridad y Prevención</h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Mobile Header Role Switcher */}
            <div className="md:hidden flex bg-slate-950/80 border border-slate-800/80 p-0.5 rounded-lg text-[9px] font-bold">
              <button 
                onClick={() => setUserRole(userRole === 'ADMIN' ? 'PUBLIC' : 'ADMIN')}
                className={`px-2 py-1 rounded transition-colors flex items-center space-x-1 ${
                  userRole === 'ADMIN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {userRole === 'ADMIN' ? <Shield className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{userRole === 'ADMIN' ? 'Admin' : 'Público'}</span>
              </button>
            </div>

            <div className="text-right hidden sm:block">
              <h4 className="text-xs md:text-sm font-bold text-white leading-tight">Jaime Olivares</h4>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${userRole === 'ADMIN' ? 'text-emerald-400' : 'text-slate-500'}`}>
                {userRole === 'ADMIN' ? 'Presidente CPHS (ADMIN)' : 'Trabajador (SOLO LECTURA)'}
              </span>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 font-bold font-sans">
              J
            </div>
            <button 
              onClick={handleLogout}
              title="Cerrar Sesión"
              className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700/80 flex items-center justify-center text-rose-400 transition-colors"
            >
              <LogOut className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
            </button>
          </div>
        </header>

        {/* Dynamic Views */}
        <div className="p-4 md:p-8 flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin"></div>
              <p className="text-sm text-slate-400 font-sans">Cargando base de datos...</p>
            </div>
          ) : (
            <>
              {/* DASHBOARD VIEW */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6 md:space-y-8">
                  
                  {/* Trabajador del Mes */}
                  <div className="glass-card rounded-3xl p-5 md:p-6 border-2 border-emerald-500/20 relative overflow-hidden bg-gradient-to-r from-emerald-950/15 via-[#0f172a]/60 to-[#070b19]/60">
                    <div className="absolute right-0 top-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-xl shadow-emerald-500/10 flex-shrink-0">
                          <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center text-emerald-400 text-2xl font-bold font-sans">
                            {workerOfMonth.avatar}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold tracking-wider uppercase">Reconocimiento CPHS</span>
                            <span className="text-[10px] text-amber-400 font-extrabold uppercase flex items-center space-x-1">
                              <Award className="w-3.5 h-3.5" />
                              <span>Prevención Activa</span>
                            </span>
                          </div>
                          <h3 className="text-lg md:text-xl font-extrabold text-white mt-1 leading-tight font-sans">{workerOfMonth.name}</h3>
                          <p className="text-xs text-slate-400 font-semibold">{workerOfMonth.role}</p>
                        </div>
                      </div>
                      
                      <div className="flex-1 md:max-w-md bg-slate-950/50 p-3.5 rounded-xl border border-slate-900">
                        <p className="text-xs text-slate-300 italic leading-relaxed">
                          "{workerOfMonth.reason}"
                        </p>
                      </div>

                      {userRole === 'ADMIN' && (
                        <button 
                          onClick={() => {
                            setWorkerForm({ name: workerOfMonth.name, role: workerOfMonth.role, reason: workerOfMonth.reason });
                            setShowWorkerModal(true);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-emerald-400 border border-emerald-500/20 transition-all flex items-center justify-center space-x-1.5 self-start md:self-auto shrink-0"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Actualizar</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-sans">Cuadro de Mando Integral</h2>
                      <p className="text-xs md:text-sm text-slate-400 mt-0.5 font-sans">Control preventivo e indicadores en tiempo real.</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('cronogram')}
                      className="btn-gradient flex items-center justify-center space-x-2 text-xs self-start md:self-auto"
                    >
                      <Clock className="w-4 h-4" />
                      <span>Ver Plan de Trabajo Anual</span>
                    </button>
                  </div>

                  {/* KPIs Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <div className="glass-card rounded-2xl p-5 flex items-center justify-between col-span-2 lg:col-span-1">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">Cumplimiento Mes</span>
                        <span className="text-2xl md:text-3xl font-extrabold text-white mt-1 block font-sans">{stats.complianceMonth}%</span>
                      </div>
                      <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path className="text-slate-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          <path className="text-emerald-400 transition-all duration-1000" strokeWidth="3.5" strokeDasharray={`${stats.complianceMonth}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <span className="absolute text-[10px] font-bold text-white font-sans">{stats.complianceMonth}%</span>
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl p-5 flex items-center justify-between col-span-2 lg:col-span-1">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">Cumplimiento Año</span>
                        <span className="text-2xl md:text-3xl font-extrabold text-white mt-1 block font-sans">{stats.complianceYear}%</span>
                      </div>
                      <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path className="text-slate-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          <path className="text-cyan-400 transition-all duration-1000" strokeWidth="3.5" strokeDasharray={`${stats.complianceYear}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <span className="absolute text-[10px] font-bold text-white font-sans">{stats.complianceYear}%</span>
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl p-5 flex items-center justify-between col-span-1">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">Acuerdos</span>
                        <span className="text-xl md:text-2xl font-extrabold text-white mt-1 block font-sans">
                          {stats.commitments.completed} <span className="text-xs text-slate-500 font-normal">/ {stats.commitments.total}</span>
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                        <CheckCircle2 className="w-5.5 h-5.5" />
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl p-5 flex items-center justify-between col-span-1">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">Horas Hombre</span>
                        <span className="text-xl md:text-2xl font-extrabold text-white mt-1 block font-sans">{stats.totalHoursHomme} HH</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                        <GraduationCap className="w-5.5 h-5.5" />
                      </div>
                    </div>
                  </div>

                  {/* Graphical summary */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 font-sans">
                    <div className="lg:col-span-2 glass-card rounded-3xl p-6 md:p-8 space-y-6">
                      <div>
                        <h3 className="text-base md:text-lg font-bold text-white">Desglose de Gestión Mensual</h3>
                        <p className="text-[11px] md:text-xs text-slate-400">Distribución de tareas reglamentarias del comité paritario.</p>
                      </div>

                      <div className="space-y-5 pt-2">
                        {[
                          { category: 'Reuniones Mensuales', stats: { completadas: meetings.filter(m => m.status === 'COMPLETADA').length, pendientes: meetings.filter(m => m.status === 'PENDIENTE').length }, colorClass: 'bg-emerald-500', totalCount: meetings.length },
                          { category: 'Inspecciones de Terreno', stats: { completadas: inspections.filter(i => i.status === 'COMPLETADA').length, pendientes: inspections.filter(i => i.status === 'PENDIENTE').length }, colorClass: 'bg-cyan-500', totalCount: inspections.length },
                          { category: 'Capacitaciones Dictadas', stats: { completadas: trainings.filter(t => t.status === 'COMPLETADA').length, pendientes: trainings.filter(t => t.status === 'PENDIENTE').length }, colorClass: 'bg-yellow-500', totalCount: trainings.length }
                        ].map((bar, i) => {
                          const total = bar.totalCount;
                          const completedPercent = total > 0 ? (bar.stats.completadas / total) * 100 : 0;
                          const pendingPercent = total > 0 ? (bar.stats.pendientes / total) * 100 : 0;

                          return (
                            <div key={i} className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-slate-200">{bar.category}</span>
                                <div className="flex items-center space-x-3 text-[10px] font-bold">
                                  <span className="text-emerald-400">{bar.stats.completadas} Hechos</span>
                                  <span className="text-slate-500">{bar.stats.pendientes} Pendientes</span>
                                </div>
                              </div>
                              <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden flex border border-slate-900">
                                <div className={`${bar.colorClass} h-full transition-all duration-700`} style={{ width: `${completedPercent}%` }}></div>
                                <div className="bg-slate-700 h-full transition-all duration-700" style={{ width: `${pendingPercent}%` }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Alerts Panel */}
                    <div className="glass-card rounded-3xl p-6 md:p-8 space-y-5 flex flex-col">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
                        <h3 className="text-sm md:text-base font-bold text-white">Alertas de Prevención</h3>
                      </div>
                      
                      <div className="space-y-3.5 flex-1 overflow-y-auto max-h-72">
                        {alerts.criticalFindings.length === 0 && alerts.upcomingCommitments.length === 0 && (
                          <div className="flex flex-col items-center justify-center h-full text-center space-y-2 py-4">
                            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                            <p className="text-xs font-bold text-slate-350">¡Sin desviaciones críticas!</p>
                            <p className="text-[10px] text-slate-500">Todo el programa paritario se encuentra auditado.</p>
                          </div>
                        )}

                        {alerts.criticalFindings.map(f => (
                          <div key={f.id} className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-2">
                            <div className="flex justify-between items-center text-[9px] font-bold">
                              <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-sans">RIESGO CRÍTICO</span>
                              <span className="text-slate-500 font-sans">Plazo: {f.due_date}</span>
                            </div>
                            <p className="text-xs font-semibold text-slate-200">{f.description}</p>
                            <div className="flex items-center justify-between text-[9px] text-slate-500 pt-1 font-sans">
                              <span>Medida: {f.corrective_measure}</span>
                              {userRole === 'ADMIN' ? (
                                <button 
                                  onClick={() => handleCloseFinding(f.id)}
                                  className="text-rose-400 hover:text-rose-300 font-bold"
                                >
                                  Solucionar
                                </button>
                              ) : (
                                <span className="text-slate-650 flex items-center space-x-0.5">
                                  <Lock className="w-2.5 h-2.5" />
                                  <span>Cerrar</span>
                                </span>
                              )}
                            </div>
                          </div>
                        ))}

                        {alerts.upcomingCommitments.map(c => (
                          <div key={c.id} className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/10 space-y-2">
                            <div className="flex justify-between items-center text-[9px] font-bold">
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">COMPROMISO</span>
                              <span className="text-slate-500">Límite: {c.due_date}</span>
                            </div>
                            <p className="text-xs font-semibold text-slate-200">{c.description}</p>
                            <div className="flex items-center justify-between text-[9px] text-slate-500 pt-1 font-sans">
                              <span>Resp: {c.responsible_name}</span>
                              {userRole === 'ADMIN' ? (
                                <button 
                                  onClick={() => toggleCommitment(c.id)}
                                  className="text-emerald-400 hover:text-emerald-300 font-bold"
                                >
                                  Marcar Listo
                                </button>
                              ) : (
                                <span className="text-slate-650 flex items-center space-x-0.5">
                                  <Lock className="w-2.5 h-2.5" />
                                  <span>Admin</span>
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* REUNIONES VIEW */}
              {activeTab === 'meetings' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Reuniones Mensuales</h2>
                      <p className="text-xs md:text-sm text-slate-400">Registro de sesiones ordinarias y extraordinarias paritarias.</p>
                    </div>
                    {userRole === 'ADMIN' ? (
                      <button 
                        onClick={() => setShowMeetingModal(true)}
                        className="btn-gradient flex items-center space-x-1 text-xs"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Registrar Sesión</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-500 flex items-center space-x-1">
                        <Lock className="w-3.5 h-3.5 text-slate-600" />
                        <span>Lectura (Público)</span>
                      </span>
                    )}
                  </div>

                  {/* Responsive grid with Master-Detail logic */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    
                    {/* Left List */}
                    <div className={`glass-card rounded-3xl p-5 space-y-4 ${selectedMeeting ? 'hidden lg:block' : 'block'}`}>
                      <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider block">Historial de Sesiones</h3>
                      
                      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                        {meetings.map(m => {
                          const isSelected = selectedMeeting?.id === m.id;
                          return (
                            <div 
                              key={m.id}
                              onClick={() => setSelectedMeeting(m)}
                              className={`p-3.5 rounded-xl cursor-pointer border transition-all duration-300 ${
                                isSelected 
                                  ? 'bg-emerald-500/10 border-emerald-500/40 shadow-md shadow-emerald-500/5' 
                                  : 'bg-slate-950/40 border-slate-900 hover:border-slate-800 hover:bg-slate-950/80'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[9px] font-bold mb-1.5">
                                <span className={`px-1.5 py-0.5 rounded ${
                                  m.type === 'ORDINARIA' ? 'bg-cyan-500/15 text-cyan-400' : 'bg-purple-500/15 text-purple-400'
                                }`}>
                                  {m.type}
                                </span>
                                <span className="text-slate-500 font-sans">{m.date}</span>
                              </div>
                              <h4 className="font-bold text-sm text-slate-100 line-clamp-1">{m.title}</h4>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Detail Pane */}
                    <div className={`lg:col-span-2 glass-card rounded-3xl p-6 md:p-8 space-y-6 ${!selectedMeeting ? 'hidden lg:block' : 'block'}`}>
                      {selectedMeeting ? (
                        <>
                          <button 
                            onClick={() => setSelectedMeeting(null)}
                            className="lg:hidden flex items-center space-x-1.5 text-emerald-400 hover:text-emerald-300 font-bold text-xs mb-3"
                          >
                            <ArrowLeft className="w-4.5 h-4.5" />
                            <span>Volver al listado</span>
                          </button>

                          <div className="border-b border-slate-800 pb-5 space-y-3">
                            <div className="flex justify-between items-center text-[10px] font-bold">
                              <span className="text-emerald-400 uppercase tracking-widest block font-sans">Sesión Seleccionada</span>
                              <span className="text-slate-500">Fecha: {selectedMeeting.date}</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-extrabold text-white font-sans">{selectedMeeting.title}</h3>
                            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">{selectedMeeting.description}</p>
                            
                            {selectedMeeting.attendees && selectedMeeting.attendees.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1.5">
                                <span className="text-[10px] text-slate-500 font-bold self-center mr-1">Asistieron:</span>
                                {selectedMeeting.attendees.map((a, idx) => (
                                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-semibold">{a}</span>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-900 mt-2">
                              <div className="flex items-center space-x-3">
                                <div className="p-1.5 rounded-lg bg-slate-900 text-emerald-400">
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-slate-300">Acta / Evidencia cargada</p>
                                  <p className="text-[9px] text-slate-500">Documento legal firmado del paritario.</p>
                                </div>
                              </div>
                              {selectedMeeting.act_file_url || (selectedMeeting.act_file_path && selectedMeeting.act_file_path.startsWith('data:')) ? (
                                <button 
                                  onClick={() => {
                                    const path = selectedMeeting.act_file_url || selectedMeeting.act_file_path;
                                    if (path.startsWith('data:')) {
                                      const win = window.open();
                                      if (win) win.document.write(`<iframe src="${path}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                                    } else {
                                      window.open(path, '_blank');
                                    }
                                  }}
                                  className="px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 transition-colors"
                                >
                                  Ver Documento
                                </button>
                              ) : (
                                userRole === 'ADMIN' ? (
                                  <label className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold cursor-pointer transition-all">
                                    Subir Acta
                                    <input 
                                      type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden"
                                      onChange={async (e) => {
                                        handleSafeFileBase64(e, async (base64) => {
                                          if (apiMode) {
                                            const fd = new FormData();
                                            fd.append('acta', e.target.files[0]);
                                            const res = await fetch(`${BASE_API_URL}/meetings/${selectedMeeting.id}/upload-act`, {
                                              method: 'PUT',
                                              headers: getMultipartHeaders(),
                                              body: fd
                                            });
                                            const data = await res.json();
                                            const updated = meetings.map(m => {
                                              if (m.id === selectedMeeting.id) return { ...m, act_file_path: data.act_file_url, status: 'COMPLETADA' };
                                              return m;
                                            });
                                            setMeetings(updated);
                                            setSelectedMeeting({ ...selectedMeeting, act_file_url: data.act_file_url, status: 'COMPLETADA' });
                                          } else {
                                            const updated = meetings.map(m => {
                                              if (m.id === selectedMeeting.id) return { ...m, act_file_path: base64 };
                                              return m;
                                            });
                                            setMeetings(updated);
                                            setSelectedMeeting({ ...selectedMeeting, act_file_path: base64 });
                                            triggerSaveState({ meetings: updated });
                                          }
                                        }, () => {});
                                      }}
                                    />
                                  </label>
                                ) : (
                                  <span className="text-[10px] text-slate-600 font-semibold flex items-center space-x-0.5">
                                    <Lock className="w-2.5 h-2.5" />
                                    <span>Sin Archivo</span>
                                  </span>
                                )
                              )}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-sm text-slate-200 uppercase tracking-wider block">Compromisos Asignados</h4>
                              {userRole === 'ADMIN' && (
                                <button 
                                  onClick={() => {
                                    const desc = prompt("Descripción del acuerdo:");
                                    const resp = prompt("Responsable:");
                                    if (desc && resp) {
                                      const newCom = {
                                        id: commitments.length + 1,
                                        meeting_id: selectedMeeting.id,
                                        description: desc,
                                        responsible_name: resp,
                                        due_date: new Date(Date.now() + 15*24*60*60*1000).toISOString().split('T')[0],
                                        status: 'PENDIENTE',
                                        closed_at: null
                                      };
                                      setCommitments([newCom, ...commitments]);
                                      triggerSaveState({ commitments: [newCom, ...commitments] });

                                      if (apiMode) {
                                        fetch(`${BASE_API_URL}/meetings/${selectedMeeting.id}/commitments`, {
                                          method: 'POST',
                                          headers: getRequestHeaders(),
                                          body: JSON.stringify(newCom)
                                        });
                                      }
                                    }
                                  }}
                                  className="text-xs text-emerald-400 hover:underline flex items-center space-x-1 font-bold"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Añadir Compromiso</span>
                                </button>
                              )}
                            </div>

                            <div className="space-y-2 font-sans">
                              {commitments.filter(c => c.meeting_id === selectedMeeting.id).length === 0 ? (
                                <p className="text-[11px] text-slate-500 italic">No se han registrado acuerdos en esta sesión.</p>
                              ) : (
                                commitments.filter(c => c.meeting_id === selectedMeeting.id).map(c => {
                                  const isDone = c.status === 'COMPLETADO';
                                  return (
                                    <div key={c.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-900 flex items-start space-x-3.5">
                                      <button 
                                        disabled={userRole !== 'ADMIN'}
                                        onClick={() => toggleCommitment(c.id)}
                                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                          isDone 
                                            ? 'bg-emerald-500 border-emerald-400 text-white' 
                                            : 'border-slate-700 disabled:opacity-40'
                                        }`}
                                      >
                                        {isDone && <Check className="w-4 h-4" />}
                                      </button>
                                      <div className="flex-1">
                                        <p className={`text-xs font-semibold ${isDone ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{c.description}</p>
                                        <span className="text-[9px] text-slate-500 block mt-0.5">Encargado: {c.responsible_name} | Límite: {c.due_date}</span>
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-700">
                            <Calendar className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-300">Selecciona una Reunión</p>
                            <p className="text-[10px] text-slate-500 max-w-xs mx-auto">Selecciona una sesión del historial lateral para ver las actas firmadas y dar seguimiento a los compromisos.</p>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* INSPECCIONES VIEW */}
              {activeTab === 'inspections' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Inspecciones en Terreno</h2>
                      <p className="text-xs md:text-sm text-slate-400">Control de condiciones inseguras y hallazgos operacionales.</p>
                    </div>
                    {userRole === 'ADMIN' ? (
                      <button 
                        onClick={() => setShowInspectionModal(true)}
                        className="btn-gradient flex items-center space-x-1 text-xs"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Nueva Inspección</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-500 flex items-center space-x-1">
                        <Lock className="w-3.5 h-3.5 text-slate-600" />
                        <span>Lectura (Público)</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    
                    {/* Left List */}
                    <div className={`glass-card rounded-3xl p-5 space-y-4 ${selectedInspection ? 'hidden lg:block' : 'block'}`}>
                      <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider block font-sans">Recorridos Programados</h3>
                      
                      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                        {inspections.map(insp => {
                          const isSelected = selectedInspection?.id === insp.id;
                          return (
                            <div 
                              key={insp.id}
                              onClick={() => setSelectedInspection(insp)}
                              className={`p-3.5 rounded-xl cursor-pointer border transition-all duration-350 ${
                                isSelected 
                                  ? 'bg-emerald-500/10 border-emerald-500/40 shadow-md' 
                                  : 'bg-slate-950/40 border-slate-900 hover:border-slate-800'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[9px] font-bold mb-1.5">
                                <span className={`px-1.5 py-0.5 rounded ${
                                  insp.status === 'COMPLETADA' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                }`}>
                                  {insp.status === 'COMPLETADA' ? 'Realizada' : 'Planificada'}
                                </span>
                                <span className="text-slate-500 font-sans">{insp.planned_date}</span>
                              </div>
                              <h4 className="font-bold text-sm text-slate-100 line-clamp-1">{insp.title}</h4>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Detail Pane */}
                    <div className={`lg:col-span-2 glass-card rounded-3xl p-6 md:p-8 space-y-6 ${!selectedInspection ? 'hidden lg:block' : 'block'}`}>
                      {selectedInspection ? (
                        <>
                          <button 
                            onClick={() => setSelectedInspection(null)}
                            className="lg:hidden flex items-center space-x-1.5 text-emerald-400 hover:text-emerald-300 font-bold text-xs mb-3"
                          >
                            <ArrowLeft className="w-4.5 h-4.5" />
                            <span>Volver al listado</span>
                          </button>

                          <div className="border-b border-slate-800 pb-5 space-y-3">
                            <div className="flex justify-between items-center text-[10px] font-bold">
                              <span className="text-emerald-400 uppercase tracking-widest block font-sans">Detalle de Recorrido</span>
                              <span className="text-slate-500">Inspector: {selectedInspection.inspector_name}</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-extrabold text-white font-sans">{selectedInspection.title}</h3>
                            <div className="flex items-center space-x-4 text-xs text-slate-400 pt-1 font-sans">
                              <span>Planificado: <strong className="text-slate-200">{selectedInspection.planned_date}</strong></span>
                              {selectedInspection.conducted_date && (
                                <span>Realizado: <strong className="text-emerald-400">{selectedInspection.conducted_date}</strong></span>
                              )}
                            </div>
                          </div>

                          {/* Findings Section */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-sm text-slate-200 uppercase tracking-wider block">Desviaciones y Respaldos</h4>
                              {userRole === 'ADMIN' && (
                                <button 
                                  onClick={() => setShowFindingModal(true)}
                                  className="text-xs text-emerald-400 hover:underline flex items-center space-x-1 font-bold"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Añadir Hallazgo</span>
                                </button>
                              )}
                            </div>

                            <div className="space-y-3">
                              {findings.filter(f => f.inspection_id === selectedInspection.id).length === 0 ? (
                                <p className="text-[11px] text-slate-500 italic">No se han registrado hallazgos en este recorrido.</p>
                              ) : (
                                findings.filter(f => f.inspection_id === selectedInspection.id).map(f => {
                                  const isCrit = f.risk_level === 'CRITICO' || f.risk_level === 'ALTO';
                                  const isClosed = f.status === 'CERRADO';
                                  return (
                                    <div key={f.id} className="p-4 rounded-xl bg-slate-950 border border-slate-900 space-y-3">
                                      <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold ${
                                            f.risk_level === 'CRITICO' ? 'bg-rose-500/20 text-rose-400' :
                                            f.risk_level === 'ALTO' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
                                          }`}>
                                            RIESGO {f.risk_level}
                                          </span>
                                          <h5 className="font-semibold text-xs text-slate-100 leading-snug mt-1.5">{f.description}</h5>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold ${
                                          isClosed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400 animate-pulse'
                                        }`}>
                                          {f.status}
                                        </span>
                                      </div>

                                      {/* EVIDENCE PHOTO PREVIEW */}
                                      {(f.evidence_file_path || f.evidence_file_url) && (
                                        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-850 flex items-center space-x-3 max-w-sm">
                                          <div className="w-12 h-12 rounded bg-slate-950 flex-shrink-0 overflow-hidden border border-slate-800 flex items-center justify-center">
                                            {((f.evidence_file_path && f.evidence_file_path.startsWith('data:')) || f.evidence_file_url) ? (
                                              <img src={f.evidence_file_url || f.evidence_file_path} className="w-full h-full object-cover" />
                                            ) : (
                                              <Camera className="w-5 h-5 text-emerald-400" />
                                            )}
                                          </div>
                                          <div>
                                            <p className="text-[10px] font-bold text-slate-355">Evidencia Adjunta</p>
                                            <button 
                                              onClick={() => {
                                                const url = f.evidence_file_url || f.evidence_file_path;
                                                if (url.startsWith('data:')) {
                                                  const win = window.open();
                                                  if (win) win.document.write(`<img src="${url}" style="max-width:100%; height:auto;" />`);
                                                } else {
                                                  window.open(url, '_blank');
                                                }
                                              }}
                                              className="text-[9px] text-emerald-400 font-bold hover:underline"
                                            >
                                              Previsualizar Evidencia
                                            </button>
                                          </div>
                                        </div>
                                      )}

                                      <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500 font-sans">
                                        <span>Medida: <strong className="text-slate-400">{f.corrective_measure}</strong></span>
                                        {!isClosed && userRole === 'ADMIN' && (
                                          <button 
                                            onClick={() => handleCloseFinding(f.id)}
                                            className="px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold transition-all border border-emerald-500/20"
                                          >
                                            Solucionado
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-700">
                            <ClipboardList className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-300">Selecciona un Recorrido</p>
                            <p className="text-[10px] text-slate-500 max-w-xs mx-auto">Selecciona una inspección del listado para auditar desviaciones críticas e ingresar respaldos visuales.</p>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* CAPACITACIONES VIEW */}
              {activeTab === 'trainings' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-sans">Matriz de Capacitaciones</h2>
                      <p className="text-xs md:text-sm text-slate-400">Control de competencias e inducciones preventivas.</p>
                    </div>
                    {userRole === 'ADMIN' ? (
                      <button 
                        onClick={() => setShowTrainingModal(true)}
                        className="btn-gradient flex items-center space-x-1 text-xs"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Programar Curso</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-500 flex items-center space-x-1">
                        <Lock className="w-3.5 h-3.5 text-slate-600" />
                        <span>Lectura (Público)</span>
                      </span>
                    )}
                  </div>

                  {/* Filtro de Categorías */}
                  <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-950/80 border border-slate-900 rounded-2xl max-w-lg">
                    {[
                      { id: 'ALL', name: 'Todos los Cursos' },
                      { id: 'SEGURIDAD', name: 'Seguridad Industrial' },
                      { id: 'SALUD', name: 'Salud y RCP' },
                      { id: 'NORMATIVA', name: 'Normativa Legal' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setTrainingCategoryFilter(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          trainingCategoryFilter === cat.id 
                            ? 'bg-emerald-500 text-white shadow shadow-emerald-500/10' 
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    
                    {/* Left List */}
                    <div className={`glass-card rounded-3xl p-5 space-y-4 ${selectedTraining ? 'hidden lg:block' : 'block'}`}>
                      <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider block font-sans">Cursos Activos</h3>
                      
                      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                        {categorizedTrainings.map(t => {
                          const isSelected = selectedTraining?.id === t.id;
                          return (
                            <div 
                              key={t.id}
                              onClick={() => setSelectedTraining(t)}
                              className={`p-3.5 rounded-xl cursor-pointer border transition-all duration-300 ${
                                isSelected 
                                  ? 'bg-emerald-500/10 border-emerald-500/40 shadow-md' 
                                  : 'bg-slate-950/40 border-slate-900 hover:border-slate-800'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[9px] font-bold mb-1.5">
                                <span className="px-1.5 py-0.5 rounded bg-slate-900 text-emerald-450 uppercase">
                                  {t.category || 'SEGURIDAD'}
                                </span>
                                <span className="text-slate-500 font-sans">{t.planned_date}</span>
                              </div>
                              <h4 className="font-bold text-sm text-slate-100 line-clamp-1">{t.topic}</h4>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Detail Pane */}
                    <div className={`lg:col-span-2 glass-card rounded-3xl p-6 md:p-8 space-y-6 ${!selectedTraining ? 'hidden lg:block' : 'block'}`}>
                      {selectedTraining ? (
                        <>
                          <button 
                            onClick={() => setSelectedTraining(null)}
                            className="lg:hidden flex items-center space-x-1.5 text-emerald-400 hover:text-emerald-300 font-bold text-xs mb-3"
                          >
                            <ArrowLeft className="w-4.5 h-4.5" />
                            <span>Volver al listado</span>
                          </button>

                          <div className="border-b border-slate-800 pb-5 space-y-3">
                            <div className="flex justify-between items-center text-[10px] font-bold">
                              <span className="text-emerald-400 uppercase tracking-widest block font-sans">Acreditación Legal</span>
                              <span className="text-slate-500">Duración: {selectedTraining.hours} Horas</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-extrabold text-white font-sans">{selectedTraining.topic}</h3>
                            
                            <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-1 font-sans">
                              <span>Categoría: <strong className="text-emerald-400 uppercase">{selectedTraining.category || 'SEGURIDAD'}</strong></span>
                              <span>Realización: <strong className="text-slate-200">{selectedTraining.conducted_date || 'PENDIENTE'}</strong></span>
                            </div>
                          </div>

                          {/* Trained Employees */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-sm text-slate-200 uppercase tracking-wider block">Trabajadores Certificados</h4>
                              {userRole === 'ADMIN' && selectedTraining.status === 'COMPLETADA' && (
                                <button 
                                  onClick={() => setShowAttendeeModal(true)}
                                  className="text-xs text-emerald-400 hover:underline flex items-center space-x-1 font-bold"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Acreditar Trabajador</span>
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {certificates.filter(c => c.training_id === selectedTraining.id).length === 0 ? (
                                <p className="text-[11px] text-slate-500 italic col-span-full">No se han registrado acreditaciones.</p>
                              ) : (
                                certificates.filter(c => c.training_id === selectedTraining.id).map(c => (
                                  <div key={c.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-900 flex justify-between items-center">
                                    <div>
                                      <h5 className="font-bold text-xs text-slate-100">{c.employee_name}</h5>
                                      <span className="text-[9px] text-slate-500 block font-sans">RUN: {c.employee_run}</span>
                                    </div>
                                    <button 
                                      onClick={() => triggerCertificatePrint(c)}
                                      className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex items-center space-x-1 font-bold text-[9px]"
                                    >
                                      <Eye className="w-4 h-4" />
                                      <span className="hidden sm:inline">Previsualizar</span>
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-700">
                            <GraduationCap className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-300">Selecciona un Curso</p>
                            <p className="text-[10px] text-slate-500 max-w-xs mx-auto">Selecciona una capacitación para auditar horas hombre, categorizar temáticas e imprimir diplomas oficiales.</p>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* CERTIFICADOS CENTRAL SEARCH */}
              {activeTab === 'certificates' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-sans">Buscador Central de Certificados</h2>
                    <p className="text-xs md:text-sm text-slate-400">Busca, previsualiza e imprime certificados legales de competencias y capacitaciones de tus trabajadores.</p>
                  </div>

                  <div className="glass-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-1">
                      <div className="absolute left-3 top-3 text-slate-500">
                        <Search className="w-5 h-5" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Buscar por Nombre, RUN (ej: 12.345.678-9) o Tema del curso..."
                        value={certSearchQuery}
                        onChange={(e) => setCertSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-650 text-sm focus:outline-none focus:border-emerald-500/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredCertificates.length === 0 ? (
                      <div className="col-span-full text-center py-8 glass-card rounded-2xl">
                        <p className="text-xs font-semibold text-slate-400">No se encontraron registros de acreditación.</p>
                      </div>
                    ) : (
                      filteredCertificates.map(c => (
                        <div key={c.id} className="glass-card rounded-2xl p-5 space-y-3 hover:border-emerald-500/20 transition-all duration-300">
                          <div className="flex justify-between items-start">
                            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                              <Award className="w-5 h-5" />
                            </div>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[8px] font-bold">VIGENTE</span>
                          </div>

                          <div className="space-y-0.5">
                            <h4 className="font-bold text-sm text-slate-100 font-sans">{c.employee_name}</h4>
                            <span className="text-[10px] text-slate-500 font-sans block">RUN: {c.employee_run}</span>
                          </div>

                          <div className="pt-2 border-t border-slate-900 space-y-1 font-sans">
                            <p className="text-[11px] font-semibold text-slate-300 line-clamp-1">{c.training_topic}</p>
                            <span className="text-[9px] text-slate-500 block">Acreditación: {c.training_date}</span>
                          </div>

                          <button 
                            onClick={() => triggerCertificatePrint(c)}
                            className="w-full mt-1.5 py-2 rounded-xl bg-slate-950 border border-slate-900 text-xs font-bold text-slate-300 flex items-center justify-center space-x-1.5 hover:bg-slate-900"
                          >
                            <Eye className="w-4 h-4 text-emerald-400" />
                            <span>Previsualizar Certificado</span>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ACCIDENTES VIEW */}
              {activeTab === 'accidents' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Investigación de Accidentes (5 Porqués)</h2>
                      <p className="text-xs md:text-sm text-slate-400">Metodología oficial de causa raíz y planes correctivos legales.</p>
                    </div>
                    {userRole === 'ADMIN' ? (
                      <button 
                        onClick={() => setShowAccidentModal(true)}
                        className="btn-gradient flex items-center space-x-1 text-xs"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Registrar Accidente</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-500 flex items-center space-x-1">
                        <Lock className="w-3.5 h-3.5 text-slate-600" />
                        <span>Lectura (Público)</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    
                    {/* Left List */}
                    <div className={`glass-card rounded-3xl p-5 space-y-4 ${selectedAccident ? 'hidden lg:block' : 'block'}`}>
                      <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider block font-sans">Registro de Sucesos</h3>
                      
                      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                        {accidents.map(a => {
                          const isSelected = selectedAccident?.id === a.id;
                          const completedCount = a.corrective_measures.filter(m => m.status === 'COMPLETADA').length;
                          const totalCount = a.corrective_measures.length;

                          return (
                            <div 
                              key={a.id}
                              onClick={() => setSelectedAccident(a)}
                              className={`p-3.5 rounded-xl cursor-pointer border transition-all duration-300 ${
                                isSelected 
                                  ? 'bg-emerald-500/10 border-emerald-500/40 shadow-md' 
                                  : 'bg-slate-950/40 border-slate-900 hover:border-slate-800'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[9px] font-bold mb-1.5">
                                <span className={`px-1.5 py-0.5 rounded ${
                                  a.accident_type === 'LEVE' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                                }`}>
                                  {a.accident_type}
                                </span>
                                <span className="text-slate-500 font-sans">{a.date.split(' ')[0]}</span>
                              </div>
                              <h4 className="font-bold text-sm text-slate-100 line-clamp-1">{a.employee_name}</h4>
                              <span className="text-[10px] text-slate-500 font-semibold block mt-1">Planes: {completedCount}/{totalCount} resueltos</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Detail Pane */}
                    <div className={`lg:col-span-2 glass-card rounded-3xl p-6 md:p-8 space-y-6 ${!selectedAccident ? 'hidden lg:block' : 'block'}`}>
                      {selectedAccident ? (
                        <>
                          <button 
                            onClick={() => setSelectedAccident(null)}
                            className="lg:hidden flex items-center space-x-1.5 text-emerald-400 hover:text-emerald-300 font-bold text-xs mb-3"
                          >
                            <ArrowLeft className="w-4.5 h-4.5" />
                            <span>Volver al listado</span>
                          </button>

                          <div className="border-b border-slate-800 pb-5 space-y-3">
                            <div className="flex justify-between items-center text-[10px] font-bold font-sans">
                              <span className="text-emerald-400 uppercase tracking-widest block">Investigación Oficial</span>
                              <span className="text-slate-500">Fecha Incidente: {selectedAccident.date}</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-extrabold text-white font-sans">Investigación: {selectedAccident.employee_name}</h3>
                            <p className="text-xs md:text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-900 mt-2 font-sans">
                              <strong className="text-slate-500 block mb-1">Descripción:</strong>
                              {selectedAccident.description}
                            </p>
                          </div>

                          {/* 5 Whys Chain */}
                          <div className="space-y-4">
                            <h4 className="font-bold text-xs text-white uppercase tracking-wider block font-sans">Cadena de los 5 Porqués (Causa Raíz)</h4>
                            
                            <div className="relative pl-5 border-l border-emerald-500/20 space-y-3.5">
                              {selectedAccident.root_cause_analysis.map((why, idx) => (
                                <div key={idx} className="relative">
                                  <span className="absolute -left-[26px] top-0 w-3.5 h-3.5 rounded-full bg-slate-950 border border-emerald-400 flex items-center justify-center text-[8px] font-bold text-emerald-400">
                                    {idx+1}
                                  </span>
                                  <p className="text-xs font-semibold text-slate-200">{why}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Corrective measures list */}
                          <div className="space-y-3 pt-3 border-t border-slate-905">
                            <h4 className="font-bold text-xs text-white uppercase tracking-wider block font-sans">Medidas Correctivas Legales</h4>
                            
                            <div className="space-y-2.5">
                              {selectedAccident.corrective_measures.map((m, idx) => {
                                const isDone = m.status === 'COMPLETADA';
                                return (
                                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-900 flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                      <button 
                                        disabled={userRole !== 'ADMIN'}
                                        onClick={() => toggleAccidentMeasure(selectedAccident.id, idx)}
                                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                                          isDone 
                                            ? 'bg-emerald-500 border-emerald-400 text-white' 
                                            : 'border-slate-700 disabled:opacity-40'
                                        }`}
                                      >
                                        {isDone && <Check className="w-3.5 h-3.5" />}
                                      </button>
                                      <div>
                                        <p className={`text-xs font-semibold ${isDone ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{m.measure}</p>
                                        <span className="text-[9px] text-slate-500 block font-sans">Fecha límite: {m.due_date}</span>
                                      </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                      isDone ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                    }`}>
                                      {m.status}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-700">
                            <Activity className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-300">Selecciona una Investigación</p>
                            <p className="text-[10px] text-slate-500 max-w-xs mx-auto">Selecciona una investigación para verificar los 5 Porqués y dar seguimiento a los planes correctivos.</p>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* CRONOGRAMA ANUAL GANTT */}
              {activeTab === 'cronogram' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-sans">Cronograma de Trabajo Anual (Gantt)</h2>
                    <p className="text-xs md:text-sm text-slate-400">Planificador de hitos anuales obligatorios y auditorías legales del CPHS.</p>
                  </div>

                  <div className="glass-card rounded-3xl p-5 md:p-8 space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-sans">Plan Anual 2026</span>
                      <span className="text-xs md:text-sm text-slate-300 font-semibold font-sans">
                        Cumplimiento Acumulado: <strong className="text-emerald-400 font-sans">{stats.complianceYear}%</strong>
                      </span>
                    </div>

                    <div className="space-y-6 pt-3">
                      {[
                        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                      ].map((monthName, idx) => {
                        const monthNum = idx + 1;
                        const monthTasks = annualPlan.filter(t => t.month === monthNum);

                        if (monthTasks.length === 0) return null;

                        return (
                          <div key={idx} className="space-y-2.5">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-emerald-500 pl-2">
                              {monthName}
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {monthTasks.map(t => {
                                const isDone = t.status === 'COMPLETADO';
                                return (
                                  <div 
                                    key={t.id}
                                    className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-3.5 transition-all duration-300 ${
                                      isDone ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-slate-900/40 border-slate-800'
                                    }`}
                                  >
                                    <div>
                                      <div className="flex justify-between items-center text-[9px] font-bold mb-1">
                                        <span className={`px-1.5 py-0.5 rounded ${
                                          t.type === 'REUNION' ? 'bg-cyan-500/15 text-cyan-400' : 'bg-purple-500/15 text-purple-400'
                                        }`}>
                                          {t.type}
                                        </span>
                                        <span className="text-slate-500 font-sans">RESP: {t.responsible}</span>
                                      </div>
                                      <h5 className="font-semibold text-xs text-slate-100 line-clamp-2">{t.task_name}</h5>
                                    </div>

                                    <div className="flex justify-between items-center pt-2 border-t border-slate-900">
                                      <span className={`text-[9px] font-bold font-sans ${isDone ? 'text-emerald-400' : 'text-slate-500'}`}>{t.status}</span>
                                      {userRole === 'ADMIN' ? (
                                        <button 
                                          onClick={() => toggleAnnualTask(t.id)}
                                          className={`px-2.5 py-1 rounded text-[9px] font-bold border transition-colors ${
                                            isDone ? 'bg-emerald-500/10 text-emerald-450 border-emerald-500/20' : 'bg-slate-800 text-slate-300 border-slate-700'
                                          }`}
                                        >
                                          {isDone ? 'Pendiente' : 'Completado'}
                                        </button>
                                      ) : (
                                        <span className="text-slate-650 flex items-center space-x-0.5 text-[9px] font-semibold">
                                          <Lock className="w-2.5 h-2.5" />
                                          <span>Solo Admin</span>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#070b19]/90 backdrop-blur-xl border-t border-slate-800/80 z-50 justify-around items-center px-1">
        {[
          { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
          { id: 'meetings', label: 'Sesiones', icon: Calendar },
          { id: 'inspections', label: 'Auditorías', icon: ClipboardList },
          { id: 'trainings', label: 'Cursos', icon: GraduationCap },
          { id: 'certificates', label: 'Buscar', icon: Search },
          { id: 'accidents', label: 'LOTO', icon: Activity },
          { id: 'cronogram', label: 'Gantt', icon: Clock }
        ].map(item => {
          const IconComp = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSelectedMeeting(null);
                setSelectedInspection(null);
                setSelectedTraining(null);
                setSelectedAccident(null);
              }}
              className="flex flex-col items-center justify-center flex-1 h-full py-2"
            >
              <div className={`p-1 rounded-lg transition-colors ${active ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500'}`}>
                <IconComp className="w-5 h-5 shrink-0" />
              </div>
              <span className={`text-[9px] font-bold mt-0.5 ${active ? 'text-emerald-400' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* MODALS */}
      
      {/* Modal 0: Trabajador del Mes */}
      {showWorkerModal && userRole === 'ADMIN' && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full bg-[#070b19] border-t md:border border-slate-800 rounded-t-3xl md:rounded-3xl p-6 md:p-8 space-y-5 max-h-[92vh] md:max-h-[90vh] md:max-w-lg overflow-y-auto pb-8 shadow-2xl">
            <div className="block md:hidden w-12 h-1 bg-slate-800 rounded-full mx-auto mb-2"></div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white font-sans">Actualizar Trabajador del Mes</h3>
              <button onClick={() => setShowWorkerModal(false)} className="text-slate-500 p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveWorkerOfMonth} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nombre Completo</label>
                <input 
                  type="text" required value={workerForm.name}
                  onChange={(e) => setWorkerForm({ ...workerForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Puesto / Cargo</label>
                <input 
                  type="text" required value={workerForm.role}
                  onChange={(e) => setWorkerForm({ ...workerForm, role: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Descripción del Mérito de Seguridad</label>
                <textarea 
                  rows="3" required value={workerForm.reason}
                  onChange={(e) => setWorkerForm({ ...workerForm, reason: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                />
              </div>
              <div className="flex space-x-3 pt-3">
                <button type="button" onClick={() => setShowWorkerModal(false)} className="btn-secondary flex-1">Cancelar</button>
                <button type="submit" className="btn-gradient flex-1">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 1: Registrar Reunión */}
      {showMeetingModal && userRole === 'ADMIN' && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full bg-[#070b19] border-t md:border border-slate-800 rounded-t-3xl md:rounded-3xl p-6 md:p-8 space-y-5 max-h-[92vh] md:max-h-[90vh] md:max-w-lg overflow-y-auto pb-8 shadow-2xl">
            <div className="block md:hidden w-12 h-1 bg-slate-800 rounded-full mx-auto mb-2"></div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white font-sans">Registrar Reunión CPHS</h3>
              <button onClick={() => setShowMeetingModal(false)} className="text-slate-500 p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateMeeting} className="space-y-4 font-sans">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Título de la Sesión</label>
                <input 
                  type="text" required placeholder="Ej: Reunión Ordinaria Junio"
                  value={meetingForm.title}
                  onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tipo</label>
                  <select 
                    value={meetingForm.type}
                    onChange={(e) => setMeetingForm({ ...meetingForm, type: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                  >
                    <option value="ORDINARIA">Ordinaria</option>
                    <option value="EXTRAORDINARIA">Extraordinaria</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fecha</label>
                  <input 
                    type="date" required value={meetingForm.date}
                    onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tabla / Puntos a Tratar</label>
                <textarea 
                  rows="3" placeholder="Puntos a auditar..."
                  value={meetingForm.description}
                  onChange={(e) => setMeetingForm({ ...meetingForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Asistentes (separados por coma)</label>
                <input 
                  type="text" placeholder="Ej: Juan Pérez, María Gómez"
                  value={meetingForm.attendees}
                  onChange={(e) => setMeetingForm({ ...meetingForm, attendees: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Adjuntar Evidencia del Acta (PDF/Imagen - Max 5MB)</label>
                <input 
                  type="file" accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => handleSafeFileBase64(e, setMeetingFileBase64, setMeetingRawFile)}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-emerald-400 hover:file:bg-slate-800"
                />
              </div>

              <div className="flex space-x-3 pt-3">
                <button type="button" onClick={() => setShowMeetingModal(false)} className="btn-secondary flex-1">Cancelar</button>
                <button type="submit" className="btn-gradient flex-1">Crear Reunión</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Programar Inspección */}
      {showInspectionModal && userRole === 'ADMIN' && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full bg-[#070b19] border-t md:border border-slate-800 rounded-t-3xl md:rounded-3xl p-6 md:p-8 space-y-5 max-h-[92vh] md:max-h-[90vh] md:max-w-lg overflow-y-auto pb-8 shadow-2xl">
            <div className="block md:hidden w-12 h-1 bg-slate-800 rounded-full mx-auto mb-2"></div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white font-sans">Programar Inspección de Terreno</h3>
              <button onClick={() => setShowInspectionModal(false)} className="text-slate-500 p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateInspection} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nombre de la Inspección</label>
                <input 
                  type="text" required placeholder="Ej: Inspección Mensual de EPP - Talleres"
                  value={inspectionForm.title}
                  onChange={(e) => setInspectionForm({ ...inspectionForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fecha Planificada</label>
                  <input 
                    type="date" required value={inspectionForm.planned_date}
                    onChange={(e) => setInspectionForm({ ...inspectionForm, planned_date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Inspector Asignado</label>
                  <input 
                    type="text" required placeholder="Ej: Pedro Silva"
                    value={inspectionForm.inspector_name}
                    onChange={(e) => setInspectionForm({ ...inspectionForm, inspector_name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fecha Realización (Opcional)</label>
                <input 
                  type="date" value={inspectionForm.conducted_date}
                  onChange={(e) => setInspectionForm({ ...inspectionForm, conducted_date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                />
              </div>

              <div className="flex space-x-3 pt-3">
                <button type="button" onClick={() => setShowInspectionModal(false)} className="btn-secondary flex-1">Cancelar</button>
                <button type="submit" className="btn-gradient flex-1">Programar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Reportar Hallazgo */}
      {showFindingModal && userRole === 'ADMIN' && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full bg-[#070b19] border-t md:border border-slate-800 rounded-t-3xl md:rounded-3xl p-6 md:p-8 space-y-5 max-h-[92vh] md:max-h-[90vh] md:max-w-lg overflow-y-auto pb-8 shadow-2xl">
            <div className="block md:hidden w-12 h-1 bg-slate-800 rounded-full mx-auto mb-2"></div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white font-sans">Reportar Desviación / Hallazgo</h3>
              <button onClick={() => setShowFindingModal(false)} className="text-slate-500 p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateFinding} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Descripción del Hallazgo</label>
                <textarea 
                  rows="3" required placeholder="Describa la condición insegura..."
                  value={findingForm.description}
                  onChange={(e) => setFindingForm({ ...findingForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Riesgo</label>
                  <select 
                    value={findingForm.risk_level}
                    onChange={(e) => setFindingForm({ ...findingForm, risk_level: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                  >
                    <option value="BAJO">Bajo</option>
                    <option value="MEDIO">Medio</option>
                    <option value="ALTO">Alto</option>
                    <option value="CRITICO">Crítico</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Límite de Cierre</label>
                  <input 
                    type="date" required value={findingForm.due_date}
                    onChange={(e) => setFindingForm({ ...findingForm, due_date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Medida Correctiva Asignada</label>
                <input 
                  type="text" required placeholder="Ej: Adquirir e instalar resguardo físico"
                  value={findingForm.corrective_measure}
                  onChange={(e) => setFindingForm({ ...findingForm, corrective_measure: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Adjuntar Evidencia Fotográfica (JPG/PNG - Max 5MB)</label>
                <input 
                  type="file" accept=".png,.jpg,.jpeg,.webp"
                  onChange={(e) => handleSafeFileBase64(e, setFindingFileBase64, setFindingRawFile)}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-emerald-400 hover:file:bg-slate-800"
                />
              </div>

              <div className="flex space-x-3 pt-3">
                <button type="button" onClick={() => setShowFindingModal(false)} className="btn-secondary flex-1">Cancelar</button>
                <button type="submit" className="btn-gradient flex-1">Reportar Desviación</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Programar Capacitación */}
      {showTrainingModal && userRole === 'ADMIN' && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full bg-[#070b19] border-t md:border border-slate-800 rounded-t-3xl md:rounded-3xl p-6 md:p-8 space-y-5 max-h-[92vh] md:max-h-[90vh] md:max-w-lg overflow-y-auto pb-8 shadow-2xl">
            <div className="block md:hidden w-12 h-1 bg-slate-800 rounded-full mx-auto mb-2"></div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white font-sans">Programar Capacitación</h3>
              <button onClick={() => setShowTrainingModal(false)} className="text-slate-500 p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateTraining} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tema o Título del Curso</label>
                <input 
                  type="text" required placeholder="Ej: Uso y Manejo de Extintores Portátiles"
                  value={trainingForm.topic}
                  onChange={(e) => setTrainingForm({ ...trainingForm, topic: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Categoría de Curso</label>
                  <select 
                    value={trainingForm.category}
                    onChange={(e) => setTrainingForm({ ...trainingForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                  >
                    <option value="SEGURIDAD">Seguridad Industrial</option>
                    <option value="SALUD">Salud y RCP</option>
                    <option value="NORMATIVA">Legislación Legal</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Horas Formativas</label>
                  <input 
                    type="number" required min="1" max="40" value={trainingForm.hours}
                    onChange={(e) => setTrainingForm({ ...trainingForm, hours: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fecha Programada</label>
                  <input 
                    type="date" required value={trainingForm.planned_date}
                    onChange={(e) => setTrainingForm({ ...trainingForm, planned_date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fecha Realización (Opcional)</label>
                  <input 
                    type="date" value={trainingForm.conducted_date}
                    onChange={(e) => setTrainingForm({ ...trainingForm, conducted_date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-3">
                <button type="button" onClick={() => setShowTrainingModal(false)} className="btn-secondary flex-1">Cancelar</button>
                <button type="submit" className="btn-gradient flex-1">Guardar Curso</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: Acreditar Trabajador */}
      {showAttendeeModal && userRole === 'ADMIN' && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full bg-[#070b19] border-t md:border border-slate-800 rounded-t-3xl md:rounded-3xl p-6 md:p-8 space-y-5 max-h-[92vh] md:max-h-[90vh] md:max-w-md overflow-y-auto pb-8 shadow-2xl">
            <div className="block md:hidden w-12 h-1 bg-slate-800 rounded-full mx-auto mb-2"></div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white font-sans">Acreditar Trabajador</h3>
              <button onClick={() => setShowAttendeeModal(false)} className="text-slate-500 p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddAttendee} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nombre del Colaborador</label>
                <input 
                  type="text" required placeholder="Ej: Carlos Mendoza"
                  value={attendeeForm.employee_name}
                  onChange={(e) => setAttendeeForm({ ...attendeeForm, employee_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-850 text-slate-100 text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cédula de Identidad / RUN</label>
                <input 
                  type="text" required placeholder="Ej: 18.555.666-4"
                  value={attendeeForm.employee_run}
                  onChange={(e) => setAttendeeForm({ ...attendeeForm, employee_run: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-850 text-slate-100 text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estado</label>
                <select 
                  value={attendeeForm.status}
                  onChange={(e) => setAttendeeForm({ ...attendeeForm, status: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                >
                  <option value="APROBADO">Aprobado (Genera Certificado)</option>
                  <option value="ASISTIO">Asistió</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-3">
                <button type="button" onClick={() => setShowAttendeeModal(false)} className="btn-secondary flex-1">Cancelar</button>
                <button type="submit" className="btn-gradient flex-1">Acreditar y Cerrar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 6: Registrar Accidente */}
      {showAccidentModal && userRole === 'ADMIN' && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full bg-[#070b19] border-t md:border border-slate-800 rounded-t-3xl md:rounded-3xl p-6 md:p-8 space-y-5 max-h-[92vh] md:max-h-[90vh] md:max-w-2xl overflow-y-auto pb-8 shadow-2xl">
            <div className="block md:hidden w-12 h-1 bg-slate-800 rounded-full mx-auto mb-2"></div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white font-sans">Investigación de Accidente</h3>
              <button onClick={() => setShowAccidentModal(false)} className="text-slate-500 p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateAccident} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nombre del Afectado</label>
                  <input 
                    type="text" required placeholder="Ej: Juan Pérez"
                    value={accidentForm.employee_name}
                    onChange={(e) => setAccidentForm({ ...accidentForm, employee_name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fecha y Hora</label>
                  <input 
                    type="datetime-local" required value={accidentForm.date}
                    onChange={(e) => setAccidentForm({ ...accidentForm, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gravedad Legal</label>
                  <select 
                    value={accidentForm.accident_type}
                    onChange={(e) => setAccidentForm({ ...accidentForm, accident_type: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                  >
                    <option value="LEVE">Leve (Corte, golpe menor)</option>
                    <option value="GRAVE">Grave (Fractura, hospitalización)</option>
                    <option value="FATAL">Fatal</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Descripción de lo Sucedido</label>
                <textarea 
                  rows="2" required placeholder="Relato detallado de la desviación..."
                  value={accidentForm.description}
                  onChange={(e) => setAccidentForm({ ...accidentForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-850 space-y-3">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block font-sans">Cadena de los 5 Porqués</span>
                <input 
                  type="text" required placeholder="1. ¿Por qué ocurrió el contacto?"
                  value={accidentForm.why1}
                  onChange={(e) => setAccidentForm({ ...accidentForm, why1: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none"
                />
                <input 
                  type="text" required placeholder="2. ¿Por qué...? (Siguiente causa)"
                  value={accidentForm.why2}
                  onChange={(e) => setAccidentForm({ ...accidentForm, why2: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-850 space-y-3">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block font-sans">Medida Correctiva Inicial</span>
                <div className="grid grid-cols-3 gap-2">
                  <input 
                    type="text" required placeholder="Acción correctiva obligatoria..."
                    value={accidentForm.measure1}
                    onChange={(e) => setAccidentForm({ ...accidentForm, measure1: e.target.value })}
                    className="col-span-2 px-3 py-2 rounded-lg bg-slate-950 border border-slate-850 text-xs text-slate-105 focus:outline-none"
                  />
                  <input 
                    type="date" value={accidentForm.measure1Date}
                    onChange={(e) => setAccidentForm({ ...accidentForm, measure1Date: e.target.value })}
                    className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-850 text-xs text-slate-105 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-3">
                <button type="button" onClick={() => setShowAccidentModal(false)} className="btn-secondary flex-1">Cancelar</button>
                <button type="submit" className="btn-gradient flex-1">Guardar Investigación</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 7: Visor de Certificados/Diplomas Pre-descarga */}
      {activeCertificatePdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg md:max-w-2xl bg-white text-slate-900 rounded-3xl p-6 md:p-10 space-y-6 md:space-y-8 shadow-2xl relative border-8 border-emerald-500/10">
            
            <button 
              onClick={() => setActiveCertificatePdf(null)}
              className="absolute right-4 top-4 md:right-6 md:top-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-505 hover:text-slate-900 border transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-4 md:space-y-6 py-4 md:py-6 border-4 border-double border-slate-300 p-4 md:p-8 rounded-xl relative">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 mx-auto flex items-center justify-center text-emerald-600">
                <Shield className="w-7 h-7 md:w-8 md:h-8" />
              </div>

              <div className="space-y-1.5 font-sans">
                <h2 className="font-extrabold text-lg md:text-2xl tracking-wider text-slate-800 uppercase font-sans">CERTIFICADO DE ACREDITACIÓN</h2>
                <p className="text-[8px] md:text-[10px] tracking-widest text-emerald-600 font-bold uppercase">Comité Paritario de Higiene y Seguridad</p>
              </div>

              <p className="text-[10px] md:text-xs text-slate-505 max-w-md mx-auto leading-relaxed">
                El CPHS y la Dirección de Prevención de Riesgos de la Compañía certifican bajo el marco de las normativas de seguridad que el(la) trabajador(a):
              </p>

              <div className="space-y-0.5">
                <h3 className="text-lg md:text-2xl font-bold text-slate-900 font-sans">{activeCertificatePdf.employee_name}</h3>
                <p className="text-[10px] md:text-xs font-semibold text-slate-400">RUN: {activeCertificatePdf.employee_run}</p>
              </div>

              <p className="text-[10px] md:text-xs text-slate-505">
                Ha aprobado y completado el curso teórico-práctico de:
              </p>

              <div className="bg-slate-50 p-3 md:p-4 rounded-xl border border-slate-200 inline-block w-full md:w-auto md:max-w-lg font-sans">
                <h4 className="font-bold text-xs md:text-sm text-slate-850 leading-snug">{activeCertificatePdf.training_topic}</h4>
                <p className="text-[9px] md:text-[10px] text-slate-405 font-semibold mt-1">Fecha de Acreditación: {activeCertificatePdf.training_date}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 md:gap-12 pt-6 md:pt-8 max-w-md mx-auto">
                <div className="text-center border-t border-slate-300 pt-2">
                  <div className="h-6 md:h-8 italic text-slate-400 text-[10px] md:text-xs font-serif flex items-center justify-center">Jaime López</div>
                  <span className="text-[8px] md:text-[9px] font-bold text-slate-550 uppercase tracking-wider block font-sans">Presidente CPHS</span>
                </div>
                <div className="text-center border-t border-slate-300 pt-2">
                  <div className="h-6 md:h-8 italic text-slate-400 text-[10px] md:text-xs font-serif flex items-center justify-center">Prevencionista</div>
                  <span className="text-[8px] md:text-[9px] font-bold text-slate-550 uppercase tracking-wider block font-sans">Asesor CPHS</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2.5 justify-end">
              <button 
                onClick={() => setActiveCertificatePdf(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border text-slate-700 text-xs font-bold transition-all flex-1 md:flex-none"
              >
                Cerrar Vista
              </button>
              <button 
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-1.5 flex-1 md:flex-none"
              >
                <Download className="w-4 h-4" />
                <span>Descargar e Imprimir</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
