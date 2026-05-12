/**
 * Importadora Nissan - EventBus
 * Sistema de comunicación entre módulos sin acoplamiento
 */

(function(window) {
    'use strict';

    // Namespace global
    window.Importadora = window.Importadora || {};
    window.Importadora.Core = window.Importadora.Core || {};

    /**
     * EventBus - Sistema de eventos publicados/suscritos
     */
    class EventBus {
        constructor() {
            this.events = new Map();
            this.maxListeners = 50;
            this.debugMode = false;
        }

        /**
         * Suscribirse a un evento
         * @param {string} event - Nombre del evento
         * @param {function} callback - Función a ejecutar
         * @param {object} options - Opciones adicionales
         * @returns {function} Función para cancelar suscripción
         */
        on(event, callback, options = {}) {
            if (typeof callback !== 'function') {
                throw new Error('El callback debe ser una función');
            }

            // Crear array de listeners si no existe
            if (!this.events.has(event)) {
                this.events.set(event, []);
            }

            const listeners = this.events.get(event);
            
            // Verificar límite de listeners
            if (listeners.length >= this.maxListeners) {
                console.warn(`⚠️ Evento '${event}' ha alcanzado el máximo de listeners (${this.maxListeners})`);
            }

            // Crear listener object
            const listener = {
                callback,
                once: options.once || false,
                context: options.context || null,
                id: this.generateListenerId()
            };

            listeners.push(listener);

            if (this.debugMode) {
                console.log(`📡 Suscripción a evento '${event}' [${listener.id}]`);
            }

            // Retornar función para cancelar suscripción
            return () => this.off(event, listener.id);
        }

        /**
         * Suscribirse a un evento solo una vez
         * @param {string} event - Nombre del evento
         * @param {function} callback - Función a ejecutar
         * @param {object} options - Opciones adicionales
         * @returns {function} Función para cancelar suscripción
         */
        once(event, callback, options = {}) {
            return this.on(event, callback, { ...options, once: true });
        }

        /**
         * Cancelar suscripción a un evento
         * @param {string} event - Nombre del evento
         * @param {string|function} identifier - ID del listener o función callback
         */
        off(event, identifier) {
            if (!this.events.has(event)) {
                if (this.debugMode) {
                    console.warn(`⚠️ Intento de cancelar suscripción a evento inexistente '${event}'`);
                }
                return;
            }

            const listeners = this.events.get(event);
            const initialLength = listeners.length;

            // Filtrar listeners a eliminar
            const filteredListeners = listeners.filter(listener => {
                if (typeof identifier === 'string') {
                    return listener.id !== identifier;
                } else if (typeof identifier === 'function') {
                    return listener.callback !== identifier;
                }
                return true;
            });

            // Actualizar listeners
            if (filteredListeners.length === 0) {
                this.events.delete(event);
            } else {
                this.events.set(event, filteredListeners);
            }

            const removedCount = initialLength - filteredListeners.length;
            
            if (this.debugMode && removedCount > 0) {
                console.log(`📡 Canceladas ${removedCount} suscripciones a evento '${event}'`);
            }
        }

        /**
         * Emitir/publish un evento
         * @param {string} event - Nombre del evento
         * @param {*} data - Datos a pasar a los listeners
         * @param {object} options - Opciones adicionales
         */
        emit(event, data, options = {}) {
            if (!this.events.has(event)) {
                if (this.debugMode) {
                    console.log(`📡 Emitiendo evento '${event}' sin listeners`);
                }
                return;
            }

            const listeners = this.events.get(event);
            const listenersToRemove = [];

            if (this.debugMode) {
                console.log(`📡 Emitiendo evento '${event}' a ${listeners.length} listeners`, data);
            }

            // Ejecutar listeners
            listeners.forEach(listener => {
                try {
                    if (listener.context) {
                        listener.callback.call(listener.context, data, event);
                    } else {
                        listener.callback(data, event);
                    }

                    // Si es once, marcar para remover
                    if (listener.once) {
                        listenersToRemove.push(listener.id);
                    }
                } catch (error) {
                    console.error(`❌ Error en listener del evento '${event}':`, error);
                    
                    // Emitir error si no es el mismo evento de error
                    if (event !== 'app:error') {
                        this.emit('app:error', { 
                            originalEvent: event, 
                            error, 
                            listener: listener.id 
                        });
                    }
                }
            });

            // Remover listeners once
            listenersToRemove.forEach(id => {
                this.off(event, id);
            });

            // Opciones adicionales
            if (options.async) {
                // Para eventos asíncronos, retornar promise
                return Promise.resolve();
            }
        }

        /**
         * Emitir evento asíncrono
         * @param {string} event - Nombre del evento
         * @param {*} data - Datos a pasar
         */
        async emitAsync(event, data) {
            return this.emit(event, data, { async: true });
        }

        /**
         * Limpiar todos los eventos
         */
        clear() {
            const eventCount = this.events.size;
            this.events.clear();
            
            if (this.debugMode) {
                console.log(`📡 Limpiados ${eventCount} eventos`);
            }
        }

        /**
         * Obtener lista de eventos registrados
         */
        getEvents() {
            const events = {};
            this.events.forEach((listeners, event) => {
                events[event] = listeners.map(listener => ({
                    id: listener.id,
                    once: listener.once,
                    hasContext: !!listener.context
                }));
            });
            return events;
        }

        /**
         * Obtener número de listeners para un evento
         * @param {string} event - Nombre del evento
         */
        getListenerCount(event) {
            if (!this.events.has(event)) {
                return 0;
            }
            return this.events.get(event).length;
        }

        /**
         * Verificar si existe un evento
         * @param {string} event - Nombre del evento
         */
        hasEvent(event) {
            return this.events.has(event);
        }

        /**
         * Configurar modo debug
         * @param {boolean} enabled - Activar/desactivar debug
         */
        setDebugMode(enabled) {
            this.debugMode = enabled;
            console.log(`📡 Debug mode ${enabled ? 'activado' : 'desactivado'}`);
        }

        /**
         * Configurar máximo de listeners por evento
         * @param {number} max - Máximo de listeners
         */
        setMaxListeners(max) {
            this.maxListeners = max;
            console.log(`📡 Máximo de listeners configurado a ${max}`);
        }

        /**
         * Generar ID único para listener
         * @private
         */
        generateListenerId() {
            return 'listener_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }

        /**
         * Crear namespace para eventos
         * @param {string} namespace - Nombre del namespace
         * @returns {object} Namespace con métodos prefijados
         */
        namespace(namespace) {
            const self = this;
            
            return {
                on(event, callback, options) {
                    return self.on(`${namespace}:${event}`, callback, options);
                },
                once(event, callback, options) {
                    return self.once(`${namespace}:${event}`, callback, options);
                },
                off(event, identifier) {
                    return self.off(`${namespace}:${event}`, identifier);
                },
                emit(event, data, options) {
                    return self.emit(`${namespace}:${event}`, data, options);
                },
                emitAsync(event, data) {
                    return self.emitAsync(`${namespace}:${event}`, data);
                }
            };
        }

        /**
         * Estadísticas del EventBus
         */
        getStats() {
            const totalEvents = this.events.size;
            let totalListeners = 0;
            
            this.events.forEach(listeners => {
                totalListeners += listeners.length;
            });

            return {
                totalEvents,
                totalListeners,
                averageListenersPerEvent: totalEvents > 0 ? (totalListeners / totalEvents).toFixed(2) : 0,
                maxListeners: this.maxListeners,
                debugMode: this.debugMode
            };
        }
    }

    // Crear instancia global del EventBus
    window.Importadora.Core.EventBus = new EventBus();

    // Configurar modo debug en desarrollo
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.Importadora.Core.EventBus.setDebugMode(true);
    }

})(window);
