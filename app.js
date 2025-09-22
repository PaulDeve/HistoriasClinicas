/**
 * Sistema de Gestión de Historias Clínicas
 * Aplicación web completa con HTML, CSS y JavaScript
 * Autor: Sistema Médico Profesional
 * Versión: 1.0.0
 */

// ===== CONFIGURACIÓN GLOBAL =====
const CONFIG = {
    APP_NAME: 'Sistema de Historias Clínicas',
    VERSION: '1.0.0',
    STORAGE_KEYS: {
        USERS: 'medical_users',
        PATIENTS: 'medical_patients',
        RECORDS: 'medical_records',
        APPOINTMENTS: 'medical_appointments',
        DOCTORS: 'medical_doctors',
        SETTINGS: 'medical_settings',
        NOTIFICATIONS: 'medical_notifications'
    },
    ROLES: {
        ADMIN: 'admin',
        DOCTOR: 'doctor',
        ASSISTANT: 'assistant'
    },
    LANGUAGES: {
        ES: 'es',
        EN: 'en'
    },
    THEMES: {
        LIGHT: 'light',
        DARK: 'dark'
    }
};

// ===== CLASES PRINCIPALES =====

/**
 * Clase para gestionar usuarios del sistema
 */
class User {
    constructor(data) {
        this.id = data.id || this.generateId();
        this.username = data.username;
        this.password = data.password;
        this.role = data.role;
        this.name = data.name;
        this.email = data.email;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.isActive = data.isActive !== undefined ? data.isActive : true;
    }

    generateId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            password: this.password,
            role: this.role,
            name: this.name,
            email: this.email,
            createdAt: this.createdAt,
            isActive: this.isActive
        };
    }
}

/**
 * Clase para gestionar pacientes
 */
