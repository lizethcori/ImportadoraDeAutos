/**
 * Importadora Nissan - Toast Component
 * Componente reutilizable de notificaciones toast
 */

(function(window) {
    'use strict';

    window.Importadora = window.Importadora || {};
    window.Importadora.Components = window.Importadora.Components || {};

    class Toast {
        constructor() {
            this.queue = [];
            this.isShowing = false;
        }

        /**
         * Mostrar toast de éxito
         */
        success(message) {
            this.show(message, 'success');
        }

        /**
         * Mostrar toast de error
         */
        error(message) {
            this.show(message, 'error');
        }

        /**
         * Mostrar toast informativo
         */
        info(message) {
            this.show(message, 'info');
        }

        /**
         * Mostrar toast genérico
         */
        show(message, type = 'info', duration = 3000) {
            const icons = {
                success: 'fa-check-circle',
                error: 'fa-exclamation-circle',
                info: 'fa-info-circle'
            };

            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.innerHTML = `
                <i class="fas ${icons[type] || icons.info}"></i>
                <span>${message}</span>
            `;
            document.body.appendChild(toast);

            // Trigger animation
            requestAnimationFrame(() => {
                toast.classList.add('show');
            });

            // Auto-dismiss
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }
    }

    // Singleton
    window.Importadora.Components.Toast = new Toast();

})(window);
