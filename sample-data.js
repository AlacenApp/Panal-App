// Datos iniciales de demostración para el Generador de Manuales de Marca

window.DEFAULT_BRANDS = [
  {
    id: "brand-lumina-01",
    name: "Lumina Tech",
    tagline: "Inteligencia conectada, claridad humana",
    industry: "Tecnología & Software SaaS",
    website: "https://lumina.example.com",
    createdDate: "2026-09-28",
    status: "Activo",
    summary: "Plataforma de software empresarial que transforma datos complejos en decisiones visuales e intuitivas para equipos ágiles.",
    
    // Identidad y Filosofía
    identity: {
      mission: "Democratizar el acceso a la inteligencia de datos mediante herramientas visuales, transparentes y de alto impacto operativo.",
      vision: "Ser el estándar global en interfaces de colaboración inteligente para empresas en crecimiento hacia 2030.",
      values: [
        { title: "Claridad Radical", desc: "Simplificamos lo complejo sin perder profundidad. La transparencia guía nuestras interfaces y comunicaciones." },
        { title: "Empatía Proactiva", desc: "Diseñamos pensando en el usuario final, anticipando sus fricciones antes de que ocurran." },
        { title: "Innovación con Propósito", desc: "No usamos tecnología por moda; cada actualización resuelve una necesidad real comprobada." },
        { title: "Rigor Estético", desc: "El buen diseño no es un decorado: es una herramienta de eficiencia, confianza y calma visual." }
      ],
      archetype: "El Sabio / El Creador",
      toneAndVoice: {
        attributes: [
          { trait: "Cercano pero Profesional", note: "Hablamos como un colega experto que te explica con calma, nunca distantes ni pedantes." },
          { trait: "Preciso y Directo", note: "Evitamos el relleno corporativo; vamos al grano con datos y soluciones concretas." },
          { trait: "Inspirador y Propositivo", note: "Mostramos caminos y soluciones ante cualquier problema técnico o de negocio." }
        ],
        weAre: [
          "Expertos accesibles",
          "Claramente orientados a la solución",
          "Constructores de confianza técnica",
          "Ágiles y humanos"
        ],
        weAreNot: [
          "Burocráticos ni solemnes",
          "Vendedores insistentes",
          "Superficiales o ambiguos",
          "Crípticos con jerga innecesaria"
        ]
      }
    },

    // Logos y Recursos
    logos: [
      {
        id: "logo-main",
        name: "Logotipo Principal (Horizontal)",
        type: "Versión Primaria",
        description: "Uso obligatorio en encabezados de sitios web, papelería oficial, presentaciones corporativas y firmas.",
        previewSvg: `<svg viewBox="0 0 320 80" class="w-full h-auto max-h-20" xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="80" rx="12" fill="#0f172a"/>
          <circle cx="48" cy="40" r="18" fill="none" stroke="#38bdf8" stroke-width="6"/>
          <path d="M48 26 L48 54 M34 40 L62 40" stroke="#818cf8" stroke-width="5" stroke-linecap="round"/>
          <text x="82" y="48" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="28" letter-spacing="-0.5">lumina<tspan fill="#38bdf8">.</tspan></text>
          <text x="210" y="48" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="12" letter-spacing="2">TECH</text>
        </svg>`,
        safeMargin: "Equivalente a la altura de la 'L' en todo el perímetro.",
        minSize: "Impresión: 35mm | Digital: 120px ancho",
        bgRecommended: "Fondos claros (#FFFFFF, #F8FAFC) o fondos oscuros con variante invertida."
      },
      {
        id: "logo-symbol",
        name: "Isotipo / Símbolo Aislado",
        type: "Ícono & Favicon",
        description: "Utilizado en avatares de redes sociales, favicon de navegador, apps móviles y aplicaciones de poco espacio.",
        previewSvg: `<svg viewBox="0 0 100 100" class="w-full h-auto max-h-20" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" rx="22" fill="#1e293b"/>
          <circle cx="50" cy="50" r="26" fill="none" stroke="#38bdf8" stroke-width="8"/>
          <path d="M50 30 L50 70 M30 50 L70 50" stroke="#818cf8" stroke-width="7" stroke-linecap="round"/>
        </svg>`,
        safeMargin: "Mínimo 25% del ancho del símbolo alrededor.",
        minSize: "Impresión: 10mm | Digital: 24px ancho",
        bgRecommended: "Cualquier fondo con suficiente contraste (>4.5:1)."
      }
    ],

    // Reglas de No Usar
    logoRules: [
      { rule: "No deformar ni estirar", desc: "Mantener siempre la proporción original bloqueando la relación de aspecto." },
      { rule: "No alterar los colores", desc: "No sustituir los gradientes o tonos oficiales por colores fuera de paleta." },
      { rule: "No aplicar sombras pesadas", desc: "Evitar sombras paralelas intensas o biseles que comprometan la limpieza visual." },
      { rule: "No colocar sobre fondos saturados", desc: "Asegurar que el fondo no compita con la legibilidad del isotipo." }
    ],

    // Colores Oficiales
    colors: [
      {
        id: "col-1",
        category: "Primario",
        name: "Azul Lumina",
        hex: "#0284c7",
        rgb: "rgb(2, 132, 199)",
        cmyk: "C:84 M:38 Y:0 K:0",
        pantone: "Pantone 2192 C",
        usage: "Color central de marca. Botones primarios, enlaces activos y acentos de interfaces.",
        isLight: false
      },
      {
        id: "col-2",
        category: "Secundario",
        name: "Índigo Profundo",
        hex: "#4f46e5",
        rgb: "rgb(79, 70, 229)",
        cmyk: "C:78 M:78 Y:0 K:0",
        pantone: "Pantone 2365 C",
        usage: "Gradientes combinados con el azul primario, insignias y elementos de confianza.",
        isLight: false
      },
      {
        id: "col-3",
        category: "Acento",
        name: "Cian Eléctrico",
        hex: "#38bdf8",
        rgb: "rgb(56, 189, 248)",
        cmyk: "C:63 M:0 Y:0 K:0",
        pantone: "Pantone 298 C",
        usage: "Destacados, chips de estado activo, bordes brillantes en modo oscuro.",
        isLight: true
      },
      {
        id: "col-4",
        category: "Neutro Oscuro",
        name: "Pizarra Noche",
        hex: "#0f172a",
        rgb: "rgb(15, 23, 42)",
        cmyk: "C:80 M:68 Y:50 K:62",
        pantone: "Black 6 C",
        usage: "Tipografía principal, encabezados y fondos en componentes dark-mode.",
        isLight: false
      },
      {
        id: "col-5",
        category: "Neutro Claro",
        name: "Gris Nube",
        hex: "#f8fafc",
        rgb: "rgb(248, 250, 252)",
        cmyk: "C:2 M:1 Y:0 K:0",
        pantone: "Cool Gray 1 C",
        usage: "Fondos de página, tarjetas de contenido y separadores suaves.",
        isLight: true
      },
      {
        id: "col-6",
        category: "Semáforo / Éxito",
        name: "Verde Esmeralda",
        hex: "#10b981",
        rgb: "rgb(16, 185, 129)",
        cmyk: "C:76 M:0 Y:64 K:0",
        pantone: "Pantone 7481 C",
        usage: "Alertas de éxito, aprobaciones en flujos de procesos y métricas positivas.",
        isLight: false
      }
    ],

    // Tipografías
    typography: {
      display: {
        name: "Space Grotesk",
        source: "Google Fonts",
        weights: "Medium (500), Bold (700)",
        usage: "Títulos principales (H1, H2), logotipos derivados y números de métricas destacadas.",
        sampleText: "Construyendo el futuro de la gestión inteligente."
      },
      body: {
        name: "Plus Jakarta Sans",
        source: "Google Fonts",
        weights: "Regular (400), Medium (500), SemiBold (600)",
        usage: "Cuerpo de texto, párrafos explicativos, etiquetas de interfaz y tablas de datos.",
        sampleText: "Los procesos claros eliminan la fricción cognitiva y aumentan la autonomía del equipo."
      },
      mono: {
        name: "JetBrains Mono",
        source: "Google Fonts",
        weights: "Regular (400)",
        usage: "Códigos de color, parámetros técnicos, scripts y números de serie.",
        sampleText: "HEX: #0284c7 | RGB: 2, 132, 199"
      },
      scale: [
        { level: "H1 - Título Hero", size: "36px - 44px", weight: "Bold (700)", lineHeight: "1.2", tracking: "-0.02em" },
        { level: "H2 - Sección", size: "26px - 30px", weight: "Bold (700)", lineHeight: "1.3", tracking: "-0.01em" },
        { level: "H3 - Subsección", size: "20px - 22px", weight: "SemiBold (600)", lineHeight: "1.4", tracking: "0" },
        { level: "Cuerpo Regular", size: "15px - 16px", weight: "Regular (400)", lineHeight: "1.6", tracking: "0" },
        { level: "Micro / Etiqueta", size: "12px - 13px", weight: "Medium (500)", lineHeight: "1.4", tracking: "+0.02em" }
      ]
    },

    // Procedimientos (SOPs)
    procedures: [
      {
        id: "sop-1",
        code: "SOP-MKT-01",
        title: "Creación y Aprobación de Piezas para Redes Sociales",
        category: "Marketing & Comunicación",
        role: "Content Creator & Brand Guardian",
        estimatedTime: "45 minutos",
        summary: "Pauta estándar para redactar, diseñar y validar piezas visuales antes de su publicación en canales oficiales.",
        tags: ["Redes Sociales", "Diseño", "Aprobaciones"],
        checklist: [
          { text: "Verificar paleta de colores oficial según la plantilla aprobada en Figma.", done: true },
          { text: "Comprobar contraste entre el texto y el fondo (mínimo ratio 4.5:1).", done: true },
          { text: "Revisar que el logotipo respete la zona de seguridad y no esté deformado.", done: false },
          { text: "Validar copy con el tono de voz: claro, empático, sin clichés vacíos.", done: false },
          { text: "Exportar en formato WebP / PNG con compresión óptima sin pérdida.", done: false },
          { text: "Cargar en la herramienta de programación y etiquetar al aprobador.", done: false }
        ],
        guidelines: "Nunca publicar imágenes con logos en baja resolución o textos pegados a los bordes de la cuadrícula."
      },
      {
        id: "sop-2",
        code: "SOP-COM-02",
        title: "Emisión de Comunicados Oficiales y Notas de Prensa",
        category: "Comunicación Corporativa",
        role: "Director de Comunicaciones & CEO",
        estimatedTime: "2 a 4 horas",
        summary: "Protocolo formal para redactar anuncios de prensa, cambios estratégicos o nuevos lanzamientos institucionales.",
        tags: ["Prensa", "Institucional", "Lanzamientos"],
        checklist: [
          { text: "Definir los 3 mensajes clave del comunicado con el área técnica.", done: true },
          { text: "Redactar titular informativo en tipografía Space Grotesk Bold.", done: true },
          { text: "Incluir cita oficial del portavoz autorizado de la compañía.", done: false },
          { text: "Adjuntar enlace al Brand Kit oficial con logos vectoriales para medios.", done: false },
          { text: "Revisión legal y de confidencialidad antes del envío a agencias.", done: false }
        ],
        guidelines: "Todo comunicado debe contar con la plantilla membretada oficial Lumina Tech v2.0."
      },
      {
        id: "sop-3",
        code: "SOP-OPS-03",
        title: "Solicitud y Supervisión de Merchandising de Marca",
        category: "Operaciones & Eventos",
        role: "Event & Brand Ops Manager",
        estimatedTime: "5 días hábiles",
        summary: "Requerimientos de calidad para estampados, serigrafía y artículos físicos promocionales.",
        tags: ["Merchandising", "Físico", "Proveedores"],
        checklist: [
          { text: "Enviar archivos vectoriales en formato .SVG o .AI en modo de color CMYK.", done: true },
          { text: "Exigir prueba de color física o muestra digital certificada por el impresor.", done: false },
          { text: "Confirmar los códigos Pantone oficiales con el proveedor.", done: false },
          { text: "Inspeccionar lote recibido para comprobar fidelidad y ausencia de descalces.", done: false }
        ],
        guidelines: "Se prohíbe el uso de transfer genérico que se desprenda con facilidad. Preferir bordado o serigrafía textil de alto gramaje."
      }
    ],

    // Procesos y Flujos de Trabajo
    processes: [
      {
        id: "proc-1",
        code: "PROC-DSN-01",
        title: "Flujo Integral de Creación y Validación de Material Gráfico",
        category: "Diseño & Producto",
        owner: "Lead Visual Designer",
        purpose: "Asegurar consistencia visual total desde la solicitud inicial hasta la entrega final para producción.",
        steps: [
          {
            stepNumber: 1,
            title: "Recepción del Brief",
            responsible: "Área Solicitante",
            input: "Formulario de requerimiento con objetivo y fecha de entrega",
            output: "Ticket validado en el backlog de diseño",
            duration: "24h",
            status: "Completado"
          },
          {
            stepNumber: 2,
            title: "Bocetado & Exploración",
            responsible: "Diseñador Gráfico",
            input: "Manual de Marca Lumina + Guía de componentes",
            output: "2 a 3 propuestas conceptuales en Figma",
            duration: "2 a 3 días",
            status: "En Proceso"
          },
          {
            stepNumber: 3,
            title: "Revisión de Identidad de Marca",
            responsible: "Brand Guardian",
            input: "Propuestas de diseño",
            output: "Checklist de auditoría de marca con visto bueno o ajustes",
            duration: "1 día",
            status: "Pendiente"
          },
          {
            stepNumber: 4,
            title: "Exportación & Publicación",
            responsible: "Diseñador / Ops",
            input: "Arte final aprobado",
            output: "Archivos maestros en repositorio cloud (.SVG, .PDF, .WebP)",
            duration: "2h",
            status: "Pendiente"
          }
        ]
      },
      {
        id: "proc-2",
        code: "PROC-ONB-02",
        title: "Onboarding de Nuevos Colaboradores a la Cultura de Marca",
        category: "Talento & Cultura",
        owner: "People & Culture Lead",
        purpose: "Transmitir la identidad, valores, tono de voz y uso adecuado de las herramientas de marca a todo nuevo integrante.",
        steps: [
          {
            stepNumber: 1,
            title: "Entrega del Welcome Brand Kit",
            responsible: "People Team",
            input: "Kit digital de bienvenida + credenciales de diseño",
            output: "Acceso al Brand Portal y plantillas oficiales",
            duration: "Día 1",
            status: "Completado"
          },
          {
            stepNumber: 2,
            title: "Taller de Tono de Voz y Valores",
            responsible: "Brand Strategist",
            input: "Presentación interactiva y casos reales",
            output: "Colaborador capacitado en la redacción institucional",
            duration: "Semana 1",
            status: "Completado"
          },
          {
            stepNumber: 3,
            title: "Práctica Guiada con SOPs",
            responsible: "Mentor asignado",
            input: "Procedimientos del área respectiva",
            output: "Primera tarea ejecutada cumpliendo el estándar",
            duration: "Semana 2",
            status: "En Proceso"
          }
        ]
      }
    ]
  }
];
