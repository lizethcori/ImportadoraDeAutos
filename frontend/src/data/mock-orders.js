/**
 * Importadora Nissan - Mock Orders Data
 * Datos de pedidos extraídos del frontend legacy (dashboard-client.js líneas 45-62)
 * Con campos adicionales basados en los pedidos mostrados en el HTML
 */

(function(window) {
    'use strict';

    window.Importadora = window.Importadora || {};
    window.Importadora.Data = window.Importadora.Data || {};

    // Datos de tracking del frontend legacy (dashboard-client.js:45-62)
    const legacyOrderData = {
        'ORD-001': {
            status: 'EN TRANSPORTE',
            location: 'Control Colchane',
            progress: 40,
            currentStep: 3
        },
        'ORD-002': {
            status: 'COTIZACIÓN',
            location: 'Oficina Central',
            progress: 10,
            currentStep: 1
        },
        'ORD-003': {
            status: 'ENTREGADO',
            location: 'Almacén Cochabamba',
            progress: 100,
            currentStep: 9
        }
    };

    // Datos de vehículos de los pedidos (extraídos de los HTML de dashboards)
    const orderVehicles = {
        'ORD-001': 'Nissan Big Thumb 2024',
        'ORD-002': 'Nissan Diesel UD 2024',
        'ORD-003': 'Nissan Atlas 2024'
    };

    // Pedidos completos combinando datos legacy
    window.Importadora.Data.MockOrders = [
        {
            id: 'ORD-001',
            vehicle: 'Nissan Big Thumb 2024',
            client: 'Cliente Demo', // Cliente por defecto para demo
            date: '2024-01-15',
            status: 'EN TRANSPORTE',
            location: 'Control Colchane',
            progress: 40,
            currentStep: 3,
            price: 45000, // Precio estimado
            type: 'Camión',
            priority: 'normal',
            notes: 'Pedido en proceso de importación',
            documents: [
                {
                    id: 'doc-001',
                    name: 'Factura_ORD-001.pdf',
                    type: 'pdf',
                    size: '2.5 MB',
                    uploadDate: '2024-01-15'
                },
                {
                    id: 'doc-002',
                    name: 'Poliza_Aduana.pdf',
                    type: 'pdf',
                    size: '1.8 MB',
                    uploadDate: '2024-01-16'
                }
            ]
        },
        {
            id: 'ORD-002',
            vehicle: 'Nissan Diesel UD 2024',
            client: 'Empresa Transporte S.A.',
            date: '2024-02-20',
            status: 'COTIZACIÓN',
            location: 'Oficina Central',
            progress: 10,
            currentStep: 1,
            price: 38000,
            type: 'Camión',
            priority: 'high',
            notes: 'Esperando confirmación de cliente',
            documents: []
        },
        {
            id: 'ORD-003',
            vehicle: 'Nissan Atlas 2024',
            client: 'Logística Boliviana Ltd.',
            date: '2023-12-10',
            status: 'ENTREGADO',
            location: 'Almacén Cochabamba',
            progress: 100,
            currentStep: 9,
            price: 52000,
            type: 'Camión',
            priority: 'normal',
            notes: 'Entregado exitosamente',
            documents: [
                {
                    id: 'doc-003',
                    name: 'Factura_ORD-003.pdf',
                    type: 'pdf',
                    size: '3.1 MB',
                    uploadDate: '2023-12-10'
                }
            ]
        }
    ];

    // Estados posibles de pedidos
    window.Importadora.Data.OrderStatuses = [
        'COTIZACIÓN',
        'CONFIRMADO',
        'EN PUERTO IQUIQUE',
        'CONTROL COLCHANE',
        'EN TRANSPORTE',
        'CONTROL PISIGA',
        'EN DEPÓSITO ORURO',
        'EN TRANSPORTE LA PAZ',
        'EN ALMACÉN COCHABAMBA',
        'ENTREGADO'
    ];

    // Ubicaciones del proceso de importación
    window.Importadora.Data.OrderLocations = [
        'Oficina Central',
        'Puerto Iquique',
        'Control Colchane',
        'Control Pisiga',
        'Depósito Oruro',
        'Transporte La Paz',
        'Almacén Cochabamba'
    ];

    // Métodos de utilidad para pedidos
    window.Importadora.Data.MockOrders.methods = {
        // Obtener todos los pedidos
        getAll: function() {
            return window.Importadora.Data.MockOrders;
        },

        // Obtener por ID
        getById: function(id) {
            return window.Importadora.Data.MockOrders.find(o => o.id === id);
        },

        // Obtener por cliente
        getByClient: function(client) {
            return window.Importadora.Data.MockOrders.filter(o => 
                o.client.toLowerCase().includes(client.toLowerCase())
            );
        },

        // Obtener por estado
        getByStatus: function(status) {
            return window.Importadora.Data.MockOrders.filter(o => o.status === status);
        },

        // Obtener por tipo de vehículo
        getByVehicleType: function(type) {
            return window.Importadora.Data.MockOrders.filter(o => o.type === type);
        },

        // Obtener pedidos activos (no entregados)
        getActive: function() {
            return window.Importadora.Data.MockOrders.filter(o => o.status !== 'ENTREGADO');
        },

        // Obtener pedidos completados
        getCompleted: function() {
            return window.Importadora.Data.MockOrders.filter(o => o.status === 'ENTREGADO');
        },

        // Buscar pedidos
        search: function(query) {
            const lowerQuery = query.toLowerCase();
            return window.Importadora.Data.MockOrders.filter(o => 
                o.id.toLowerCase().includes(lowerQuery) ||
                o.vehicle.toLowerCase().includes(lowerQuery) ||
                o.client.toLowerCase().includes(lowerQuery) ||
                o.status.toLowerCase().includes(lowerQuery) ||
                o.location.toLowerCase().includes(lowerQuery)
            );
        },

        // Obtener por prioridad
        getByPriority: function(priority) {
            return window.Importadora.Data.MockOrders.filter(o => o.priority === priority);
        },

        // Obtener tracking data (compatible con legacy)
        getTrackingData: function(orderId) {
            const order = this.getById(orderId);
            if (order) {
                return {
                    status: order.status,
                    location: order.location,
                    progress: order.progress,
                    currentStep: order.currentStep
                };
            }
            return null;
        }
    };

    console.log('📦 Mock Orders cargados:', window.Importadora.Data.MockOrders.length, 'pedidos');

})(window);
