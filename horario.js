// Configuración de periodos de 40 minutos según el turno mañana
const periodos = [
  { num: "1.º", inicio: "08:00", fin: "08:40" },
  { num: "2.º", inicio: "08:40", fin: "09:20" },
  { num: "3.º", inicio: "09:20", fin: "10:00" },
  { num: "4.º", inicio: "10:00", fin: "10:40" },
  { num: "RECREO", inicio: "10:40", fin: "10:55", esRecreo: true },
  { num: "5.º", inicio: "10:55", fin: "11:35" },
  { num: "6.º", inicio: "11:35", fin: "12:15" },
  { num: "7.º", inicio: "12:15", fin: "12:55" },
  { num: "8.º", inicio: "12:55", fin: "13:35" }
];

// Matriz semanal con nombres completos para la vista diaria y abreviados para la tabla
const horarioSemana = {
  Lu: [
    { materia: "QUÍMICA", corta: "QUÍM", prof: "JENNY CHOQUE PEREZ" },
    { materia: "QUÍMICA", corta: "QUÍM", prof: "JENNY CHOQUE PEREZ" },
    { materia: "LENGUAJE", corta: "LENG", prof: "SHIRLEY" },
    { materia: "MATEMÁTICAS", corta: "MAT", prof: "SEBASTIAN HUGO VELA" },
    { recreo: true },
    { materia: "SOC/CIENCIAS", corta: "SOC", prof: "MARIA ELENA GARCIA" },
    { materia: "SOC/CIENCIAS", corta: "SOC", prof: "MARIA ELENA GARCIA" },
    { materia: "LENGUAJE", corta: "LENG", prof: "SHIRLEY" },
    { materia: "LENGUAJE", corta: "LENG", prof: "SHIRLEY" }
  ],
  Ma: [
    { materia: "FILOSOFÍA / PSI", corta: "FILO", prof: "VIDAL CUTILI CALLISAYA" },
    { materia: "FILOSOFÍA / PSI", corta: "FILO", prof: "VIDAL CUTILI CALLISAYA" },
    { materia: "SOC/CIENCIAS", corta: "SOC", prof: "MARIA ELENA GARCIA" },
    { materia: "SOC/CIENCIAS", corta: "SOC", prof: "MARIA ELENA GARCIA" },
    { recreo: true },
    { materia: "ARTES PLÁSTICAS", corta: "ARTES", prof: "ROSMERY CHURQUI" },
    { materia: "ARTES PLÁSTICAS", corta: "ARTES", prof: "ROSMERY CHURQUI" },
    { materia: "INGLÉS", corta: "ING", prof: "DAYNOR ENRIQUE CALDERON" },
    { materia: "INGLÉS", corta: "ING", prof: "DAYNOR ENRIQUE CALDERON" }
  ],
  Mi: [
    { materia: "COMPUTACIÓN", corta: "COMP", prof: "ARTURO MOLLO MAMANI" },
    { materia: "COMPUTACIÓN", corta: "COMP", prof: "ARTURO MOLLO MAMANI" },
    { materia: "MATEMÁTICAS", corta: "MAT", prof: "SEBASTIAN HUGO VELA" },
    { materia: "MATEMÁTICAS", corta: "MAT", prof: "SEBASTIAN HUGO VELA" },
    { recreo: true },
    { materia: "BIOLOGÍA", corta: "BIO", prof: "SILVIA EUGENIA RAMOS" },
    { materia: "BIOLOGÍA", corta: "BIO", prof: "SILVIA EUGENIA RAMOS" },
    { materia: "MÚSICA", corta: "MÚS", prof: "EDWIN CRUZ ARUQUIPA" },
    { materia: "MÚSICA", corta: "MÚS", prof: "EDWIN CRUZ ARUQUIPA" }
  ],
  Ju: [
    { materia: "SOC/CIENCIAS", corta: "SOC", prof: "MARIA ELENA GARCIA" },
    { materia: "SOC/CIENCIAS", corta: "SOC", prof: "MARIA ELENA GARCIA" },
    { materia: "FÍSICA", corta: "FIS", prof: "MIGUEL ANGEL CHOQUE" },
    { materia: "FÍSICA", corta: "FIS", prof: "MIGUEL ANGEL CHOQUE" },
    { recreo: true },
    { materia: "VALORES / REL", corta: "VAL", prof: "PRIMO PEDRO QUISBERT" },
    { materia: "VALORES / REL", corta: "VAL", prof: "PRIMO PEDRO QUISBERT" },
    { materia: "BIOLOGÍA", corta: "BIO", prof: "SILVIA EUGENIA RAMOS" },
    { materia: "BIOLOGÍA", corta: "BIO", prof: "SILVIA EUGENIA RAMOS" }
  ],
  Vi: [
    { materia: "SOC/CIENCIAS", corta: "SOC", prof: "MARIA ELENA GARCIA" },
    { materia: "SOC/CIENCIAS", corta: "SOC", prof: "MARIA ELENA GARCIA" },
    { materia: "MATEMÁTICAS", corta: "MAT", prof: "SEBASTIAN HUGO VELA" },
    { materia: "MATEMÁTICAS", corta: "MAT", prof: "SEBASTIAN HUGO VELA" },
    { recreo: true },
    { materia: "EDUCACIÓN FÍSICA", corta: "ED FIS", prof: "EULOGIO ORDOÑEZ" },
    { materia: "EDUCACIÓN FÍSICA", corta: "ED FIS", prof: "EULOGIO ORDOÑEZ" },
    { materia: "-", corta: "-", prof: "-" },
    { materia: "-", corta: "-", prof: "-" }
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  const btnHoy = document.getElementById("btn-hoy");
  const btnSemana = document.getElementById("btn-semana");
  const vistaHoy = document.getElementById("vista-hoy");
  const vistaSemana = document.getElementById("vista-semana");

  btnHoy?.addEventListener("click", () => {
    btnHoy.className = "tab-btn flex-1 py-2.5 rounded-xl transition-all tab-active flex items-center justify-center gap-2";
    btnSemana.className = "tab-btn flex-1 py-2.5 rounded-xl transition-all text-slate-400 hover:text-slate-200 flex items-center justify-center gap-2";
    vistaHoy.classList.remove("hidden");
    vistaSemana.classList.add("hidden");
  });

  btnSemana?.addEventListener("click", () => {
    btnSemana.className = "tab-btn flex-1 py-2.5 rounded-xl transition-all tab-active flex items-center justify-center gap-2";
    btnHoy.className = "tab-btn flex-1 py-2.5 rounded-xl transition-all text-slate-400 hover:text-slate-200 flex items-center justify-center gap-2";
    vistaSemana.classList.remove("hidden");
    vistaHoy.classList.add("hidden");
  });

  renderizarHoy();
  renderizarTablaSemanal();
});

