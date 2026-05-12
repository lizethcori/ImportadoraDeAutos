/**
 * Importadora Nissan - Mock Users Data
 * Datos de usuarios extraídos del servidor real (server.js líneas 47-67) 
 * y usuarios de gestión (dashboard.js líneas 322-328)
 */

(function(window) {
    'use strict';

    window.Importadora = window.Importadora || {};
    window.Importadora.Data = window.Importadora.Data || {};

    // Usuarios de autenticación del servidor legacy (server.js:47-67)
    window.Importadora.Data.AuthUsers = [
        {
            id: '1',
            username: 'admin',
            role: 'admin',
            name: 'Administrador',
            email: 'admin@importadora.com'
        },
        {
            id: '2',
            username: 'vendedor',
            role: 'vendedor',
            name: 'Vendedor',
            email: 'vendedor@importadora.com'
        },
        {
            id: '3',
            username: 'cliente',
            role: 'cliente',
            name: 'Cliente',
            email: 'cliente@importadora.com'
        }
    ];

    // Usuarios de gestión del dashboard legacy (dashboard.js:322-328)
    window.Importadora.Data.ManagementUsers = [
        {
            id: 'ADM-001',
            name: 'Admin Principal',
            email: 'admin@importadora.com',
            role: 'admin',
            status: 'active',
            phone: '+591 70000000'
        },
        {
            id: 'VEN-001',
            name: 'Carlos Mendoza',
            email: 'carlos@importadora.com',
            role: 'vendedor',
            status: 'active',
            phone: '+591 70000001'
        },
        {
            id: 'VEN-002',
            name: 'Ana Rodríguez',
            email: 'ana@importadora.com',
            role: 'vendedor',
            status: 'active',
            phone: '+591 70000002'
        }
    ];

    // Contraseñas del servidor legacy (server.js:70-74)
    window.Importadora.Data.Passwords = {
        'admin': 'admin123',
        'vendedor': 'vendedor123',
        'cliente': 'cliente123'
    };

    // Combinar todos los usuarios en una sola estructura
    window.Importadora.Data.MockUsers = {
        // Usuarios para autenticación
        auth: window.Importadora.Data.AuthUsers,
        
        // Usuarios para gestión
        management: window.Importadora.Data.ManagementUsers,
        
        // Contraseñas (solo para mock backend)
        passwords: window.Importadora.Data.Passwords,
        
        // Todos los usuarios combinados
        all: [
            ...window.Importadora.Data.AuthUsers.map(user => ({
                ...user,
                status: user.status || 'active',
                phone: user.phone || null,
                source: 'auth'
            })),
            ...window.Importadora.Data.ManagementUsers.map(user => ({
                ...user,
                username: user.email.split('@')[0], // Generar username desde email
                source: 'management'
            }))
        ]
    };

    // Métodos de utilidad para usuarios
    window.Importadora.Data.MockUsers.methods = {
        // Autenticación
        authenticate: function(username, password) {
            const user = window.Importadora.Data.AuthUsers.find(u => u.username === username);
            const validPassword = window.Importadora.Data.Passwords[username];
            
            if (user && validPassword === password) {
                return { 
                    success: true, 
                    user: { ...user, password: undefined } // No devolver contraseña
                };
            }
            
            return { success: false, message: 'Usuario o contraseña incorrectos' };
        },

        // Obtener todos los usuarios
        getAll: function() {
            return window.Importadora.Data.MockUsers.all;
        },

        // Obtener por ID
        getById: function(id) {
            return window.Importadora.Data.MockUsers.all.find(u => u.id === id);
        },

        // Obtener por username
        getByUsername: function(username) {
            return window.Importadora.Data.AuthUsers.find(u => u.username === username);
        },

        // Obtener por rol
        getByRole: function(role) {
            return window.Importadora.Data.MockUsers.all.filter(u => u.role === role);
        },

        // Obtener usuarios de gestión
        getManagementUsers: function() {
            return window.Importadora.Data.ManagementUsers;
        },

        // Buscar usuarios
        search: function(query) {
            const lowerQuery = query.toLowerCase();
            return window.Importadora.Data.MockUsers.all.filter(u => 
                u.name?.toLowerCase().includes(lowerQuery) ||
                u.email.toLowerCase().includes(lowerQuery) ||
                u.role.toLowerCase().includes(lowerQuery) ||
                u.username?.toLowerCase().includes(lowerQuery)
            );
        },

        // Obtener usuarios por estado
        getByStatus: function(status) {
            return window.Importadora.Data.MockUsers.all.filter(u => u.status === status);
        }
    };

    console.log('👤 Mock Users cargados:', {
        auth: window.Importadora.Data.AuthUsers.length,
        management: window.Importadora.Data.ManagementUsers.length,
        total: window.Importadora.Data.MockUsers.all.length
    });

})(window);
