/**
 * Importadora Nissan - Mock Backend Service
 * Simula el backend real usando los datos mock extraídos del legacy
 */

(function(window) {
    'use strict';

    window.Importadora = window.Importadora || {};
    window.Importadora.Services = window.Importadora.Services || {};

    /**
     * Mock Backend Service
     * Simula llamadas a API con delays y respuestas realistas
     */
    class MockBackendService {
        constructor() {
            this.isInitialized = false;
            this.networkDelay = { min: 300, max: 500 };
            this.errorRate = 0; // Sin errores simulados en desarrollo
        }

        /**
         * Inicializar el servicio
         */
        init() {
            console.log('🌐 Inicializando Mock Backend Service...');
            
            // Verificar que los datos estén cargados
            if (!window.Importadora.Data?.MockVehicles || 
                !window.Importadora.Data?.MockUsers || 
                !window.Importadora.Data?.MockOrders) {
                throw new Error('Datos mock no encontrados. Asegúrate de cargar los archivos de datos primero.');
            }

            this.isInitialized = true;
            console.log('✅ Mock Backend Service inicializado');
        }

        /**
         * Simular delay de red
         */
        async simulateNetworkDelay(customDelay = null) {
            const delay = customDelay || 
                Math.floor(Math.random() * (this.networkDelay.max - this.networkDelay.min + 1)) + this.networkDelay.min;
            
            return new Promise(resolve => setTimeout(resolve, delay));
        }

        /**
         * Simular error aleatorio
         */
        simulateRandomError() {
            return Math.random() < this.errorRate;
        }

        /**
         * Autenticación de usuarios
         */
        async login(credentials) {
            console.log('🔐 Mock Backend: Login attempt', credentials.username);
            
            try {
                await this.simulateNetworkDelay();

                if (this.simulateRandomError()) {
                    throw new Error('Error de conexión simulado');
                }

                const result = window.Importadora.Data.MockUsers.methods.authenticate(
                    credentials.username, 
                    credentials.password
                );

                console.log('🔐 Mock Backend: Login result', result.success ? 'SUCCESS' : 'FAILED');
                return result;

            } catch (error) {
                console.error('🔐 Mock Backend: Login error', error);
                throw error;
            }
        }

        /**
         * Obtener todos los vehículos
         */
        async getVehicles() {
            console.log('🚗 Mock Backend: Getting all vehicles');
            
            try {
                await this.simulateNetworkDelay();

                if (this.simulateRandomError()) {
                    throw new Error('Error al cargar vehículos');
                }

                const vehicles = window.Importadora.Data.MockVehicles.methods.getAll();
                console.log('🚗 Mock Backend: Retrieved', vehicles.length, 'vehicles');
                
                return vehicles;

            } catch (error) {
                console.error('🚗 Mock Backend: Get vehicles error', error);
                throw error;
            }
        }

        /**
         * Obtener vehículo específico
         */
        async getVehicleById(id) {
            console.log('🚗 Mock Backend: Getting vehicle by ID', id);
            
            try {
                await this.simulateNetworkDelay();

                if (this.simulateRandomError()) {
                    throw new Error('Vehículo no encontrado');
                }

                const vehicle = window.Importadora.Data.MockVehicles.methods.getById(id);
                
                if (!vehicle) {
                    throw new Error('Vehículo no encontrado');
                }

                console.log('🚗 Mock Backend: Vehicle found', vehicle.model);
                return vehicle;

            } catch (error) {
                console.error('🚗 Mock Backend: Get vehicle error', error);
                throw error;
            }
        }

        /**
         * Agregar nuevo vehículo
         */
        async addVehicle(vehicleData) {
            console.log('🚗 Mock Backend: Adding vehicle', vehicleData);

            try {
                await this.simulateNetworkDelay(800);

                if (this.simulateRandomError()) {
                    throw new Error('Error al agregar vehículo');
                }

                // Agregar vehículo a los datos mock (estructura correcta: MockVehicles es un array directo)
                window.Importadora.Data.MockVehicles.push(vehicleData);

                console.log('🚗 Mock Backend: Vehicle added successfully', vehicleData.id);
                return { success: true, vehicle: vehicleData };

            } catch (error) {
                console.error('🚗 Mock Backend: Add vehicle error', error);
                throw error;
            }
        }

        /**
         * Eliminar vehículo
         */
        async deleteVehicle(vehicleId) {
            console.log('🚗 Mock Backend: Deleting vehicle', vehicleId);

            try {
                await this.simulateNetworkDelay(600);

                if (this.simulateRandomError()) {
                    throw new Error('Error al eliminar vehículo');
                }

                // Eliminar vehículo de los datos mock (estructura correcta: MockVehicles es un array directo)
                const vehicles = window.Importadora.Data.MockVehicles;
                const index = vehicles.findIndex(v => v.id === vehicleId);

                if (index === -1) {
                    throw new Error('Vehículo no encontrado');
                }

                vehicles.splice(index, 1);

                console.log('🚗 Mock Backend: Vehicle deleted successfully', vehicleId);
                return { success: true };

            } catch (error) {
                console.error('🚗 Mock Backend: Delete vehicle error', error);
                throw error;
            }
        }

        /**
         * Obtener todos los pedidos
         */
        async getOrders() {
            console.log('📦 Mock Backend: Getting all orders');
            
            try {
                await this.simulateNetworkDelay();

                if (this.simulateRandomError()) {
                    throw new Error('Error al cargar pedidos');
                }

                const orders = window.Importadora.Data.MockOrders.methods.getAll();
                console.log('📦 Mock Backend: Retrieved', orders.length, 'orders');
                
                return orders;

            } catch (error) {
                console.error('📦 Mock Backend: Get orders error', error);
                throw error;
            }
        }

        /**
         * Obtener pedido específico
         */
        async getOrderById(id) {
            console.log('📦 Mock Backend: Getting order by ID', id);
            
            try {
                await this.simulateNetworkDelay();

                if (this.simulateRandomError()) {
                    throw new Error('Pedido no encontrado');
                }

                const order = window.Importadora.Data.MockOrders.methods.getById(id);
                
                if (!order) {
                    throw new Error('Pedido no encontrado');
                }

                console.log('📦 Mock Backend: Order found', order.id);
                return order;

            } catch (error) {
                console.error('📦 Mock Backend: Get order error', error);
                throw error;
            }
        }

        /**
         * Obtener datos de tracking de un pedido
         */
        async getOrderTracking(orderId) {
            console.log('📍 Mock Backend: Getting order tracking', orderId);
            
            try {
                await this.simulateNetworkDelay();

                if (this.simulateRandomError()) {
                    throw new Error('Error al obtener tracking');
                }

                const trackingData = window.Importadora.Data.MockOrders.methods.getTrackingData(orderId);
                
                if (!trackingData) {
                    throw new Error('Tracking no encontrado');
                }

                console.log('📍 Mock Backend: Tracking data found', trackingData.status);
                return trackingData;

            } catch (error) {
                console.error('📍 Mock Backend: Get tracking error', error);
                throw error;
            }
        }

        /**
         * Obtener todos los usuarios (gestión)
         */
        async getUsers() {
            console.log('👥 Mock Backend: Getting all users');

            try {
                await this.simulateNetworkDelay();

                if (this.simulateRandomError()) {
                    throw new Error('Error al cargar usuarios');
                }

                const users = window.Importadora.Data.MockUsers.methods.getAll();
                console.log('👥 Mock Backend: Retrieved', users.length, 'users');

                return users;

            } catch (error) {
                console.error('👥 Mock Backend: Get users error', error);
                throw error;
            }
        }

        /**
         * Agregar nuevo usuario
         */
        async addUser(userData) {
            console.log('👥 Mock Backend: Adding user', userData);

            try {
                await this.simulateNetworkDelay(800);

                if (this.simulateRandomError()) {
                    throw new Error('Error al agregar usuario');
                }

                // Agregar usuario a los datos mock (estructura correcta)
                // Agregar a all (que combina auth y management)
                window.Importadora.Data.MockUsers.all.push(userData);

                // Si es un usuario de gestión (no de auth), también agregar a management
                if (userData.role !== 'admin' && userData.role !== 'vendedor') {
                    window.Importadora.Data.MockUsers.management.push(userData);
                }

                console.log('👥 Mock Backend: User added successfully', userData.id);
                return { success: true, user: userData };

            } catch (error) {
                console.error('👥 Mock Backend: Add user error', error);
                throw error;
            }
        }

        /**
         * Eliminar usuario
         */
        async deleteUser(userId) {
            console.log('👥 Mock Backend: Deleting user', userId);

            try {
                await this.simulateNetworkDelay(600);

                if (this.simulateRandomError()) {
                    throw new Error('Error al eliminar usuario');
                }

                // Eliminar usuario de los datos mock (estructura correcta)
                const allUsers = window.Importadora.Data.MockUsers.all;
                const index = allUsers.findIndex(u => u.id === userId);

                if (index === -1) {
                    throw new Error('Usuario no encontrado');
                }

                allUsers.splice(index, 1);

                // También eliminar de management si está allí
                const managementUsers = window.Importadora.Data.MockUsers.management;
                const managementIndex = managementUsers.findIndex(u => u.id === userId);
                if (managementIndex !== -1) {
                    managementUsers.splice(managementIndex, 1);
                }

                console.log('👥 Mock Backend: User deleted successfully', userId);
                return { success: true };

            } catch (error) {
                console.error('👥 Mock Backend: Delete user error', error);
                throw error;
            }
        }

        /**
         * Simular creación de pedido
         */
        async createOrder(orderData) {
            console.log('📦 Mock Backend: Creating order', orderData);
            
            try {
                await this.simulateNetworkDelay(800); // Creación toma más tiempo

                if (this.simulateRandomError()) {
                    throw new Error('Error al crear pedido');
                }

                // Generar nuevo ID
                const newId = 'ORD-' + String(Date.now()).slice(-3);
                const newOrder = {
                    id: newId,
                    ...orderData,
                    date: new Date().toISOString().split('T')[0],
                    status: 'COTIZACIÓN',
                    location: 'Oficina Central',
                    progress: 10,
                    currentStep: 1
                };

                console.log('📦 Mock Backend: Order created', newId);
                return { success: true, order: newOrder };

            } catch (error) {
                console.error('📦 Mock Backend: Create order error', error);
                throw error;
            }
        }

        /**
         * Configurar delays de red
         */
        setNetworkDelay(min, max) {
            this.networkDelay = { min, max };
            console.log('🌐 Network delay configurado:', min + 'ms - ' + max + 'ms');
        }

        /**
         * Configurar tasa de error
         */
        setErrorRate(rate) {
            this.errorRate = Math.max(0, Math.min(1, rate));
            console.log('🌐 Error rate configurado:', (this.errorRate * 100) + '%');
        }

        /**
         * Obtener estadísticas del servicio
         */
        getStats() {
            return {
                initialized: this.isInitialized,
                networkDelay: this.networkDelay,
                errorRate: this.errorRate,
                availableEndpoints: [
                    'login()',
                    'getVehicles()',
                    'getVehicleById()',
                    'addVehicle()',
                    'deleteVehicle()',
                    'getOrders()',
                    'getOrderById()',
                    'getOrderTracking()',
                    'getUsers()',
                    'addUser()',
                    'deleteUser()',
                    'createOrder()'
                ]
            };
        }
    }

    // Crear instancia global del servicio
    window.Importadora.Services.MockBackend = new MockBackendService();

    // Auto-inicialización
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.Importadora.Services.MockBackend.init();
        });
    } else {
        window.Importadora.Services.MockBackend.init();
    }

    console.log('🌐 Mock Backend Service cargado');

})(window);
