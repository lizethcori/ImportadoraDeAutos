/**
 * Importadora Nissan - Vehicle Service
 * Servicio simplificado para gestión de vehículos (sin caché)
 */

(function(window) {
    'use strict';

    window.Importadora = window.Importadora || {};
    window.Importadora.Services = window.Importadora.Services || {};

    /**
     * Vehicle Service - Gestión de vehículos
     * Wrapper simple sobre MockBackend, sin caché ni eventos excesivos
     */
    class VehicleService {
        constructor() {
            this.isInitialized = false;
        }

        /**
         * Inicializar el servicio
         */
        init() {
            this.isInitialized = true;
        }

        /**
         * Obtener todos los vehículos
         * @returns {Promise<Array>} Lista de vehículos
         */
        async getAll() {
            return await window.Importadora.Services.MockBackend.getVehicles();
        }

        /**
         * Obtener vehículo por ID
         * @param {number} id - ID del vehículo
         * @returns {Promise<object>} Vehículo encontrado
         */
        async getById(id) {
            return await window.Importadora.Services.MockBackend.getVehicleById(id);
        }

        /**
         * Buscar vehículos
         * @param {string} query - Término de búsqueda
         * @returns {Promise<Array>} Vehículos encontrados
         */
        async search(query) {
            if (!query || query.trim().length === 0) {
                return await this.getAll();
            }

            const allVehicles = await this.getAll();
            const lowerQuery = query.toLowerCase().trim();

            return allVehicles.filter(vehicle =>
                vehicle.brand.toLowerCase().includes(lowerQuery) ||
                vehicle.model.toLowerCase().includes(lowerQuery) ||
                vehicle.type.toLowerCase().includes(lowerQuery) ||
                vehicle.description.toLowerCase().includes(lowerQuery) ||
                vehicle.features.some(feature => feature.toLowerCase().includes(lowerQuery))
            );
        }

        /**
         * Filtrar vehículos por tipo
         * @param {string} type - Tipo de vehículo
         * @returns {Promise<Array>} Vehículos filtrados
         */
        async filterByType(type) {
            if (!type || type.trim().length === 0) {
                return await this.getAll();
            }

            const allVehicles = await this.getAll();
            const lowerType = type.toLowerCase().trim();

            return allVehicles.filter(vehicle => vehicle.type.toLowerCase() === lowerType);
        }

        /**
         * Filtrar vehículos por marca
         * @param {string} brand - Marca del vehículo
         * @returns {Promise<Array>} Vehículos filtrados
         */
        async filterByBrand(brand) {
            if (!brand || brand.trim().length === 0) {
                return await this.getAll();
            }

            const allVehicles = await this.getAll();
            const lowerBrand = brand.toLowerCase().trim();

            return allVehicles.filter(vehicle => vehicle.brand.toLowerCase() === lowerBrand);
        }

        /**
         * Obtener vehículos disponibles
         * @returns {Promise<Array>} Vehículos disponibles
         */
        async getAvailable() {
            const allVehicles = await this.getAll();
            return allVehicles.filter(vehicle => vehicle.available);
        }

        /**
         * Obtener vehículos por rango de precio
         * @param {number} minPrice - Precio mínimo
         * @param {number} maxPrice - Precio máximo
         * @returns {Promise<Array>} Vehículos en rango
         */
        async getByPriceRange(minPrice, maxPrice) {
            const allVehicles = await this.getAll();
            return allVehicles.filter(vehicle => vehicle.price >= minPrice && vehicle.price <= maxPrice);
        }

        /**
         * Obtener tipos de vehículos disponibles
         * @returns {Promise<Array>} Lista de tipos únicos
         */
        async getTypes() {
            const allVehicles = await this.getAll();
            return [...new Set(allVehicles.map(vehicle => vehicle.type))];
        }

        /**
         * Obtener marcas de vehículos disponibles
         * @returns {Promise<Array>} Lista de marcas únicas
         */
        async getBrands() {
            const allVehicles = await this.getAll();
            return [...new Set(allVehicles.map(vehicle => vehicle.brand))];
        }
    }

    // Crear instancia global del servicio
    window.Importadora.Services.VehicleService = new VehicleService();

})(window);
