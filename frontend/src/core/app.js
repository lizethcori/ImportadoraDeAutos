/**
 * Importadora Nissan - Aplicación Principal
 * Punto de entrada de la nueva arquitectura modular
 */

(function(window) {
    'use strict';

    // Namespace global de la aplicación
    window.Importadora = window.Importadora || {};
    window.Importadora.Core = window.Importadora.Core || {};
    window.Importadora.Modules = window.Importadora.Modules || {};
    window.Importadora.Services = window.Importadora.Services || {};
    window.Importadora.Components = window.Importadora.Components || {};

    /**
     * Clase principal de la aplicación
     */
    class App {
        constructor() {
            this.isInitialized = false;
            this.modules = new Map();
            this.services = new Map();
            this.eventBus = null;
        }

        /**
         * Inicialización de la aplicación
         */
        async init() {
            console.log('🚀 Inicializando Importadora Nissan App...');
            
            try {
                // 1. Inicializar EventBus
                await this.initEventBus();
                
                // 2. Inicializar servicios
                await this.initServices();
                
                // 3. Inicializar módulos
                await this.initModules();
                
                // 4. Configurar eventos globales
                this.setupGlobalEvents();
                
                // 5. Marcar como inicializada
                this.isInitialized = true;
                
                console.log('✅ Aplicación inicializada correctamente');
                this.eventBus.emit('app:initialized');
                
            } catch (error) {
                console.error('❌ Error al inicializar la aplicación:', error);
                this.eventBus.emit('app:error', { error });
            }
        }

        /**
         * Inicializar EventBus
         */
        async initEventBus() {
            console.log('📡 Inicializando EventBus...');
            
            if (window.Importadora.Core.EventBus) {
                this.eventBus = window.Importadora.Core.EventBus;
                console.log('✅ EventBus inicializado');
            } else {
                throw new Error('EventBus no encontrado');
            }
        }

        /**
         * Inicializar servicios
         */
        async initServices() {
            console.log('🔧 Inicializando servicios...');
            
            // Aquí se registrarán los servicios cuando se creen
            // Por ahora solo registramos el placeholder
            
            console.log('✅ Servicios inicializados');
        }

        /**
         * Inicializar módulos
         */
        async initModules() {
            console.log('📦 Inicializando módulos...');
            
            // Aquí se registrarán los módulos cuando se creen
            // Por ahora solo registramos el placeholder
            
            console.log('✅ Módulos inicializados');
        }

        /**
         * Configurar eventos globales
         */
        setupGlobalEvents() {
            // Manejo de errores no capturados
            window.addEventListener('error', (event) => {
                console.error('Error global:', event.error);
                this.eventBus.emit('app:error', { 
                    error: event.error, 
                    source: event.filename, 
                    line: event.lineno 
                });
            });

            // Manejo de promesas rechazadas
            window.addEventListener('unhandledrejection', (event) => {
                console.error('Promesa rechazada no manejada:', event.reason);
                this.eventBus.emit('app:error', { 
                    error: event.reason,
                    type: 'unhandledRejection'
                });
            });

            // Evento de cierre de página
            window.addEventListener('beforeunload', () => {
                this.eventBus.emit('app:beforeUnload');
            });
        }

        /**
         * Registrar un servicio
         */
        registerService(name, service) {
            if (this.services.has(name)) {
                console.warn(`⚠️ Servicio '${name}' ya existe, será reemplazado`);
            }
            
            this.services.set(name, service);
            console.log(`📋 Servicio '${name}' registrado`);
        }

        /**
         * Obtener un servicio
         */
        getService(name) {
            if (!this.services.has(name)) {
                throw new Error(`Servicio '${name}' no encontrado`);
            }
            return this.services.get(name);
        }

        /**
         * Registrar un módulo
         */
        registerModule(name, module) {
            if (this.modules.has(name)) {
                console.warn(`⚠️ Módulo '${name}' ya existe, será reemplazado`);
            }
            
            this.modules.set(name, module);
            console.log(`📦 Módulo '${name}' registrado`);
        }

        /**
         * Obtener un módulo
         */
        getModule(name) {
            if (!this.modules.has(name)) {
                throw new Error(`Módulo '${name}' no encontrado`);
            }
            return this.modules.get(name);
        }

        /**
         * Obtener estado de la aplicación
         */
        getStatus() {
            return {
                initialized: this.isInitialized,
                modulesCount: this.modules.size,
                servicesCount: this.services.size,
                modules: Array.from(this.modules.keys()),
                services: Array.from(this.services.keys())
            };
        }

        /**
         * Reiniciar aplicación
         */
        async restart() {
            console.log('🔄 Reiniciando aplicación...');
            
            // Limpiar módulos
            this.modules.clear();
            this.services.clear();
            
            // Reinicializar
            await this.init();
        }
    }

    // Crear instancia global de la aplicación
    window.Importadora.App = new App();

    // Auto-inicialización cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.Importadora.App.init();
        });
    } else {
        // Si el DOM ya está cargado, inicializar inmediatamente
        window.Importadora.App.init();
    }

})(window);