class Patient {
    constructor(data) {
        this.id = data.id || this.generateId();
        this.name = data.name;
        this.dni = data.dni;
        this.age = data.age;
        this.gender = data.gender;
        this.phone = data.phone;
        this.email = data.email || '';
        this.address = data.address || '';
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    generateId() {
        return 'patient_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    update(data) {
        Object.assign(this, data);
        this.updatedAt = new Date().toISOString();
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            dni: this.dni,
            age: this.age,
            gender: this.gender,
            phone: this.phone,
            email: this.email,
            address: this.address,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

/**
 * Clase para gestionar historias clínicas
 */
class MedicalRecord {
    constructor(data) {
        this.id = data.id || this.generateId();
        this.patientId = data.patientId;
        this.doctorId = data.doctorId;
        this.date = data.date;
        this.diagnosis = data.diagnosis;
        this.treatment = data.treatment || '';
        this.medications = data.medications || '';
        this.allergies = data.allergies || '';
        this.medicalHistory = data.medicalHistory || '';
        this.observations = data.observations || '';
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    generateId() {
        return 'record_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    update(data) {
        Object.assign(this, data);
        this.updatedAt = new Date().toISOString();
    }

    toJSON() {
        return {
            id: this.id,
            patientId: this.patientId,
            doctorId: this.doctorId,
            date: this.date,
            diagnosis: this.diagnosis,
            treatment: this.treatment,
            medications: this.medications,
            allergies: this.allergies,
            medicalHistory: this.medicalHistory,
            observations: this.observations,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

/**
 * Clase para gestionar citas médicas
 */
class Appointment {
    constructor(data) {
        this.id = data.id || this.generateId();
        this.patientId = data.patientId;
        this.doctorId = data.doctorId;
        this.date = data.date;
        this.time = data.time;
        this.reason = data.reason;
        this.status = data.status || 'pending';
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    generateId() {
        return 'appointment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    update(data) {
        Object.assign(this, data);
        this.updatedAt = new Date().toISOString();
    }

    toJSON() {
        return {
            id: this.id,
            patientId: this.patientId,
            doctorId: this.doctorId,
            date: this.date,
            time: this.time,
            reason: this.reason,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

/**
 * Clase para gestionar médicos
 */
class Doctor {
    constructor(data) {
        this.id = data.id || this.generateId();
        this.name = data.name;
        this.specialty = data.specialty;
        this.email = data.email;
        this.phone = data.phone;
        this.isActive = data.isActive !== undefined ? data.isActive : true;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    generateId() {
        return 'doctor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    update(data) {
        Object.assign(this, data);
        this.updatedAt = new Date().toISOString();
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            specialty: this.specialty,
            email: this.email,
            phone: this.phone,
            isActive: this.isActive,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

// ===== GESTIÓN DE ALMACENAMIENTO =====

/**
 * Clase para gestionar el almacenamiento local
 */
class StorageManager {
    static save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
            return false;
        }
    }

    static load(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error al cargar desde localStorage:', error);
            return null;
        }
    }

    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error al eliminar de localStorage:', error);
            return false;
        }
    }

    static clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error al limpiar localStorage:', error);
            return false;
        }
    }

    static exportData() {
        const data = {};
        Object.values(CONFIG.STORAGE_KEYS).forEach(key => {
            data[key] = this.load(key);
        });
        return data;
    }

    static importData(data) {
        try {
            Object.keys(data).forEach(key => {
                if (data[key]) {
                    this.save(key, data[key]);
                }
            });
            return true;
        } catch (error) {
            console.error('Error al importar datos:', error);
            return false;
        }
    }
}

// ===== GESTIÓN DE NOTIFICACIONES =====

/**
 * Clase para gestionar notificaciones del sistema
 */
class NotificationManager {
    constructor() {
        this.notifications = this.loadNotifications();
        this.container = document.getElementById('toastContainer');
    }

    loadNotifications() {
        const stored = StorageManager.load(CONFIG.STORAGE_KEYS.NOTIFICATIONS);
        return stored || [];
    }

    saveNotifications() {
        StorageManager.save(CONFIG.STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    }

    addNotification(type, title, message, duration = 5000) {
        const notification = {
            id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            type,
            title,
            message,
            timestamp: new Date().toISOString(),
            read: false
        };

        this.notifications.unshift(notification);
        this.saveNotifications();
        this.showToast(notification);
        this.updateNotificationCount();
    }

    showToast(notification) {
        const toast = document.createElement('div');
        toast.className = `toast ${notification.type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${this.getIcon(notification.type)}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${notification.title}</div>
                <div class="toast-message">${notification.message}</div>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        this.container.appendChild(toast);

        // Animar entrada
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto-remover
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, notification.duration || 5000);

        // Botón de cerrar
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        });
    }

    getIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || 'fa-info-circle';
    }

    updateNotificationCount() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        const countElement = document.getElementById('notificationCount');
        if (countElement) {
            countElement.textContent = unreadCount;
            countElement.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }

    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
            this.updateNotificationCount();
        }
    }

    clearAll() {
        this.notifications = [];
        this.saveNotifications();
        this.updateNotificationCount();
        this.renderNotificationList();
    }

    renderNotificationList() {
        const list = document.getElementById('notificationList');
        if (!list) return;

        if (this.notifications.length === 0) {
            list.innerHTML = '<div class="notification-item"><p>No hay notificaciones</p></div>';
            return;
        }

        list.innerHTML = this.notifications.map(notification => `
            <div class="notification-item ${notification.read ? '' : 'unread'}" 
                 data-id="${notification.id}">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${this.formatTime(notification.timestamp)}</div>
            </div>
        `).join('');

        // Agregar event listeners
        list.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.id;
                this.markAsRead(id);
                item.classList.remove('unread');
            });
        });
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Hace un momento';
        if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)} minutos`;
        if (diff < 86400000) return `Hace ${Math.floor(diff / 3600000)} horas`;
        return date.toLocaleDateString();
    }
}

// ===== GESTIÓN DE TEMAS Y IDIOMAS =====

/**
 * Clase para gestionar temas y idiomas
 */
class ThemeManager {
    constructor() {
        this.currentTheme = this.loadTheme();
        this.currentLanguage = this.loadLanguage();
        this.init();
    }

    init() {
        this.applyTheme();
        this.applyLanguage();
        this.setupEventListeners();
    }

    loadTheme() {
        const stored = StorageManager.load('theme');
        return stored || CONFIG.THEMES.LIGHT;
    }

    loadLanguage() {
        const stored = StorageManager.load('language');
        return stored || CONFIG.LANGUAGES.ES;
    }

    saveTheme(theme) {
        StorageManager.save('theme', theme);
    }

    saveLanguage(language) {
        StorageManager.save('language', language);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === CONFIG.THEMES.LIGHT 
            ? CONFIG.THEMES.DARK 
            : CONFIG.THEMES.LIGHT;
        
        this.saveTheme(this.currentTheme);
        this.applyTheme();
    }

    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === CONFIG.LANGUAGES.ES 
            ? CONFIG.LANGUAGES.EN 
            : CONFIG.LANGUAGES.ES;
        
        this.saveLanguage(this.currentLanguage);
        this.applyLanguage();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = this.currentTheme === CONFIG.THEMES.LIGHT 
                ? 'fas fa-moon' 
                : 'fas fa-sun';
        }
    }

    applyLanguage() {
        document.documentElement.setAttribute('lang', this.currentLanguage);
        // Aquí se aplicarían las traducciones
        this.updateLanguageElements();
    }

    updateLanguageElements() {
        // Actualizar elementos de interfaz según el idioma
        const elements = {
            'app-title': this.currentLanguage === CONFIG.LANGUAGES.ES 
                ? 'Sistema de Historias Clínicas' 
                : 'Medical Records System',
            'dashboard-title': this.currentLanguage === CONFIG.LANGUAGES.ES 
                ? 'Dashboard' 
                : 'Dashboard',
            'patients-title': this.currentLanguage === CONFIG.LANGUAGES.ES 
                ? 'Pacientes' 
                : 'Patients'
        };

        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = elements[id];
            }
        });
    }

    setupEventListeners() {
        const themeToggle = document.getElementById('themeToggle');
        const languageToggle = document.getElementById('languageToggle');

        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        if (languageToggle) {
            languageToggle.addEventListener('click', () => this.toggleLanguage());
        }
    }
}

// ===== GESTIÓN DE AUTENTICACIÓN =====

/**
 * Clase para gestionar autenticación de usuarios
 */
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkExistingSession();
    }

    loadUsers() {
        const stored = StorageManager.load(CONFIG.STORAGE_KEYS.USERS);
        if (!stored || stored.length === 0) {
            // Crear usuario administrador por defecto
            const defaultAdmin = new User({
                username: 'admin',
                password: 'admin123',
                role: CONFIG.ROLES.ADMIN,
                name: 'Administrador',
                email: 'admin@sistema.com'
            });
            return [defaultAdmin.toJSON()];
        }
        return stored;
    }

    saveUsers() {
        StorageManager.save(CONFIG.STORAGE_KEYS.USERS, this.users);
    }

    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const registerBtn = document.getElementById('registerBtn');
        const backToLogin = document.getElementById('backToLogin');
        const logoutBtn = document.getElementById('logout');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        if (registerBtn) {
            registerBtn.addEventListener('click', () => this.showRegister());
        }

        if (backToLogin) {
            backToLogin.addEventListener('click', () => this.showLogin());
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        console.log('Intento de login:', { username, password, role });
        console.log('Usuarios disponibles:', this.users);

        const user = this.users.find(u => 
            u.username === username && 
            u.password === password && 
            u.role === role &&
            u.isActive
        );

        console.log('Usuario encontrado:', user);

        if (user) {
            this.currentUser = user;
            this.saveCurrentUser();
            this.showApp();
            
            // Mostrar notificación si está disponible
            if (window.notificationManager) {
                window.notificationManager.addNotification('success', 'Bienvenido', `Hola ${user.name}!`);
            } else {
                alert(`¡Bienvenido ${user.name}!`);
            }
        } else {
            // Mostrar error si está disponible
            if (window.notificationManager) {
                window.notificationManager.addNotification('error', 'Error de Login', 'Credenciales incorrectas');
            } else {
                alert('Credenciales incorrectas. Usa: admin / admin123 / Administrador');
            }
        }
    }

    handleRegister(e) {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        const role = document.getElementById('regRole').value;
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;

        // Verificar si el usuario ya existe
        if (this.users.find(u => u.username === username)) {
            notificationManager.addNotification('error', 'Error', 'El usuario ya existe');
            return;
        }

        const newUser = new User({
            username,
            password,
            role,
            name,
            email
        });

        this.users.push(newUser.toJSON());
        this.saveUsers();
        
        notificationManager.addNotification('success', 'Registro Exitoso', 'Usuario creado correctamente');
        this.showLogin();
        this.clearRegisterForm();
    }

    handleLogout() {
        this.currentUser = null;
        this.clearCurrentUser();
        this.showLogin();
        notificationManager.addNotification('info', 'Sesión Cerrada', 'Has cerrado sesión correctamente');
    }

    showLogin() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('registerScreen').style.display = 'none';
        document.getElementById('app').style.display = 'none';
    }

    showRegister() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('registerScreen').style.display = 'flex';
        document.getElementById('app').style.display = 'none';
    }

    showApp() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('registerScreen').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        
        this.updateUserInterface();
        
        // Inicializar la aplicación principal si no está inicializada
        if (!window.app) {
            window.app = new MedicalApp();
        }
    }

    updateUserInterface() {
        if (!this.currentUser) return;

        const userName = document.getElementById('userName');
        const profileName = document.getElementById('profileName');
        const profileRole = document.getElementById('profileRole');

        if (userName) userName.textContent = this.currentUser.name;
        if (profileName) profileName.textContent = this.currentUser.name;
        if (profileRole) profileRole.textContent = this.getRoleDisplayName(this.currentUser.role);
    }

    getRoleDisplayName(role) {
        const roles = {
            [CONFIG.ROLES.ADMIN]: 'Administrador',
            [CONFIG.ROLES.DOCTOR]: 'Médico',
            [CONFIG.ROLES.ASSISTANT]: 'Asistente'
        };
        return roles[role] || 'Usuario';
    }

    clearRegisterForm() {
        document.getElementById('registerForm').reset();
    }

    saveCurrentUser() {
        StorageManager.save('currentUser', this.currentUser);
    }

    clearCurrentUser() {
        StorageManager.remove('currentUser');
    }

    checkExistingSession() {
        const savedUser = StorageManager.load('currentUser');
        if (savedUser) {
            this.currentUser = savedUser;
            this.showApp();
        }
    }

    hasPermission(requiredRole) {
        if (!this.currentUser) return false;
        
        const roleHierarchy = {
            [CONFIG.ROLES.ASSISTANT]: 1,
            [CONFIG.ROLES.DOCTOR]: 2,
            [CONFIG.ROLES.ADMIN]: 3
        };

        return roleHierarchy[this.currentUser.role] >= roleHierarchy[requiredRole];
    }
}

