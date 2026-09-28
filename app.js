// Configuración de Supabase
const SUPABASE_URL = "https://evsphcaefebrytvdmveg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2c3BoY2FlZmVicnl0dmRtdmVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDU2MzE2MywiZXhwIjoyMTA2MTM5MTYzfQ.m8JsnueqUt6FSROP0M_-2fqYoT6xSNdMkPHHHC053TI";

const getSupabaseClient = () => {
  if (window.supabase && typeof window.supabase.createClient === "function") {
    return window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return null;
};

const { createApp, ref, computed, onMounted, watch } = Vue;

const app = createApp({
  setup() {
    // 1. Estado reactivo principal
    const brands = ref([]);
    const currentBrandId = ref("");
    const activeTab = ref("overview");
    const isPortalMode = ref(false); // Modo presentación / lectura para clientes o equipo
    const searchQuery = ref("");
    const searchFilter = ref("all");
    const cloudStatus = ref("connecting"); // 'synced', 'syncing', 'offline', 'error'
    let syncTimeout = null;
    
    // Spotlight / Buscador Cmd+K
    const isSpotlightOpen = ref(false);
    const spotlightQuery = ref("");

    // Typography Tester
    const typeTesterText = ref("Lumina Tech: Claridad en el diseño y en los procesos.");
    const typeTesterSize = ref(24);

    // Notificaciones Toast
    const toast = ref({
      show: false,
      message: "",
      type: "success"
    });

    // Modales de Edición y Creación
    const brandModal = ref({
      isOpen: false,
      isEditing: false,
      data: {
        name: "",
        tagline: "",
        industry: "",
        website: "",
        summary: "",
        mission: "",
        vision: "",
        archetype: ""
      }
    });

    const colorModal = ref({
      isOpen: false,
      isEditing: false,
      data: {
        id: "",
        name: "",
        category: "Primario",
        hex: "#0284c7",
        rgb: "rgb(2, 132, 199)",
        cmyk: "C:84 M:38 Y:0 K:0",
        pantone: "Pantone 2192 C",
        usage: "",
        isLight: false
      }
    });

    const procedureModal = ref({
      isOpen: false,
      isEditing: false,
      data: {
        id: "",
        code: "",
        title: "",
        category: "",
        role: "",
        estimatedTime: "",
        summary: "",
        guidelines: "",
        tagsInput: "",
        checklistInput: ""
      }
    });

    const processModal = ref({
      isOpen: false,
      isEditing: false,
      data: {
        id: "",
        code: "",
        title: "",
        category: "",
        owner: "",
        purpose: "",
        steps: [
          { stepNumber: 1, title: "", responsible: "", input: "", output: "", duration: "", status: "Pendiente" }
        ]
      }
    });

    // Estado del visor de procesos interactivo
    const selectedProcessStep = ref(null);

    // 2. Carga inicial y persistencia
    const loadFromStorage = () => {
      try {
        const stored = localStorage.getItem("brandcraft_brands");
        if (stored) {
          brands.value = JSON.parse(stored);
        } else if (window.DEFAULT_BRANDS && window.DEFAULT_BRANDS.length > 0) {
          brands.value = JSON.parse(JSON.stringify(window.DEFAULT_BRANDS));
          saveToStorage();
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
        brands.value = JSON.parse(JSON.stringify(window.DEFAULT_BRANDS || []));
      }

      // Cargar ID de marca activa
      const lastBrandId = localStorage.getItem("brandcraft_current_id");
      if (lastBrandId && brands.value.some(b => b.id === lastBrandId)) {
        currentBrandId.value = lastBrandId;
      } else if (brands.value.length > 0) {
        currentBrandId.value = brands.value[0].id;
      }
    };

    const saveToStorage = () => {
      try {
        localStorage.setItem("brandcraft_brands", JSON.stringify(brands.value));
        if (currentBrandId.value) {
          localStorage.setItem("brandcraft_current_id", currentBrandId.value);
        }
      } catch (err) {
        console.error("Error al guardar:", err);
      }
    };

    // Sincronización en tiempo real con Supabase
    const loadFromSupabase = async () => {
      const client = getSupabaseClient();
      if (!client) {
        cloudStatus.value = "offline";
        return;
      }

      try {
        cloudStatus.value = "syncing";
        const { data, error } = await client.from("brands").select("*").order("created_at", { ascending: false });

        if (error) {
          console.error("Error al leer desde Supabase:", error);
          cloudStatus.value = "error";
          return;
        }

        if (data && data.length > 0) {
          brands.value = data.map(b => ({
            id: b.id,
            name: b.name,
            tagline: b.tagline || "",
            industry: b.industry || "",
            website: b.website || "",
            status: b.status || "Activo",
            summary: b.summary || "",
            identity: b.identity || {},
            logos: b.logos || [],
            logoRules: b.logo_rules || [],
            colors: b.colors || [],
            typography: b.typography || {},
            procedures: b.procedures || [],
            processes: b.processes || []
          }));

          if (!brands.value.some(b => b.id === currentBrandId.value)) {
            currentBrandId.value = brands.value[0].id;
          }

          localStorage.setItem("brandcraft_brands", JSON.stringify(brands.value));
          cloudStatus.value = "synced";
          showToast("Datos sincronizados con Supabase", "success");
        } else {
          // Primera vez: sembrar la base de datos de Supabase con los datos locales
          if (brands.value.length > 0) {
            await syncAllBrandsToSupabase();
          }
        }
      } catch (err) {
        console.error("Fallo de conexión con Supabase:", err);
        cloudStatus.value = "offline";
      }
    };

    const syncBrandToSupabase = async (brand) => {
      const client = getSupabaseClient();
      if (!client || !brand) return;

      try {
        cloudStatus.value = "syncing";
        const row = {
          id: brand.id,
          name: brand.name,
          tagline: brand.tagline || "",
          industry: brand.industry || "",
          website: brand.website || "",
          status: brand.status || "Activo",
          summary: brand.summary || "",
          identity: brand.identity || {},
          logos: brand.logos || [],
          logo_rules: brand.logoRules || [],
          colors: brand.colors || [],
          typography: brand.typography || {},
          procedures: brand.procedures || [],
          processes: brand.processes || [],
          updated_at: new Date().toISOString()
        };

        const { error } = await client.from("brands").upsert(row);
        if (error) {
          console.error("Error al guardar en Supabase:", error);
          cloudStatus.value = "error";
        } else {
          cloudStatus.value = "synced";
        }
      } catch (err) {
        console.error("Fallo de red con Supabase:", err);
        cloudStatus.value = "offline";
      }
    };

    const syncAllBrandsToSupabase = async () => {
      const client = getSupabaseClient();
      if (!client) return;

      cloudStatus.value = "syncing";
      for (const b of brands.value) {
        await syncBrandToSupabase(b);
      }
      cloudStatus.value = "synced";
      showToast("Todos los manuales respaldados en Supabase", "success");
    };

    const deleteBrandFromSupabase = async (brandId) => {
      const client = getSupabaseClient();
      if (!client) return;

      try {
        cloudStatus.value = "syncing";
        await client.from("brands").delete().eq("id", brandId);
        cloudStatus.value = "synced";
      } catch (err) {
        console.error("Error al eliminar en Supabase:", err);
      }
    };

    const triggerCloudSync = () => {
      if (syncTimeout) clearTimeout(syncTimeout);
      syncTimeout = setTimeout(() => {
        if (currentBrand.value) {
          syncBrandToSupabase(currentBrand.value);
        }
      }, 1200);
    };

    // 3. Computed Properties
    const currentBrand = computed(() => {
      return brands.value.find(b => b.id === currentBrandId.value) || brands.value[0] || null;
    });

    // Estadísticas del Dashboard
    const stats = computed(() => {
      if (!currentBrand.value) return { colors: 0, sops: 0, procs: 0, sopsCompleted: 0 };
      const brand = currentBrand.value;
      const totalSopChecklist = brand.procedures.reduce((acc, p) => acc + (p.checklist ? p.checklist.length : 0), 0);
      const doneSopChecklist = brand.procedures.reduce((acc, p) => acc + (p.checklist ? p.checklist.filter(c => c.done).length : 0), 0);
      const sopProgress = totalSopChecklist > 0 ? Math.round((doneSopChecklist / totalSopChecklist) * 100) : 0;

      return {
        colors: brand.colors ? brand.colors.length : 0,
        sops: brand.procedures ? brand.procedures.length : 0,
        procs: brand.processes ? brand.processes.length : 0,
        sopProgress: sopProgress
      };
    });

    // Buscador Global y de Sección
    const searchResults = computed(() => {
      if (!currentBrand.value) return [];
      const q = (searchQuery.value || spotlightQuery.value || "").toLowerCase().trim();
      if (!q) return [];

      const b = currentBrand.value;
      const results = [];

      // Colores
      if (searchFilter.value === "all" || searchFilter.value === "colors") {
        (b.colors || []).forEach(c => {
          if (c.name.toLowerCase().includes(q) || c.hex.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || (c.usage && c.usage.toLowerCase().includes(q))) {
            results.push({
              type: "Color",
              tab: "colors",
              title: `${c.name} (${c.hex})`,
              subtitle: `${c.category} - ${c.usage || 'Color oficial'}`,
              badgeColor: "bg-blue-100 text-blue-700",
              data: c
            });
          }
        });
      }

      // Procedimientos (SOPs)
      if (searchFilter.value === "all" || searchFilter.value === "procedures") {
        (b.procedures || []).forEach(p => {
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchCode = (p.code || "").toLowerCase().includes(q);
          const matchRole = (p.role || "").toLowerCase().includes(q);
          const matchTags = (p.tags || []).some(t => t.toLowerCase().includes(q));
          const matchChecklist = (p.checklist || []).some(item => item.text.toLowerCase().includes(q));

          if (matchTitle || matchCode || matchRole || matchTags || matchChecklist) {
            results.push({
              type: "Procedimiento",
              tab: "procedures",
              title: `${p.code ? p.code + ': ' : ''}${p.title}`,
              subtitle: `Rol: ${p.role || 'No asignado'} • ${p.category || 'General'}`,
              badgeColor: "bg-amber-100 text-amber-700",
              data: p
            });
          }
        });
      }

      // Procesos
      if (searchFilter.value === "all" || searchFilter.value === "processes") {
        (b.processes || []).forEach(proc => {
          const matchTitle = proc.title.toLowerCase().includes(q);
          const matchOwner = (proc.owner || "").toLowerCase().includes(q);
          const matchStep = (proc.steps || []).some(s => s.title.toLowerCase().includes(q) || (s.responsible && s.responsible.toLowerCase().includes(q)));

          if (matchTitle || matchOwner || matchStep) {
            results.push({
              type: "Proceso",
              tab: "processes",
              title: `${proc.code ? proc.code + ': ' : ''}${proc.title}`,
              subtitle: `Dueño: ${proc.owner || 'Equipo'} • ${proc.steps ? proc.steps.length : 0} etapas`,
              badgeColor: "bg-emerald-100 text-emerald-700",
              data: proc
            });
          }
        });
      }

      // Identidad / Valores / Tono
      if (searchFilter.value === "all" || searchFilter.value === "identity") {
        if (b.identity) {
          if (b.identity.mission && b.identity.mission.toLowerCase().includes(q)) {
            results.push({
              type: "Identidad",
              tab: "identity",
              title: "Misión Institucional",
              subtitle: b.identity.mission,
              badgeColor: "bg-purple-100 text-purple-700"
            });
          }
          if (b.identity.vision && b.identity.vision.toLowerCase().includes(q)) {
            results.push({
              type: "Identidad",
              tab: "identity",
              title: "Visión Estratégica",
              subtitle: b.identity.vision,
              badgeColor: "bg-purple-100 text-purple-700"
            });
          }
          (b.identity.values || []).forEach(val => {
            if (val.title.toLowerCase().includes(q) || val.desc.toLowerCase().includes(q)) {
              results.push({
                type: "Valor",
                tab: "identity",
                title: `Valor: ${val.title}`,
                subtitle: val.desc,
                badgeColor: "bg-purple-100 text-purple-700"
              });
            }
          });
          if (b.identity.toneAndVoice) {
            (b.identity.toneAndVoice.weAre || []).forEach(trait => {
              if (trait.toLowerCase().includes(q)) {
                results.push({
                  type: "Tono de Voz",
                  tab: "identity",
                  title: `Lo que somos: ${trait}`,
                  subtitle: "Directriz de tono y voz aprobada",
                  badgeColor: "bg-indigo-100 text-indigo-700"
                });
              }
            });
          }
        }
      }

      // Tipografía
      if (searchFilter.value === "all" || searchFilter.value === "typography") {
        if (b.typography) {
          ['display', 'body', 'mono'].forEach(key => {
            const font = b.typography[key];
            if (font && (font.name.toLowerCase().includes(q) || font.usage.toLowerCase().includes(q))) {
              results.push({
                type: "Tipografía",
                tab: "typography",
                title: `Fuente: ${font.name} (${key.toUpperCase()})`,
                subtitle: font.usage,
                badgeColor: "bg-teal-100 text-teal-700"
              });
            }
          });
        }
      }

      return results;
    });

    // 4. Métodos y Acciones
    const showToast = (message, type = "success") => {
      toast.value = { show: true, message, type };
      setTimeout(() => {
        toast.value.show = false;
      }, 3200);
    };

    const copyToClipboard = async (text, label = "Dato") => {
      try {
        await navigator.clipboard.writeText(text);
        showToast(`${label} copiado al portapapeles: "${text}"`, "success");
      } catch (err) {
        // Fallback
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        showToast(`${label} copiado: "${text}"`, "success");
      }
    };

    const selectSearchResult = (item) => {
      activeTab.value = item.tab;
      isSpotlightOpen.value = false;
      spotlightQuery.value = "";
      searchQuery.value = "";
      showToast(`Navegando a sección: ${item.type}`, "info");
    };

    // Helpers para cálculo automático de color
    const hexToRgb = (hex) => {
      let c = hex.replace("#", "");
      if (c.length === 3) c = c.split("").map(x => x + x).join("");
      const num = parseInt(c, 16);
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;
      return `rgb(${r}, ${g}, ${b})`;
    };

    const hexToCmyk = (hex) => {
      let c = hex.replace("#", "");
      if (c.length === 3) c = c.split("").map(x => x + x).join("");
      const num = parseInt(c, 16);
      let r = ((num >> 16) & 255) / 255;
      let g = ((num >> 8) & 255) / 255;
      let b = (num & 255) / 255;
      
      let k = 1 - Math.max(r, g, b);
      if (k === 1) return "C:0 M:0 Y:0 K:100";
      let cyan = Math.round(((1 - r - k) / (1 - k)) * 100);
      let magenta = Math.round(((1 - g - k) / (1 - k)) * 100);
      let yellow = Math.round(((1 - b - k) / (1 - k)) * 100);
      let black = Math.round(k * 100);
      return `C:${cyan} M:${magenta} Y:${yellow} K:${black}`;
    };

    const isLightColor = (hex) => {
      let c = hex.replace("#", "");
      if (c.length === 3) c = c.split("").map(x => x + x).join("");
      const num = parseInt(c, 16);
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 155;
    };

    const onColorHexInput = () => {
      const hex = colorModal.value.data.hex;
      if (/^#[0-9A-Fa-f]{6}$/.test(hex) || /^#[0-9A-Fa-f]{3}$/.test(hex)) {
        colorModal.value.data.rgb = hexToRgb(hex);
        colorModal.value.data.cmyk = hexToCmyk(hex);
        colorModal.value.data.isLight = isLightColor(hex);
      }
    };

    // Checklist de Procedimientos
    const toggleChecklistItem = (procedure, index) => {
      if (procedure.checklist && procedure.checklist[index]) {
        procedure.checklist[index].done = !procedure.checklist[index].done;
        saveToStorage();
      }
    };

    // Gestión de Marcas
    const openNewBrandModal = () => {
      brandModal.value = {
        isOpen: true,
        isEditing: false,
        data: {
          name: "",
          tagline: "",
          industry: "",
          website: "",
          summary: "",
          mission: "",
          vision: "",
          archetype: "El Creador"
        }
      };
    };

    const openEditBrandModal = () => {
      if (!currentBrand.value) return;
      const b = currentBrand.value;
      brandModal.value = {
        isOpen: true,
        isEditing: true,
        data: {
          name: b.name,
          tagline: b.tagline || "",
          industry: b.industry || "",
          website: b.website || "",
          summary: b.summary || "",
          mission: b.identity ? b.identity.mission : "",
          vision: b.identity ? b.identity.vision : "",
          archetype: b.identity ? b.identity.archetype : ""
        }
      };
    };

    const saveBrand = () => {
      if (!brandModal.value.data.name.trim()) {
        alert("El nombre de la marca es obligatorio");
        return;
      }

      if (brandModal.value.isEditing) {
        // Actualizar actual
        const b = currentBrand.value;
        b.name = brandModal.value.data.name;
        b.tagline = brandModal.value.data.tagline;
        b.industry = brandModal.value.data.industry;
        b.website = brandModal.value.data.website;
        b.summary = brandModal.value.data.summary;
        if (!b.identity) b.identity = {};
        b.identity.mission = brandModal.value.data.mission;
        b.identity.vision = brandModal.value.data.vision;
        b.identity.archetype = brandModal.value.data.archetype;
        showToast("Marca actualizada con éxito", "success");
      } else {
        // Nueva marca
        const newId = "brand-" + Date.now();
        const newBrand = {
          id: newId,
          name: brandModal.value.data.name,
          tagline: brandModal.value.data.tagline,
          industry: brandModal.value.data.industry,
          website: brandModal.value.data.website,
          summary: brandModal.value.data.summary,
          createdDate: new Date().toISOString().split("T")[0],
          status: "Activo",
          identity: {
            mission: brandModal.value.data.mission || "Definir misión.",
            vision: brandModal.value.data.vision || "Definir visión.",
            values: [
              { title: "Calidad y Coherencia", desc: "Todo elemento respeta las normas de identidad y propósito." }
            ],
            archetype: brandModal.value.data.archetype || "El Creador",
            toneAndVoice: {
              attributes: [
                { trait: "Profesional y Claro", note: "Comunicación directa orientada al cliente." }
              ],
              weAre: ["Comprometidos", "Innovadores"],
              weAreNot: ["Descuidados", "Burocráticos"]
            }
          },
          logos: [],
          logoRules: [
            { rule: "No distorsionar", desc: "Mantener proporciones bloqueadas en todo momento." },
            { rule: "No alterar colores", desc: "Usar solo las versiones autorizadas en este manual." }
          ],
          colors: [
            {
              id: "col-" + Date.now(),
              category: "Primario",
              name: "Color Principal",
              hex: "#2563eb",
              rgb: "rgb(37, 99, 235)",
              cmyk: "C:84 M:58 Y:0 K:8",
              pantone: "Pantone 2174 C",
              usage: "Identidad principal, botones de acción y encabezados.",
              isLight: false
            }
          ],
          typography: {
            display: {
              name: "Space Grotesk",
              source: "Google Fonts",
              weights: "Bold (700)",
              usage: "Titulares y encabezados principales.",
              sampleText: "Titular de Alto Impacto"
            },
            body: {
              name: "Plus Jakarta Sans",
              source: "Google Fonts",
              weights: "Regular (400), SemiBold (600)",
              usage: "Párrafos, documentación y procesos.",
              sampleText: "Texto de lectura ágil y confortable."
            },
            mono: {
              name: "JetBrains Mono",
              source: "Google Fonts",
              weights: "Regular (400)",
              usage: "Códigos, especificaciones y métricas.",
              sampleText: "COD: #2563eb"
            },
            scale: [
              { level: "H1 - Título Hero", size: "36px - 44px", weight: "Bold (700)", lineHeight: "1.2", tracking: "-0.02em" },
              { level: "H2 - Sección", size: "26px - 30px", weight: "Bold (700)", lineHeight: "1.3", tracking: "-0.01em" },
              { level: "Cuerpo", size: "15px - 16px", weight: "Regular (400)", lineHeight: "1.6", tracking: "0" }
            ]
          },
          procedures: [],
          processes: []
        };

        brands.value.push(newBrand);
        currentBrandId.value = newId;
        showToast("Nueva marca creada y seleccionada", "success");
      }

      saveToStorage();
      brandModal.value.isOpen = false;
    };

    const deleteCurrentBrand = () => {
      if (brands.value.length <= 1) {
        alert("No puedes eliminar la única marca activa.");
        return;
      }
      if (confirm(`¿Estás seguro de que deseas eliminar permanentemente la marca "${currentBrand.value.name}"?`)) {
        const idToDelete = currentBrandId.value;
        const idx = brands.value.findIndex(b => b.id === idToDelete);
        brands.value.splice(idx, 1);
        currentBrandId.value = brands.value[0].id;
        saveToStorage();
        deleteBrandFromSupabase(idToDelete);
        showToast("Marca eliminada de local y Supabase", "info");
      }
    };

    // Gestión de Colores
    const openAddColorModal = () => {
      colorModal.value = {
        isOpen: true,
        isEditing: false,
        data: {
          id: "col-" + Date.now(),
          name: "",
          category: "Primario",
          hex: "#3b82f6",
          rgb: "rgb(59, 130, 246)",
          cmyk: "C:76 M:47 Y:0 K:4",
          pantone: "Pantone 2174 C",
          usage: "",
          isLight: false
        }
      };
      onColorHexInput();
    };

    const openEditColorModal = (color) => {
      colorModal.value = {
        isOpen: true,
        isEditing: true,
        data: { ...color }
      };
    };

    const saveColor = () => {
      if (!colorModal.value.data.name.trim() || !colorModal.value.data.hex.trim()) {
        alert("Nombre y valor HEX son requeridos");
        return;
      }
      if (!currentBrand.value.colors) currentBrand.value.colors = [];

      if (colorModal.value.isEditing) {
        const idx = currentBrand.value.colors.findIndex(c => c.id === colorModal.value.data.id);
        if (idx !== -1) {
          currentBrand.value.colors[idx] = { ...colorModal.value.data };
          showToast("Color actualizado", "success");
        }
      } else {
        currentBrand.value.colors.push({ ...colorModal.value.data });
        showToast("Nuevo color añadido a la paleta", "success");
      }
      saveToStorage();
      colorModal.value.isOpen = false;
    };

    const deleteColor = (id) => {
      if (confirm("¿Eliminar este color de la paleta?")) {
        currentBrand.value.colors = currentBrand.value.colors.filter(c => c.id !== id);
        saveToStorage();
        showToast("Color eliminado", "info");
      }
    };

    // Gestión de Procedimientos (SOPs)
    const openAddProcedureModal = () => {
      procedureModal.value = {
        isOpen: true,
        isEditing: false,
        data: {
          id: "sop-" + Date.now(),
          code: `SOP-${(currentBrand.value.procedures?.length || 0) + 1}`,
          title: "",
          category: "General",
          role: "",
          estimatedTime: "30 min",
          summary: "",
          guidelines: "",
          tagsInput: "Operaciones, Calidad",
          checklistInput: "Revisar requisitos\nEjecutar paso principal\nValidar resultado final"
        }
      };
    };

    const openEditProcedureModal = (sop) => {
      procedureModal.value = {
        isOpen: true,
        isEditing: true,
        data: {
          id: sop.id,
          code: sop.code || "",
          title: sop.title,
          category: sop.category || "General",
          role: sop.role || "",
          estimatedTime: sop.estimatedTime || "",
          summary: sop.summary || "",
          guidelines: sop.guidelines || "",
          tagsInput: (sop.tags || []).join(", "),
          checklistInput: (sop.checklist || []).map(c => c.text).join("\n")
        }
      };
    };

    const saveProcedure = () => {
      const d = procedureModal.value.data;
      if (!d.title.trim()) {
        alert("El título del procedimiento es obligatorio.");
        return;
      }

      const tags = d.tagsInput.split(",").map(t => t.trim()).filter(Boolean);
      const checklistLines = d.checklistInput.split("\n").map(l => l.trim()).filter(Boolean);
      const checklist = checklistLines.map(text => ({ text, done: false }));

      if (!currentBrand.value.procedures) currentBrand.value.procedures = [];

      if (procedureModal.value.isEditing) {
        const idx = currentBrand.value.procedures.findIndex(p => p.id === d.id);
        if (idx !== -1) {
          const old = currentBrand.value.procedures[idx];
          // Preservar estados de checks si el texto coincide
          const mergedChecklist = checklist.map(newItem => {
            const match = (old.checklist || []).find(c => c.text === newItem.text);
            return match ? match : newItem;
          });

          currentBrand.value.procedures[idx] = {
            ...old,
            code: d.code,
            title: d.title,
            category: d.category,
            role: d.role,
            estimatedTime: d.estimatedTime,
            summary: d.summary,
            guidelines: d.guidelines,
            tags,
            checklist: mergedChecklist
          };
          showToast("Procedimiento actualizado", "success");
        }
      } else {
        currentBrand.value.procedures.push({
          id: d.id,
          code: d.code,
          title: d.title,
          category: d.category,
          role: d.role,
          estimatedTime: d.estimatedTime,
          summary: d.summary,
          guidelines: d.guidelines,
          tags,
          checklist
        });
        showToast("Nuevo procedimiento (SOP) registrado", "success");
      }

      saveToStorage();
      procedureModal.value.isOpen = false;
    };

    const deleteProcedure = (id) => {
      if (confirm("¿Estás seguro de eliminar este procedimiento?")) {
        currentBrand.value.procedures = currentBrand.value.procedures.filter(p => p.id !== id);
        saveToStorage();
        showToast("Procedimiento eliminado", "info");
      }
    };

    // Gestión de Procesos y Flujos
    const openAddProcessModal = () => {
      processModal.value = {
        isOpen: true,
        isEditing: false,
        data: {
          id: "proc-" + Date.now(),
          code: `PROC-${(currentBrand.value.processes?.length || 0) + 1}`,
          title: "",
          category: "Operaciones",
          owner: "",
          purpose: "",
          steps: [
            { stepNumber: 1, title: "Inicio & Solicitud", responsible: "Solicitante", input: "Brief", output: "Ticket", duration: "1d", status: "Completado" },
            { stepNumber: 2, title: "Desarrollo", responsible: "Ejecutor", input: "Normas de marca", output: "Propuesta", duration: "2d", status: "En Proceso" },
            { stepNumber: 3, title: "Aprobación", responsible: "Brand Guardian", input: "Propuesta", output: "Aprobación", duration: "1d", status: "Pendiente" }
          ]
        }
      };
    };

    const openEditProcessModal = (proc) => {
      processModal.value = {
        isOpen: true,
        isEditing: true,
        data: JSON.parse(JSON.stringify(proc))
      };
    };

    const addStepToProcessModal = () => {
      const nextNum = processModal.value.data.steps.length + 1;
      processModal.value.data.steps.push({
        stepNumber: nextNum,
        title: "",
        responsible: "",
        input: "",
        output: "",
        duration: "1d",
        status: "Pendiente"
      });
    };

    const removeStepFromProcessModal = (index) => {
      if (processModal.value.data.steps.length > 1) {
        processModal.value.data.steps.splice(index, 1);
        // Renumerar
        processModal.value.data.steps.forEach((s, idx) => s.stepNumber = idx + 1);
      }
    };

    const saveProcess = () => {
      const d = processModal.value.data;
      if (!d.title.trim()) {
        alert("El título del proceso es obligatorio.");
        return;
      }

      if (!currentBrand.value.processes) currentBrand.value.processes = [];

      if (processModal.value.isEditing) {
        const idx = currentBrand.value.processes.findIndex(p => p.id === d.id);
        if (idx !== -1) {
          currentBrand.value.processes[idx] = JSON.parse(JSON.stringify(d));
          showToast("Proceso actualizado", "success");
        }
      } else {
        currentBrand.value.processes.push(JSON.parse(JSON.stringify(d)));
        showToast("Nuevo proceso creado", "success");
      }

      saveToStorage();
      processModal.value.isOpen = false;
    };

    const deleteProcess = (id) => {
      if (confirm("¿Estás seguro de eliminar este proceso?")) {
        currentBrand.value.processes = currentBrand.value.processes.filter(p => p.id !== id);
        saveToStorage();
        showToast("Proceso eliminado", "info");
      }
    };

    // Importación y Exportación
    const exportToJson = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentBrand.value, null, 2));
      const downloadAnchor = document.createElement("a");
      const fileName = `${(currentBrand.value.name || 'manual').toLowerCase().replace(/\s+/g, '-')}-manual-marca.json`;
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", fileName);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast("Manual descargado como archivo JSON", "success");
    };

    const exportAllBrandsJson = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(brands.value, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "brandcraft-backup-completo.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast("Backup completo de todas las marcas exportado", "success");
    };

    const handleImportJson = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (Array.isArray(parsed)) {
            // Importar múltiples marcas
            brands.value = parsed;
            if (brands.value.length > 0) currentBrandId.value = brands.value[0].id;
            saveToStorage();
            showToast(`Se importaron ${parsed.length} marcas exitosamente`, "success");
          } else if (parsed && parsed.id && parsed.name) {
            // Importar marca única
            const existingIndex = brands.value.findIndex(b => b.id === parsed.id);
            if (existingIndex !== -1) {
              brands.value[existingIndex] = parsed;
            } else {
              brands.value.push(parsed);
            }
            currentBrandId.value = parsed.id;
            saveToStorage();
            showToast(`Marca "${parsed.name}" importada exitosamente`, "success");
          } else {
            alert("El archivo no tiene el formato de manual de marca válido.");
          }
        } catch (err) {
          alert("Error al leer el archivo JSON: " + err.message);
        }
        event.target.value = "";
      };
      reader.readAsText(file);
    };

    const printManual = () => {
      window.print();
    };

    // Keyboard Shortcuts
    const handleGlobalKeydown = (e) => {
      // Ctrl + K o Cmd + K para Spotlight
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        isSpotlightOpen.value = !isSpotlightOpen.value;
        if (isSpotlightOpen.value) {
          setTimeout(() => {
            const input = document.getElementById("spotlight-search-input");
            if (input) input.focus();
          }, 50);
        }
      }
      // Escape cierra modales
      if (e.key === "Escape") {
        isSpotlightOpen.value = false;
        brandModal.value.isOpen = false;
        colorModal.value.isOpen = false;
        procedureModal.value.isOpen = false;
        processModal.value.isOpen = false;
        selectedProcessStep.value = null;
      }
    };

    onMounted(() => {
      loadFromStorage();
      loadFromSupabase();
      window.addEventListener("keydown", handleGlobalKeydown);
    });

    // Observar cambios para persistir automáticamente
    watch(brands, () => {
      saveToStorage();
      triggerCloudSync();
    }, { deep: true });

    watch(currentBrandId, () => {
      saveToStorage();
    });

    return {
      brands,
      currentBrandId,
      currentBrand,
      activeTab,
      isPortalMode,
      searchQuery,
      searchFilter,
      cloudStatus,
      isSpotlightOpen,
      spotlightQuery,
      searchResults,
      stats,
      toast,
      brandModal,
      colorModal,
      procedureModal,
      processModal,
      selectedProcessStep,
      typeTesterText,
      typeTesterSize,
      // Métodos
      showToast,
      copyToClipboard,
      selectSearchResult,
      onColorHexInput,
      toggleChecklistItem,
      openNewBrandModal,
      openEditBrandModal,
      saveBrand,
      deleteCurrentBrand,
      openAddColorModal,
      openEditColorModal,
      saveColor,
      deleteColor,
      openAddProcedureModal,
      openEditProcedureModal,
      saveProcedure,
      deleteProcedure,
      openAddProcessModal,
      openEditProcessModal,
      addStepToProcessModal,
      removeStepFromProcessModal,
      saveProcess,
      deleteProcess,
      exportToJson,
      exportAllBrandsJson,
      handleImportJson,
      printManual,
      syncAllBrandsToSupabase
    };
  }
});

// Componente Icon reactivo para Lucide
app.component("icon", {
  props: {
    name: { type: String, required: true },
    class: { type: String, default: "w-4 h-4" }
  },
  setup(props) {
    const svgHtml = computed(() => {
      if (!window.lucide || !window.lucide.icons) return "";
      const pascal = props.name
        .split("-")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join("");
      const iconDef = window.lucide.icons[pascal];
      if (iconDef && window.lucide.createElement) {
        const svgEl = window.lucide.createElement(iconDef);
        if (props.class) svgEl.setAttribute("class", props.class);
        return svgEl.outerHTML;
      }
      return "";
    });

    return () => Vue.h("span", {
      class: "inline-flex items-center justify-center shrink-0 " + (props.class || ""),
      innerHTML: svgHtml.value
    });
  }
});

app.mount("#app");
