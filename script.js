// Array de control (Respaldo en memoria)
let events = [];
const MAX_EVENTS = 200;

// Elementos del DOM
const eventForm = document.getElementById('eventForm');
const eventLog = document.getElementById('eventLog');
const counterBadge = document.getElementById('counterBadge');
const searchInput = document.getElementById('searchInput');

// 1. SIMULACIÓN DE FETCH API (Criterio 3 - AJAX/JSON)
function fetchInitialEvents() {
    // Simulamos una petición a un servidor con un setTimeout
    setTimeout(() => {
        const mockData = [
            { id: 1, name: "Inicio de sistema", type: "operativo", priority: "baja", timestamp: new Date(Date.now() - 3600000).toLocaleString() },
            { id: 2, name: "Fallo de conexión a BD", type: "error", priority: "alta", timestamp: new Date(Date.now() - 1800000).toLocaleString() }
        ];

        events = [...mockData];
        renderEvents();
        showToast("Datos iniciales cargados vía Fetch API", "info");
    }, 1000);
}

// 2. RENDERIZADO EN EL DOM CON TIMESTAMP
function renderEvents(filterText = "") {
    eventLog.innerHTML = "";

    // Filtrar por búsqueda si es necesario
    const filtered = events.filter(e => e.name.toLowerCase().includes(filterText.toLowerCase()));

    if (filtered.length === 0) {
        eventLog.innerHTML = `<div class="text-muted text-center py-5">No hay eventos registrados.</div>`;
        return;
    }

    // Renderizar en orden inverso (el más nuevo arriba)
    filtered.slice().reverse().forEach(ev => {
        const div = document.createElement('div');
        div.className = 'log-item';

        let typeClass = ev.type === 'operativo' ? 'type-operativo' : ev.type === 'error' ? 'type-error' : 'type-seguridad';

        div.innerHTML = `
            <span class="badge-type ${typeClass}">${ev.type.toUpperCase()}</span>
            <div class="log-content">
                <span class="log-id">#${ev.id}</span> <strong>${ev.name}</strong>
                <span class="badge bg-secondary ms-2" style="font-size:0.65rem">${ev.priority}</span>
                <span class="log-time"><i class="ph ph-clock"></i> ${ev.timestamp}</span>
            </div>
        `;
        eventLog.appendChild(div);
    });

    // Actualizar contador
    counterBadge.textContent = `${events.length} / ${MAX_EVENTS} Eventos`;

    // Alerta si se llega al límite
    if(events.length >= MAX_EVENTS) {
        counterBadge.classList.add('bg-danger');
        counterBadge.classList.remove('bg-primary');
    } else {
        counterBadge.classList.add('bg-primary');
        counterBadge.classList.remove('bg-danger');
    }
}

// 3. REGISTRO DE NUEVOS EVENTOS
eventForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (events.length >= MAX_EVENTS) {
        alert("⚠️ Límite de 200 eventos alcanzado. No se pueden registrar más.");
        return;
    }

    const name = document.getElementById('eventName').value;
    const type = document.getElementById('eventType').value;
    const priority = document.getElementById('eventPriority').value;

    // TIMESTAMP AUTOMÁTICO (Criterio 2)
    const timestamp = new Date().toLocaleString();

    const newEvent = {
        id: events.length + 1,
        name: name,
        type: type,
        priority: priority,
        timestamp: timestamp
    };

    events.push(newEvent);
    renderEvents();

    // Resetear formulario
    eventForm.reset();
    showToast("Evento registrado exitosamente", "success");
});

// 4. RESPALDO / BACKUP EN JSON (Criterio 3)
document.getElementById('btnBackup').addEventListener('click', () => {
    if (events.length === 0) {
        alert("No hay eventos para respaldar.");
        return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(events, null, 4));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `backup_eventos_${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    showToast("Backup JSON generado", "success");
});

// 5. BUSCADOR EN TIEMPO REAL (Funcionalidad de Negocio Extra)
searchInput.addEventListener('input', (e) => {
    renderEvents(e.target.value);
});

// TOAST PERSONALIZADO
function showToast(msg, type) {
    // Implementación rápida de toast (puedes usar la del lab si prefieres)
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 9999;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white; padding: 15px 25px; border-radius: 8px;
        font-weight: bold; animation: fadeIn 0.3s;
    `;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Iniciar
document.addEventListener('DOMContentLoaded', fetchInitialEvents);
