// Solución simple para el problema de login
console.log('🔧 Aplicando fix de login...');

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM cargado');
    
    // Buscar el formulario de login
    const loginForm = document.getElementById('loginForm');
    
    if (!loginForm) {
        console.error('❌ No se encontró el formulario de login');
        return;
    }
    
    console.log('✅ Formulario de login encontrado');
    
    // Remover cualquier listener anterior
    const newForm = loginForm.cloneNode(true);
    loginForm.parentNode.replaceChild(newForm, loginForm);
    
    // Agregar nuevo listener
    newForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('📝 Formulario enviado');
        
        // Obtener valores
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        
        console.log('📋 Datos ingresados:', { username, password, role });
        
        // Validar credenciales
        if (username === 'admin' && password === 'admin123' && role === 'admin') {
            console.log('✅ Login exitoso');
            
            // Ocultar pantalla de login
            const loginScreen = document.getElementById('loginScreen');
            const app = document.getElementById('app');
            
            if (loginScreen && app) {
                loginScreen.style.display = 'none';
                app.style.display = 'block';
                
                // Actualizar nombre de usuario
                const userNameElement = document.getElementById('userName');
                if (userNameElement) {
                    userNameElement.textContent = 'Administrador';
                }
                
                console.log('🎉 Sistema iniciado correctamente');
                
                // Inicializar el sistema principal
                setTimeout(() => {
                    if (window.MedicalApp) {
                        console.log('🚀 Inicializando aplicación principal...');
                        window.app = new window.MedicalApp();
                        console.log('✅ Aplicación principal inicializada');
                    } else {
                        console.log('⚠️ MedicalApp no disponible, cargando funcionalidades básicas...');
                        initializeBasicFeatures();
                    }
                }, 100);
                
                alert('¡Bienvenido al Sistema de Historias Clínicas!');
            } else {
                console.error('❌ No se encontraron los elementos de la interfaz');
            }
        } else {
            console.log('❌ Credenciales incorrectas');
            alert('❌ Credenciales incorrectas\n\nUsa:\nUsuario: admin\nContraseña: admin123\nRol: Administrador');
        }
    });
    
    console.log('✅ Fix de login aplicado correctamente');
});

// Función para inicializar funcionalidades básicas
function initializeBasicFeatures() {
    console.log('🔧 Inicializando funcionalidades básicas...');
    
    // Configurar navegación del sidebar
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Si es un toggle de submenú
            if (this.classList.contains('nav-toggle')) {
                toggleSubmenu(this);
                return;
            }
            
            const section = this.dataset.section;
            const action = this.dataset.action;
            
            if (action) {
                handleAction(action);
            } else if (section) {
                console.log('📱 Navegando a:', section);
                showSection(section);
            }
        });
    });
    
    // Configurar enlaces de submenú
    const submenuLinks = document.querySelectorAll('.submenu-link');
    submenuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const section = this.dataset.section;
            const action = this.dataset.action;
            
            if (action) {
                handleAction(action);
            } else if (section) {
                console.log('📱 Navegando a:', section);
                showSection(section);
            }
        });
    });
    
    // Configurar botones de agregar
    const addButtons = {
        'addPatientBtn': () => showPatientModal(),
        'addRecordBtn': () => showRecordModal(),
        'addAppointmentBtn': () => showAppointmentModal(),
        'addDoctorBtn': () => showDoctorModal()
    };
    
    Object.keys(addButtons).forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', addButtons[id]);
        }
    });
    
    // Configurar opciones del header
    const sidebarToggle = document.getElementById('sidebarToggle');
    const languageToggle = document.getElementById('languageToggle');
    const notificationBtn = document.getElementById('notificationBtn');
    const profileBtn = document.getElementById('profileBtn');
    const logoutBtn = document.getElementById('logout');
    
    if (sidebarToggle) sidebarToggle.addEventListener('click', toggleSidebar);
    if (languageToggle) languageToggle.addEventListener('click', toggleLanguage);
    if (notificationBtn) notificationBtn.addEventListener('click', toggleNotifications);
    if (profileBtn) profileBtn.addEventListener('click', toggleProfileDropdown);
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
        console.log('✅ Event listener de logout configurado');
    } else {
        console.log('❌ No se encontró el botón de logout');
    }
    
    // Cargar datos de ejemplo
    loadSampleData();
    
    // Cerrar dropdowns al hacer click fuera
    document.addEventListener('click', function(e) {
        const profileDropdown = document.getElementById('profileDropdown');
        const notificationDropdown = document.getElementById('notificationDropdown');
        
        if (profileDropdown && !e.target.closest('.user-profile')) {
            profileDropdown.classList.remove('show');
        }
        
        if (notificationDropdown && !e.target.closest('.notifications')) {
            notificationDropdown.classList.remove('show');
        }
    });
    
    console.log('✅ Funcionalidades básicas inicializadas');
}

