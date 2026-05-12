/**
 * Importadora Nissan - Utilidades de Formateo
 * Funciones compartidas para formatear datos en toda la aplicación
 */

(function(window) {
    'use strict';

    window.Importadora = window.Importadora || {};
    window.Importadora.Utils = window.Importadora.Utils || {};

    const Formatters = {

        /**
         * Formatear precio en USD
         */
        currency(amount, currency = 'USD') {
            if (!amount && amount !== 0) return 'N/A';
            return `${currency} ${Number(amount).toLocaleString()}`;
        },

        /**
         * Formatear fecha relativa (Hace X minutos/horas/días)
         */
        timeAgo(date) {
            const now = new Date();
            const diff = now - new Date(date);
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(diff / 3600000);
            const days = Math.floor(diff / 86400000);

            if (minutes < 1) return 'Ahora';
            if (minutes < 60) return `Hace ${minutes} min`;
            if (hours < 24) return `Hace ${hours} h`;
            return `Hace ${days} días`;
        },

        /**
         * Formatear hora HH:MM
         */
        time(date) {
            const d = date instanceof Date ? date : new Date(date);
            return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
        },

        /**
         * Formatear fecha DD/MM/YYYY
         */
        date(date) {
            const d = date instanceof Date ? date : new Date(date);
            return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
        },

        /**
         * Capitalizar primera letra
         */
        capitalize(str) {
            if (!str) return '';
            return str.charAt(0).toUpperCase() + str.slice(1);
        },

        /**
         * Truncar texto con ellipsis
         */
        truncate(str, maxLength = 50) {
            if (!str || str.length <= maxLength) return str || '';
            return str.slice(0, maxLength) + '...';
        },

        /**
         * Obtener clase CSS de estado de pedido
         */
        orderStatusClass(status) {
            const map = {
                'En Proceso': 'processing',
                'Pendiente': 'pending',
                'Entregado': 'completed',
                'Cotización': 'pending',
                'En Tránsito': 'processing'
            };
            return map[status] || 'pending';
        },

        /**
         * Obtener icono de rol
         */
        roleIcon(role) {
            const map = {
                admin: 'fa-user-shield',
                vendedor: 'fa-user-tie',
                cliente: 'fa-user'
            };
            return map[role] || 'fa-user';
        }
    };

    window.Importadora.Utils.Formatters = Formatters;

})(window);
