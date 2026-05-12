/**
 * Importadora Nissan - Base View
 * Clase base para todas las vistas del dashboard
 * Proporciona funcionalidad común: init, showSection, logout, destroy
 */

(function(window) {
    'use strict';

    window.Importadora = window.Importadora || {};
    window.Importadora.Core = window.Importadora.Core || {};

    /**
     * Base View Class
     * Clase base para todas las vistas de dashboard (admin, seller, client)
     */
    class BaseView {
        constructor() {
            this.eventBus = null;
            this.authService = null;
            this.router = null;
            this.currentUser = null;
        }

        /**
         * Inicializar la vista
         * Obtiene referencias a servicios globales
         */
        init() {
            this.eventBus = window.Importadora.Core.EventBus;
            this.authService = window.Importadora.Services.AuthService;
            this.router = window.Importadora.Core.Router;
            this.currentUser = this.authService.getCurrentUser();
        }

        /**
         * Mostrar la vista
         * Flujo: render -> loadData -> setupEvents
         * Las clases hijas deben implementar render() y loadData()
         */
        async show() {
            this.render();
            await this.loadData();
            this.setupEvents();
        }

        /**
         * Renderizar la vista
         * Debe ser implementado por las clases hijas
         */
        render() {
            throw new Error('render() debe ser implementado por la clase hija');
        }

        /**
         * Cargar datos necesarios para la vista
         * Debe ser implementado por las clases hijas
         */
        async loadData() {
            // Override en clases hijas
        }

        /**
         * Configurar eventos de la vista
         * Configura eventos comunes: logout y navegación sidebar
         * Las clases hijas pueden extender para agregar más eventos
         */
        setupEvents() {
            this._setupLogout();
            this._setupNavigation();
        }

        /**
         * Configurar botón de logout
         * @private
         */
        _setupLogout() {
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => this.logout());
            }
        }

        /**
         * Configurar navegación del sidebar
         * @private
         */
        _setupNavigation() {
            document.querySelectorAll('.nav-link[data-section]').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showSection(link.getAttribute('data-section'));
                });
            });
        }

        /**
         * Mostrar una sección específica del dashboard
         * @param {string} sectionId - ID de la sección a mostrar
         */
        showSection(sectionId) {
            window.Importadora.Utils.DOM.showSection(sectionId);
        }

        /**
         * Cerrar sesión y navegar al login
         */
        logout() {
            this.authService.logout();
            this.router.navigate('/login');
        }

        /**
         * Limpiar recursos de la vista
         * Llamado cuando se abandona la vista
         */
        destroy() {
            // Override en clases hijas si es necesario
        }
    }

    // Exportar
    window.Importadora.Core.BaseView = BaseView;

})(window);