// ===== INICIALIZACIÓN GLOBAL =====

// Instancias globales
let notificationManager;
let themeManager;
let authManager;
let app;

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar gestores
    notificationManager = new NotificationManager();
    themeManager = new ThemeManager();
    authManager = new AuthManager();

    // Mostrar pantalla de login por defecto
    authManager.showLogin();
});

// ===== GESTIÓN DE DATOS =====

/**
 * Clase para gestionar todos los datos del sistema
 */
class DataManager {
    constructor() {
        this.patients = this.loadPatients();
        this.records = this.loadRecords();
        this.appointments = this.loadAppointments();
        this.doctors = this.loadDoctors();
    }

    // Cargar datos desde localStorage
    loadPatients() {
        const stored = StorageManager.load(CONFIG.STORAGE_KEYS.PATIENTS);
        return stored || [];
    }

    loadRecords() {
        const stored = StorageManager.load(CONFIG.STORAGE_KEYS.RECORDS);
        return stored || [];
    }

    loadAppointments() {
        const stored = StorageManager.load(CONFIG.STORAGE_KEYS.APPOINTMENTS);
        return stored || [];
    }

    loadDoctors() {
        const stored = StorageManager.load(CONFIG.STORAGE_KEYS.DOCTORS);
        if (!stored || stored.length === 0) {
            // Crear médicos por defecto
            const defaultDoctors = [
                new Doctor({
                    name: 'Dr. Juan Pérez',
                    specialty: 'Medicina General',
                    email: 'jperez@clinica.com',
                    phone: '+1234567890'
                }),
                new Doctor({
                    name: 'Dra. María García',
                    specialty: 'Cardiología',
                    email: 'mgarcia@clinica.com',
                    phone: '+1234567891'
                })
            ];
            const doctorsData = defaultDoctors.map(d => d.toJSON());
            this.saveDoctors(doctorsData);
            return doctorsData;
        }
        return stored;
    }

    // Guardar datos en localStorage
    savePatients() {
        StorageManager.save(CONFIG.STORAGE_KEYS.PATIENTS, this.patients);
    }

    saveRecords() {
        StorageManager.save(CONFIG.STORAGE_KEYS.RECORDS, this.records);
    }

    saveAppointments() {
        StorageManager.save(CONFIG.STORAGE_KEYS.APPOINTMENTS, this.appointments);
    }

    saveDoctors(data = this.doctors) {
        StorageManager.save(CONFIG.STORAGE_KEYS.DOCTORS, data);
        this.doctors = data;
    }

    // CRUD Pacientes
    addPatient(patientData) {
        const patient = new Patient(patientData);
        this.patients.push(patient.toJSON());
        this.savePatients();
        return patient;
    }

    updatePatient(id, data) {
        const index = this.patients.findIndex(p => p.id === id);
        if (index !== -1) {
            const patient = new Patient(this.patients[index]);
            patient.update(data);
            this.patients[index] = patient.toJSON();
            this.savePatients();
            return patient;
        }
        return null;
    }

    deletePatient(id) {
        const index = this.patients.findIndex(p => p.id === id);
        if (index !== -1) {
            this.patients.splice(index, 1);
            this.savePatients();
            // Eliminar historias clínicas relacionadas
            this.records = this.records.filter(r => r.patientId !== id);
            this.saveRecords();
            // Eliminar citas relacionadas
            this.appointments = this.appointments.filter(a => a.patientId !== id);
            this.saveAppointments();
            return true;
        }
        return false;
    }

    getPatient(id) {
        return this.patients.find(p => p.id === id);
    }

    // CRUD Historias Clínicas
    addRecord(recordData) {
        const record = new MedicalRecord(recordData);
        this.records.push(record.toJSON());
        this.saveRecords();
        return record;
    }

    updateRecord(id, data) {
        const index = this.records.findIndex(r => r.id === id);
        if (index !== -1) {
            const record = new MedicalRecord(this.records[index]);
            record.update(data);
            this.records[index] = record.toJSON();
            this.saveRecords();
            return record;
        }
        return null;
    }

    deleteRecord(id) {
        const index = this.records.findIndex(r => r.id === id);
        if (index !== -1) {
            this.records.splice(index, 1);
            this.saveRecords();
            return true;
        }
        return false;
    }

    getRecord(id) {
        return this.records.find(r => r.id === id);
    }

    getRecordsByPatient(patientId) {
        return this.records.filter(r => r.patientId === patientId);
    }

    // CRUD Citas
    addAppointment(appointmentData) {
        const appointment = new Appointment(appointmentData);
        this.appointments.push(appointment.toJSON());
        this.saveAppointments();
        return appointment;
    }

    updateAppointment(id, data) {
        const index = this.appointments.findIndex(a => a.id === id);
        if (index !== -1) {
            const appointment = new Appointment(this.appointments[index]);
            appointment.update(data);
            this.appointments[index] = appointment.toJSON();
            this.saveAppointments();
            return appointment;
        }
        return null;
    }

    deleteAppointment(id) {
        const index = this.appointments.findIndex(a => a.id === id);
        if (index !== -1) {
            this.appointments.splice(index, 1);
            this.saveAppointments();
            return true;
        }
        return false;
    }

    getAppointment(id) {
        return this.appointments.find(a => a.id === id);
    }

    getAppointmentsByDate(date) {
        return this.appointments.filter(a => a.date === date);
    }

    getTodayAppointments() {
        const today = new Date().toISOString().split('T')[0];
        return this.getAppointmentsByDate(today);
    }

    // CRUD Médicos
    addDoctor(doctorData) {
        const doctor = new Doctor(doctorData);
        this.doctors.push(doctor.toJSON());
        this.saveDoctors();
        return doctor;
    }

    updateDoctor(id, data) {
        const index = this.doctors.findIndex(d => d.id === id);
        if (index !== -1) {
            const doctor = new Doctor(this.doctors[index]);
            doctor.update(data);
            this.doctors[index] = doctor.toJSON();
            this.saveDoctors();
            return doctor;
        }
        return null;
    }

    deleteDoctor(id) {
        const index = this.doctors.findIndex(d => d.id === id);
        if (index !== -1) {
            this.doctors.splice(index, 1);
            this.saveDoctors();
            return true;
        }
        return false;
    }

    getDoctor(id) {
        return this.doctors.find(d => d.id === id);
    }

    getActiveDoctors() {
        return this.doctors.filter(d => d.isActive);
    }

    // Estadísticas
    getStats() {
        return {
            totalPatients: this.patients.length,
            totalRecords: this.records.length,
            todayAppointments: this.getTodayAppointments().length,
            activeDoctors: this.getActiveDoctors().length
        };
    }

    // Búsquedas y filtros
    searchPatients(query) {
        if (!query) return this.patients;
        
        const lowerQuery = query.toLowerCase();
        return this.patients.filter(patient => 
            patient.name.toLowerCase().includes(lowerQuery) ||
            patient.dni.includes(query) ||
            patient.email.toLowerCase().includes(lowerQuery)
        );
    }

