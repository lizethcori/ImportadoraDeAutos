/**
 * Importadora Nissan - Router SPA
 * Sistema de ruteo basado en hash con protección de rutas
 */

(function(window) {
    'use strict';

    window.Importadora = window.Importadora || {};
    window.Importadora.Core = window.Importadora.Core || {};

    /**
     * Router - Sistema de navegación SPA
     */
    class Router {
        constructor() {
            this.routes = new Map();
            this.currentRoute = null;
            this.history = [];
            this.defaultRoute = '/login';
            this.notFoundRoute = '/login';
            this.protectedRoutes = new Set();
            this.isInitialized = false;
            this.eventBus = null;
        }

        /**
         * Inicializar el router
         */
        init(eventBus) {
            console.log('🛣️ Inicializando Router...');
            
            this.eventBus = eventBus || window.Importadora.Core.EventBus;
            
            // Configurar rutas por defecto
            this.setupDefaultRoutes();
            
            // Escuchar cambios de hash
            window.addEventListener('hashchange', () => {
                this.handleRoute();
            });
            
            // Manejar navegación del browser
            window.addEventListener('popstate', () => {
                this.handleRoute();
            });
            
            // Procesar ruta inicial
            this.handleRoute();
            
            this.isInitialized = true;
            console.log('✅ Router inicializado');
        }

        /**
         * Configurar rutas por defecto
         */
        setupDefaultRoutes() {
            // Rutas públicas
            this.register('/login', () => this.handleLoginRoute());
            this.register('/404', () => this.handleNotFoundRoute());
            
            // Rutas protegidas
            this.register('/dashboard/admin', () => this.handleDashboardRoute('admin'));
            this.register('/dashboard/vendedor', () => this.handleDashboardRoute('vendedor'));
            this.register('/dashboard/cliente', () => this.handleDashboardRoute('cliente'));
            
            // Rutas adicionales
            this.register('/catalog', () => this.handleCatalogRoute());
            this.register('/orders', () => this.handleOrdersRoute());
            this.register('/tracking', () => this.handleTrackingRoute());
            
            // Marcar rutas protegidas
            this.protectedRoutes.add('/dashboard/admin');
            this.protectedRoutes.add('/dashboard/vendedor');
            this.protectedRoutes.add('/dashboard/cliente');
            this.protectedRoutes.add('/catalog');
            this.protectedRoutes.add('/orders');
            this.protectedRoutes.add('/tracking');
        }

        /**
         * Registrar una ruta
         * @param {string} path - Ruta (ej: '/login')
         * @param {function} handler - Función a ejecutar
         * @param {object} options - Opciones adicionales
         */
        register(path, handler, options = {}) {
            if (typeof handler !== 'function') {
                throw new Error('El handler debe ser una función');
            }

            // Normalizar ruta
            const normalizedPath = this.normalizePath(path);
            
            this.routes.set(normalizedPath, {
                handler,
                protected: options.protected || this.protectedRoutes.has(normalizedPath),
                title: options.title || this.generateTitle(normalizedPath),
                meta: options.meta || {}
            });

            console.log('🛣️ Ruta registrada:', normalizedPath, options.protected ? '(protegida)' : '(pública)');
        }

        /**
         * Navegar a una ruta
         * @param {string} path - Ruta a navegar
         * @param {object} options - Opciones de navegación
         */
        navigate(path, options = {}) {
            const normalizedPath = this.normalizePath(path);
            
            // Verificar si la ruta existe
            if (!this.routes.has(normalizedPath)) {
                console.warn('🛣️ Ruta no encontrada:', normalizedPath);
                this.navigate(this.notFoundRoute);
                return;
            }

            // Guardar en historial
            if (!options.replace) {
                this.history.push(this.currentRoute);
            }

            // Actualizar hash
            window.location.hash = normalizedPath;
            
            console.log('🛣️ Navegando a:', normalizedPath);
        }

        /**
         * Volver a la página anterior
         */
        back() {
            if (this.history.length > 0) {
                const previousRoute = this.history.pop();
                window.location.hash = previousRoute || this.defaultRoute;
                console.log('🛣️ Volviendo a:', previousRoute);
            } else {
                console.log('🛣️ No hay historial para volver');
            }
        }

        /**
         * Procesar la ruta actual
         */
        handleRoute() {
            const hash = window.location.hash.slice(1) || this.defaultRoute;
            const normalizedHash = this.normalizePath(hash);
            
            console.log('🛣️ Procesando ruta:', normalizedHash);

            // Verificar si la ruta existe
            if (!this.routes.has(normalizedHash)) {
                console.warn('🛣️ Ruta no encontrada, redirigiendo a 404');
                this.handleNotFoundRoute();
                return;
            }

            const route = this.routes.get(normalizedHash);
            
            // Verificar protección de ruta
            if (route.protected && !this.isAuthenticated()) {
                console.warn('🛣️ Ruta protegida, redirigiendo a login');
                this.eventBus.emit('router:unauthorized', { 
                    attemptedRoute: normalizedHash,
                    redirectTo: '/login'
                });
                this.navigate('/login');
                return;
            }

            // Verificar permisos de rol
            if (route.protected && !this.hasRequiredRole(normalizedHash)) {
                console.warn('🛣️ Permisos insuficientes');
                this.handleUnauthorizedRoute(normalizedHash);
                return;
            }

            // Ejecutar handler
            try {
                this.currentRoute = normalizedHash;
                
                // Actualizar título
                if (route.title) {
                    document.title = route.title;
                }

                // Emitir evento antes de cambiar ruta
                this.eventBus.emit('router:beforeChange', {
                    from: this.currentRoute,
                    to: normalizedHash,
                    route
                });

                // Ejecutar handler
                route.handler();

                // Emitir evento después de cambiar ruta
                this.eventBus.emit('router:changed', {
                    route: normalizedHash,
                    route
                });

                console.log('✅ Ruta procesada:', normalizedHash);

            } catch (error) {
                console.error('🛣️ Error al procesar ruta:', error);
                this.eventBus.emit('router:error', { 
                    route: normalizedHash, 
                    error 
                });
                this.handleNotFoundRoute();
            }
        }

        /**
         * Normalizar ruta
         * @private
         */
        normalizePath(path) {
            if (!path) return '/';
            
            // Asegurar que empiece con /
            if (!path.startsWith('/')) {
                path = '/' + path;
            }
            
            // Remover hash si existe
            if (path.startsWith('#')) {
                path = path.slice(1);
            }
            
            // Remover trailing slash excepto para root
            if (path.length > 1 && path.endsWith('/')) {
                path = path.slice(0, -1);
            }
            
            return path.toLowerCase();
        }

        /**
         * Verificar si hay sesión activa
         * @private
         */
        isAuthenticated() {
            // Esto se conectará con auth-service cuando esté disponible
            if (window.Importadora.Services?.AuthService) {
                return window.Importadora.Services.AuthService.isAuthenticated();
            }
            
            // Mientras tanto, verificar sessionStorage
            return sessionStorage.getItem('importadora_session') !== null;
        }

        /**
         * Verificar si el usuario tiene el rol requerido
         * @private
         */
        hasRequiredRole(route) {
            if (!window.Importadora.Services?.AuthService) {
                return true; // Mientras tanto, permitir todo
            }

            const user = window.Importadora.Services.AuthService.getCurrentUser();
            if (!user) return false;

            // Extraer rol requerido de la ruta
            if (route.includes('/dashboard/admin')) {
                return user.role === 'admin';
            } else if (route.includes('/dashboard/vendedor')) {
                return user.role === 'vendedor' || user.role === 'admin';
            } else if (route.includes('/dashboard/cliente')) {
                return user.role === 'cliente' || user.role === 'admin' || user.role === 'vendedor';
            }

            return true;
        }

        /**
         * Handlers de rutas específicas
         * @private
         */
        handleLoginRoute() {
            console.log('🔐 Mostrando login');
            if (window.Importadora.Views?.LoginView) {
                window.Importadora.Views.LoginView.show();
            } else {
                console.error('❌ LoginView no disponible');
                this.renderView('<div class="login-view"><h1>Login</h1><p>Error: LoginView no disponible</p></div>');
            }
        }

        handleDashboardRoute(role) {
            console.log('📊 Mostrando dashboard:', role);
            if (role === 'admin' && window.Importadora.Views?.AdminView) {
                window.Importadora.Views.AdminView.show();
            } else if (role === 'vendedor' && window.Importadora.Views?.SellerView) {
                window.Importadora.Views.SellerView.show();
            } else if (role === 'cliente' && window.Importadora.Views?.ClientView) {
                window.Importadora.Views.ClientView.show();
            } else {
                console.error('❌ Dashboard view no disponible para rol:', role);
                this.renderView(`<div class="dashboard-view"><h1>Dashboard ${role}</h1><p>Error: Vista no disponible</p></div>`);
            }
        }

        handleCatalogRoute() {
            console.log('🚗 Mostrando catálogo');
            this.renderView('<div class="catalog-view"><h1>Catálogo de Vehículos</h1><p>Listado de vehículos disponibles</p></div>');
        }

        handleOrdersRoute() {
            console.log('📦 Mostrando pedidos');
            this.renderView('<div class="orders-view"><h1>Mis Pedidos</h1><p>Listado de pedidos</p></div>');
        }

        handleTrackingRoute() {
            console.log('📍 Mostrando tracking');
            this.renderView('<div class="tracking-view"><h1>Seguimiento</h1><p>Estado de pedidos</p></div>');
        }

        handleNotFoundRoute() {
            console.log('❌ Página no encontrada');
            this.renderView('<div class="not-found-view"><h1>Página no encontrada</h1><p>Redirigiendo...</p></div>');
            
            // Redirigir después de 2 segundos
            setTimeout(() => {
                this.navigate(this.notFoundRoute);
            }, 2000);
        }

        handleUnauthorizedRoute(attemptedRoute) {
            console.log('🚫 Acceso no autorizado a:', attemptedRoute);
            this.renderView('<div class="unauthorized-view"><h1>Acceso Denegado</h1><p>No tienes permisos para acceder a esta página.</p></div>');
        }

        /**
         * Renderizar vista en el contenedor principal
         * @private
         */
        renderView(content) {
            const appContainer = document.getElementById('app');
            if (appContainer) {
                appContainer.innerHTML = content;
            } else {
                console.warn('🛣️ Contenedor #app no encontrado');
            }
        }

        /**
         * Generar título para la ruta
         * @private
         */
        generateTitle(path) {
            const titles = {
                '/login': 'Login - Importadora Nissan',
                '/dashboard/admin': 'Dashboard Admin - Importadora Nissan',
                '/dashboard/vendedor': 'Dashboard Vendedor - Importadora Nissan',
                '/dashboard/cliente': 'Dashboard Cliente - Importadora Nissan',
                '/catalog': 'Catálogo - Importadora Nissan',
                '/orders': 'Pedidos - Importadora Nissan',
                '/tracking': 'Seguimiento - Importadora Nissan',
                '/404': 'Página no encontrada - Importadora Nissan'
            };
            
            return titles[path] || 'Importadora Nissan';
        }

        /**
         * Obtener ruta actual
         */
        getCurrentRoute() {
            return this.currentRoute;
        }

        /**
         * Obtener historial de navegación
         */
        getHistory() {
            return [...this.history];
        }

        /**
         * Limpiar historial
         */
        clearHistory() {
            this.history = [];
            console.log('🛣️ Historial limpiado');
        }

        /**
         * Estadísticas del router
         */
        getStats() {
            return {
                initialized: this.isInitialized,
                totalRoutes: this.routes.size,
                protectedRoutes: this.protectedRoutes.size,
                currentRoute: this.currentRoute,
                historyLength: this.history.length,
                availableRoutes: Array.from(this.routes.keys())
            };
        }
    }

    // Crear instancia global del router
    window.Importadora.Core.Router = new Router();

    console.log('🛣️ Router cargado');

})(window);
