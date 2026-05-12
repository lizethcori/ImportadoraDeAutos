/**
 * Importadora Nissan - Auth Service
 * Servicio de autenticación usando mock-backend
 */

(function(window) {
    'use strict';

    window.Importadora = window.Importadora || {};
    window.Importadora.Services = window.Importadora.Services || {};

    /**
     * Auth Service - Gestión de autenticación
     */
    class AuthService {
        constructor() {
            this.currentUser = null;
            this.sessionTimeout = null;
            this.sessionDuration = 30 * 60 * 1000; // 30 minutos
            this.eventBus = null;
            this.isInitialized = false;
        }

        /**
         * Inicializar el servicio
         */
        init(eventBus) {
            console.log('🔐 Inicializando Auth Service...');
            
            this.eventBus = eventBus || window.Importadora.Core.EventBus;
            
            // Restaurar sesión existente
            this.restoreSession();
            
            // Configurar timeout de sesión
            this.setupSessionTimeout();
            
            this.isInitialized = true;
            console.log('✅ Auth Service inicializado');
        }

        /**
         * Iniciar sesión
         * @param {object} credentials - { username, password }
         * @returns {Promise<object>} Resultado del login
         */
        async login(credentials) {
            console.log('🔐 Intento de login:', credentials.username);
            
            try {
                // Emitir evento de inicio de login
                this.eventBus.emit('auth:loginStart', { username: credentials.username });

                // Usar mock backend para autenticación
                const result = await window.Importadora.Services.MockBackend.login(credentials);
                
                if (result.success) {
                    // Guardar usuario actual
                    this.currentUser = result.user;
                    
                    // Guardar sesión en sessionStorage
                    this.saveSession();
                    
                    // Configurar timeout
                    this.setupSessionTimeout();
                    
                    // Emitir evento de éxito
                    this.eventBus.emit('auth:loginSuccess', { user: result.user });
                    
                    console.log('✅ Login exitoso:', result.user.name);
                    
                } else {
                    // Emitir evento de error
                    this.eventBus.emit('auth:loginError', { 
                        message: result.message,
                        username: credentials.username
                    });
                    
                    console.log('❌ Login fallido:', result.message);
                }
                
                return result;
                
            } catch (error) {
                console.error('🔐 Error en login:', error);
                
                // Emitir evento de error
                this.eventBus.emit('auth:loginError', { 
                    error: error.message,
                    username: credentials.username
                });
                
                return { 
                    success: false, 
                    message: 'Error de conexión. Intente nuevamente.' 
                };
            }
        }

        /**
         * Cerrar sesión
         */
        logout() {
            console.log('🔐 Cerrando sesión...');
            
            // Limpiar timeout
            if (this.sessionTimeout) {
                clearTimeout(this.sessionTimeout);
                this.sessionTimeout = null;
            }
            
            // Guardar usuario antes de limpiar
            const previousUser = this.currentUser;
            
            // Limpiar datos
            this.currentUser = null;
            
            // Limpiar sessionStorage
            sessionStorage.removeItem('importadora_session');
            sessionStorage.removeItem('importadora_session_timestamp');
            
            // Emitir evento de logout
            this.eventBus.emit('auth:logout', { previousUser });
            
            console.log('✅ Sesión cerrada');
        }

        /**
         * Verificar si hay sesión activa
         * @returns {boolean}
         */
        isAuthenticated() {
            if (!this.currentUser) {
                return false;
            }
            
            // Verificar si la sesión ha expirado
            const timestamp = sessionStorage.getItem('importadora_session_timestamp');
            if (timestamp) {
                const elapsed = Date.now() - parseInt(timestamp);
                if (elapsed > this.sessionDuration) {
                    this.logout();
                    return false;
                }
            }
            
            return true;
        }

        /**
         * Obtener usuario actual
         * @returns {object|null}
         */
        getCurrentUser() {
            return this.isAuthenticated() ? this.currentUser : null;
        }

        /**
         * Verificar si el usuario tiene un rol específico
         * @param {string} role - Rol a verificar
         * @returns {boolean}
         */
        hasRole(role) {
            const user = this.getCurrentUser();
            return user ? user.role === role : false;
        }

        /**
         * Verificar si el usuario tiene alguno de los roles especificados
         * @param {array} roles - Array de roles
         * @returns {boolean}
         */
        hasAnyRole(roles) {
            const user = this.getCurrentUser();
            if (!user) return false;
            
            return roles.some(role => user.role === role);
        }

        /**
         * Verificar si el usuario es admin
         * @returns {boolean}
         */
        isAdmin() {
            return this.hasRole('admin');
        }

        /**
         * Verificar si el usuario es vendedor
         * @returns {boolean}
         */
        isSeller() {
            return this.hasRole('vendedor');
        }

        /**
         * Verificar si el usuario es cliente
         * @returns {boolean}
         */
        isClient() {
            return this.hasRole('cliente');
        }

        /**
         * Guardar sesión en sessionStorage
         * @private
         */
        saveSession() {
            if (!this.currentUser) return;
            
            const sessionData = {
                user: this.currentUser,
                timestamp: Date.now()
            };
            
            sessionStorage.setItem('importadora_session', JSON.stringify(sessionData));
            sessionStorage.setItem('importadora_session_timestamp', Date.now().toString());
            
            console.log('💾 Sesión guardada en sessionStorage');
        }

        /**
         * Restaurar sesión desde sessionStorage
         * @private
         */
        restoreSession() {
            try {
                const sessionData = sessionStorage.getItem('importadora_session');
                const timestamp = sessionStorage.getItem('importadora_session_timestamp');
                
                if (sessionData && timestamp) {
                    const parsed = JSON.parse(sessionData);
                    
                    // Verificar si la sesión ha expirado
                    const elapsed = Date.now() - parseInt(timestamp);
                    if (elapsed <= this.sessionDuration) {
                        this.currentUser = parsed.user;
                        console.log('♻️ Sesión restaurada:', this.currentUser.name);
                        
                        // Emitir evento de restauración
                        this.eventBus.emit('auth:sessionRestored', { user: this.currentUser });
                        
                    } else {
                        console.log('⏰ Sesión expirada, limpiando...');
                        this.logout();
                    }
                } else {
                    console.log('🔐 No hay sesión activa');
                }
                
            } catch (error) {
                console.error('🔐 Error al restaurar sesión:', error);
                this.logout();
            }
        }

        /**
         * Configurar timeout de sesión
         * @private
         */
        setupSessionTimeout() {
            if (this.sessionTimeout) {
                clearTimeout(this.sessionTimeout);
            }
            
            if (this.currentUser) {
                this.sessionTimeout = setTimeout(() => {
                    console.log('⏰ Sesión expirada por timeout');
                    this.eventBus.emit('auth:sessionExpired');
                    this.logout();
                }, this.sessionDuration);
            }
        }

        /**
         * Extender sesión
         */
        extendSession() {
            if (this.isAuthenticated()) {
                this.saveSession();
                this.setupSessionTimeout();
                
                this.eventBus.emit('auth:sessionExtended', { user: this.currentUser });
                console.log('⏰ Sesión extendida');
            }
        }

        /**
         * Obtener tiempo restante de sesión
         * @returns {number} Milisegundos restantes
         */
        getSessionTimeRemaining() {
            if (!this.isAuthenticated()) {
                return 0;
            }
            
            const timestamp = sessionStorage.getItem('importadora_session_timestamp');
            if (!timestamp) return 0;
            
            const elapsed = Date.now() - parseInt(timestamp);
            return Math.max(0, this.sessionDuration - elapsed);
        }

        /**
         * Obtener tiempo restante formateado
         * @returns {string} Tiempo en formato MM:SS
         */
        getSessionTimeRemainingFormatted() {
            const remaining = this.getSessionTimeRemaining();
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        /**
         * Forzar refresh de usuario (desde backend)
         * @param {object} updatedUser - Datos actualizados del usuario
         */
        refreshUser(updatedUser) {
            if (this.currentUser && this.currentUser.id === updatedUser.id) {
                this.currentUser = { ...this.currentUser, ...updatedUser };
                this.saveSession();
                
                this.eventBus.emit('auth:userUpdated', { user: this.currentUser });
                console.log('🔄 Usuario actualizado:', this.currentUser.name);
            }
        }

        /**
         * Estadísticas del servicio
         */
        getStats() {
            return {
                initialized: this.isInitialized,
                authenticated: this.isAuthenticated(),
                currentUser: this.getCurrentUser(),
                sessionTimeRemaining: this.getSessionTimeRemaining(),
                sessionTimeRemainingFormatted: this.getSessionTimeRemainingFormatted(),
                sessionDuration: this.sessionDuration
            };
        }
    }

    // Crear instancia global del servicio
    window.Importadora.Services.AuthService = new AuthService();

    // Auto-inicialización cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.Importadora.Services.AuthService.init();
        });
    } else {
        window.Importadora.Services.AuthService.init();
    }

    console.log('🔐 Auth Service cargado');

})(window);