    filterPatientsByAge(ageRange) {
        if (!ageRange) return this.patients;
        
        const [min, max] = ageRange.split('-').map(Number);
        return this.patients.filter(patient => {
            if (max) {
                return patient.age >= min && patient.age <= max;
            } else {
                return patient.age >= min;
            }
        });
    }

    filterPatientsByGender(gender) {
        if (!gender) return this.patients;
        return this.patients.filter(patient => patient.gender === gender);
    }

    searchRecords(query) {
        if (!query) return this.records;
        
        const lowerQuery = query.toLowerCase();
        return this.records.filter(record => {
            const patient = this.getPatient(record.patientId);
            const doctor = this.getDoctor(record.doctorId);
            
            return record.diagnosis.toLowerCase().includes(lowerQuery) ||
                   (patient && patient.name.toLowerCase().includes(lowerQuery)) ||
                   (doctor && doctor.name.toLowerCase().includes(lowerQuery));
        });
    }

    searchAppointments(query) {
        if (!query) return this.appointments;
        
        const lowerQuery = query.toLowerCase();
        return this.appointments.filter(appointment => {
            const patient = this.getPatient(appointment.patientId);
            const doctor = this.getDoctor(appointment.doctorId);
            
            return appointment.reason.toLowerCase().includes(lowerQuery) ||
                   (patient && patient.name.toLowerCase().includes(lowerQuery)) ||
                   (doctor && doctor.name.toLowerCase().includes(lowerQuery));
        });
    }

    searchDoctors(query) {
        if (!query) return this.doctors;
        
        const lowerQuery = query.toLowerCase();
        return this.doctors.filter(doctor => 
            doctor.name.toLowerCase().includes(lowerQuery) ||
            doctor.specialty.toLowerCase().includes(lowerQuery) ||
            doctor.email.toLowerCase().includes(lowerQuery)
        );
    }

    filterDoctorsBySpecialty(specialty) {
        if (!specialty) return this.doctors;
        return this.doctors.filter(doctor => doctor.specialty === specialty);
    }
}

// ===== APLICACIÓN PRINCIPAL =====

/**
 * Clase principal de la aplicación
 */
class MedicalApp {
    constructor() {
        this.dataManager = new DataManager();
        this.currentSection = 'dashboard';
        this.modals = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeModals();
        this.loadDashboard();
        this.setupSidebar();
        this.setupProfileDropdown();
        this.setupNotificationDropdown();
        this.checkAppointmentNotifications();
    }