function renderizarHoy() {
  const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const clavesDias = [null, "Lu", "Ma", "Mi", "Ju", "Vi", null];
  
  const fechaActual = new Date();
  const diaNum = fechaActual.getDay();
  const clave = clavesDias[diaNum] || "Lu";

  const tituloDia = document.getElementById("nombre-dia-hoy");
  if (tituloDia) tituloDia.innerText = `${dias[diaNum]} (${clave})`;

  const contenedor = document.getElementById("contenedor-periodos-hoy");
  if (!contenedor) return;
  contenedor.innerHTML = "";

  const clasesHoy = horarioSemana[clave];

  let idx = 0;
  while (idx < periodos.length) {
    const p = periodos[idx];
    const item = clasesHoy[idx];

    if (p.esRecreo) {
      contenedor.innerHTML += `
        <div class="flex items-center justify-between p-3.5 rounded-2xl recreo-card font-semibold">
          <div class="flex items-center gap-2">
            <span class="text-sm">🔔</span>
            <span class="text-xs font-bold tracking-wide">RECREO</span>
          </div>
          <span class="text-xs font-mono font-medium">${p.inicio} - ${p.fin}</span>
        </div>
      `;
      idx++;
    } else if (item && item.materia !== "-") {
      let duracionPeriodos = 1;
      let finHora = p.fin;

      if (idx + 1 < periodos.length && !periodos[idx + 1].esRecreo && clasesHoy[idx + 1]?.materia === item.materia) {
        duracionPeriodos = 2;
        finHora = periodos[idx + 1].fin;
      }

      contenedor.innerHTML += `
        <div class="p-4 rounded-2xl glass-card flex justify-between items-center space-x-3 hover:border-indigo-500/30 transition-all">
          <div class="space-y-1">
            <span class="inline-block px-2.5 py-1 rounded-xl badge-materia text-[11px] font-bold tracking-wider">
              ${item.materia}
            </span>
            <p class="text-xs font-medium text-slate-300 pl-0.5">${item.prof}</p>
          </div>
          <div class="text-right shrink-0">
            <span class="text-[11px] font-bold text-indigo-400 block">${duracionPeriodos === 2 ? '2 Periodos' : '1 Periodo'}</span>
            <span class="text-[10px] font-mono text-slate-400">${p.inicio} - ${finHora}</span>
          </div>
        </div>
      `;
      idx += duracionPeriodos;
    } else {
      idx++;
    }
  }
}

function renderizarTablaSemanal() {
  const tbody = document.getElementById("tabla-semana-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  const diasClaves = ["Lu", "Ma", "Mi", "Ju", "Vi"];
  const skip = { Lu: 0, Ma: 0, Mi: 0, Ju: 0, Vi: 0 };

  periodos.forEach((p, idx) => {
    if (p.esRecreo) {
      tbody.innerHTML += `
        <tr>
          <td class="py-2 px-1 text-center font-bold text-[10px] recreo-card rounded-xl" colspan="6">
            🔔 RECREO (${p.inicio} - ${p.fin})
          </td>
        </tr>
      `;
      return;
    }

    let filaHtml = `<tr>`;
    filaHtml += `<td class="py-2 px-0.5 font-mono text-[9px] text-slate-400 text-center leading-tight align-middle">${p.inicio}<br><span class="text-slate-600">${p.fin}</span></td>`;

    diasClaves.forEach((dia) => {
      if (skip[dia] > 0) {
        skip[dia]--;
        return;
      }

      const item = horarioSemana[dia][idx];
      let rowspan = 1;

      if (
        idx + 1 < periodos.length &&
        !periodos[idx + 1].esRecreo &&
        horarioSemana[dia][idx + 1]?.materia === item.materia &&
        item.materia !== "-"
      ) {
        rowspan = 2;
        skip[dia] = 1;
      }

      const attrRowspan = rowspan > 1 ? `rowspan="${rowspan}"` : "";
      const bgStyle = item && item.materia !== "-" ? "cell-materia text-slate-100 font-bold" : "text-slate-600";

      filaHtml += `<td ${attrRowspan} class="p-1.5 text-center align-middle ${bgStyle}">${item ? item.corta : '-'}</td>`;
    });

    filaHtml += `</tr>`;
    tbody.innerHTML += filaHtml;
  });
}