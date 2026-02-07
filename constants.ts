
import { Country, DofaFactor } from './types';

export const COUNTRIES: (Country & { flag: string })[] = [
  { name: 'Colombia', code: 'COL', flag: '🇨🇴' },
  { name: 'Ecuador', code: 'ECU', flag: '🇪🇨' },
  { name: 'Panamá', code: 'PAN', flag: '🇵🇦' },
  { name: 'Costa Rica', code: 'CRI', flag: '🇨🇷' },
  { name: 'Guatemala', code: 'GUA', flag: '🇬🇹' },
  { name: 'El Salvador', code: 'SLV', flag: '🇸🇻' }
];

export const AXES = [
  'Sostenibilidad',
  'Excelencia Operativa',
  'Crecimiento, diversificación y rentabilidad'
];

export const CATEGORIES = [
  'Clientes',
  'Competidores',
  'Proveedor y contratistas',
  'Protección',
  'Ambiental',
  'Infraestructura',
  'Personal',
  'Requisitos legales y de cliente'
];

// Mapeo de factores sugeridos por Eje y Categoría
export const FACTOR_TEMPLATES: Record<string, Record<string, string[]>> = {
  'Sostenibilidad': {
    'Clientes': [
      'Exigencias ambientales del mercado / clientes',
      'Mayor demanda social por empresas sostenibles',
      'Relación técnica con clientes',
      'Gestión reactiva de retroalimentación',
      'Posicionamiento como operador de excelencia',
      'Fidelización por seguridad operacional',
      'Presión por costos',
      'Riesgo reputacional'
    ],
    'Competidores': [
      'Estrategias competitivas basadas en certificaciones ESG',
      'Oferta de servicios con menor huella ambiental',
      'Presión competitiva por innovación sostenible',
      'Programas de transparencia en reportes ESG de la competencia',
      'Posicionamiento de marca basado en sostenibilidad'
    ],
    'Proveedor y contratistas': [
      'Dependencia o diversificación de proveedores críticos',
      'Gestión de riesgos y resiliencia de la cadena de suministro',
      'Alianzas estratégicas and mejora continua con enfoque sostenible',
      'Selección de proveedores con estándares ESG',
      'Política de adquisición de insumos sostenibles',
      'Certificación ambiental y cumplimiento normativo del proveedor',
      'Huella ambiental de la cadena de suministro',
      'Estabilidad financiera del proveedor',
      'Cumplimiento laboral y ético del proveedor',
      'Innovación tecnológica disponible en el mercado proveedor',
      'Capacidad logística y tiempos de respuesta regionales',
      'Proximidad/localización del proveedor'
    ],
    'Protección': [
      'Preparación ante emergencias ambientales',
      'Prevención de derrames y contaminación marina',
      'Uso de tecnología para control ambiental y prevención de incidentes',
      'Monitoreo tecnológico de seguridad y prevención de contaminación'
    ],
    'Ambiental': [
      'Consumo de combustible y eficiencia energética de la flota',
      'Gestión de residuos a bordo y en base operativa',
      'Uso de lubricantes y productos biodegradables',
      'Huella de carbono de las operaciones',
      'Gestión de aguas oleosas y sentinas',
      'Mantenimiento preventivo con enfoque ambiental',
      'Programas de mejora ambiental y eficiencia operativa',
      'Gestión y cumplimiento de la huella hídrica en operaciones',
      'Cumplimiento de normativa ambiental marítima (MARPOL / local)',
      'Gestión ambiental de proveedores críticos'
    ],
    'Infraestructura': [
      'Eficiencia energética de instalaciones',
      'Consumo eléctrico de bases operativas',
      'Uso de energías renovables en infraestructura',
      'Huella de carbono de instalaciones',
      'Consumo de agua en infraestructura',
      'Sistemas de ahorro y reutilización de agua',
      'Tratamiento de aguas residuales',
      'Gestión de residuos peligrosos en talleres',
      'Inversión en modernización sostenible',
      'Riesgo de contaminación en entorno portuario',
      'Cumplimiento ambiental de permisos e infraestructura',
      'Resiliencia ante eventos climáticos extremos'
    ],
    'Personal': [
      'Cultura de seguridad y experiencia multicultural en operaciones regionales',
      'Programas de capacitación y desarrollo de talento técnico',
      'Relaciones estables con comunidades portuarias y liderazgo local sólido',
      'Brechas culturales y comunicación limitada entre países',
      'Rotación y escasez de talento técnico especializado',
      'Desigualdad en estándares laborales y de formación interna',
      'Cooperación e integración cultural entre países del clúster'
    ],
    'Requisitos legales y de cliente': [
      'Sistemas tecnológicos que facilitan cumplimiento ambiental (MARPOL, control emisiones)',
      'Registros digitales para trazabilidad y auditorías regulatorias',
      'Infraestructura tecnológica alineada a exigencias regulatorias ambientales',
      'Automatización de reportes regulatorios ESG',
      'Nuevas regulaciones ambientales internacionales',
      'Incentivos y financiamiento para tecnologías limpias',
      'Estándares internacionales ambientales',
      'Sanciones por incumplimiento tecnológico-regulatorio',
      'Brecha entre velocidad regulatoria y capacidad de adaptación'
    ]
  },
  'Excelencia Operativa': {
    'Clientes': [
      'Reputación operativa regional',
      'Relación técnica con clientes',
      'Variabilidad en estándares de servicio',
      'Gestión reactiva de retroalimentación',
      'Posicionamiento como operador de excelencia',
      'Fidelización por seguridad operacional',
      'Presión por costos',
      'Competencia regional',
      'Riesgo reputacional'
    ],
    'Competidores': [
      'Competencia regional directa',
      'Presión competitiva en costos y desempeño'
    ],
    'Proveedor y contratistas': [
      'Evaluación de desempeño de proveedores',
      'Integración con estándares corporativos',
      'Homologación regional incompleta',
      'Dependencia de proveedores únicos',
      'Control irregular de calidad externa',
      'Desarrollo de red regional de proveedores',
      'Alianzas técnicas estratégicas',
      'Interrupción de suministro crítico',
      'Escasez de repuestos especializados'
    ],
    'Protección': [
      'Baja accidentalidad en personas',
      'Registro de incidentes',
      'Incidentes recurrentes',
      'Reporte insuficiente de eventos',
      'Análisis de causas limitado',
      'Sistemas predictivos de seguridad',
      'Cultura avanzada de reporte sectorial',
      'Reconocimiento como empresa segura y confiable',
      'Accidentes mayores',
      'Impacto reputacional por eventos'
    ],
    'Ambiental': [
      'Programas básicos de control ambiental',
      'Cumplimiento operativo MARPOL',
      'Monitoreo ambiental limitado',
      'Capacitación ambiental insuficiente',
      'Certificaciones ambientales',
      'Programas ESG regionales',
      'Sanciones regulatorias ambientales',
      'Accidentes ambientales mayores'
    ],
    'Infraestructura': [
      'Bases operativas estratégicas',
      'Capacidad técnica instalada',
      'Falta de estandarización',
      'Cultura débil de orden y aseo',
      'Mantenimiento reactivo',
      'Modernización regional',
      'Inversión en infraestructura crítica',
      'Eventos climáticos extremos',
      'Interrupciones operativas'
    ],
    'Personal': [
      'Experiencia operativa acumulada',
      'Compromiso con seguridad',
      'Baja confiabilidad humana',
      'Resistencia al cambio',
      'Escasez de maquinistas',
      'Pilotos desalineados',
      'Cultura débil de disciplina',
      'Academia regional de formación',
      'Programas de confiabilidad humana',
      'Mercado laboral escaso',
      'Rotación de talento crítico',
      'Fatiga sectorial'
    ],
    'Requisitos legales y de cliente': [
      'Licencias operativas vigentes',
      'Cumplimiento regulatorio básico',
      'Gestión documental fragmentada',
      'Seguimiento normativo lento',
      'Armonización legal regional',
      'Certificaciones internacionales',
      'Sanciones regulatorias',
      'Cambios legales abruptos'
    ]
  },
  'Crecimiento, diversificación y rentabilidad': {
    'Clientes': [
      'Mayor posicionamiento de mercado',
      'Contratos a largo plazo',
      'Licitaciones exitosas',
      'Gestión de renovación contractual',
      'Dependencia de clientes estratégicos',
      'Captación de nuevos clientes como clúster',
      'Fortalecimiento de operaciones especiales',
      'Mejora de tarifas',
      'Competencia regional agresiva',
      'Presión por reducción de tarifas'
    ],
    'Competidores': [
      'Competencia regional agresiva en precios',
      'Presión competitiva por contratos estratégicos'
    ],
    'Proveedor y contratistas': [
      'Contratos de largo plazo con proveedores clave',
      'Integración con políticas de compliance',
      'Control de calidad de servicios críticos',
      'Dependencia de proveedores únicos',
      'Variabilidad de costos externos',
      'Estandarización regional incompleta',
      'Desarrollo de red regional de proveedores',
      'Alianzas estratégicas especializadas',
      'Interrupción de suministro',
      'Inestabilidad financiera de proveedores'
    ],
    'Protección': [
      'Riesgos financieros por volatilidad económica',
      'Restricción de crédito',
      'Riesgos tributarios regulatorios',
      'Devaluación monetaria',
      'Presión sobre márgenes'
    ],
    'Ambiental': [
      'Demanda del mercado por servicios ambientalmente responsables',
      'Ventajas competitivas derivadas de certificaciones ambientales',
      'Costos asociados a cumplimiento ambiental como discriminator de precio',
      'Acceso a incentivos fiscales o financieros por desempeño ambiental',
      'Posibilidad de nuevos productos/servicios vinculados a sostenibilidad ambiental',
      'Capacidad de monetizar reducciones de emisiones o créditos ambientales'
    ],
    'Infraestructura': [
      'Capacidad instalada para expansión',
      'Infraestructura estratégica regional',
      'Mantenimiento reactivo',
      'Ineficiencia en uso de activos',
      'Inversión en modernización',
      'Expansión regional',
      'Eventos climáticos',
      'Interrupciones logísticas'
    ],
    'Personal': [
      'Cultura de excelencia operativa',
      'Liderazgo regional',
      'Resistencia al cambio',
      'Productividad administrativa desigual',
      'Sobrecarga del equipo financiero',
      'Desarrollo de talento especializado',
      'Integración cultural regional',
      'Mercado laboral competitivo',
      'Rotación de talento'
    ],
    'Requisitos legales y de cliente': [
      'Políticas sólidas de compliance corporativo',
      'Transparencia financiera',
      'Cumplimiento tributario regional',
      'Gestión contractual internacional',
      'Complejidad contractual entre países',
      'Gestión documental pesada',
      'Adaptación lenta regulatoria',
      'Incentivos fiscales por país',
      'Seguridad jurídica regional',
      'Armonización regulatoria',
      'Cambios regulatorios abruptos',
      'Riesgo sancionatorio'
    ]
  }
};

export const TYPE_LABELS: Record<string, string> = {
  F: 'Fortaleza',
  O: 'Oportunidad',
  D: 'Debilidad',
  A: 'Amenaza'
};

export const TYPE_COLORS: Record<string, string> = {
  F: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  O: 'bg-sky-100 text-sky-800 border-sky-200',
  D: 'bg-amber-100 text-amber-800 border-amber-200',
  A: 'bg-rose-100 text-rose-800 border-rose-200'
};

export const IMPACT_LABELS: Record<number, string> = {
  1: 'Bajo',
  2: 'Relevante',
  3: 'Importante',
  4: 'Muy Importante',
  5: 'Crítico'
};
