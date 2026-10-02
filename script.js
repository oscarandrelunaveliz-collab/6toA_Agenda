// ==========================================
// CONFIGURACIÓN DE SUPABASE
// ==========================================
const SUPABASE_URL = 'https://supabase.com/dashboard/project/axxhgojhocyoozbcqtbl';
const SUPABASE_ANON_KEY = 'sb_publishable_-tN4KKXbcCjUuEONM_yw1g_Qy6fWP7k';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

lucide.createIcons();

let tasks = [];
let currentFilter = 'todas';
let searchQuery = '';

// ==========================================
// ELEMENTOS DEL DOM
// ==========================================
const tasksContainer = document.getElementById('tasks-container');
const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('open-modal');
const closeModalBtn = document.getElementById('close-modal');
const taskForm = document.getElementById('task-form');
const searchInput = document.getElementById('search-input');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

// ==========================================
// CONTROL DEL MODAL & ACORDEÓN
// ==========================================
openModalBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.getElementById('due-date').valueAsDate = new Date();
});

closeModalBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  resetSubjectAccordion();
});

const accordionToggle = document.getElementById('accordion-toggle');
const accordionContent = document.getElementById('accordion-content');
const accordionIcon = document.getElementById('accordion-icon');
const selectedSubjectLabel = document.getElementById('selected-subject-label');
const subjectHiddenInput = document.getElementById('subject');

if (accordionToggle) {
  accordionToggle.addEventListener('click', () => {
    accordionContent.classList.toggle('hidden');
    accordionIcon.style.transform = accordionContent.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
  });
}

document.querySelectorAll('.subject-option').forEach(option => {
  option.addEventListener('click', (e) => {
    const selectedSubject = e.currentTarget.dataset.subject;
    subjectHiddenInput.value = selectedSubject;
    selectedSubjectLabel.textContent = selectedSubject;
    selectedSubjectLabel.classList.remove('text-slate-400');
    selectedSubjectLabel.classList.add('text-indigo-400', 'font-bold');
    accordionContent.classList.add('hidden');
    accordionIcon.style.transform = 'rotate(0deg)';
  });
});

function resetSubjectAccordion() {
  subjectHiddenInput.value = '';
  selectedSubjectLabel.textContent = 'Seleccionar una materia...';
  selectedSubjectLabel.classList.remove('text-indigo-400', 'font-bold');
  selectedSubjectLabel.classList.add('text-slate-400');
  if (accordionContent) accordionContent.classList.add('hidden');
  if (accordionIcon) accordionIcon.style.transform = 'rotate(0deg)';
}

// ==========================================
// OPERACIONES CON SUPABASE (CRUD & REALTIME)
// ==========================================

// 1. Cargar tareas iniciales desde Supabase
async function fetchTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener tareas:', error.message);
    return;
  }

  tasks = data.map(t => ({
    id: t.id,
    subject: t.subject,
    description: t.description,
    priority: t.priority,
    dueDate: t.due_date,
    author: t.author,
    completed: t.completed
  }));

  renderTasks();
}

// 2. Escuchar cambios en tiempo real (Realtime)
function listenRealtimeChanges() {
  supabase
    .channel('tasks_channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
      fetchTasks(); // Actualiza los datos automáticamente al detectar un cambio
    })
    .subscribe();
}

// 3. Crear tarea en Supabase
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const newTask = {
    subject: document.getElementById('subject').value,
    description: document.getElementById('description').value.trim(),
    priority: document.getElementById('priority').value,
    due_date: document.getElementById('due-date').value,
    author: document.getElementById('author').value.trim(),
    completed: false
  };

  const { error } = await supabase.from('tasks').insert([newTask]);

  if (error) {
    alert('Error al guardar la tarea: ' + error.message);
    return;
  }

  taskForm.reset();
  resetSubjectAccordion();
  modal.classList.add('hidden');
  modal.classList.remove('flex');
});

// 4. Cambiar estado completado/pendiente
window.toggleTask = async function(id) {
  const currentTask = tasks.find(t => t.id === id);
  if (!currentTask) return;

  const { error } = await supabase
    .from('tasks')
    .update({ completed: !currentTask.completed })
    .eq('id', id);

  if (error) console.error('Error al actualizar:', error.message);
};

// 5. Eliminar tarea en Supabase
window.deleteTask = async function(id) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) console.error('Error al eliminar:', error.message);
};

