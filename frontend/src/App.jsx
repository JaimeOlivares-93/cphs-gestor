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
  TrendingUp,
  FileMinus
} from 'lucide-react';

// ============================================================================
// DATOS SEMILLA DE RESPALDO (Offline Demo State)
// ============================================================================
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
    { id: 1, topic: 'Uso y Manejo de Extintores Portátiles PQS y CO2', planned_date: '2026-03-25', conducted_date: '2026-03-25', hours: 2, attendee_count: 5, status: 'COMPLETADA', attendance_list_file_path: 'mock_lista_ext.pdf', photo_file_path: 'mock_foto_ext.jpg', material_file_path: 'mock_manual_ext.pdf' },
    { id: 2, topic: 'Curso Básico de Primeros Auxilios y Reanimación RCP', planned_date: '2026-05-18', conducted_date: '2026-05-18', hours: 4, attendee_count: 4, status: 'COMPLETADA', attendance_list_file_path: 'mock_lista_rcp.pdf', photo_file_path: 'mock_foto_rcp.jpg', material_file_path: null },
    { id: 3, topic: 'Prevención de Riesgos de Atrapamientos y EPP', planned_date: '2026-06-22', conducted_date: null, hours: 2, attendee_count: 0, status: 'PENDIENTE', attendance_list_file_path: null, photo_file_path: null, material_file_path: null }
  ],
  training_employees: [
    { id: 1, training_id: 1, employee_name: 'Juan Pérez', employee_run: '12.345.678-9', certificate_file_path: 'mock_cert_juan.pdf', status: 'APROBADO', training_topic: 'Uso y Manejo de Extintores Portátiles PQS y CO2', training_date: '2026-03-25' },
    { id: 2, training_id: 1, employee_name: 'María Gómez', employee_run: '15.432.109-8', certificate_file_path: 'mock_cert_maria.pdf', status: 'APROBADO', training_topic: 'Uso y Manejo de Extintores Portátiles PQS y CO2', training_date: '2026-03-25' },
    { id: 3, training_id: 1, employee_name: 'Pedro Silva', employee_run: '11.222.333-k', certificate_file_path: 'mock_cert_pedro.pdf', status: 'APROBADO', training_topic: 'Uso y Manejo de Extintores Portátiles PQS y CO2', training_date: '2026-03-25' },
    { id: 4, training_id: 1, employee_name: 'Carlos Mendoza', employee_run: '18.555.666-4', certificate_file_path: 'mock_cert_carlos.pdf', status: 'APROBADO', training_topic: 'Uso y Manejo de Extintores Portátiles PQS y CO2', training_date: '2026-03-25' },
    { id: 5, training_id: 1, employee_name: 'Ana López', employee_run: '14.999.888-7', certificate_file_path: 'mock_cert_ana.pdf', status: 'APROBADO', training_topic: 'Uso y Manejo de Extintores Portátiles PQS y CO2', training_date: '2026-03-25' },
    { id: 6, training_id: 2, employee_name: 'Juan Pérez', employee_run: '12.345.678-9', certificate_file_path: 'mock_cert_juan_rcp.pdf', status: 'APROBADO', training_topic: 'Curso Básico de Primeros Auxilios y Reanimación RCP', training_date: '2026-05-18' },
    { id: 7, training_id: 2, employee_name: 'María Gómez', employee_run: '15.432.109-8', certificate_file_path: 'mock_cert_maria_rcp.pdf', status: 'APROBADO', training_topic: 'Curso Básico de Primeros Auxilios y Reanimación RCP', training_date: '2026-05-18' },
    { id: 8, training_id: 2, employee_name: 'Pedro Silva', employee_run: '11.222.333-k', certificate_file_path: 'mock_cert_pedro_rcp.pdf', status: 'APROBADO', training_topic: 'Curso Básico de Primeros Auxilios y Reanimación RCP', training_date: '2026-05-18' },
    { id: 9, training_id: 2, employee_name: 'Ana López', employee_run: '14.999.888-7', certificate_file_path: 'mock_cert_ana_rcp.pdf', status: 'APROBADO', training_topic: 'Curso Básico de Primeros Auxilios y Reanimación RCP', training_date: '2026-05-18' }
  ],
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
  
  // App Connection State
  const [apiMode, setApiMode] = useState(false);
  const [loading, setLoading] = useState(true);

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

  // Modal / Form trigger states
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [showFindingModal, setShowFindingModal] = useState(false);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [showAttendeeModal, setShowAttendeeModal] = useState(false);
  const [showAccidentModal, setShowAccidentModal] = useState(false);

  // Form Fields State
  const [meetingForm, setMeetingForm] = useState({ title: '', type: 'ORDINARIA', date: '', description: '', attendees: '' });
  const [commitmentForm, setCommitmentForm] = useState({ description: '', responsible_name: '', due_date: '' });
  const [inspectionForm, setInspectionForm] = useState({ title: '', planned_date: '', conducted_date: '', inspector_name: '' });
  const [findingForm, setFindingForm] = useState({ description: '', risk_level: 'MEDIO', due_date: '', corrective_measure: '' });
  const [trainingForm, setTrainingForm] = useState({ topic: '', planned_date: '', conducted_date: '', hours: 1 });
  const [attendeeForm, setAttendeeForm] = useState({ employee_name: '', employee_run: '', status: 'APROBADO' });
  const [accidentForm, setAccidentForm] = useState({
    employee_name: '',
    date: '',
    accident_type: 'LEVE',
    description: '',
    why1: '', why2: '', why3: '', why4: '', why5: '',
    measure1: '', measure1Date: '',
    measure2: '', measure2Date: ''
  });

  // ============================================================================
  // INITIAL DATA INITIALIZER (Sync with Backend or fallback to localStorage)
  // ============================================================================
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Intentar conectar con la API de Node
        const testRes = await fetch(`${BASE_API_URL}/dashboard/stats`);
        if (testRes.ok) {
          // Si el servidor está online, hacer los fetches correspondientes
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

          // El backend asocia compromisos en los endpoints /meetings/:id
          // Para simplificar, acumulamos todos los compromisos haciendo fetches de cada reunión
          const loadedMeetings = await resMeet.clone().json();
          let allComs = [];
          for (let m of loadedMeetings) {
            const detail = await fetch(`${BASE_API_URL}/meetings/${m.id}`);
            const data = await detail.json();
            if (data.commitments) {
              allComs = [...allComs, ...data.commitments];
            }
          }
          setCommitments(allComs);

          // Extraemos todos los hallazgos de las inspecciones
          const loadedInspections = await resInsp.clone().json();
          let allFindings = [];
          loadedInspections.forEach(i => {
            if (i.findings) {
              allFindings = [...allFindings, ...i.findings];
            }
          });
          setFindings(allFindings);

          setApiMode(true);
          console.log("CPHS Gestor: Conectado a la base de datos central en local.");
        } else {
          throw new Error("API Offline");
        }
      } catch (err) {
        console.warn("CPHS API offline o no instalada. Iniciando Modo Demo local.");
        setApiMode(false);
        
        // Cargar desde localStorage o inicializar con semilla
        const cached = localStorage.getItem('cphs_store_v1');
        if (cached) {
          const parsed = JSON.parse(cached);
          setMeetings(parsed.meetings);
          setCommitments(parsed.commitments);
          setInspections(parsed.inspections);
          setFindings(parsed.findings);
          setTrainings(parsed.trainings);
          setCertificates(parsed.training_employees || parsed.certificates);
          setAccidents(parsed.accidents);
          setAnnualPlan(parsed.annual_plan);
        } else {
          // Inicializar por primera vez
          setMeetings(INITIAL_SEED_DATA.meetings);
          setCommitments(INITIAL_SEED_DATA.commitments);
          setInspections(INITIAL_SEED_DATA.inspections);
          setFindings(INITIAL_SEED_DATA.findings);
          setTrainings(INITIAL_SEED_DATA.trainings);
          setCertificates(INITIAL_SEED_DATA.training_employees);
          setAccidents(INITIAL_SEED_DATA.accidents);
          setAnnualPlan(INITIAL_SEED_DATA.annual_plan);
          
          saveToLocalStorage(INITIAL_SEED_DATA);
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Función para guardar en LocalStorage
  const saveToLocalStorage = (data) => {
    localStorage.setItem('cphs_store_v1', JSON.stringify(data));
  };

  // Guardar estado local reactivamente al cambiar cualquier entidad en modo Demo
  const triggerLocalSave = (updatedFields) => {
    if (apiMode) return; // Si es API mode, se maneja por servidor HTTP
    
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
    saveToLocalStorage(currentStore);
  };

  // ============================================================================
  // METRICAS Y LOGICA DEL DASHBOARD (CALCULADOS EN TIEMPO REAL)
  // ============================================================================
  const stats = useMemo(() => {
    const currentMonth = new Date().getMonth() + 1; // 1-12
    
    // Cumplimiento Mensual (Plan de Trabajo Anual)
    const monthTasks = annualPlan.filter(t => t.month === currentMonth);
    const completedMonthTasks = monthTasks.filter(t => t.status === 'COMPLETADO');
    const complianceMonth = monthTasks.length > 0 
      ? Math.round((completedMonthTasks.length / monthTasks.length) * 100) 
      : 0;

    // Cumplimiento Anual Acumulado (hasta el mes actual inclusive)
    const yearTasks = annualPlan.filter(t => t.month <= currentMonth);
    const completedYearTasks = yearTasks.filter(t => t.status === 'COMPLETADO');
    const complianceYear = yearTasks.length > 0 
      ? Math.round((completedYearTasks.length / yearTasks.length) * 100) 
      : 0;

    // Contadores de Reuniones
    const meetCom = meetings.filter(m => m.status === 'COMPLETADA').length;
    const meetPen = meetings.filter(m => m.status === 'PENDIENTE').length;
    const meetAtr = meetings.filter(m => m.status === 'ATRASADA').length;

    // Contadores de Inspecciones
    const inspCom = inspections.filter(i => i.status === 'COMPLETADA').length;
    const inspPen = inspections.filter(i => i.status === 'PENDIENTE').length;
    const inspAtr = inspections.filter(i => i.status === 'ATRASADA').length;

    // Contadores de Capacitaciones
    const trainCom = trainings.filter(t => t.status === 'COMPLETADA').length;
    const trainPen = trainings.filter(t => t.status === 'PENDIENTE').length;
    const trainAtr = trainings.filter(t => t.status === 'ATRASADA').length;

    // Horas Hombre acumuladas de formación
    let totalHH = 0;
    trainings.forEach(t => {
      if (t.status === 'COMPLETADA') {
        const count = certificates.filter(c => c.training_id === t.id).length || t.attendee_count || 0;
        totalHH += (t.hours * count);
      }
    });

    // Cantidad total de compromisos
    const completedComs = commitments.filter(c => c.status === 'COMPLETADO').length;
    const totalComs = commitments.length;

    return {
      complianceMonth,
      complianceYear,
      meetings: { completadas: meetCom, pendientes: meetPen, atrasadas: meetAtr },
      inspections: { completadas: inspCom, pendientes: inspPen, atrasadas: inspAtr },
      trainings: { completadas: trainCom, pendientes: trainPen, atrasadas: trainAtr },
      totalHoursHomme: totalHH,
      commitments: { completed: completedComs, total: totalComs }
    };
  }, [meetings, commitments, inspections, trainings, certificates, annualPlan]);

  // Alertas tempranas
  const alerts = useMemo(() => {
    // 1. Compromisos pendientes próximos a vencer
    const upcomingCommitments = commitments
      .filter(c => c.status === 'PENDIENTE')
      .slice(0, 4);

    // 2. Hallazgos abiertos en inspección (Riesgos Altos o Críticos)
    const criticalFindings = findings
      .filter(f => f.status === 'ABIERTO' && (f.risk_level === 'CRITICO' || f.risk_level === 'ALTO'));

    // 3. Tareas mensuales pendientes
    const currentMonth = new Date().getMonth() + 1;
    const pendingMonthTasks = annualPlan.filter(t => t.month === currentMonth && t.status === 'PENDIENTE');

    return {
      upcomingCommitments,
      criticalFindings,
      pendingMonthTasks
    };
  }, [commitments, findings, annualPlan]);

  // Filtro de certificados del buscador
  const filteredCertificates = useMemo(() => {
    if (!certSearchQuery) return certificates;
    const q = certSearchQuery.toLowerCase();
    return certificates.filter(c => 
      c.employee_name.toLowerCase().includes(q) || 
      c.employee_run.toLowerCase().includes(q) ||
      (c.training_topic && c.training_topic.toLowerCase().includes(q))
    );
  }, [certificates, certSearchQuery]);

  // ============================================================================
  // EVENT HANDLERS (Soporta Backend y Local Storage reactivamente)
  // ============================================================================

  // 1. Alternar estado del Cronograma Anual
  const toggleAnnualTask = async (taskId) => {
    const updatedPlan = annualPlan.map(t => {
      if (t.id === taskId) {
        return { ...t, status: t.status === 'COMPLETADO' ? 'PENDIENTE' : 'COMPLETADO' };
      }
      return t;
    });
    setAnnualPlan(updatedPlan);
    triggerLocalSave({ annualPlan: updatedPlan });

    if (apiMode) {
      const task = updatedPlan.find(t => t.id === taskId);
      await fetch(`${BASE_API_URL}/annual-plan/${taskId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: task.status })
      });
    }
  };

  // 2. Alternar estado de un compromiso de reunión
  const toggleCommitment = async (comId) => {
    const updatedCommitments = commitments.map(c => {
      if (c.id === comId) {
        const nextStatus = c.status === 'COMPLETADO' ? 'PENDIENTE' : 'COMPLETADO';
        return { 
          ...c, 
          status: nextStatus,
          closed_at: nextStatus === 'COMPLETADO' ? new Date().toISOString().split('T')[0] : null
        };
      }
      return c;
    });
    setCommitments(updatedCommitments);
    triggerLocalSave({ commitments: updatedCommitments });

    if (apiMode) {
      const target = updatedCommitments.find(c => c.id === comId);
      await fetch(`${BASE_API_URL}/commitments/${comId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: target.status })
      });
    }
  };

  // 3. Crear Nueva Reunión
  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    const newId = meetings.length + 1;
    const newMeeting = {
      id: newId,
      title: meetingForm.title,
      type: meetingForm.type,
      date: meetingForm.date,
      description: meetingForm.description,
      attendees: meetingForm.attendees ? meetingForm.attendees.split(',').map(a => a.trim()) : [],
      act_file_path: meetingForm.title ? 'uploads/acta_simulada.pdf' : null,
      status: 'COMPLETADA'
    };

    const updatedMeetings = [newMeeting, ...meetings];
    setMeetings(updatedMeetings);
    
    // Crear compromiso inicial si se desea
    let updatedCommitments = [...commitments];
    if (meetingForm.title) {
      const initialCommitment = {
        id: commitments.length + 1,
        meeting_id: newId,
        description: `Elaborar plan de seguimiento para ${meetingForm.title}`,
        responsible_name: 'Presidente CPHS',
        due_date: new Date(Date.now() + 15*24*60*60*1000).toISOString().split('T')[0],
        status: 'PENDIENTE',
        closed_at: null
      };
      updatedCommitments = [initialCommitment, ...commitments];
      setCommitments(updatedCommitments);
    }

    triggerLocalSave({ meetings: updatedMeetings, commitments: updatedCommitments });

    if (apiMode) {
      const fd = new FormData();
      fd.append('title', meetingForm.title);
      fd.append('type', meetingForm.type);
      fd.append('date', meetingForm.date);
      fd.append('description', meetingForm.description);
      fd.append('attendees', JSON.stringify(newMeeting.attendees));
      
      await fetch(`${BASE_API_URL}/meetings`, {
        method: 'POST',
        body: fd
      });
      // Recargar datos reales
      window.location.reload();
    }

    // Resetear form
    setMeetingForm({ title: '', type: 'ORDINARIA', date: '', description: '', attendees: '' });
    setShowMeetingModal(false);
  };

  // 4. Crear Nueva Inspección
  const handleCreateInspection = async (e) => {
    e.preventDefault();
    const newId = inspections.length + 1;
    const newInsp = {
      id: newId,
      title: inspectionForm.title,
      planned_date: inspectionForm.planned_date,
      conducted_date: inspectionForm.conducted_date || null,
      inspector_name: inspectionForm.inspector_name,
      report_file_path: inspectionForm.conducted_date ? 'uploads/informe_simulado.pdf' : null,
      status: inspectionForm.conducted_date ? 'COMPLETADA' : 'PENDIENTE'
    };

    const updatedInsps = [newInsp, ...inspections];
    setInspections(updatedInsps);
    triggerLocalSave({ inspections: updatedInsps });

    if (apiMode) {
      await fetch(`${BASE_API_URL}/inspections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInsp)
      });
      window.location.reload();
    }

    setInspectionForm({ title: '', planned_date: '', conducted_date: '', inspector_name: '' });
    setShowInspectionModal(false);
  };

  // 5. Agregar Hallazgo a Inspección
  const handleCreateFinding = async (e) => {
    e.preventDefault();
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
      evidence_file_path: 'uploads/evidencia_simulada.jpg',
      closed_at: null
    };

    const updatedFindings = [newFinding, ...findings];
    setFindings(updatedFindings);
    triggerLocalSave({ findings: updatedFindings });

    if (apiMode) {
      await fetch(`${BASE_API_URL}/inspections/${selectedInspection.id}/findings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFinding)
      });
      window.location.reload();
    }

    setFindingForm({ description: '', risk_level: 'MEDIO', due_date: '', corrective_measure: '' });
    setShowFindingModal(false);
  };

  // 6. Cerrar un Hallazgo
  const handleCloseFinding = async (findingId) => {
    const updatedFindings = findings.map(f => {
      if (f.id === findingId) {
        return { ...f, status: 'CERRADO', closed_at: new Date().toISOString().split('T')[0] };
      }
      return f;
    });
    setFindings(updatedFindings);
    triggerLocalSave({ findings: updatedFindings });

    if (apiMode) {
      await fetch(`${BASE_API_URL}/findings/${findingId}/close`, { method: 'PUT' });
    }
  };

  // 7. Crear Capacitación
  const handleCreateTraining = async (e) => {
    e.preventDefault();
    const newId = trainings.length + 1;
    const newTraining = {
      id: newId,
      topic: trainingForm.topic,
      planned_date: trainingForm.planned_date,
      conducted_date: trainingForm.conducted_date || null,
      hours: Number(trainingForm.hours),
      attendee_count: 0,
      status: trainingForm.conducted_date ? 'COMPLETADA' : 'PENDIENTE',
      attendance_list_file_path: trainingForm.conducted_date ? 'uploads/asistencia_simulada.pdf' : null,
      photo_file_path: trainingForm.conducted_date ? 'uploads/foto_simulada.jpg' : null,
      material_file_path: null
    };

    const updatedTrainings = [newTraining, ...trainings];
    setTrainings(updatedTrainings);
    triggerLocalSave({ trainings: updatedTrainings });

    if (apiMode) {
      await fetch(`${BASE_API_URL}/trainings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTraining)
      });
      window.location.reload();
    }

    setTrainingForm({ topic: '', planned_date: '', conducted_date: '', hours: 1 });
    setShowTrainingModal(false);
  };

  // 8. Registrar Trabajador en Curso y generar Certificado
  const handleAddAttendee = async (e) => {
    e.preventDefault();
    if (!selectedTraining) return;

    const newId = certificates.length + 1;
    const newCert = {
      id: newId,
      training_id: selectedTraining.id,
      employee_name: attendeeForm.employee_name,
      employee_run: attendeeForm.employee_run,
      certificate_file_path: 'uploads/certificado_autogenerado.pdf',
      status: attendeeForm.status,
      training_topic: selectedTraining.topic,
      training_date: selectedTraining.conducted_date || new Date().toISOString().split('T')[0]
    };

    const updatedCerts = [newCert, ...certificates];
    setCertificates(updatedCerts);

    // Incrementar cuenta de asistentes
    const updatedTrainings = trainings.map(t => {
      if (t.id === selectedTraining.id) {
        return { ...t, attendee_count: (t.attendee_count || 0) + 1 };
      }
      return t;
    });
    setTrainings(updatedTrainings);

    triggerLocalSave({ certificates: updatedCerts, trainings: updatedTrainings });

    if (apiMode) {
      await fetch(`${BASE_API_URL}/trainings/${selectedTraining.id}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCert)
      });
      window.location.reload();
    }

    setAttendeeForm({ employee_name: '', employee_run: '', status: 'APROBADO' });
    setShowAttendeeModal(false);
  };

  // 9. Registrar Accidente con Análisis 5 Porqués
  const handleCreateAccident = async (e) => {
    e.preventDefault();
    const newId = accidents.length + 1;
    
    const whyAnalysis = [
      accidentForm.why1,
      accidentForm.why2,
      accidentForm.why3,
      accidentForm.why4,
      accidentForm.why5
    ].filter(Boolean);

    const correctiveActions = [];
    if (accidentForm.measure1) {
      correctiveActions.push({ 
        measure: accidentForm.measure1, 
        due_date: accidentForm.measure1Date || '2026-06-30', 
        status: 'PENDIENTE', 
        date_closed: null 
      });
    }
    if (accidentForm.measure2) {
      correctiveActions.push({ 
        measure: accidentForm.measure2, 
        due_date: accidentForm.measure2Date || '2026-07-15', 
        status: 'PENDIENTE', 
        date_closed: null 
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

    // Sumar tarea mensual en el Plan de Trabajo
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

    triggerLocalSave({ accidents: updatedAccs, annualPlan: updatedPlan });

    if (apiMode) {
      await fetch(`${BASE_API_URL}/accidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAcc)
      });
      window.location.reload();
    }

    // Reset Form
    setAccidentForm({
      employee_name: '', date: '', accident_type: 'LEVE', description: '',
      why1: '', why2: '', why3: '', why4: '', why5: '',
      measure1: '', measure1Date: '', measure2: '', measure2Date: ''
    });
    setShowAccidentModal(false);
  };

  // Alternar el estado de las medidas de un accidente
  const toggleAccidentMeasure = async (accId, measureIndex) => {
    const updatedAccidents = accidents.map(a => {
      if (a.id === accId) {
        const nextMeasures = a.corrective_measures.map((m, idx) => {
          if (idx === measureIndex) {
            const nextStatus = m.status === 'COMPLETADA' ? 'PENDIENTE' : 'COMPLETADA';
            return {
              ...m,
              status: nextStatus,
              date_closed: nextStatus === 'COMPLETADA' ? new Date().toISOString().split('T')[0] : null
            };
          }
          return m;
        });
        
        // Si todas las medidas están completadas, cerramos el accidente
        const allClosed = nextMeasures.every(m => m.status === 'COMPLETADA');
        return {
          ...a,
          corrective_measures: nextMeasures,
          status: allClosed ? 'CERRADO' : 'ABIERTO'
        };
      }
      return a;
    });

    setAccidents(updatedAccidents);
    triggerLocalSave({ accidents: updatedAccidents });

    if (apiMode) {
      const target = updatedAccidents.find(a => a.id === accId);
      await fetch(`${BASE_API_URL}/accidents/${accId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: target.status, 
          corrective_measures: target.corrective_measures 
        })
      });
    }
  };

  // Imprimir/Visualizar Certificado
  const triggerCertificatePrint = (cert) => {
    setActiveCertificatePdf(cert);
  };


  // ============================================================================
  // AUXILIAR VIEWS / COMPONENT LAYOUTS
  // ============================================================================
  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-100 font-sans">
      
      {/* -------------------------------------------------------------
          SIDEBAR NAVIGATION
          ------------------------------------------------------------- */}
      <aside className="w-64 border-r border-slate-800 bg-[#070b19] flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Brand */}
          <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight text-white">CPHS Gestor</h1>
              <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">Cumplimiento Legal</span>
            </div>
          </div>

          {/* Menú de Navegación */}
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
              const Icon = item.icon;
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
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Estatus de la base de datos (Dual Mode display) */}
        <div className="p-4 border-t border-slate-800 bg-[#040813]">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
            <div className={`w-2.5 h-2.5 rounded-full ${apiMode ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`}></div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-300 truncate">
                {apiMode ? 'API Relacional Activa' : 'Local Sandbox Mode'}
              </p>
              <p className="text-[10px] text-slate-500">
                {apiMode ? 'SQLite sync activo' : 'Guardado en LocalStorage'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* -------------------------------------------------------------
          MAIN CONTENT AREA
          ------------------------------------------------------------- */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800/80 bg-[#070b19]/60 backdrop-blur-md px-8 flex items-center justify-between shrink-0 sticky top-0 z-40">
          <div>
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Panel de Control General</span>
            <h2 className="text-sm font-semibold text-slate-300">CPHS - Higiene, Seguridad y Prevención de Riesgos</h2>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <h4 className="text-sm font-semibold text-white">Jaime - Administrador</h4>
              <span className="text-[11px] font-medium text-emerald-400">Presidente CPHS</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold">
              J
            </div>
          </div>
        </header>

        {/* Dashboard / Sub-Views */}
        <div className="p-8 flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin"></div>
              <p className="text-sm text-slate-400">Cargando base de datos y registros relacionales...</p>
            </div>
          ) : (
            <>
              {/* =========================================================
                  TAB: DASHBOARD
                  ========================================================= */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  {/* Title & Headline */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-extrabold text-white tracking-tight font-sans">Cuadro de Mando Integral</h2>
                      <p className="text-slate-400 mt-1">Supervisión y control del cumplimiento del comité paritario en tiempo real.</p>
                    </div>
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => setActiveTab('cronogram')}
                        className="btn-gradient flex items-center space-x-2 text-xs"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Ver Plan de Trabajo Anual</span>
                      </button>
                    </div>
                  </div>

                  {/* KPIs (Gauges & counters) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Gauge 1: Cumplimiento Mes */}
                    <div className="glass-card rounded-2xl p-6 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Cumplimiento del Mes</span>
                        <span className="text-3xl font-extrabold text-white mt-2 block font-sans">{stats.complianceMonth}%</span>
                        <span className="text-[11px] text-emerald-400 mt-1 block">Plan de Trabajo Mensual</span>
                      </div>
                      <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path className="text-slate-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          <path className="text-emerald-400 transition-all duration-1000" strokeWidth="3.5" strokeDasharray={`${stats.complianceMonth}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <span className="absolute text-xs font-bold text-white">{stats.complianceMonth}%</span>
                      </div>
                    </div>

                    {/* Gauge 2: Cumplimiento Año */}
                    <div className="glass-card rounded-2xl p-6 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Cumplimiento del Año</span>
                        <span className="text-3xl font-extrabold text-white mt-2 block font-sans">{stats.complianceYear}%</span>
                        <span className="text-[11px] text-cyan-400 mt-1 block">Acumulado Legal 2026</span>
                      </div>
                      <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path className="text-slate-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          <path className="text-cyan-400 transition-all duration-1000" strokeWidth="3.5" strokeDasharray={`${stats.complianceYear}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <span className="absolute text-xs font-bold text-white">{stats.complianceYear}%</span>
                      </div>
                    </div>

                    {/* Gauge 3: Compromisos */}
                    <div className="glass-card rounded-2xl p-6 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Compromisos Cerrados</span>
                        <span className="text-3xl font-extrabold text-white mt-2 block font-sans">
                          {stats.commitments.completed} <span className="text-lg text-slate-500 font-normal">/ {stats.commitments.total}</span>
                        </span>
                        <span className="text-[11px] text-slate-400 mt-1 block">Acuerdos de actas de reunión</span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Gauge 4: Horas Hombre */}
                    <div className="glass-card rounded-2xl p-6 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Horas Hombre Formación</span>
                        <span className="text-3xl font-extrabold text-white mt-2 block font-sans">{stats.totalHoursHomme} HH</span>
                        <span className="text-[11px] text-cyan-400 mt-1 block">Horas acumuladas dictadas</span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Main Grid: Charts & Alerts */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Chart Container (SVG Custom beautiful bar charts) */}
                    <div className="lg:col-span-2 glass-card rounded-3xl p-8 space-y-6">
                      <div>
                        <h3 className="text-lg font-bold text-white">Desglose de Gestión Mensual</h3>
                        <p className="text-xs text-slate-400">Total de tareas programadas y ejecutadas por categoría (Reuniones, Inspecciones, Capacitaciones).</p>
                      </div>

                      {/* Custom SVG/HTML Bar chart */}
                      <div className="space-y-6 pt-4">
                        {[
                          { category: 'Reuniones Mensuales', stats: stats.meetings, colorClass: 'bg-emerald-500', icon: Calendar },
                          { category: 'Inspecciones de Terreno', stats: stats.inspections, colorClass: 'bg-cyan-500', icon: ClipboardList },
                          { category: 'Capacitaciones Dictadas', stats: stats.trainings, colorClass: 'bg-yellow-500', icon: GraduationCap }
                        ].map((bar, i) => {
                          const total = bar.stats.completadas + bar.stats.pendientes + bar.stats.atrasadas;
                          const completedPercent = total > 0 ? (bar.stats.completadas / total) * 100 : 0;
                          const pendingPercent = total > 0 ? (bar.stats.pendientes / total) * 100 : 0;
                          const delayedPercent = total > 0 ? (bar.stats.atrasadas / total) * 100 : 0;
                          const Icon = bar.icon;

                          return (
                            <div key={i} className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <span className="font-semibold text-white">{bar.category}</span>
                                </div>
                                <div className="flex items-center space-x-4 text-xs font-medium">
                                  <span className="text-emerald-400">{bar.stats.completadas} Completadas</span>
                                  <span className="text-slate-400">{bar.stats.pendientes} Pendientes</span>
                                  {bar.stats.atrasadas > 0 && <span className="text-rose-500">{bar.stats.atrasadas} Atrasadas</span>}
                                </div>
                              </div>
                              
                              {/* Stacked bar */}
                              <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden flex border border-slate-800">
                                <div className={`${bar.colorClass} h-full transition-all duration-500`} style={{ width: `${completedPercent}%` }} title="Completado"></div>
                                <div className="bg-slate-700 h-full transition-all duration-500" style={{ width: `${pendingPercent}%` }} title="Pendiente"></div>
                                <div className="bg-rose-500/80 h-full transition-all duration-500" style={{ width: `${delayedPercent}%` }} title="Atrasado"></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Chart Legend */}
                      <div className="flex items-center space-x-6 text-xs pt-4 border-t border-slate-800">
                        <div className="flex items-center space-x-2">
                          <span className="w-3 h-3 rounded-sm bg-gradient-to-r from-emerald-500 to-cyan-500"></span>
                          <span className="text-slate-400">Completadas</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="w-3 h-3 rounded-sm bg-slate-700"></span>
                          <span className="text-slate-400">Pendientes</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="w-3 h-3 rounded-sm bg-rose-500/80"></span>
                          <span className="text-slate-400">Atrasadas / Fuera de Plazo</span>
                        </div>
                      </div>
                    </div>

                    {/* Alertas Panel */}
                    <div className="glass-card rounded-3xl p-8 space-y-6 flex flex-col">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        <h3 className="text-lg font-bold text-white">Alertas Tempranas</h3>
                      </div>
                      
                      <div className="space-y-4 flex-1 overflow-y-auto max-h-80 pr-1">
                        {alerts.criticalFindings.length === 0 && alerts.upcomingCommitments.length === 0 && (
                          <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                            <p className="text-sm font-medium text-slate-300">¡Cumplimiento impecable!</p>
                            <p className="text-xs text-slate-500">No hay hallazgos críticos abiertos ni compromisos próximos a vencer.</p>
                          </div>
                        )}

                        {/* Critical Findings Alert */}
                        {alerts.criticalFindings.map(f => (
                          <div key={f.id} className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-[10px] font-bold text-rose-400">RIESGO CRÍTICO</span>
                              <span className="text-[10px] text-slate-400 font-semibold">Límite: {f.due_date}</span>
                            </div>
                            <p className="text-xs font-semibold text-slate-200 line-clamp-2">{f.description}</p>
                            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                              <span>Medida: {f.corrective_measure}</span>
                              <button 
                                onClick={() => handleCloseFinding(f.id)}
                                className="text-rose-400 hover:text-rose-300 font-bold"
                              >
                                Marcar Solucionado
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Upcoming Commitments Alert */}
                        {alerts.upcomingCommitments.map(c => (
                          <div key={c.id} className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-400">COMPROMISO MENSUAL</span>
                              <span className="text-[10px] text-slate-400 font-semibold">Límite: {c.due_date}</span>
                            </div>
                            <p className="text-xs font-medium text-slate-200 line-clamp-2">{c.description}</p>
                            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                              <span>Responsable: {c.responsible_name}</span>
                              <button 
                                onClick={() => toggleCommitment(c.id)}
                                className="text-emerald-400 hover:text-emerald-300 font-bold"
                              >
                                Completar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}


              {/* =========================================================
                  TAB: MEETINGS (REUNIONES Y COMPROMISOS)
                  ========================================================= */}
              {activeTab === 'meetings' && (
                <div className="space-y-8">
                  {/* Title Bar */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-extrabold text-white tracking-tight">Reuniones y Actas del CPHS</h2>
                      <p className="text-slate-400 mt-1">Calendario de reuniones ordinarias/extraordinarias y asignación de compromisos.</p>
                    </div>
                    <button 
                      onClick={() => setShowMeetingModal(true)}
                      className="btn-gradient flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Registrar Reunión Mensual</span>
                    </button>
                  </div>

                  {/* Grid layout: Meetings List and Commitment Detail */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Meetings List */}
                    <div className="lg:col-span-1 glass-card rounded-3xl p-6 space-y-4">
                      <h3 className="font-bold text-lg text-white">Cronograma de Sesiones</h3>
                      <div className="space-y-3">
                        {meetings.map(m => {
                          const isSelected = selectedMeeting?.id === m.id;
                          return (
                            <div 
                              key={m.id}
                              onClick={() => setSelectedMeeting(m)}
                              className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                                isSelected 
                                  ? 'bg-emerald-500/10 border-emerald-500/40' 
                                  : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700/80'
                              }`}
                            >
                              <div className="flex items-center justify-between text-xs mb-2">
                                <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                                  m.type === 'ORDINARIA' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-purple-500/10 text-purple-400'
                                }`}>
                                  {m.type}
                                </span>
                                <span className="text-slate-400 font-semibold">{m.date}</span>
                              </div>
                              <h4 className="font-bold text-sm text-slate-100 line-clamp-1">{m.title}</h4>
                              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{m.description}</p>
                              
                              <div className="flex items-center justify-between text-[11px] pt-3 mt-3 border-t border-slate-800/60">
                                <span className={`font-semibold flex items-center space-x-1 ${
                                  m.status === 'COMPLETADA' ? 'text-emerald-400' : 'text-amber-400'
                                }`}>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>{m.status === 'COMPLETADA' ? 'Acta Firmada' : 'Pendiente Acta'}</span>
                                </span>
                                {m.act_file_path && (
                                  <span className="text-emerald-400 hover:underline flex items-center space-x-1 font-bold">
                                    <FileText className="w-3.5 h-3.5" />
                                    <span>Ver PDF</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Commitments & Detail Section */}
                    <div className="lg:col-span-2 glass-card rounded-3xl p-8 space-y-6">
                      {selectedMeeting ? (
                        <>
                          <div className="border-b border-slate-800 pb-6 space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Reunión en detalle</span>
                              <span className="text-xs text-slate-400 font-semibold">Fecha: {selectedMeeting.date}</span>
                            </div>
                            <h3 className="text-2xl font-extrabold text-white">{selectedMeeting.title}</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">{selectedMeeting.description}</p>
                            
                            {/* Asistentes */}
                            {selectedMeeting.attendees && selectedMeeting.attendees.length > 0 && (
                              <div className="flex flex-wrap gap-2 pt-2">
                                <span className="text-xs text-slate-400 font-bold self-center mr-2">Participantes:</span>
                                {selectedMeeting.attendees.map((attendee, idx) => (
                                  <span key={idx} className="px-2.5 py-1 rounded-full bg-slate-800 text-xs text-slate-300 font-medium">
                                    {attendee}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Acta File Info */}
                            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-xl bg-slate-800 text-emerald-400">
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-slate-300">Acta de Constitución o Acta Mensual</p>
                                  <p className="text-[10px] text-slate-500">
                                    {selectedMeeting.act_file_path ? 'Documento legal cargado y firmado en PDF.' : 'Falta cargar documento firmado.'}
                                  </p>
                                </div>
                              </div>
                              {selectedMeeting.act_file_path ? (
                                <a 
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    alert(`Abriendo documento PDF: ${selectedMeeting.act_file_path} (Documento legal de respaldo del comité)`);
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition-colors border border-emerald-500/20"
                                >
                                  Descargar Acta PDF
                                </a>
                              ) : (
                                <button
                                  onClick={() => {
                                    const updated = meetings.map(m => {
                                      if (m.id === selectedMeeting.id) {
                                        return { ...m, act_file_path: 'uploads/acta_mensual_cargada.pdf', status: 'COMPLETADA' };
                                      }
                                      return m;
                                    });
                                    setMeetings(updated);
                                    setSelectedMeeting({ ...selectedMeeting, act_file_path: 'uploads/acta_mensual_cargada.pdf', status: 'COMPLETADA' });
                                    triggerLocalSave({ meetings: updated });
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
                                >
                                  Cargar Acta Firmada (PDF)
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Compromisos del CPHS */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-white text-base">Compromisos y Acuerdos</h4>
                              <button
                                onClick={() => {
                                  const desc = prompt("Ingrese descripción del compromiso:");
                                  const resp = prompt("Ingrese nombre del responsable:");
                                  const date = prompt("Ingrese fecha límite (YYYY-MM-DD):", new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0]);
                                  if (desc && resp && date) {
                                    const newCom = {
                                      id: commitments.length + 1,
                                      meeting_id: selectedMeeting.id,
                                      description: desc,
                                      responsible_name: resp,
                                      due_date: date,
                                      status: 'PENDIENTE',
                                      closed_at: null
                                    };
                                    const updatedComs = [newCom, ...commitments];
                                    setCommitments(updatedComs);
                                    triggerLocalSave({ commitments: updatedComs });
                                  }
                                }}
                                className="text-xs text-emerald-400 hover:underline flex items-center space-x-1 font-bold"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Añadir Compromiso</span>
                              </button>
                            </div>

                            <div className="space-y-3">
                              {commitments.filter(c => c.meeting_id === selectedMeeting.id).length === 0 ? (
                                <p className="text-xs text-slate-500 italic">No hay compromisos asociados a esta sesión.</p>
                              ) : (
                                commitments
                                  .filter(c => c.meeting_id === selectedMeeting.id)
                                  .map(c => {
                                    const isCompleted = c.status === 'COMPLETADO';
                                    return (
                                      <div 
                                        key={c.id} 
                                        className={`p-4 rounded-2xl border flex items-start justify-between gap-4 ${
                                          isCompleted 
                                            ? 'bg-emerald-500/5 border-emerald-500/10 opacity-70' 
                                            : 'bg-slate-900/60 border-slate-800'
                                        }`}
                                      >
                                        <div className="flex items-start space-x-3">
                                          <button
                                            onClick={() => toggleCommitment(c.id)}
                                            className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                                              isCompleted 
                                                ? 'bg-emerald-500 border-emerald-400 text-white' 
                                                : 'border-slate-600 hover:border-emerald-500'
                                            }`}
                                          >
                                            {isCompleted && <Check className="w-4 h-4" />}
                                          </button>
                                          <div>
                                            <p className={`text-xs font-semibold ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                                              {c.description}
                                            </p>
                                            <div className="flex items-center space-x-4 text-[10px] text-slate-500 mt-1">
                                              <span>Resp: <strong className="text-slate-400">{c.responsible_name}</strong></span>
                                              <span>Límite: <strong className="text-slate-400">{c.due_date}</strong></span>
                                              {isCompleted && <span className="text-emerald-400">Resuelto el {c.closed_at}</span>}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                          <div className="w-16 h-16 rounded-2xl bg-slate-900/80 flex items-center justify-center text-slate-600 border border-slate-800">
                            <Calendar className="w-8 h-8" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-300">Seleccione una reunión</p>
                            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">Haga clic en una reunión del menú lateral para ver el acta legal, asistentes y control de compromisos.</p>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}


              {/* =========================================================
                  TAB: INSPECTIONS (INSPECCIONES Y HALLAZGOS)
                  ========================================================= */}
              {activeTab === 'inspections' && (
                <div className="space-y-8">
                  {/* Title Bar */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-extrabold text-white tracking-tight">Inspecciones de Seguridad en Terreno</h2>
                      <p className="text-slate-400 mt-1">Auditoría, planificación mensual de recorridos en planta y gestión correctiva de hallazgos.</p>
                    </div>
                    <button 
                      onClick={() => setShowInspectionModal(true)}
                      className="btn-gradient flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Programar Inspección</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Inspections list */}
                    <div className="lg:col-span-1 glass-card rounded-3xl p-6 space-y-4">
                      <h3 className="font-bold text-lg text-white">Inspecciones Programadas</h3>
                      <div className="space-y-3">
                        {inspections.map(insp => {
                          const isSelected = selectedInspection?.id === insp.id;
                          const countFindings = findings.filter(f => f.inspection_id === insp.id).length;
                          const countOpen = findings.filter(f => f.inspection_id === insp.id && f.status === 'ABIERTO').length;

                          return (
                            <div
                              key={insp.id}
                              onClick={() => setSelectedInspection(insp)}
                              className={`p-4 rounded-2xl cursor-pointer border transition-all duration-300 ${
                                isSelected 
                                  ? 'bg-emerald-500/10 border-emerald-500/40' 
                                  : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700/80'
                              }`}
                            >
                              <div className="flex items-center justify-between text-xs mb-2">
                                <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                                  insp.status === 'COMPLETADA' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                }`}>
                                  {insp.status === 'COMPLETADA' ? 'Realizada' : 'Planificada'}
                                </span>
                                <span className="text-slate-400 font-semibold">{insp.planned_date}</span>
                              </div>
                              <h4 className="font-bold text-sm text-slate-100 line-clamp-1">{insp.title}</h4>
                              <p className="text-[11px] text-slate-500 mt-1">Inspector: {insp.inspector_name}</p>

                              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/60 text-xs">
                                <span className="text-slate-400">
                                  Hallazgos: <strong className="text-white">{countFindings}</strong> ({countOpen} abiertos)
                                </span>
                                {insp.status === 'PENDIENTE' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const updated = inspections.map(i => {
                                        if (i.id === insp.id) return { ...i, status: 'COMPLETADA', conducted_date: new Date().toISOString().split('T')[0] };
                                        return i;
                                      });
                                      setInspections(updated);
                                      triggerLocalSave({ inspections: updated });
                                    }}
                                    className="text-emerald-400 font-bold hover:underline"
                                  >
                                    Marcar Ejecutada
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Inspection findings and evidence */}
                    <div className="lg:col-span-2 glass-card rounded-3xl p-8 space-y-6">
                      {selectedInspection ? (
                        <>
                          <div className="border-b border-slate-800 pb-6 space-y-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-emerald-400 font-bold tracking-wider uppercase">Informe de Auditoría en Terreno</span>
                              <span className="text-slate-400 font-semibold">Ejecutada: {selectedInspection.conducted_date || 'En espera'}</span>
                            </div>
                            <h3 className="text-2xl font-extrabold text-white">{selectedInspection.title}</h3>
                            <p className="text-sm text-slate-400">
                              Esta inspección tiene como objetivo auditar las condiciones operativas bajo normativas legales. Inspector asignado: <strong>{selectedInspection.inspector_name}</strong>.
                            </p>
                          </div>

                          {/* Findings list */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-white text-base">Desviaciones y Hallazgos Detectados</h4>
                              <button
                                onClick={() => setShowFindingModal(true)}
                                className="text-xs text-emerald-400 hover:underline flex items-center space-x-1 font-bold"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Reportar Hallazgo</span>
                              </button>
                            </div>

                            <div className="space-y-4">
                              {findings.filter(f => f.inspection_id === selectedInspection.id).length === 0 ? (
                                <div className="text-center p-6 border border-dashed border-slate-800 rounded-2xl">
                                  <Check className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                                  <p className="text-xs text-slate-400 font-semibold">¡Inspección limpia de desviaciones!</p>
                                  <p className="text-[10px] text-slate-600">No se detectaron hallazgos durante el recorrido.</p>
                                </div>
                              ) : (
                                findings
                                  .filter(f => f.inspection_id === selectedInspection.id)
                                  .map(f => {
                                    const isOpen = f.status === 'ABIERTO';
                                    return (
                                      <div 
                                        key={f.id} 
                                        className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                                          isOpen 
                                            ? 'bg-slate-900/60 border-slate-800' 
                                            : 'bg-emerald-500/5 border-emerald-500/10 opacity-70'
                                        }`}
                                      >
                                        <div className="space-y-2 flex-1">
                                          <div className="flex items-center space-x-2">
                                            <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                                              f.risk_level === 'CRITICO' ? 'bg-red-500/20 text-red-400' :
                                              f.risk_level === 'ALTO' ? 'bg-orange-500/20 text-orange-400' :
                                              'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                              RIESGO {f.risk_level}
                                            </span>
                                            <span className="text-[10px] text-slate-500">Límite: {f.due_date}</span>
                                          </div>
                                          <h5 className="font-bold text-sm text-slate-100">{f.description}</h5>
                                          <p className="text-xs text-slate-400">
                                            <span className="font-semibold text-slate-300">Acción correctiva:</span> {f.corrective_measure}
                                          </p>

                                          {f.evidence_file_path && (
                                            <div className="flex items-center space-x-2 text-[10px] text-slate-500 pt-1">
                                              <Camera className="w-3.5 h-3.5 text-emerald-400" />
                                              <span>Evidencia adjunta cargada</span>
                                            </div>
                                          )}
                                        </div>

                                        <div className="flex items-center space-x-3 shrink-0">
                                          {isOpen ? (
                                            <button
                                              onClick={() => handleCloseFinding(f.id)}
                                              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md"
                                            >
                                              Marcar Cerrado
                                            </button>
                                          ) : (
                                            <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                                              <Check className="w-4 h-4" />
                                              <span>Cerrado el {f.closed_at}</span>
                                            </div>
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
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                          <div className="w-16 h-16 rounded-2xl bg-slate-900/80 flex items-center justify-center text-slate-600 border border-slate-800">
                            <ClipboardList className="w-8 h-8" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-300">Seleccione una Inspección</p>
                            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">Visualice los hallazgos críticos detectados, nivele los riesgos y valide los planes de acción correctivos.</p>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}


              {/* =========================================================
                  TAB: TRAININGS (CAPACITACIONES Y MATRIZ)
                  ========================================================= */}
              {activeTab === 'trainings' && (
                <div className="space-y-8">
                  {/* Title Bar */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-extrabold text-white tracking-tight">Matriz de Capacitación y Difusión</h2>
                      <p className="text-slate-400 mt-1">Registros legales de formación de trabajadores, firmas de asistencia y acreditaciones.</p>
                    </div>
                    <button 
                      onClick={() => setShowTrainingModal(true)}
                      className="btn-gradient flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Programar Capacitación</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Courses matrix list */}
                    <div className="lg:col-span-1 glass-card rounded-3xl p-6 space-y-4">
                      <h3 className="font-bold text-lg text-white">Matriz Mensual de Cursos</h3>
                      <div className="space-y-3">
                        {trainings.map(t => {
                          const isSelected = selectedTraining?.id === t.id;
                          return (
                            <div 
                              key={t.id}
                              onClick={() => setSelectedTraining(t)}
                              className={`p-4 rounded-2xl cursor-pointer border transition-all duration-300 ${
                                isSelected 
                                  ? 'bg-emerald-500/10 border-emerald-500/40' 
                                  : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700/80'
                              }`}
                            >
                              <div className="flex items-center justify-between text-xs mb-2">
                                <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                                  t.status === 'COMPLETADA' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                }`}>
                                  {t.status === 'COMPLETADA' ? 'Realizado' : 'Programado'}
                                </span>
                                <span className="text-slate-400 font-semibold">{t.planned_date}</span>
                              </div>
                              <h4 className="font-bold text-sm text-slate-100 line-clamp-1">{t.topic}</h4>
                              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/60 text-xs text-slate-400">
                                <span>Duración: <strong className="text-slate-300">{t.hours} hrs</strong></span>
                                <span>Tenedores: <strong className="text-emerald-400">{t.attendee_count} emp</strong></span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Course Detail & Attendees accreditation */}
                    <div className="lg:col-span-2 glass-card rounded-3xl p-8 space-y-6">
                      {selectedTraining ? (
                        <>
                          <div className="border-b border-slate-800 pb-6 space-y-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-emerald-400 font-bold uppercase tracking-widest">Matriz de Competencias</span>
                              <span className="text-slate-400 font-semibold">Ejecución: {selectedTraining.conducted_date || 'Pendiente'}</span>
                            </div>
                            <h3 className="text-2xl font-extrabold text-white">{selectedTraining.topic}</h3>
                            
                            <div className="flex items-center space-x-6 text-xs text-slate-400 pt-2">
                              <span>Duración Legal: <strong className="text-slate-200">{selectedTraining.hours} horas cronológicas</strong></span>
                              <span>Total Acreditados: <strong className="text-slate-200">{selectedTraining.attendee_count} trabajadores</strong></span>
                            </div>
                          </div>

                          {/* Attendance File Downloads */}
                          {selectedTraining.status === 'COMPLETADA' ? (
                            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-xl bg-slate-800 text-emerald-400">
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-slate-300">Lista de Asistencia Firmada</p>
                                  <p className="text-[10px] text-slate-500">Documento PDF cargado con firmas legales de respaldo.</p>
                                </div>
                              </div>
                              <button
                                onClick={() => alert("Abriendo lista de firmas digitalizada en PDF (Respaldo normativo CPHS).")}
                                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
                              >
                                Ver Asistencia PDF
                              </button>
                            </div>
                          ) : (
                            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-xs text-amber-500">
                                <AlertTriangle className="w-5 h-5 shrink-0" />
                                <span>Capacitación pendiente de realización. Debe registrar la asistencia real.</span>
                              </div>
                              <button
                                onClick={() => {
                                  const updated = trainings.map(t => {
                                    if (t.id === selectedTraining.id) {
                                      return {
                                        ...t,
                                        status: 'COMPLETADA',
                                        conducted_date: new Date().toISOString().split('T')[0]
                                      };
                                    }
                                    return t;
                                  });
                                  setTrainings(updated);
                                  setSelectedTraining({ ...selectedTraining, status: 'COMPLETADA', conducted_date: new Date().toISOString().split('T')[0] });
                                  triggerLocalSave({ trainings: updated });
                                }}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all"
                              >
                                Registrar Cierre y Firmas
                              </button>
                            </div>
                          )}

                          {/* Accredited Employees list */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-white text-base">Trabajadores Capacitados y Certificados</h4>
                              {selectedTraining.status === 'COMPLETADA' && (
                                <button
                                  onClick={() => setShowAttendeeModal(true)}
                                  className="text-xs text-emerald-400 hover:underline flex items-center space-x-1 font-bold"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Registrar Acreditación</span>
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {certificates.filter(c => c.training_id === selectedTraining.id).length === 0 ? (
                                <p className="text-xs text-slate-500 italic md:col-span-2">No se han registrado trabajadores acreditados para esta capacitación.</p>
                              ) : (
                                certificates
                                  .filter(c => c.training_id === selectedTraining.id)
                                  .map(c => (
                                    <div key={c.id} className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between">
                                      <div className="space-y-1">
                                        <h5 className="font-bold text-sm text-slate-100">{c.employee_name}</h5>
                                        <p className="text-[10px] text-slate-500">RUN: {c.employee_run}</p>
                                        <span className="inline-block px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase">
                                          {c.status}
                                        </span>
                                      </div>
                                      
                                      <button
                                        onClick={() => triggerCertificatePrint(c)}
                                        className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-emerald-400 border border-slate-700/80 transition-all hover:scale-105"
                                        title="Descargar Certificado Legal"
                                      >
                                        <Award className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                          <div className="w-16 h-16 rounded-2xl bg-slate-900/80 flex items-center justify-center text-slate-600 border border-slate-800">
                            <GraduationCap className="w-8 h-8" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-300">Seleccione una Capacitación</p>
                            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">Gestione las inducciones mensuales de la planta, audite las horas acumuladas e imprima los certificados de competencias laborales.</p>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}


              {/* =========================================================
                  TAB: CERTIFICADOS (BUSCADOR Y ACCREDITACIONES)
                  ========================================================= */}
              {activeTab === 'certificates' && (
                <div className="space-y-8">
                  {/* Title Bar */}
                  <div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">Repositorio Central de Certificados</h2>
                    <p className="text-slate-400 mt-1">Buscador unificado por RUN o nombre de trabajador para constancias de acreditación.</p>
                  </div>

                  {/* Search Bar container */}
                  <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-3.5 text-slate-500 w-5 h-5" />
                      <input 
                        type="text" 
                        placeholder="Buscar por nombre, RUN de trabajador (ej: 12.345.678-9) o tema del curso..."
                        value={certSearchQuery}
                        onChange={(e) => setCertSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>

                  {/* Certificates Results Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCertificates.length === 0 ? (
                      <div className="col-span-full text-center py-12 glass-card rounded-2xl space-y-2">
                        <FileMinus className="w-8 h-8 text-slate-600 mx-auto" />
                        <p className="text-sm font-semibold text-slate-300">No se encontraron certificados</p>
                        <p className="text-xs text-slate-500">Pruebe ingresando otro parámetro de búsqueda en el filtro.</p>
                      </div>
                    ) : (
                      filteredCertificates.map(c => (
                        <div key={c.id} className="glass-card rounded-2xl p-6 space-y-4 hover:border-emerald-500/30 transition-all">
                          <div className="flex items-start justify-between">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                              <Award className="w-5 h-5" />
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase">
                              Vigente
                            </span>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Trabajador</span>
                            <h4 className="font-bold text-base text-white">{c.employee_name}</h4>
                            <p className="text-xs text-slate-400">RUN: {c.employee_run}</p>
                          </div>

                          <div className="pt-3 border-t border-slate-800/80 space-y-1">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Curso Acreditado</span>
                            <p className="text-xs font-semibold text-slate-200 line-clamp-1">{c.training_topic}</p>
                            <p className="text-[10px] text-slate-500">Fecha: {c.training_date}</p>
                          </div>

                          <button
                            onClick={() => triggerCertificatePrint(c)}
                            className="w-full mt-2 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-bold transition-all flex items-center justify-center space-x-2"
                          >
                            <Download className="w-4 h-4 text-emerald-400" />
                            <span>Imprimir / Descargar Certificado</span>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}


              {/* =========================================================
                  TAB: ACCIDENTS (INVESTIGACIÓN DE ACCIDENTES - 5 PORQUÉS)
                  ========================================================= */}
              {activeTab === 'accidents' && (
                <div className="space-y-8">
                  {/* Title Bar */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-extrabold text-white tracking-tight">Investigación de Accidentes e Incidentes</h2>
                      <p className="text-slate-400 mt-1">Análisis de Causa Raíz mediante la metodología de los 5 Porqués y seguimiento correctivo.</p>
                    </div>
                    <button 
                      onClick={() => setShowAccidentModal(true)}
                      className="btn-gradient flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Registrar Accidente</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Accidents list */}
                    <div className="lg:col-span-1 glass-card rounded-3xl p-6 space-y-4">
                      <h3 className="font-bold text-lg text-white">Registro de Incidentes</h3>
                      <div className="space-y-3">
                        {accidents.length === 0 ? (
                          <p className="text-xs text-slate-500 italic">No hay accidentes registrados.</p>
                        ) : (
                          accidents.map(a => {
                            const isSelected = selectedAccident?.id === a.id;
                            const completedCount = a.corrective_measures.filter(m => m.status === 'COMPLETADA').length;
                            const totalCount = a.corrective_measures.length;

                            return (
                              <div
                                key={a.id}
                                onClick={() => setSelectedAccident(a)}
                                className={`p-4 rounded-2xl cursor-pointer border transition-all duration-300 ${
                                  isSelected 
                                    ? 'bg-emerald-500/10 border-emerald-500/40' 
                                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700/80'
                                }`}
                              >
                                <div className="flex items-center justify-between text-xs mb-2">
                                  <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                                    a.accident_type === 'LEVE' ? 'bg-yellow-500/10 text-yellow-400' :
                                    a.accident_type === 'GRAVE' ? 'bg-orange-500/10 text-orange-400' :
                                    'bg-red-500/10 text-red-400'
                                  }`}>
                                    {a.accident_type}
                                  </span>
                                  <span className="text-slate-400 font-semibold">{a.date.split(' ')[0]}</span>
                                </div>
                                <h4 className="font-bold text-sm text-slate-100 line-clamp-1">{a.employee_name}</h4>
                                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{a.description}</p>
                                
                                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/60 text-[11px] text-slate-500">
                                  <span>Medidas: <strong className="text-white">{completedCount}/{totalCount}</strong></span>
                                  <span className={`font-bold ${a.status === 'CERRADO' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {a.status}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Accident investigation details and 5 whys solver */}
                    <div className="lg:col-span-2 glass-card rounded-3xl p-8 space-y-6">
                      {selectedAccident ? (
                        <>
                          <div className="border-b border-slate-800 pb-6 space-y-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-emerald-400 font-bold uppercase tracking-widest">Informe de Causa Raíz</span>
                              <span className="text-slate-400 font-semibold">Tipo: {selectedAccident.accident_type}</span>
                            </div>
                            <h3 className="text-2xl font-extrabold text-white">Investigación: {selectedAccident.employee_name}</h3>
                            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-850">
                              <strong className="text-slate-400 block mb-1">Descripción del Suceso:</strong>
                              {selectedAccident.description}
                            </p>
                          </div>

                          {/* 5 Whys chain display */}
                          <div className="space-y-4">
                            <h4 className="font-bold text-white text-base flex items-center space-x-2">
                              <TrendingUp className="w-5 h-5 text-emerald-400" />
                              <span>Cadena de los 5 Porqués (Root Cause Analysis)</span>
                            </h4>

                            <div className="relative pl-6 border-l-2 border-emerald-500/25 space-y-4">
                              {selectedAccident.root_cause_analysis.map((why, idx) => (
                                <div key={idx} className="relative">
                                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-slate-950 border-2 border-emerald-400 flex items-center justify-center text-[9px] font-bold text-emerald-400">
                                    {idx + 1}
                                  </span>
                                  <p className="text-xs font-semibold text-slate-200 pl-1">{why}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Corrective measures with checking triggers */}
                          <div className="space-y-4 pt-4 border-t border-slate-800">
                            <h4 className="font-bold text-white text-base">Plan de Acción y Medidas Correctivas</h4>
                            
                            <div className="space-y-3">
                              {selectedAccident.corrective_measures.map((m, idx) => {
                                const isDone = m.status === 'COMPLETADA';
                                return (
                                  <div 
                                    key={idx}
                                    className={`p-4 rounded-2xl border flex items-center justify-between ${
                                      isDone ? 'bg-emerald-500/5 border-emerald-500/15' : 'bg-slate-900/60 border-slate-800'
                                    }`}
                                  >
                                    <div className="flex items-center space-x-3">
                                      <button
                                        onClick={() => toggleAccidentMeasure(selectedAccident.id, idx)}
                                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                                          isDone ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-slate-600 hover:border-emerald-500'
                                        }`}
                                      >
                                        {isDone && <Check className="w-4 h-4" />}
                                      </button>
                                      <div>
                                        <p className={`text-xs font-semibold ${isDone ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                                          {m.measure}
                                        </p>
                                        <span className="text-[10px] text-slate-500">Límite: {m.due_date} {m.date_closed && `| Completada el ${m.date_closed}`}</span>
                                      </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
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
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                          <div className="w-16 h-16 rounded-2xl bg-slate-900/80 flex items-center justify-center text-slate-600 border border-slate-800">
                            <Activity className="w-8 h-8" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-300">Seleccione una Investigación</p>
                            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">Analice los incidentes de la planta, encadene los 5 Porqués de la causa y supervise el cierre del plan correctivo legal.</p>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}


              {/* =========================================================
                  TAB: CRONOGRAM (PLAN ANUAL GANTT COMPLIANCE LIST)
                  ========================================================= */}
              {activeTab === 'cronogram' && (
                <div className="space-y-8">
                  {/* Title Bar */}
                  <div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">Cronograma de Trabajo Anual (Gantt)</h2>
                    <p className="text-slate-400 mt-1">Obligaciones normativas y plan de trabajo anual para asegurar auditorías exitosas.</p>
                  </div>

                  {/* Monthly interactive checklist (Visual Gantt style) */}
                  <div className="glass-card rounded-3xl p-8 space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Plan Anual CPHS 2026</span>
                      <span className="text-sm text-slate-300 font-semibold">
                        Porcentaje de Cumplimiento Acumulado: <strong className="text-emerald-400">{stats.complianceYear}%</strong>
                      </span>
                    </div>

                    <div className="space-y-8 pt-4">
                      {[
                        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                      ].map((monthName, idx) => {
                        const monthNum = idx + 1;
                        const monthTasks = annualPlan.filter(t => t.month === monthNum);

                        if (monthTasks.length === 0) return null;

                        return (
                          <div key={idx} className="space-y-3">
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-l-4 border-emerald-500 pl-3">
                              {monthName}
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {monthTasks.map(t => {
                                const isDone = t.status === 'COMPLETADO';
                                return (
                                  <div 
                                    key={t.id}
                                    className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-all duration-300 ${
                                      isDone 
                                        ? 'bg-emerald-500/5 border-emerald-500/10' 
                                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                                    }`}
                                  >
                                    <div className="space-y-1">
                                      <div className="flex items-center justify-between text-[9px] font-bold">
                                        <span className={`px-2 py-0.5 rounded-full ${
                                          t.type === 'REUNION' ? 'bg-cyan-500/15 text-cyan-400' :
                                          t.type === 'INSPECCION' ? 'bg-yellow-500/15 text-yellow-400' :
                                          'bg-purple-500/15 text-purple-400'
                                        }`}>
                                          {t.type}
                                        </span>
                                        <span className="text-slate-500">RESP: {t.responsible}</span>
                                      </div>
                                      <h5 className="font-semibold text-xs text-slate-100 line-clamp-2">{t.task_name}</h5>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                                      <span className={`text-[10px] font-bold ${isDone ? 'text-emerald-400' : 'text-slate-500'}`}>
                                        {t.status}
                                      </span>
                                      
                                      <button
                                        onClick={() => toggleAnnualTask(t.id)}
                                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                          isDone 
                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                            : 'bg-slate-850 text-slate-300 hover:bg-slate-800 border border-slate-800'
                                        }`}
                                      >
                                        {isDone ? 'Marcar Pendiente' : 'Marcar Realizado'}
                                      </button>
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

      {/* ============================================================================
          MODALES Y DIALOGOS DE FORMULARIOS (Gorgous glassy designs)
          ============================================================================ */}

      {/* Modal 1: Crear Reunión */}
      {showMeetingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="w-full max-w-lg glass-card rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">Registrar Reunión CPHS</h3>
              <button onClick={() => setShowMeetingModal(false)} className="text-slate-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateMeeting} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Título de la Sesión</label>
                <input 
                  type="text" required
                  placeholder="Ej: Reunión Ordinaria Junio"
                  value={meetingForm.title}
                  onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Tipo</label>
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
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Fecha</label>
                  <input 
                    type="date" required
                    value={meetingForm.date}
                    onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Temas a Tratar / Tabla</label>
                <textarea 
                  rows="3" placeholder="Puntos a analizar en la reunión legal..."
                  value={meetingForm.description}
                  onChange={(e) => setMeetingForm({ ...meetingForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Asistentes (separados por coma)</label>
                <input 
                  type="text" placeholder="Ej: Juan Pérez, María Gómez, Pedro Silva"
                  value={meetingForm.attendees}
                  onChange={(e) => setMeetingForm({ ...meetingForm, attendees: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:outline-none"
                />
              </div>

              <div className="flex space-x-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowMeetingModal(false)} className="btn-secondary flex-1">
                  Cancelar
                </button>
                <button type="submit" className="btn-gradient flex-1">
                  Crear y Cerrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Crear Inspección */}
      {showInspectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="w-full max-w-lg glass-card rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">Programar Inspección de Terreno</h3>
              <button onClick={() => setShowInspectionModal(false)} className="text-slate-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateInspection} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Nombre de la Inspección</label>
                <input 
                  type="text" required placeholder="Ej: Inspección Mensual de EPP - Talleres"
                  value={inspectionForm.title}
                  onChange={(e) => setInspectionForm({ ...inspectionForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Fecha Planificada</label>
                  <input 
                    type="date" required
                    value={inspectionForm.planned_date}
                    onChange={(e) => setInspectionForm({ ...inspectionForm, planned_date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Inspector Asignado</label>
                  <input 
                    type="text" required placeholder="Ej: Pedro Silva"
                    value={inspectionForm.inspector_name}
                    onChange={(e) => setInspectionForm({ ...inspectionForm, inspector_name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Fecha Realización (opcional)</label>
                <input 
                  type="date"
                  value={inspectionForm.conducted_date}
                  onChange={(e) => setInspectionForm({ ...inspectionForm, conducted_date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Deje vacío si desea dejarla como planificada para el futuro.</span>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowInspectionModal(false)} className="btn-secondary flex-1">
                  Cancelar
                </button>
                <button type="submit" className="btn-gradient flex-1">
                  Programar Inspección
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Reportar Hallazgo */}
      {showFindingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="w-full max-w-lg glass-card rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">Reportar Desviación / Hallazgo</h3>
              <button onClick={() => setShowFindingModal(false)} className="text-slate-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateFinding} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Descripción del Hallazgo</label>
                <textarea 
                  rows="3" required placeholder="Describa la condición insegura o desviación observada..."
                  value={findingForm.description}
                  onChange={(e) => setFindingForm({ ...findingForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Nivel de Riesgo</label>
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
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Fecha Límite Corrección</label>
                  <input 
                    type="date" required
                    value={findingForm.due_date}
                    onChange={(e) => setFindingForm({ ...findingForm, due_date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Medida Correctiva Asignada</label>
                <input 
                  type="text" required placeholder="Ej: Adquirir resguardo de seguridad o recargar extintor"
                  value={findingForm.corrective_measure}
                  onChange={(e) => setFindingForm({ ...findingForm, corrective_measure: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">¿Adjuntar evidencia fotográfica?</span>
                <span className="text-emerald-400 font-bold">Autogenerada (*.jpg)</span>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowFindingModal(false)} className="btn-secondary flex-1">
                  Cancelar
                </button>
                <button type="submit" className="btn-gradient flex-1">
                  Reportar Desviación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Crear Capacitación */}
      {showTrainingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="w-full max-w-lg glass-card rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">Programar Capacitación / Charla</h3>
              <button onClick={() => setShowTrainingModal(false)} className="text-slate-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateTraining} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Tema / Título del Curso</label>
                <input 
                  type="text" required placeholder="Ej: Ergonomía e Higiene Postural en Planta"
                  value={trainingForm.topic}
                  onChange={(e) => setTrainingForm({ ...trainingForm, topic: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Fecha Programación</label>
                  <input 
                    type="date" required
                    value={trainingForm.planned_date}
                    onChange={(e) => setTrainingForm({ ...trainingForm, planned_date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Horas Formativas</label>
                  <input 
                    type="number" required min="1" max="40"
                    value={trainingForm.hours}
                    onChange={(e) => setTrainingForm({ ...trainingForm, hours: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Fecha Realización (opcional)</label>
                <input 
                  type="date"
                  value={trainingForm.conducted_date}
                  onChange={(e) => setTrainingForm({ ...trainingForm, conducted_date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Deje vacío si desea dejarla como planificada para el futuro.</span>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowTrainingModal(false)} className="btn-secondary flex-1">
                  Cancelar
                </button>
                <button type="submit" className="btn-gradient flex-1">
                  Guardar Capacitación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: Acreditar Asistente de Curso */}
      {showAttendeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="w-full max-w-md glass-card rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">Acreditar Trabajador</h3>
              <button onClick={() => setShowAttendeeModal(false)} className="text-slate-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddAttendee} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Nombre Completo del Trabajador</label>
                <input 
                  type="text" required placeholder="Ej: Carlos Mendoza"
                  value={attendeeForm.employee_name}
                  onChange={(e) => setAttendeeForm({ ...attendeeForm, employee_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-650 text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Cédula Identidad / RUN / ID</label>
                <input 
                  type="text" required placeholder="Ej: 18.555.666-4"
                  value={attendeeForm.employee_run}
                  onChange={(e) => setAttendeeForm({ ...attendeeForm, employee_run: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-650 text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Estado</label>
                <select 
                  value={attendeeForm.status}
                  onChange={(e) => setAttendeeForm({ ...attendeeForm, status: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                >
                  <option value="APROBADO">Aprobado (Genera Certificado)</option>
                  <option value="ASISTIO">Asistió</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowAttendeeModal(false)} className="btn-secondary flex-1">
                  Cancelar
                </button>
                <button type="submit" className="btn-gradient flex-1">
                  Acreditar y Cerrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 6: Registrar Accidente (5 Porqués) */}
      {showAccidentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl glass-card rounded-3xl p-8 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">Investigación de Accidente</h3>
              <button onClick={() => setShowAccidentModal(false)} className="text-slate-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateAccident} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Nombre del Afectado</label>
                  <input 
                    type="text" required placeholder="Ej: Juan Pérez"
                    value={accidentForm.employee_name}
                    onChange={(e) => setAccidentForm({ ...accidentForm, employee_name: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Fecha y Hora</label>
                  <input 
                    type="datetime-local" required
                    value={accidentForm.date}
                    onChange={(e) => setAccidentForm({ ...accidentForm, date: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Gravedad Legal</label>
                  <select 
                    value={accidentForm.accident_type}
                    onChange={(e) => setAccidentForm({ ...accidentForm, accident_type: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                  >
                    <option value="LEVE">Leve (Corte, contusión menor)</option>
                    <option value="GRAVE">Grave (Accidente con hospitalización o amputación)</option>
                    <option value="FATAL">Fatal</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Descripción de lo Sucedido</label>
                <textarea 
                  rows="2" required placeholder="Detalle cómo ocurrió el incidente en planta..."
                  value={accidentForm.description}
                  onChange={(e) => setAccidentForm({ ...accidentForm, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none"
                />
              </div>

              {/* 5 Whys Chain inputs */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">Metodología de los 5 Porqués</span>
                
                <div className="space-y-2">
                  <input 
                    type="text" required placeholder="1. ¿Por qué ocurrió el contacto/corte?"
                    value={accidentForm.why1}
                    onChange={(e) => setAccidentForm({ ...accidentForm, why1: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
                  />
                  <input 
                    type="text" required placeholder="2. ¿Por qué...? (Siguiente eslabón)"
                    value={accidentForm.why2}
                    onChange={(e) => setAccidentForm({ ...accidentForm, why2: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
                  />
                  <input 
                    type="text" required placeholder="3. ¿Por qué...?"
                    value={accidentForm.why3}
                    onChange={(e) => setAccidentForm({ ...accidentForm, why3: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
                  />
                  <input 
                    type="text" required placeholder="4. ¿Por qué...?"
                    value={accidentForm.why4}
                    onChange={(e) => setAccidentForm({ ...accidentForm, why4: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
                  />
                  <input 
                    type="text" required placeholder="5. ¿Por qué...? (Causa raíz raíz organizacional)"
                    value={accidentForm.why5}
                    onChange={(e) => setAccidentForm({ ...accidentForm, why5: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Corrective measures initial entry */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block">Medidas Correctivas Legales</span>
                <div className="grid grid-cols-3 gap-2">
                  <input 
                    type="text" required placeholder="Acción correctiva 1..."
                    value={accidentForm.measure1}
                    onChange={(e) => setAccidentForm({ ...accidentForm, measure1: e.target.value })}
                    className="col-span-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
                  />
                  <input 
                    type="date"
                    value={accidentForm.measure1Date}
                    onChange={(e) => setAccidentForm({ ...accidentForm, measure1Date: e.target.value })}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowAccidentModal(false)} className="btn-secondary flex-1">
                  Cancelar
                </button>
                <button type="submit" className="btn-gradient flex-1">
                  Guardar Investigación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 7: Visualizar Certificado para Acreditación (Gorgeous PDF/Print layout) */}
      {activeCertificatePdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-white text-slate-900 rounded-3xl p-10 space-y-8 shadow-2xl relative border-8 border-emerald-500/10">
            
            {/* Close trigger */}
            <button 
              onClick={() => setActiveCertificatePdf(null)}
              className="absolute right-6 top-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 border transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Certificate Print-Ready layout */}
            <div className="text-center space-y-6 py-6 border-4 border-double border-slate-300 p-8 rounded-xl relative">
              
              {/* Seal */}
              <div className="w-16 h-16 rounded-full bg-emerald-50/85 border-2 border-emerald-500 mx-auto flex items-center justify-center text-emerald-600">
                <Shield className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="font-extrabold text-2xl tracking-wider text-slate-850 uppercase font-sans">CERTIFICADO DE ACREDITACIÓN</h2>
                <p className="text-[10px] tracking-widest text-emerald-600 font-bold uppercase">Comité Paritario de Higiene y Seguridad</p>
              </div>

              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                El CPHS y la Dirección de Prevención de Riesgos de la Compañía certifican bajo el marco de las normativas de seguridad que el(la) trabajador(a):
              </p>

              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-slate-900 font-sans">{activeCertificatePdf.employee_name}</h3>
                <p className="text-xs font-semibold text-slate-500">Cédula de Identidad / RUN: {activeCertificatePdf.employee_run}</p>
              </div>

              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Ha aprobado y completado satisfactoriamente el curso teórico-práctico de:
              </p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 inline-block max-w-lg">
                <h4 className="font-bold text-sm text-slate-800">{activeCertificatePdf.training_topic}</h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Dictado el día: {activeCertificatePdf.training_date}</p>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-12 pt-8 max-w-md mx-auto">
                <div className="text-center border-t border-slate-300 pt-3">
                  <div className="h-8 italic text-slate-400 text-xs font-serif flex items-center justify-center">Jaime López</div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Presidente CPHS</span>
                </div>
                <div className="text-center border-t border-slate-300 pt-3">
                  <div className="h-8 italic text-slate-400 text-xs font-serif flex items-center justify-center">Prev. CPHS</div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Asesor Prevención</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 justify-end">
              <button 
                onClick={() => setActiveCertificatePdf(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border text-slate-700 text-xs font-bold transition-all"
              >
                Cerrar Vista
              </button>
              <button 
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Imprimir Certificado</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