    setupEventListeners() {
        // Navegación del sidebar
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
            });
        });

        // Toggle del sidebar
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                document.getElementById('sidebar').classList.toggle('show');
            });
        }

        // Botones de acción
        this.setupActionButtons();
    }

    setupActionButtons() {
        // Botones de agregar
        const addButtons = {
            'addPatientBtn': () => this.showPatientModal(),
            'addRecordBtn': () => this.showRecordModal(),
            'addAppointmentBtn': () => this.showAppointmentModal(),
            'addDoctorBtn': () => this.showDoctorModal()
        };

        Object.keys(addButtons).forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', addButtons[id]);
            }
        });

        // Botón de vista calendario
        const calendarViewBtn = document.getElementById('calendarViewBtn');
        if (calendarViewBtn) {
            calendarViewBtn.addEventListener('click', () => this.toggleCalendarView());
        }

        // Botón de exportar datos
        const exportDataBtn = document.getElementById('exportData');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => this.exportAllData());
        }

        // Botón de importar datos
        const importDataBtn = document.getElementById('importData');
        if (importDataBtn) {
            importDataBtn.addEventListener('click', () => this.importData());
        }
    }

    setupSidebar() {
        const sidebar = document.getElementById('sidebar');
        const app = document.getElementById('app');

        // Cerrar sidebar al hacer clic fuera en móvil
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !e.target.closest('.sidebar-toggle')) {
                    sidebar.classList.remove('show');
                }
            }
        });
    }

    setupProfileDropdown() {
        const profileBtn = document.getElementById('profileBtn');
        const profileDropdown = document.getElementById('profileDropdown');

        if (profileBtn && profileDropdown) {
            profileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                profileDropdown.classList.toggle('show');
                profileBtn.classList.toggle('active');
            });

            // Cerrar al hacer clic fuera
            document.addEventListener('click', () => {
                profileDropdown.classList.remove('show');
                profileBtn.classList.remove('active');
            });
        }
    }

    setupNotificationDropdown() {
        const notificationBtn = document.getElementById('notificationBtn');
        const notificationDropdown = document.getElementById('notificationDropdown');
        const clearNotifications = document.getElementById('clearNotifications');

        if (notificationBtn && notificationDropdown) {
            notificationBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                notificationDropdown.classList.toggle('show');
                notificationManager.renderNotificationList();
            });

            // Cerrar al hacer clic fuera
            document.addEventListener('click', () => {
                notificationDropdown.classList.remove('show');
            });
        }

        if (clearNotifications) {
            clearNotifications.addEventListener('click', () => {
                notificationManager.clearAll();
            });
        }
    }

    showSection(sectionName) {
        // Ocultar todas las secciones
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Mostrar la sección seleccionada
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Actualizar navegación
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        this.currentSection = sectionName;

        // Cargar contenido específico de la sección
        switch (sectionName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'patients':
                this.loadPatients();
                break;
            case 'medical-records':
                this.loadRecords();
                break;
            case 'appointments':
                this.loadAppointments();
                break;
            case 'doctors':
                this.loadDoctors();
                break;
        }
    }

    // Cargar Dashboard
    loadDashboard() {
        const stats = this.dataManager.getStats();
        
        // Actualizar estadísticas
        document.getElementById('totalPatients').textContent = stats.totalPatients;
        document.getElementById('totalRecords').textContent = stats.totalRecords;
        document.getElementById('todayAppointments').textContent = stats.todayAppointments;
        document.getElementById('activeDoctors').textContent = stats.activeDoctors;

        // Crear gráficas
        this.createPatientsChart();
        this.createAppointmentsChart();
    }

    createPatientsChart() {
        const ctx = document.getElementById('patientsChart');
        if (!ctx) return;

        const patients = this.dataManager.patients;
        const ageGroups = {
            '0-18': 0,
            '19-35': 0,
            '36-55': 0,
            '56+': 0
        };

        const genderCount = { M: 0, F: 0, O: 0 };

        patients.forEach(patient => {
            // Agrupar por edad
            if (patient.age <= 18) ageGroups['0-18']++;
            else if (patient.age <= 35) ageGroups['19-35']++;
            else if (patient.age <= 55) ageGroups['36-55']++;
            else ageGroups['56+']++;

            // Contar por género
            genderCount[patient.gender] = (genderCount[patient.gender] || 0) + 1;
        });

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Masculino', 'Femenino', 'Otro'],
                datasets: [{
                    data: [genderCount.M, genderCount.F, genderCount.O],
                    backgroundColor: [
                        '#2c5aa0',
                        '#28a745',
                        '#17a2b8'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createAppointmentsChart() {
        const ctx = document.getElementById('appointmentsChart');
        if (!ctx) return;

        const appointments = this.dataManager.appointments;
        const monthlyData = {};

        appointments.forEach(appointment => {
            const month = appointment.date.substring(0, 7); // YYYY-MM
            monthlyData[month] = (monthlyData[month] || 0) + 1;
        });

        const labels = Object.keys(monthlyData).sort();
        const data = labels.map(label => monthlyData[label]);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Citas por Mes',
                    data: data,
                    borderColor: '#2c5aa0',
                    backgroundColor: 'rgba(44, 90, 160, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Cargar Pacientes
    loadPatients() {
        this.renderPatientsTable(this.dataManager.patients);
        this.setupPatientFilters();
    }

    renderPatientsTable(patients) {
        const tbody = document.getElementById('patientsTableBody');
        if (!tbody) return;

        if (patients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">No hay pacientes registrados</td></tr>';
            return;
        }

        tbody.innerHTML = patients.map(patient => `
            <tr>
                <td>${patient.id.substring(0, 8)}...</td>
                <td>${patient.name}</td>
                <td>${patient.dni}</td>
                <td>${patient.age}</td>
                <td>${this.getGenderDisplay(patient.gender)}</td>
                <td>${patient.phone}</td>
                <td>${patient.email || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="app.editPatient('${patient.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="app.deletePatient('${patient.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    setupPatientFilters() {
        const searchInput = document.getElementById('patientSearch');
        const ageFilter = document.getElementById('ageFilter');
        const genderFilter = document.getElementById('genderFilter');

        const applyFilters = () => {
            let filteredPatients = this.dataManager.patients;

            // Aplicar búsqueda
            if (searchInput.value) {
                filteredPatients = this.dataManager.searchPatients(searchInput.value);
            }

            // Aplicar filtro de edad
            if (ageFilter.value) {
                filteredPatients = this.dataManager.filterPatientsByAge(ageFilter.value);
            }

            // Aplicar filtro de género
            if (genderFilter.value) {
                filteredPatients = this.dataManager.filterPatientsByGender(genderFilter.value);
            }

            this.renderPatientsTable(filteredPatients);
        };

        if (searchInput) {
            searchInput.addEventListener('input', applyFilters);
        }
        if (ageFilter) {
            ageFilter.addEventListener('change', applyFilters);
        }
        if (genderFilter) {
            genderFilter.addEventListener('change', applyFilters);
        }
    }

    getGenderDisplay(gender) {
        const genders = {
            'M': 'Masculino',
            'F': 'Femenino',
            'O': 'Otro'
        };
        return genders[gender] || gender;
    }

    // Métodos para modales y CRUD
    showPatientModal(patientId = null) {
        this.showModal('patientModal', patientId ? 'Editar Paciente' : 'Nuevo Paciente');
        
        if (patientId) {
            const patient = this.dataManager.getPatient(patientId);
            if (patient) {
                this.fillPatientForm(patient);
            }
        } else {
            this.clearPatientForm();
        }
    }

    fillPatientForm(patient) {
        document.getElementById('patientId').value = patient.id;
        document.getElementById('patientName').value = patient.name;
        document.getElementById('patientDni').value = patient.dni;
        document.getElementById('patientAge').value = patient.age;
        document.getElementById('patientGender').value = patient.gender;
        document.getElementById('patientPhone').value = patient.phone;
        document.getElementById('patientEmail').value = patient.email;
        document.getElementById('patientAddress').value = patient.address;
    }

    clearPatientForm() {
        document.getElementById('patientForm').reset();
        document.getElementById('patientId').value = '';
    }

    editPatient(patientId) {
        this.showPatientModal(patientId);
    }

    deletePatient(patientId) {
        this.showConfirmModal(
            'Eliminar Paciente',
            '¿Está seguro de eliminar este paciente? También se eliminarán sus historias clínicas y citas relacionadas.',
            () => {
                if (this.dataManager.deletePatient(patientId)) {
                    notificationManager.addNotification('success', 'Paciente Eliminado', 'El paciente ha sido eliminado correctamente');
                    this.loadPatients();
                } else {
                    notificationManager.addNotification('error', 'Error', 'No se pudo eliminar el paciente');
                }
            }
        );
    }

    // Métodos similares para otras entidades...
    loadRecords() {
        this.renderRecordsTable(this.dataManager.records);
        this.populatePatientFilter();
        this.setupRecordFilters();
    }

    renderRecordsTable(records) {
        const tbody = document.getElementById('recordsTableBody');
        if (!tbody) return;

        if (records.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay historias clínicas registradas</td></tr>';
            return;
        }

        tbody.innerHTML = records.map(record => {
            const patient = this.dataManager.getPatient(record.patientId);
            const doctor = this.dataManager.getDoctor(record.doctorId);
            
            return `
                <tr>
                    <td>${record.id.substring(0, 8)}...</td>
                    <td>${patient ? patient.name : 'Paciente no encontrado'}</td>
                    <td>${new Date(record.date).toLocaleDateString()}</td>
                    <td>${record.diagnosis}</td>
                    <td>${doctor ? doctor.name : 'Médico no encontrado'}</td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="app.editRecord('${record.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteRecord('${record.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="btn btn-sm btn-success" onclick="app.exportRecord('${record.id}')">
                            <i class="fas fa-file-pdf"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    populatePatientFilter() {
        const patientFilter = document.getElementById('patientFilter');
        if (!patientFilter) return;

        patientFilter.innerHTML = '<option value="">Todos los pacientes</option>' +
            this.dataManager.patients.map(patient => 
                `<option value="${patient.id}">${patient.name}</option>`
            ).join('');
    }

    setupRecordFilters() {
        const searchInput = document.getElementById('recordSearch');
        const patientFilter = document.getElementById('patientFilter');
        const dateFilter = document.getElementById('dateFilter');

        const applyFilters = () => {
            let filteredRecords = this.dataManager.records;

            if (searchInput.value) {
                filteredRecords = this.dataManager.searchRecords(searchInput.value);
            }

            if (patientFilter.value) {
                filteredRecords = filteredRecords.filter(r => r.patientId === patientFilter.value);
            }

            if (dateFilter.value) {
                filteredRecords = filteredRecords.filter(r => r.date === dateFilter.value);
            }

            this.renderRecordsTable(filteredRecords);
        };

        if (searchInput) searchInput.addEventListener('input', applyFilters);
        if (patientFilter) patientFilter.addEventListener('change', applyFilters);
        if (dateFilter) dateFilter.addEventListener('change', applyFilters);
    }

    // Métodos para otras secciones...
    loadAppointments() {
        this.renderAppointmentsTable(this.dataManager.appointments);
        this.populateAppointmentFilters();
        this.setupAppointmentFilters();
    }

    renderAppointmentsTable(appointments) {
        const tbody = document.getElementById('appointmentsTableBody');
        if (!tbody) return;

        if (appointments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">No hay citas registradas</td></tr>';
            return;
        }

        tbody.innerHTML = appointments.map(appointment => {
            const patient = this.dataManager.getPatient(appointment.patientId);
            const doctor = this.dataManager.getDoctor(appointment.doctorId);
            
            return `
                <tr>
                    <td>${appointment.id.substring(0, 8)}...</td>
                    <td>${patient ? patient.name : 'Paciente no encontrado'}</td>
                    <td>${new Date(appointment.date).toLocaleDateString()}</td>
                    <td>${appointment.time}</td>
                    <td>${doctor ? doctor.name : 'Médico no encontrado'}</td>
                    <td>${appointment.reason}</td>
                    <td><span class="status-badge status-${appointment.status}">${this.getStatusDisplay(appointment.status)}</span></td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="app.editAppointment('${appointment.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteAppointment('${appointment.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    populateAppointmentFilters() {
        const patientFilter = document.getElementById('appointmentPatient');
        const doctorFilter = document.getElementById('appointmentDoctor');
        
        if (patientFilter) {
            patientFilter.innerHTML = '<option value="">Seleccionar paciente</option>' +
                this.dataManager.patients.map(patient => 
                    `<option value="${patient.id}">${patient.name}</option>`
                ).join('');
        }

        if (doctorFilter) {
            doctorFilter.innerHTML = '<option value="">Seleccionar médico</option>' +
                this.dataManager.getActiveDoctors().map(doctor => 
                    `<option value="${doctor.id}">${doctor.name}</option>`
                ).join('');
        }
    }

    setupAppointmentFilters() {
        const searchInput = document.getElementById('appointmentSearch');
        const statusFilter = document.getElementById('statusFilter');
        const dateFilter = document.getElementById('appointmentDateFilter');

        const applyFilters = () => {
            let filteredAppointments = this.dataManager.appointments;

            if (searchInput.value) {
                filteredAppointments = this.dataManager.searchAppointments(searchInput.value);
            }

            if (statusFilter.value) {
                filteredAppointments = filteredAppointments.filter(a => a.status === statusFilter.value);
            }

            if (dateFilter.value) {
                filteredAppointments = filteredAppointments.filter(a => a.date === dateFilter.value);
            }

            this.renderAppointmentsTable(filteredAppointments);
        };

        if (searchInput) searchInput.addEventListener('input', applyFilters);
        if (statusFilter) statusFilter.addEventListener('change', applyFilters);
        if (dateFilter) dateFilter.addEventListener('change', applyFilters);
    }

    loadDoctors() {
        this.renderDoctorsTable(this.dataManager.doctors);
        this.setupDoctorFilters();
    }

    renderDoctorsTable(doctors) {
        const tbody = document.getElementById('doctorsTableBody');
        if (!tbody) return;

        if (doctors.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay médicos registrados</td></tr>';
            return;
        }

        tbody.innerHTML = doctors.map(doctor => `
            <tr>
                <td>${doctor.id.substring(0, 8)}...</td>
                <td>${doctor.name}</td>
                <td>${doctor.specialty}</td>
                <td>${doctor.email}</td>
                <td>${doctor.phone}</td>
                <td><span class="status-badge status-${doctor.isActive ? 'active' : 'inactive'}">${doctor.isActive ? 'Activo' : 'Inactivo'}</span></td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="app.editDoctor('${doctor.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="app.deleteDoctor('${doctor.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    setupDoctorFilters() {
        const searchInput = document.getElementById('doctorSearch');
        const specialtyFilter = document.getElementById('specialtyFilter');

        const applyFilters = () => {
            let filteredDoctors = this.dataManager.doctors;

            if (searchInput.value) {
                filteredDoctors = this.dataManager.searchDoctors(searchInput.value);
            }

            if (specialtyFilter.value) {
                filteredDoctors = this.dataManager.filterDoctorsBySpecialty(specialtyFilter.value);
            }

            this.renderDoctorsTable(filteredDoctors);
        };

        if (searchInput) searchInput.addEventListener('input', applyFilters);
        if (specialtyFilter) specialtyFilter.addEventListener('change', applyFilters);
    }

    getStatusDisplay(status) {
        const statuses = {
            'pending': 'Pendiente',
            'completed': 'Atendida',
            'cancelled': 'Cancelada'
        };
        return statuses[status] || status;
    }

    // Métodos de utilidad
    showModal(modalId, title = '') {
        const modal = document.getElementById(modalId);
        const modalTitle = modal.querySelector('.modal-header h3');
        
        if (modalTitle && title) {
            modalTitle.textContent = title;
        }
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    showConfirmModal(title, message, onConfirm) {
        const modal = document.getElementById('confirmModal');
        const titleElement = modal.querySelector('.modal-header h3');
        const messageElement = modal.querySelector('#confirmMessage');
        const confirmBtn = document.getElementById('confirmBtn');

        titleElement.textContent = title;
        messageElement.textContent = message;

        // Remover listeners anteriores
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

        newConfirmBtn.addEventListener('click', () => {
            onConfirm();
            this.hideModal('confirmModal');
        });

        this.showModal('confirmModal');
    }

    initializeModals() {
        // Cerrar modales al hacer clic en el botón X
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.hideModal(modal.id);
            });
        });

        // Cerrar modales al hacer clic fuera
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });

        // Botones de cancelar
        document.querySelectorAll('.modal-cancel').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.hideModal(modal.id);
            });
        });

        // Formularios
        this.setupForms();
    }

    setupForms() {
        // Formulario de pacientes
        const patientForm = document.getElementById('patientForm');
        if (patientForm) {
            patientForm.addEventListener('submit', (e) => this.handlePatientSubmit(e));
        }

        // Formulario de historias clínicas
        const recordForm = document.getElementById('recordForm');
        if (recordForm) {
            recordForm.addEventListener('submit', (e) => this.handleRecordSubmit(e));
        }

        // Formulario de citas
        const appointmentForm = document.getElementById('appointmentForm');
        if (appointmentForm) {
            appointmentForm.addEventListener('submit', (e) => this.handleAppointmentSubmit(e));
        }

        // Formulario de médicos
        const doctorForm = document.getElementById('doctorForm');
        if (doctorForm) {
            doctorForm.addEventListener('submit', (e) => this.handleDoctorSubmit(e));
        }
    }

    handlePatientSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const patientData = {
            name: formData.get('patientName') || document.getElementById('patientName').value,
            dni: formData.get('patientDni') || document.getElementById('patientDni').value,
            age: parseInt(formData.get('patientAge') || document.getElementById('patientAge').value),
            gender: formData.get('patientGender') || document.getElementById('patientGender').value,
            phone: formData.get('patientPhone') || document.getElementById('patientPhone').value,
            email: formData.get('patientEmail') || document.getElementById('patientEmail').value,
            address: formData.get('patientAddress') || document.getElementById('patientAddress').value
        };

        const patientId = document.getElementById('patientId').value;
        
        if (patientId) {
            // Actualizar paciente existente
            if (this.dataManager.updatePatient(patientId, patientData)) {
                notificationManager.addNotification('success', 'Paciente Actualizado', 'El paciente ha sido actualizado correctamente');
                this.loadPatients();
                this.hideModal('patientModal');
            } else {
                notificationManager.addNotification('error', 'Error', 'No se pudo actualizar el paciente');
            }
        } else {
            // Crear nuevo paciente
            const patient = this.dataManager.addPatient(patientData);
            notificationManager.addNotification('success', 'Paciente Creado', 'El paciente ha sido creado correctamente');
            this.loadPatients();
            this.hideModal('patientModal');
        }
    }

    // Métodos similares para otros formularios...
    handleRecordSubmit(e) {
        e.preventDefault();
        
        const recordData = {
            patientId: document.getElementById('recordPatient').value,
            doctorId: document.getElementById('recordDoctor').value,
            date: document.getElementById('recordDate').value,
            diagnosis: document.getElementById('recordDiagnosis').value,
            treatment: document.getElementById('recordTreatment').value,
            medications: document.getElementById('recordMedications').value,
            allergies: document.getElementById('recordAllergies').value,
            medicalHistory: document.getElementById('recordHistory').value,
            observations: document.getElementById('recordObservations').value
        };

        const recordId = document.getElementById('recordId').value;
        
        if (recordId) {
            if (this.dataManager.updateRecord(recordId, recordData)) {
                notificationManager.addNotification('success', 'Historia Actualizada', 'La historia clínica ha sido actualizada correctamente');
                this.loadRecords();
                this.hideModal('recordModal');
            } else {
                notificationManager.addNotification('error', 'Error', 'No se pudo actualizar la historia clínica');
            }
        } else {
            const record = this.dataManager.addRecord(recordData);
            notificationManager.addNotification('success', 'Historia Creada', 'La historia clínica ha sido creada correctamente');
            this.loadRecords();
            this.hideModal('recordModal');
        }
    }

    handleAppointmentSubmit(e) {
        e.preventDefault();
        
        const appointmentData = {
            patientId: document.getElementById('appointmentPatient').value,
            doctorId: document.getElementById('appointmentDoctor').value,
            date: document.getElementById('appointmentDate').value,
            time: document.getElementById('appointmentTime').value,
            reason: document.getElementById('appointmentReason').value,
            status: document.getElementById('appointmentStatus').value
        };

        const appointmentId = document.getElementById('appointmentId').value;
        
        if (appointmentId) {
            if (this.dataManager.updateAppointment(appointmentId, appointmentData)) {
                notificationManager.addNotification('success', 'Cita Actualizada', 'La cita ha sido actualizada correctamente');
                this.loadAppointments();
                this.hideModal('appointmentModal');
            } else {
                notificationManager.addNotification('error', 'Error', 'No se pudo actualizar la cita');
            }
        } else {
            const appointment = this.dataManager.addAppointment(appointmentData);
            notificationManager.addNotification('success', 'Cita Creada', 'La cita ha sido creada correctamente');
            this.loadAppointments();
            this.hideModal('appointmentModal');
        }
    }

    handleDoctorSubmit(e) {
        e.preventDefault();
        
        const doctorData = {
            name: document.getElementById('doctorName').value,
            specialty: document.getElementById('doctorSpecialty').value,
            email: document.getElementById('doctorEmail').value,
            phone: document.getElementById('doctorPhone').value
        };

        const doctorId = document.getElementById('doctorId').value;
        
        if (doctorId) {
            if (this.dataManager.updateDoctor(doctorId, doctorData)) {
                notificationManager.addNotification('success', 'Médico Actualizado', 'El médico ha sido actualizado correctamente');
                this.loadDoctors();
                this.hideModal('doctorModal');
            } else {
                notificationManager.addNotification('error', 'Error', 'No se pudo actualizar el médico');
            }
        } else {
            const doctor = this.dataManager.addDoctor(doctorData);
            notificationManager.addNotification('success', 'Médico Creado', 'El médico ha sido creado correctamente');
            this.loadDoctors();
            this.hideModal('doctorModal');
        }
    }

    // Métodos de exportación
    exportAllData() {
        const data = StorageManager.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_historias_clinicas_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        notificationManager.addNotification('success', 'Datos Exportados', 'Los datos han sido exportados correctamente');
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        if (StorageManager.importData(data)) {
                            notificationManager.addNotification('success', 'Datos Importados', 'Los datos han sido importados correctamente');
                            // Recargar la aplicación
                            location.reload();
                        } else {
                            notificationManager.addNotification('error', 'Error', 'No se pudieron importar los datos');
                        }
                    } catch (error) {
                        notificationManager.addNotification('error', 'Error', 'Archivo inválido');
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    }

    // Notificaciones de citas
    checkAppointmentNotifications() {
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = this.dataManager.getAppointmentsByDate(today);
        
        todayAppointments.forEach(appointment => {
            const appointmentTime = new Date(`${appointment.date}T${appointment.time}`);
            const now = new Date();
            const diffMinutes = (appointmentTime - now) / (1000 * 60);
            
            if (diffMinutes > 0 && diffMinutes <= 10) {
                const patient = this.dataManager.getPatient(appointment.patientId);
                notificationManager.addNotification(
                    'info',
                    'Cita Próxima',
                    `Cita con ${patient ? patient.name : 'paciente'} en ${Math.round(diffMinutes)} minutos`
                );
            }
        });
    }

    toggleCalendarView() {
        const calendarContainer = document.getElementById('calendarContainer');
        const appointmentsList = document.getElementById('appointmentsList');
        const calendarViewBtn = document.getElementById('calendarViewBtn');
        
        if (calendarContainer.style.display === 'none') {
            calendarContainer.style.display = 'block';
            appointmentsList.style.display = 'none';
            calendarViewBtn.innerHTML = '<i class="fas fa-list"></i> Vista Lista';
            this.renderCalendar();
        } else {
            calendarContainer.style.display = 'none';
            appointmentsList.style.display = 'block';
            calendarViewBtn.innerHTML = '<i class="fas fa-calendar"></i> Vista Calendario';
        }
    }

    renderCalendar() {
        // Implementar calendario interactivo
        const calendarGrid = document.getElementById('calendarGrid');
        if (!calendarGrid) return;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        // Implementar lógica del calendario
        // Por ahora, mostrar mensaje de implementación pendiente
        calendarGrid.innerHTML = '<div class="text-center p-lg">Calendario en desarrollo</div>';
    }

    // Métodos CRUD adicionales
    showRecordModal(recordId = null) {
        this.showModal('recordModal', recordId ? 'Editar Historia Clínica' : 'Nueva Historia Clínica');
        
        // Poblar selectores
        this.populateRecordSelectors();
        
        if (recordId) {
            const record = this.dataManager.getRecord(recordId);
            if (record) {
                this.fillRecordForm(record);
            }
        } else {
            this.clearRecordForm();
        }
    }

    populateRecordSelectors() {
        const patientSelect = document.getElementById('recordPatient');
        const doctorSelect = document.getElementById('recordDoctor');
        
        if (patientSelect) {
            patientSelect.innerHTML = '<option value="">Seleccionar paciente</option>' +
                this.dataManager.patients.map(patient => 
                    `<option value="${patient.id}">${patient.name}</option>`
                ).join('');
        }

        if (doctorSelect) {
            doctorSelect.innerHTML = '<option value="">Seleccionar médico</option>' +
                this.dataManager.getActiveDoctors().map(doctor => 
                    `<option value="${doctor.id}">${doctor.name}</option>`
                ).join('');
        }
    }

    fillRecordForm(record) {
        document.getElementById('recordId').value = record.id;
        document.getElementById('recordPatient').value = record.patientId;
        document.getElementById('recordDoctor').value = record.doctorId;
        document.getElementById('recordDate').value = record.date;
        document.getElementById('recordDiagnosis').value = record.diagnosis;
        document.getElementById('recordTreatment').value = record.treatment;
        document.getElementById('recordMedications').value = record.medications;
        document.getElementById('recordAllergies').value = record.allergies;
        document.getElementById('recordHistory').value = record.medicalHistory;
        document.getElementById('recordObservations').value = record.observations;
    }

    clearRecordForm() {
        document.getElementById('recordForm').reset();
        document.getElementById('recordId').value = '';
    }

    editRecord(recordId) {
        this.showRecordModal(recordId);
    }

    deleteRecord(recordId) {
        this.showConfirmModal(
            'Eliminar Historia Clínica',
            '¿Está seguro de eliminar esta historia clínica?',
            () => {
                if (this.dataManager.deleteRecord(recordId)) {
                    notificationManager.addNotification('success', 'Historia Eliminada', 'La historia clínica ha sido eliminada correctamente');
                    this.loadRecords();
                } else {
                    notificationManager.addNotification('error', 'Error', 'No se pudo eliminar la historia clínica');
                }
            }
        );
    }

    exportRecord(recordId) {
        const record = this.dataManager.getRecord(recordId);
        if (!record) return;

        const patient = this.dataManager.getPatient(record.patientId);
        const doctor = this.dataManager.getDoctor(record.doctorId);

        // Crear PDF usando jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Título
        doc.setFontSize(18);
        doc.text('HISTORIA CLÍNICA', 105, 20, { align: 'center' });

        // Información del paciente
        doc.setFontSize(12);
        doc.text('DATOS DEL PACIENTE:', 20, 40);
        doc.text(`Nombre: ${patient ? patient.name : 'No encontrado'}`, 20, 50);
        doc.text(`DNI: ${patient ? patient.dni : 'No encontrado'}`, 20, 60);
        doc.text(`Edad: ${patient ? patient.age : 'No encontrado'}`, 20, 70);
        doc.text(`Teléfono: ${patient ? patient.phone : 'No encontrado'}`, 20, 80);

        // Información de la consulta
        doc.text('INFORMACIÓN DE LA CONSULTA:', 20, 100);
        doc.text(`Fecha: ${new Date(record.date).toLocaleDateString()}`, 20, 110);
        doc.text(`Médico: ${doctor ? doctor.name : 'No encontrado'}`, 20, 120);
        doc.text(`Especialidad: ${doctor ? doctor.specialty : 'No encontrado'}`, 20, 130);

        // Diagnóstico
        doc.text('DIAGNÓSTICO:', 20, 150);
        doc.text(record.diagnosis, 20, 160);

        // Tratamiento
        if (record.treatment) {
            doc.text('TRATAMIENTO:', 20, 180);
            doc.text(record.treatment, 20, 190);
        }

        // Medicamentos
        if (record.medications) {
            doc.text('MEDICAMENTOS:', 20, 210);
            doc.text(record.medications, 20, 220);
        }

        // Alergias
        if (record.allergies) {
            doc.text('ALERGIAS:', 20, 240);
            doc.text(record.allergies, 20, 250);
        }

        // Guardar PDF
        doc.save(`historia_clinica_${record.id.substring(0, 8)}.pdf`);
        notificationManager.addNotification('success', 'PDF Generado', 'La historia clínica ha sido exportada como PDF');
    }

    showAppointmentModal(appointmentId = null) {
        this.showModal('appointmentModal', appointmentId ? 'Editar Cita Médica' : 'Nueva Cita Médica');
        
        // Poblar selectores
        this.populateAppointmentSelectors();
        
        if (appointmentId) {
            const appointment = this.dataManager.getAppointment(appointmentId);
            if (appointment) {
                this.fillAppointmentForm(appointment);
            }
        } else {
            this.clearAppointmentForm();
        }
    }

    populateAppointmentSelectors() {
        const patientSelect = document.getElementById('appointmentPatient');
        const doctorSelect = document.getElementById('appointmentDoctor');
        
        if (patientSelect) {
            patientSelect.innerHTML = '<option value="">Seleccionar paciente</option>' +
                this.dataManager.patients.map(patient => 
                    `<option value="${patient.id}">${patient.name}</option>`
                ).join('');
        }

        if (doctorSelect) {
            doctorSelect.innerHTML = '<option value="">Seleccionar médico</option>' +
                this.dataManager.getActiveDoctors().map(doctor => 
                    `<option value="${doctor.id}">${doctor.name}</option>`
                ).join('');
        }
    }

    fillAppointmentForm(appointment) {
        document.getElementById('appointmentId').value = appointment.id;
        document.getElementById('appointmentPatient').value = appointment.patientId;
        document.getElementById('appointmentDoctor').value = appointment.doctorId;
        document.getElementById('appointmentDate').value = appointment.date;
        document.getElementById('appointmentTime').value = appointment.time;
        document.getElementById('appointmentReason').value = appointment.reason;
        document.getElementById('appointmentStatus').value = appointment.status;
    }

    clearAppointmentForm() {
        document.getElementById('appointmentForm').reset();
        document.getElementById('appointmentId').value = '';
    }

    editAppointment(appointmentId) {
        this.showAppointmentModal(appointmentId);
    }

    deleteAppointment(appointmentId) {
        this.showConfirmModal(
            'Eliminar Cita Médica',
            '¿Está seguro de eliminar esta cita médica?',
            () => {
                if (this.dataManager.deleteAppointment(appointmentId)) {
                    notificationManager.addNotification('success', 'Cita Eliminada', 'La cita ha sido eliminada correctamente');
                    this.loadAppointments();
                } else {
                    notificationManager.addNotification('error', 'Error', 'No se pudo eliminar la cita');
                }
            }
        );
    }

    showDoctorModal(doctorId = null) {
        this.showModal('doctorModal', doctorId ? 'Editar Médico' : 'Nuevo Médico');
        
        if (doctorId) {
            const doctor = this.dataManager.getDoctor(doctorId);
            if (doctor) {
                this.fillDoctorForm(doctor);
            }
        } else {
            this.clearDoctorForm();
        }
    }

    fillDoctorForm(doctor) {
        document.getElementById('doctorId').value = doctor.id;
        document.getElementById('doctorName').value = doctor.name;
        document.getElementById('doctorSpecialty').value = doctor.specialty;
        document.getElementById('doctorEmail').value = doctor.email;
        document.getElementById('doctorPhone').value = doctor.phone;
    }

    clearDoctorForm() {
        document.getElementById('doctorForm').reset();
        document.getElementById('doctorId').value = '';
    }

    editDoctor(doctorId) {
        this.showDoctorModal(doctorId);
    }

    deleteDoctor(doctorId) {
        this.showConfirmModal(
            'Eliminar Médico',
            '¿Está seguro de eliminar este médico? También se eliminarán sus citas y historias clínicas relacionadas.',
            () => {
                if (this.dataManager.deleteDoctor(doctorId)) {
                    notificationManager.addNotification('success', 'Médico Eliminado', 'El médico ha sido eliminado correctamente');
                    this.loadDoctors();
                } else {
                    notificationManager.addNotification('error', 'Error', 'No se pudo eliminar el médico');
                }
            }
        );
    }
}

// ===== INICIALIZACIÓN FINAL =====

// Instancias globales
let notificationManager;
let themeManager;
let authManager;
let app;

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar gestores
    notificationManager = new NotificationManager();
    themeManager = new ThemeManager();
    authManager = new AuthManager();

    // Mostrar pantalla de login por defecto
    authManager.showLogin();
    
    // Hacer disponible globalmente
    window.notificationManager = notificationManager;
    window.themeManager = themeManager;
    window.authManager = authManager;
});

// Exportar para uso global
window.CONFIG = CONFIG;
window.StorageManager = StorageManager;
window.NotificationManager = NotificationManager;
window.DataManager = DataManager;
window.MedicalApp = MedicalApp;
