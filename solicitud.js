import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyO0nF1Lxsyk1V0LCRE_uuuZGGG7I7NjLA",
  authDomain: "agenda-6toa.firebaseapp.com",
  databaseURL: "https://agenda-6toa-default-rtdb.firebaseio.com",
  projectId: "agenda-6toa",
  storageBucket: "agenda-6toa.appspot.com",
  messagingSenderId: "588072085664",
  appId: "1:588072085664:web:a36d82cc47ac5534d4a1c6"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const solicitudesRef = ref(db, 'solicitudes');

// Inicializar íconos de Lucide
lucide.createIcons();

// Enviar pregunta a Firebase Realtime Database
const form = document.getElementById('request-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const materiaInput = document.getElementById('request-materia');
  const preguntaInput = document.getElementById('request-text');
  const usuario = localStorage.getItem('usuario_seleccionado') || 'Estudiante 6to A';

  const nuevaSolicitud = {
    materia: materiaInput.value,
    pregunta: preguntaInput.value.trim(),
    usuario: usuario,
    fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  push(solicitudesRef, nuevaSolicitud)
    .then(() => {
      form.reset();
    })
    .catch((error) => {
      console.error("Error al publicar la duda:", error);
    });
});

// Escuchar solicitudes en tiempo real desde Firebase Realtime Database
onValue(solicitudesRef, (snapshot) => {
  const container = document.getElementById('requests-container');
  if (!container) return;
  container.innerHTML = '';

  const data = snapshot.val();
  if (!data) {
    container.innerHTML = `
      <div class="bg-slate-900/50 border border-slate-800/80 rounded-xl p-6 text-center">
        <p class="text-xs text-slate-500">No hay ninguna consulta por ahora.</p>
      </div>
    `;
    return;
  }

  Object.keys(data).reverse().forEach((key) => {
    const item = data[key];
    const card = document.createElement('div');
    card.className = 'bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2 shadow-sm';

    card.innerHTML = `
      <div class="flex items-center justify-between gap-2">
        <span class="bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold px-2 py-0.5 rounded-md text-[10px] tracking-wide">
          ${item.materia}
        </span>
        <div class="flex items-center gap-2">
          <span class="text-[10px] text-slate-500 font-medium">${item.fecha || ''} - ${item.usuario}</span>
          <!-- Botón Eliminar Consulta -->
          <button onclick="deleteRequest('${key}')" class="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors" title="Eliminar consulta">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
      <p class="text-xs text-slate-200 font-medium leading-relaxed">${item.pregunta}</p>
    `;

    container.appendChild(card);
  });

  // Renderizar íconos Lucide generados dinámicamente
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
// Función global para eliminar consulta por ID
window.deleteRequest = function(key) {
  if (confirm("¿Estás seguro de eliminar esta consulta?")) {
    const itemRef = ref(db, `solicitudes/${key}`);
    remove(itemRef)
      .then(() => console.log("Consulta eliminada"))
      .catch((err) => console.error("Error al eliminar:", err));
  }
};