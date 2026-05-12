/**
 * Importadora Nissan - Mock Vehicles Data
 * Datos de vehículos extraídos del servidor real (server.js líneas 91-188)
 */

(function(window) {
    'use strict';

    window.Importadora = window.Importadora || {};
    window.Importadora.Data = window.Importadora.Data || {};

    // Datos de vehículos de importación
    window.Importadora.Data.MockVehicles = [
        {
            id: 1,
            brand: 'Nissan',
            model: 'Atlas 2024',
            year: 2024,
            price: 85000,
            type: 'Camión',
            transmission: 'Automática',
            fuel: 'Diesel',
            seats: 3,
            color: 'Blanco',
            image: '/assets/images/nissan-atlas-2024.jpg',
            description: 'Camión pesado de alta capacidad ideal para transporte de carga a larga distancia.',
            features: ['Motor 6 cilindros', 'Cabina amplia', 'Sistema de frenos ABS', 'GPS integrado'],
            available: true
        },
        {
            id: 2,
            brand: 'Nissan',
            model: 'Big Thumb 2024',
            year: 2024,
            price: 92000,
            type: 'Camión',
            transmission: 'Manual',
            fuel: 'Diesel',
            seats: 2,
            color: 'Rojo',
            image: '/assets/images/nissan-big-thumb-2024.jpg',
            description: 'Camión de gran tonelaje con potencia superior para cargas pesadas.',
            features: ['Motor turbodiésel', 'Suspensión reforzada', 'Quinta rueda', 'Cabina doble'],
            available: true
        },
        {
            id: 3,
            brand: 'Nissan',
            model: 'Condor 2024',
            year: 2024,
            price: 78000,
            type: 'Camión',
            transmission: 'Manual',
            fuel: 'Diesel',
            seats: 2,
            color: 'Azul',
            image: '/assets/images/nissan-condor-2024.jpg',
            description: 'Camión versátil con gran capacidad de carga para distribución urbana e interurbana.',
            features: ['Carrocería adaptable', 'Motor eficiente', 'Frenos de disco', 'Caja de cambios síncrona'],
            available: true
        },
        {
            id: 4,
            brand: 'Nissan',
            model: 'CWA 2024',
            year: 2024,
            price: 110000,
            type: 'Camión',
            transmission: 'Automática',
            fuel: 'Diesel',
            seats: 2,
            color: 'Blanco',
            image: '/assets/images/nissan-cwa-2024.jpg',
            description: 'Tractocamión de alto rendimiento para transporte pesado internacional.',
            features: ['Cabina avanzada', 'Motor 500HP', 'Retarder', 'Sistema de telemetría'],
            available: true
        },
        {
            id: 5,
            brand: 'Nissan',
            model: 'PKG 2024',
            year: 2024,
            price: 68000,
            type: 'Camión',
            transmission: 'Manual',
            fuel: 'Diesel',
            seats: 2,
            color: 'Gris',
            image: '/assets/images/nissan-pkg-2024.jpg',
            description: 'Camión mediano perfecto para distribución y logística regional.',
            features: ['Caja seca 8m', 'Rampa de carga', 'Climatizador cabina', 'Sistema de monitoreo'],
            available: false
        },
        {
            id: 6,
            brand: 'Nissan',
            model: 'Quon 2024',
            year: 2024,
            price: 125000,
            type: 'Camión',
            transmission: 'Automática',
            fuel: 'Diesel',
            seats: 2,
            color: 'Blanco',
            image: '/assets/images/nissan-quon-2024.jpg',
            description: 'Camión premium de largo recorrido con tecnología de punta y máximo confort.',
            features: ['Cama doble en cabina', 'Motor Euro VI', 'Frenos EBS', 'Control de crucero adaptativo'],
            available: true
        },
        {
            id: 7,
            brand: 'Nissan',
            model: 'Resona 2024',
            year: 2024,
            price: 95000,
            type: 'Camión',
            transmission: 'Automática',
            fuel: 'Diesel',
            seats: 2,
            color: 'Plateado',
            image: '/assets/images/nissan-resona-2024.jpg',
            description: 'Camión multipropósito con diseño aerodinámico y bajo consumo de combustible.',
            features: ['Aerodinámico', 'Sistema de navegación', 'Cámara de retroceso', 'Control de estabilidad'],
            available: true
        }
    ];

    // Métodos de utilidad para vehículos
    window.Importadora.Data.MockVehicles.methods = {
        getAll: function() {
            return window.Importadora.Data.MockVehicles;
        },

        getById: function(id) {
            return window.Importadora.Data.MockVehicles.find(v => v.id === parseInt(id));
        },

        getByType: function(type) {
            return window.Importadora.Data.MockVehicles.filter(v => v.type === type);
        },

        getAvailable: function() {
            return window.Importadora.Data.MockVehicles.filter(v => v.available);
        },

        getByBrand: function(brand) {
            return window.Importadora.Data.MockVehicles.filter(v => v.brand === brand);
        },

        search: function(query) {
            const lowerQuery = query.toLowerCase();
            return window.Importadora.Data.MockVehicles.filter(v => 
                v.brand.toLowerCase().includes(lowerQuery) ||
                v.model.toLowerCase().includes(lowerQuery) ||
                v.type.toLowerCase().includes(lowerQuery) ||
                v.description.toLowerCase().includes(lowerQuery)
            );
        }
    };

    console.log('📗 Mock Vehicles cargados:', window.Importadora.Data.MockVehicles.length, 'vehículos');

})(window);