// Función para mostrar secciones
function showSection(sectionName) {
    console.log('📂 Mostrando sección:', sectionName);
    
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        console.log('✅ Sección mostrada:', sectionName);
        
        // Cargar contenido específico
        switch (sectionName) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'patients':
                loadPatients();
                break;
            case 'medical-records':
                loadRecords();
                break;
            case 'appointments':
                loadAppointments();
                break;
            case 'doctors':
                loadDoctors();
                break;
        }
    } else {
        console.error('❌ Sección no encontrada:', sectionName);
    }
    
    // Actualizar navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Función para cargar datos de ejemplo
function loadSampleData() {
    console.log('📊 Cargando datos de ejemplo...');
    
    // Datos de ejemplo
    const samplePatients = [
        { id: '1', name: 'María González', dni: '12345678A', age: 35, gender: 'F', phone: '666123456', email: 'maria@email.com' },
        { id: '2', name: 'Carlos Rodríguez', dni: '87654321B', age: 42, gender: 'M', phone: '666789012', email: 'carlos@email.com' },
        { id: '3', name: 'Ana Martínez', dni: '11223344C', age: 28, gender: 'F', phone: '666345678', email: 'ana@email.com' }
    ];
    
    const sampleDoctors = [
        { id: '1', name: 'Dr. Juan Pérez', specialty: 'Medicina General', email: 'jperez@clinica.com', phone: '666111222' },
        { id: '2', name: 'Dra. María García', specialty: 'Cardiología', email: 'mgarcia@clinica.com', phone: '666333444' }
    ];
    
    // Guardar en localStorage
    localStorage.setItem('medical_patients', JSON.stringify(samplePatients));
    localStorage.setItem('medical_doctors', JSON.stringify(sampleDoctors));
    
    console.log('✅ Datos de ejemplo cargados');
}

// Funciones para cargar cada sección
function loadDashboard() {
    console.log('📊 Cargando dashboard...');
    
    const patients = JSON.parse(localStorage.getItem('medical_patients') || '[]');
    const doctors = JSON.parse(localStorage.getItem('medical_doctors') || '[]');
    const records = JSON.parse(localStorage.getItem('medical_records') || '[]');
    const appointments = JSON.parse(localStorage.getItem('medical_appointments') || '[]');
    
    // Calcular citas de hoy
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(a => a.date === today);
    
    // Actualizar estadísticas
    const totalPatientsEl = document.getElementById('totalPatients');
    const totalRecordsEl = document.getElementById('totalRecords');
    const todayAppointmentsEl = document.getElementById('todayAppointments');
    const activeDoctorsEl = document.getElementById('activeDoctors');
    
    if (totalPatientsEl) totalPatientsEl.textContent = patients.length;
    if (totalRecordsEl) totalRecordsEl.textContent = records.length;
    if (todayAppointmentsEl) todayAppointmentsEl.textContent = todayAppointments.length;
    if (activeDoctorsEl) activeDoctorsEl.textContent = doctors.filter(d => d.isActive).length;
    
    console.log('✅ Dashboard cargado con estadísticas actualizadas');
}