// ==========================================
// RENDERIZADO DE INTERFAZ & FILTROS
// ==========================================
function formatDueDate(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = dateString.split('-').map(Number);
  const taskDate = new Date(year, month - 1, day);
  const diffDays = Math.round((taskDate - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: `Atrasada (${dateString})`, status: 'text-rose-400 font-bold' };
  if (diffDays === 0) return { text: '¡Entrega Hoy! ⚠️', status: 'text-amber-400 font-bold animate-pulse' };
  if (diffDays === 1) return { text: 'Mañana', status: 'text-indigo-400 font-semibold' };
  return { text: dateString, status: 'text-slate-400' };
}

function updateProgressAndCounters() {
  const total = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = total - completedCount;

  const percentage = total === 0 ? 0 : Math.round((completedCount / total) * 100);
  progressBar.style.width = `${percentage}%`;
  progressText.textContent = `${percentage}% completado`;

  const btnTodas = document.querySelector('[data-filter="todas"]');
  const btnPendientes = document.querySelector('[data-filter="pendientes"]');
  const btnListas = document.querySelector('[data-filter="listas"]');

  if (btnTodas) btnTodas.textContent = `Todas (${total})`;
  if (btnPendientes) btnPendientes.textContent = `Pendientes (${pendingCount})`;
  if (btnListas) btnListas.textContent = `Listas (${completedCount})`;
}

function renderTasks() {
  tasksContainer.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = 
      currentFilter === 'todas' ? true :
      currentFilter === 'pendientes' ? !task.completed : task.completed;

    const matchesSearch = 
      task.subject.toLowerCase().includes(searchQuery) ||
      task.description.toLowerCase().includes(searchQuery) ||
      task.author.toLowerCase().includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  if (filteredTasks.length === 0) {
    tasksContainer.innerHTML = `
      <div class="text-center py-12 space-y-3 bg-slate-900/40 rounded-2xl border border-slate-800/50">
        <i data-lucide="folder-open" class="w-10 h-10 mx-auto text-slate-600"></i>
        <p class="text-xs text-slate-400">No hay tareas encontradas en esta sección.</p>
      </div>
    `;
    lucide.createIcons();
    updateProgressAndCounters();
    return;
  }

  filteredTasks.forEach(task => {
    const card = document.createElement('div');
    const dateInfo = formatDueDate(task.dueDate);

    const priorityColors = {
      alta: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      media: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      baja: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    };

    card.className = `p-4 rounded-2xl border transition-all duration-300 ${
      task.completed 
        ? 'bg-slate-900/40 border-slate-800/80 opacity-60' 
        : 'bg-slate-900 border-slate-800 shadow-md'
    }`;

    card.innerHTML = `
      <div class="flex items-start justify-between gap-3">
        <div class="space-y-2 flex-1">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-2.5 py-0.5 rounded-lg text-[10px] font-bold tracking-wider uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              ${task.subject}
            </span>
            <span class="px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${priorityColors[task.priority]}">
              ${task.priority.toUpperCase()}
            </span>
          </div>
          <p class="text-xs font-medium text-slate-200 leading-relaxed ${task.completed ? 'line-through text-slate-500' : ''}">
            ${task.description}
          </p>
          <div class="flex items-center gap-3 text-[10px] pt-1">
            <span class="flex items-center gap-1 ${dateInfo.status}">
              <i data-lucide="calendar" class="w-3 h-3"></i> ${dateInfo.text}
            </span>
            <span class="text-slate-600">•</span>
            <span class="text-slate-400">Por: <strong class="text-slate-300">${task.author}</strong></span>
          </div>
        </div>
        <div class="flex flex-col gap-1.5">
          <button onclick="toggleTask(${task.id})" class="p-2 rounded-xl transition-all ${
            task.completed 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
          }">
            <i data-lucide="${task.completed ? 'check-check' : 'circle'}" class="w-4 h-4"></i>
          </button>
          <button onclick="deleteTask(${task.id})" class="p-2 rounded-xl bg-slate-800/50 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-all">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;

    tasksContainer.appendChild(card);
  });

  lucide.createIcons();
  updateProgressAndCounters();
}

// Filtros y Búsqueda
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.remove('bg-indigo-600', 'text-white', 'shadow-md', 'shadow-indigo-600/20');
      b.classList.add('text-slate-400');
    });
    
    e.currentTarget.classList.add('bg-indigo-600', 'text-white', 'shadow-md', 'shadow-indigo-600/20');
    e.currentTarget.classList.remove('text-slate-400');
    currentFilter = e.currentTarget.dataset.filter;
    renderTasks();
  });
});

searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value.toLowerCase().trim();
  renderTasks();
});

// Inicialización
fetchTasks();
listenRealtimeChanges();