function loadPatients() {
    console.log('👥 Cargando pacientes...');
    
    const patients = JSON.parse(localStorage.getItem('medical_patients') || '[]');
    const tbody = document.getElementById('patientsTableBody');
    
    if (tbody) {
        if (patients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">No hay pacientes registrados</td></tr>';
        } else {
            tbody.innerHTML = patients.map(patient => `
                <tr>
                    <td>${patient.id}</td>
                    <td>${patient.name}</td>
                    <td>${patient.dni}</td>
                    <td>${patient.age}</td>
                    <td>${patient.gender === 'F' ? 'Femenino' : 'Masculino'}</td>
                    <td>${patient.phone}</td>
                    <td>${patient.email}</td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="editPatient('${patient.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deletePatient('${patient.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    }
    
    console.log('✅ Pacientes cargados');
}

function loadRecords() {
    console.log('📋 Cargando historias clínicas...');
    
    const records = JSON.parse(localStorage.getItem('medical_records') || '[]');
    const patients = JSON.parse(localStorage.getItem('medical_patients') || '[]');
    const doctors = JSON.parse(localStorage.getItem('medical_doctors') || '[]');
    const tbody = document.getElementById('recordsTableBody');
    
    if (tbody) {
        if (records.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay historias clínicas registradas</td></tr>';
        } else {
            tbody.innerHTML = records.map(record => {
                const patient = patients.find(p => p.id === record.patientId);
                const doctor = doctors.find(d => d.id === record.doctorId);
                
                return `
                    <tr>
                        <td>${record.id.substring(0, 8)}...</td>
                        <td>${patient ? patient.name : 'Paciente no encontrado'}</td>
                        <td>${new Date(record.date).toLocaleDateString()}</td>
                        <td>${record.diagnosis}</td>
                        <td>${doctor ? doctor.name : 'Médico no encontrado'}</td>
                        <td>
                            <button class="btn btn-sm btn-info" onclick="editRecord('${record.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="deleteRecord('${record.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                            <button class="btn btn-sm btn-success" onclick="exportRecord('${record.id}')">
                                <i class="fas fa-file-pdf"></i>
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    }
    
    console.log('✅ Historias clínicas cargadas');
}

function loadAppointments() {
    console.log('📅 Cargando citas...');
    
    const appointments = JSON.parse(localStorage.getItem('medical_appointments') || '[]');
    const patients = JSON.parse(localStorage.getItem('medical_patients') || '[]');
    const doctors = JSON.parse(localStorage.getItem('medical_doctors') || '[]');
    const tbody = document.getElementById('appointmentsTableBody');
    
    if (tbody) {
        if (appointments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">No hay citas registradas</td></tr>';
        } else {
            tbody.innerHTML = appointments.map(appointment => {
                const patient = patients.find(p => p.id === appointment.patientId);
                const doctor = doctors.find(d => d.id === appointment.doctorId);
                
                return `
                    <tr>
                        <td>${appointment.id.substring(0, 8)}...</td>
                        <td>${patient ? patient.name : 'Paciente no encontrado'}</td>
                        <td>${new Date(appointment.date).toLocaleDateString()}</td>
                        <td>${appointment.time}</td>
                        <td>${doctor ? doctor.name : 'Médico no encontrado'}</td>
                        <td>${appointment.reason}</td>
                        <td><span class="status-badge status-${appointment.status}">${getStatusDisplay(appointment.status)}</span></td>
                        <td>
                            <button class="btn btn-sm btn-info" onclick="editAppointment('${appointment.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="deleteAppointment('${appointment.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    }
    
    console.log('✅ Citas cargadas');
}

function loadDoctors() {
    console.log('👨‍⚕️ Cargando médicos...');
    
    const doctors = JSON.parse(localStorage.getItem('medical_doctors') || '[]');
    const tbody = document.getElementById('doctorsTableBody');
    
    if (tbody) {
        if (doctors.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay médicos registrados</td></tr>';
        } else {
            tbody.innerHTML = doctors.map(doctor => `
                <tr>
                    <td>${doctor.id}</td>
                    <td>${doctor.name}</td>
                    <td>${doctor.specialty}</td>
                    <td>${doctor.email}</td>
                    <td>${doctor.phone}</td>
                    <td><span class="status-badge status-active">Activo</span></td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="editDoctor('${doctor.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteDoctor('${doctor.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    }
    
    console.log('✅ Médicos cargados');
}

// Funciones para modales (simplificadas)
function showPatientModal() {
    console.log('📝 Abriendo modal de paciente...');
    
    // Crear modal dinámicamente
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.id = 'patientModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Nuevo Paciente</h3>
                <button class="modal-close" onclick="closeModal('patientModal')">&times;</button>
            </div>
            <form id="patientForm" class="modal-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="patientName">Nombre Completo *</label>
                        <input type="text" id="patientName" required>
                    </div>
                    <div class="form-group">
                        <label for="patientDni">DNI *</label>
                        <input type="text" id="patientDni" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="patientAge">Edad *</label>
                        <input type="number" id="patientAge" min="0" max="120" required>
                    </div>
                    <div class="form-group">
                        <label for="patientGender">Sexo *</label>
                        <select id="patientGender" required>
                            <option value="">Seleccionar</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                            <option value="O">Otro</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="patientPhone">Teléfono *</label>
                        <input type="tel" id="patientPhone" required>
                    </div>
                    <div class="form-group">
                        <label for="patientEmail">Email</label>
                        <input type="email" id="patientEmail">
                    </div>
                </div>
                <div class="form-group">
                    <label for="patientAddress">Dirección</label>
                    <textarea id="patientAddress" rows="3"></textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal('patientModal')">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar</button>
                </div>
            </form>
        </div>
    `;
    
    // Agregar al body
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Configurar formulario
    const form = document.getElementById('patientForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        savePatient();
    });
    
    console.log('✅ Modal de paciente creado');
}

function showRecordModal() {
    console.log('📝 Abriendo modal de historia clínica...');
    
    // Obtener pacientes y médicos para los selectores
    const patients = JSON.parse(localStorage.getItem('medical_patients') || '[]');
    const doctors = JSON.parse(localStorage.getItem('medical_doctors') || '[]');
    
    // Crear modal dinámicamente
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.id = 'recordModal';
    modal.innerHTML = `
        <div class="modal-content large">
            <div class="modal-header">
                <h3>Nueva Historia Clínica</h3>
                <button class="modal-close" onclick="closeModal('recordModal')">&times;</button>
            </div>
            <form id="recordForm" class="modal-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="recordPatient">Paciente *</label>
                        <select id="recordPatient" required>
                            <option value="">Seleccionar paciente</option>
                            ${patients.map(p => `<option value="${p.id}">${p.name} (${p.dni})</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="recordDoctor">Médico *</label>
                        <select id="recordDoctor" required>
                            <option value="">Seleccionar médico</option>
                            ${doctors.map(d => `<option value="${d.id}">${d.name} - ${d.specialty}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="recordDate">Fecha *</label>
                        <input type="date" id="recordDate" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="recordDiagnosis">Diagnóstico *</label>
                    <textarea id="recordDiagnosis" rows="3" required placeholder="Describa el diagnóstico principal..."></textarea>
                </div>
                <div class="form-group">
                    <label for="recordTreatment">Tratamiento</label>
                    <textarea id="recordTreatment" rows="3" placeholder="Describa el tratamiento indicado..."></textarea>
                </div>
                <div class="form-group">
                    <label for="recordMedications">Medicamentos Recetados</label>
                    <textarea id="recordMedications" rows="3" placeholder="Liste los medicamentos y dosis..."></textarea>
                </div>
                <div class="form-group">
                    <label for="recordAllergies">Alergias</label>
                    <textarea id="recordAllergies" rows="2" placeholder="Indique alergias conocidas..."></textarea>
                </div>
                <div class="form-group">
                    <label for="recordHistory">Antecedentes Médicos</label>
                    <textarea id="recordHistory" rows="3" placeholder="Antecedentes familiares y personales..."></textarea>
                </div>
                <div class="form-group">
                    <label for="recordObservations">Observaciones</label>
                    <textarea id="recordObservations" rows="3" placeholder="Observaciones adicionales..."></textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal('recordModal')">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar Historia</button>
                </div>
            </form>
        </div>
    `;
    
    // Agregar al body
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Configurar formulario
    const form = document.getElementById('recordForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveRecord();
    });
    
    // Establecer fecha actual por defecto
    document.getElementById('recordDate').value = new Date().toISOString().split('T')[0];
    
    console.log('✅ Modal de historia clínica creado');
}

function showAppointmentModal() {
    console.log('📝 Abriendo modal de cita médica...');
    
    // Obtener pacientes y médicos para los selectores
    const patients = JSON.parse(localStorage.getItem('medical_patients') || '[]');
    const doctors = JSON.parse(localStorage.getItem('medical_doctors') || '[]');
    
    // Crear modal dinámicamente
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.id = 'appointmentModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Nueva Cita Médica</h3>
                <button class="modal-close" onclick="closeModal('appointmentModal')">&times;</button>
            </div>
            <form id="appointmentForm" class="modal-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="appointmentPatient">Paciente *</label>
                        <select id="appointmentPatient" required>
                            <option value="">Seleccionar paciente</option>
                            ${patients.map(p => `<option value="${p.id}">${p.name} (${p.dni})</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="appointmentDoctor">Médico *</label>
                        <select id="appointmentDoctor" required>
                            <option value="">Seleccionar médico</option>
                            ${doctors.map(d => `<option value="${d.id}">${d.name} - ${d.specialty}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="appointmentDate">Fecha *</label>
                        <input type="date" id="appointmentDate" required>
                    </div>
                    <div class="form-group">
                        <label for="appointmentTime">Hora *</label>
                        <input type="time" id="appointmentTime" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="appointmentReason">Motivo de la Cita *</label>
                    <textarea id="appointmentReason" rows="3" required placeholder="Describa el motivo de la consulta..."></textarea>
                </div>
                <div class="form-group">
                    <label for="appointmentStatus">Estado</label>
                    <select id="appointmentStatus">
                        <option value="pending">Pendiente</option>
                        <option value="completed">Atendida</option>
                        <option value="cancelled">Cancelada</option>
                    </select>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal('appointmentModal')">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar Cita</button>
                </div>
            </form>
        </div>
    `;
    
    // Agregar al body
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Configurar formulario
    const form = document.getElementById('appointmentForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveAppointment();
    });
    
    // Establecer fecha y hora por defecto
    const now = new Date();
    document.getElementById('appointmentDate').value = now.toISOString().split('T')[0];
    document.getElementById('appointmentTime').value = '09:00';
    
    console.log('✅ Modal de cita médica creado');
}

function showDoctorModal() {
    console.log('📝 Abriendo modal de médico...');
    
    // Crear modal dinámicamente
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.id = 'doctorModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Nuevo Médico</h3>
                <button class="modal-close" onclick="closeModal('doctorModal')">&times;</button>
            </div>
            <form id="doctorForm" class="modal-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="doctorName">Nombre Completo *</label>
                        <input type="text" id="doctorName" required placeholder="Dr./Dra. Nombre Apellido">
                    </div>
                    <div class="form-group">
                        <label for="doctorSpecialty">Especialidad *</label>
                        <select id="doctorSpecialty" required>
                            <option value="">Seleccionar especialidad</option>
                            <option value="Medicina General">Medicina General</option>
                            <option value="Cardiología">Cardiología</option>
                            <option value="Pediatría">Pediatría</option>
                            <option value="Ginecología">Ginecología</option>
                            <option value="Traumatología">Traumatología</option>
                            <option value="Dermatología">Dermatología</option>
                            <option value="Neurología">Neurología</option>
                            <option value="Psiquiatría">Psiquiatría</option>
                            <option value="Oftalmología">Oftalmología</option>
                            <option value="Otorrinolaringología">Otorrinolaringología</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="doctorEmail">Email *</label>
                        <input type="email" id="doctorEmail" required placeholder="medico@clinica.com">
                    </div>
                    <div class="form-group">
                        <label for="doctorPhone">Teléfono *</label>
                        <input type="tel" id="doctorPhone" required placeholder="+34 666 123 456">
                    </div>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal('doctorModal')">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar Médico</button>
                </div>
            </form>
        </div>
    `;
    
    // Agregar al body
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Configurar formulario
    const form = document.getElementById('doctorForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveDoctor();
    });
    
    console.log('✅ Modal de médico creado');
}

function editPatient(id) {
    alert(`Editar paciente ${id} - En desarrollo`);
}

function deletePatient(id) {
    if (confirm('¿Está seguro de eliminar este paciente?')) {
        console.log('🗑️ Eliminando paciente:', id);
        
        // Obtener pacientes actuales
        const patients = JSON.parse(localStorage.getItem('medical_patients') || '[]');
        
        // Encontrar y eliminar paciente
        const updatedPatients = patients.filter(p => p.id !== id);
        
        // Guardar cambios
        localStorage.setItem('medical_patients', JSON.stringify(updatedPatients));
        
        // Recargar tabla
        loadPatients();
        
        // Mostrar mensaje
        alert('✅ Paciente eliminado correctamente');
        
        console.log('✅ Paciente eliminado exitosamente');
    }
}

function saveDoctor() {
    console.log('💾 Guardando médico...');
    
    // Obtener datos del formulario
    const doctorData = {
        id: 'doctor_' + Date.now(),
        name: document.getElementById('doctorName').value,
        specialty: document.getElementById('doctorSpecialty').value,
        email: document.getElementById('doctorEmail').value,
        phone: document.getElementById('doctorPhone').value,
        isActive: true,
        createdAt: new Date().toISOString()
    };
    
    console.log('📋 Datos del médico:', doctorData);
    
    // Validar datos
    if (!doctorData.name || !doctorData.specialty || !doctorData.email || !doctorData.phone) {
        alert('❌ Por favor complete todos los campos obligatorios (*)');
        return;
    }
    
    // Verificar email único
    const existingDoctors = JSON.parse(localStorage.getItem('medical_doctors') || '[]');
    if (existingDoctors.find(d => d.email === doctorData.email)) {
        alert('❌ Ya existe un médico con este email');
        return;
    }
    
    // Guardar médico
    existingDoctors.push(doctorData);
    localStorage.setItem('medical_doctors', JSON.stringify(existingDoctors));
    
    // Cerrar modal
    closeModal('doctorModal');
    
    // Recargar tabla de médicos
    loadDoctors();
    
    // Mostrar mensaje de éxito
    alert('✅ Médico agregado correctamente');
    
    console.log('✅ Médico guardado exitosamente');
}

function editDoctor(id) {
    alert(`Editar médico ${id} - En desarrollo`);
}

function deleteDoctor(id) {
    if (confirm('¿Está seguro de eliminar este médico? También se eliminarán sus citas y historias clínicas relacionadas.')) {
        console.log('🗑️ Eliminando médico:', id);
        
        // Obtener médicos actuales
        const doctors = JSON.parse(localStorage.getItem('medical_doctors') || '[]');
        
        // Encontrar y eliminar médico
        const updatedDoctors = doctors.filter(d => d.id !== id);
        
        // Guardar cambios
        localStorage.setItem('medical_doctors', JSON.stringify(updatedDoctors));
        
        // Eliminar citas relacionadas
        const appointments = JSON.parse(localStorage.getItem('medical_appointments') || '[]');
        const updatedAppointments = appointments.filter(a => a.doctorId !== id);
        localStorage.setItem('medical_appointments', JSON.stringify(updatedAppointments));
        
        // Eliminar historias clínicas relacionadas
        const records = JSON.parse(localStorage.getItem('medical_records') || '[]');
        const updatedRecords = records.filter(r => r.doctorId !== id);
        localStorage.setItem('medical_records', JSON.stringify(updatedRecords));
        
        // Recargar tablas
        loadDoctors();
        loadAppointments();
        loadRecords();
        
        // Mostrar mensaje
        alert('✅ Médico eliminado correctamente');
        
        console.log('✅ Médico eliminado exitosamente');
    }
}

// Funciones para manejar modales
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
        console.log('✅ Modal cerrado:', modalId);
    }
}

function savePatient() {
    console.log('💾 Guardando paciente...');
    
    // Obtener datos del formulario
    const patientData = {
        id: 'patient_' + Date.now(),
        name: document.getElementById('patientName').value,
        dni: document.getElementById('patientDni').value,
        age: parseInt(document.getElementById('patientAge').value),
        gender: document.getElementById('patientGender').value,
        phone: document.getElementById('patientPhone').value,
        email: document.getElementById('patientEmail').value,
        address: document.getElementById('patientAddress').value,
        createdAt: new Date().toISOString()
    };
    
    console.log('📋 Datos del paciente:', patientData);
    
    // Validar datos
    if (!patientData.name || !patientData.dni || !patientData.age || !patientData.gender || !patientData.phone) {
        alert('❌ Por favor complete todos los campos obligatorios (*)');
        return;
    }
    
    // Verificar DNI único
    const existingPatients = JSON.parse(localStorage.getItem('medical_patients') || '[]');
    if (existingPatients.find(p => p.dni === patientData.dni)) {
        alert('❌ Ya existe un paciente con este DNI');
        return;
    }
    
    // Guardar paciente
    existingPatients.push(patientData);
    localStorage.setItem('medical_patients', JSON.stringify(existingPatients));
    
    // Cerrar modal
    closeModal('patientModal');
    
    // Recargar tabla de pacientes
    loadPatients();
    
    // Mostrar mensaje de éxito
    alert('✅ Paciente agregado correctamente');
    
    console.log('✅ Paciente guardado exitosamente');
}

function saveRecord() {
    console.log('💾 Guardando historia clínica...');
    
    // Obtener datos del formulario
    const recordData = {
        id: 'record_' + Date.now(),
        patientId: document.getElementById('recordPatient').value,
        doctorId: document.getElementById('recordDoctor').value,
        date: document.getElementById('recordDate').value,
        diagnosis: document.getElementById('recordDiagnosis').value,
        treatment: document.getElementById('recordTreatment').value,
        medications: document.getElementById('recordMedications').value,
        allergies: document.getElementById('recordAllergies').value,
        medicalHistory: document.getElementById('recordHistory').value,
        observations: document.getElementById('recordObservations').value,
        createdAt: new Date().toISOString()
    };
    
    console.log('📋 Datos de la historia clínica:', recordData);
    
    // Validar datos
    if (!recordData.patientId || !recordData.doctorId || !recordData.date || !recordData.diagnosis) {
        alert('❌ Por favor complete todos los campos obligatorios (*)');
        return;
    }
    
    // Guardar historia clínica
    const existingRecords = JSON.parse(localStorage.getItem('medical_records') || '[]');
    existingRecords.push(recordData);
    localStorage.setItem('medical_records', JSON.stringify(existingRecords));
    
    // Cerrar modal
    closeModal('recordModal');
    
    // Recargar tabla de historias clínicas
    loadRecords();
    
    // Mostrar mensaje de éxito
    alert('✅ Historia clínica agregada correctamente');
    
    console.log('✅ Historia clínica guardada exitosamente');
}

function editRecord(id) {
    alert(`Editar historia clínica ${id} - En desarrollo`);
}

function deleteRecord(id) {
    if (confirm('¿Está seguro de eliminar esta historia clínica?')) {
        console.log('🗑️ Eliminando historia clínica:', id);
        
        // Obtener historias actuales
        const records = JSON.parse(localStorage.getItem('medical_records') || '[]');
        
        // Encontrar y eliminar historia
        const updatedRecords = records.filter(r => r.id !== id);
        
        // Guardar cambios
        localStorage.setItem('medical_records', JSON.stringify(updatedRecords));
        
        // Recargar tabla
        loadRecords();
        
        // Mostrar mensaje
        alert('✅ Historia clínica eliminada correctamente');
        
        console.log('✅ Historia clínica eliminada exitosamente');
    }
}

function exportRecord(id) {
    alert(`Exportar historia clínica ${id} a PDF - En desarrollo`);
}

function saveAppointment() {
    console.log('💾 Guardando cita médica...');
    
    // Obtener datos del formulario
    const appointmentData = {
        id: 'appointment_' + Date.now(),
        patientId: document.getElementById('appointmentPatient').value,
        doctorId: document.getElementById('appointmentDoctor').value,
        date: document.getElementById('appointmentDate').value,
        time: document.getElementById('appointmentTime').value,
        reason: document.getElementById('appointmentReason').value,
        status: document.getElementById('appointmentStatus').value,
        createdAt: new Date().toISOString()
    };
    
    console.log('📋 Datos de la cita médica:', appointmentData);
    
    // Validar datos
    if (!appointmentData.patientId || !appointmentData.doctorId || !appointmentData.date || !appointmentData.time || !appointmentData.reason) {
        alert('❌ Por favor complete todos los campos obligatorios (*)');
        return;
    }
    
    // Guardar cita médica
    const existingAppointments = JSON.parse(localStorage.getItem('medical_appointments') || '[]');
    existingAppointments.push(appointmentData);
    localStorage.setItem('medical_appointments', JSON.stringify(existingAppointments));
    
    // Cerrar modal
    closeModal('appointmentModal');
    
    // Recargar tabla de citas
    loadAppointments();
    
    // Mostrar mensaje de éxito
    alert('✅ Cita médica agregada correctamente');
    
    console.log('✅ Cita médica guardada exitosamente');
}

function editAppointment(id) {
    alert(`Editar cita médica ${id} - En desarrollo`);
}

function deleteAppointment(id) {
    if (confirm('¿Está seguro de eliminar esta cita médica?')) {
        console.log('🗑️ Eliminando cita médica:', id);
        
        // Obtener citas actuales
        const appointments = JSON.parse(localStorage.getItem('medical_appointments') || '[]');
        
        // Encontrar y eliminar cita
        const updatedAppointments = appointments.filter(a => a.id !== id);
        
        // Guardar cambios
        localStorage.setItem('medical_appointments', JSON.stringify(updatedAppointments));
        
        // Recargar tabla
        loadAppointments();
        
        // Mostrar mensaje
        alert('✅ Cita médica eliminada correctamente');
        
        console.log('✅ Cita médica eliminada exitosamente');
    }
}

function getStatusDisplay(status) {
    const statuses = {
        'pending': 'Pendiente',
        'completed': 'Atendida',
        'cancelled': 'Cancelada'
    };
    return statuses[status] || status;
}

// Funciones para opciones del header
function toggleLanguage() {
    console.log('🌐 Cambiando idioma...');
    const currentLang = localStorage.getItem('app_language') || 'es';
    const newLang = currentLang === 'es' ? 'en' : 'es';
    
    localStorage.setItem('app_language', newLang);
    
    // Actualizar interfaz según idioma
    if (newLang === 'en') {
        document.querySelector('.app-title').textContent = 'Clinical History System';
        document.querySelector('[data-section="dashboard"] .nav-text').textContent = 'Dashboard';
        document.querySelector('[data-section="patients"] .nav-text').textContent = 'Patients';
        document.querySelector('[data-section="medical-records"] .nav-text').textContent = 'Medical Records';
        document.querySelector('[data-section="appointments"] .nav-text').textContent = 'Appointments';
        document.querySelector('[data-section="doctors"] .nav-text').textContent = 'Doctors';
    } else {
        document.querySelector('.app-title').textContent = 'Sistema de Historias Clínicas';
        document.querySelector('[data-section="dashboard"] .nav-text').textContent = 'Dashboard';
        document.querySelector('[data-section="patients"] .nav-text').textContent = 'Pacientes';
        document.querySelector('[data-section="medical-records"] .nav-text').textContent = 'Historias Clínicas';
        document.querySelector('[data-section="appointments"] .nav-text').textContent = 'Citas Médicas';
        document.querySelector('[data-section="doctors"] .nav-text').textContent = 'Médicos';
    }
    
    alert(`Idioma cambiado a: ${newLang === 'es' ? 'Español' : 'English'}`);
    console.log('✅ Idioma cambiado a:', newLang);
}

function toggleNotifications() {
    console.log('🔔 Toggle de notificaciones...');
    const dropdown = document.getElementById('notificationDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
        
        // Actualizar contador de notificaciones
        const appointments = JSON.parse(localStorage.getItem('medical_appointments') || '[]');
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = appointments.filter(a => a.date === today && a.status === 'pending');
        
        const notificationCount = document.getElementById('notificationCount');
        if (notificationCount) {
            notificationCount.textContent = todayAppointments.length;
        }
        
        // Actualizar lista de notificaciones
        const notificationList = document.getElementById('notificationList');
        if (notificationList) {
            if (todayAppointments.length > 0) {
                notificationList.innerHTML = todayAppointments.map(appointment => {
                    const patients = JSON.parse(localStorage.getItem('medical_patients') || '[]');
                    const patient = patients.find(p => p.id === appointment.patientId);
                    return `
                        <div class="notification-item">
                            <div class="notification-icon">
                                <i class="fas fa-calendar-check"></i>
                            </div>
                            <div class="notification-content">
                                <p>Cita con ${patient ? patient.name : 'Paciente'} a las ${appointment.time}</p>
                                <span class="notification-time">Hoy</span>
                            </div>
                        </div>
                    `;
                }).join('');
            } else {
                notificationList.innerHTML = '<div class="notification-item"><p>No hay notificaciones</p></div>';
            }
        }
    }
    console.log('✅ Notificaciones actualizadas');
}

function toggleProfileDropdown() {
    console.log('👤 Toggle del dropdown de perfil...');
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
        
        // Cerrar otros dropdowns
        const notificationDropdown = document.getElementById('notificationDropdown');
        if (notificationDropdown) {
            notificationDropdown.classList.remove('show');
        }
    }
    console.log('✅ Dropdown de perfil toggled');
}

function showProfile() {
    console.log('👤 Mostrando perfil...');
    const user = JSON.parse(localStorage.getItem('current_user') || '{}');
    
    const profileInfo = `
        Usuario: ${user.username || 'admin'}
        Rol: ${user.role || 'Administrador'}
        Último acceso: ${new Date().toLocaleString()}
    `;
    
    alert(`Perfil de Usuario:\n\n${profileInfo}`);
    console.log('✅ Perfil mostrado');
}

function logout() {
    console.log('🚪 Cerrando sesión...');
    
    if (confirm('¿Está seguro de que desea cerrar sesión?')) {
        console.log('✅ Usuario confirmó cerrar sesión');
        
        // Limpiar datos de sesión
        localStorage.removeItem('current_user');
        console.log('✅ Datos de sesión eliminados');
        
        // Ocultar aplicación y mostrar login
        const app = document.getElementById('app');
        const loginScreen = document.getElementById('loginScreen');
        
        console.log('📱 Elementos encontrados:', { app: !!app, loginScreen: !!loginScreen });
        
        if (app) {
            app.style.display = 'none';
            console.log('✅ App ocultada');
        }
        if (loginScreen) {
            loginScreen.style.display = 'flex';
            console.log('✅ Login screen mostrado');
        }
        
        // Limpiar formulario de login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.reset();
            console.log('✅ Formulario de login limpiado');
        }
        
        alert('✅ Sesión cerrada correctamente');
        console.log('✅ Sesión cerrada exitosamente');
    } else {
        console.log('❌ Usuario canceló cerrar sesión');
    }
}

// Funciones para menú desplegable
function toggleSidebar() {
    console.log('📱 Toggle del sidebar...');
    
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebar && mainContent) {
        const isCollapsed = sidebar.classList.contains('collapsed');
        
        if (isCollapsed) {
            // Expandir sidebar
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('sidebar-collapsed');
            console.log('✅ Sidebar expandido');
        } else {
            // Colapsar sidebar
            sidebar.classList.add('collapsed');
            mainContent.classList.add('sidebar-collapsed');
            console.log('✅ Sidebar colapsado');
        }
    }
}

function toggleSubmenu(toggleElement) {
    console.log('📂 Toggle de submenú...');
    
    const navItem = toggleElement.closest('.nav-item');
    const isOpen = navItem.classList.contains('open');
    
    // Cerrar todos los submenús
    document.querySelectorAll('.nav-item.has-submenu').forEach(item => {
        item.classList.remove('open');
    });
    
    // Abrir el submenú actual si estaba cerrado
    if (!isOpen) {
        navItem.classList.add('open');
    }
    
    console.log('✅ Submenú toggled');
}

function handleAction(action) {
    console.log('⚡ Ejecutando acción:', action);
    
    switch (action) {
        case 'addPatient':
            showPatientModal();
            break;
        case 'addRecord':
            showRecordModal();
            break;
        case 'addAppointment':
            showAppointmentModal();
            break;
        case 'addDoctor':
            showDoctorModal();
            break;
        case 'searchPatients':
            alert('🔍 Funcionalidad de búsqueda avanzada de pacientes - En desarrollo');
            break;
        case 'exportRecords':
            alert('📊 Funcionalidad de exportación de datos - En desarrollo');
            break;
        case 'showCalendar':
            alert('📅 Vista de calendario - En desarrollo');
            break;
        case 'todayAppointments':
            alert('⏰ Citas de hoy - En desarrollo');
            break;
        case 'manageSpecialties':
            alert('🩺 Gestión de especialidades - En desarrollo');
            break;
        default:
            console.log('❌ Acción no reconocida:', action);
    }
}
