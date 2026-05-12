/**
 * Importadora Nissan - Map Service
 * Servicio para mapa de seguimiento con Leaflet.js
 */

(function(window) {
    'use strict';

    window.Importadora = window.Importadora || {};
    window.Importadora.Components = window.Importadora.Components || {};

    /**
     * Map Service - Gestión de mapa Leaflet
     */
    class MapService {
        constructor() {
            this.map = null;
            this.routeLine = null;
            this.markers = [];
            this.currentMarker = null;
            this.isInitialized = false;
        }

        /**
         * Coordenadas de la ruta de importación Chile → Bolivia
         */
        getRouteCoordinates() {
            return [
                [-20.2133, -70.1529], // Iquique, Chile (Puerto)
                [-19.4167, -68.9333], // Colchane, Chile (Control fronterizo)
                [-19.4167, -68.9333], // Pisiga, Bolivia (Control fronterizo)
                [-17.9667, -66.8333], // Oruro, Bolivia (Depósito)
                [-16.5000, -68.1500], // La Paz, Bolivia (Transporte)
                [-17.3895, -66.1568]  // Cochabamba, Bolivia (Almacén final)
            ];
        }

        /**
         * Información de cada punto de la ruta
         */
        getRoutePoints() {
            return [
                {
                    name: 'Puerto Iquique',
                    coords: [-20.2133, -70.1529],
                    type: 'origin',
                    description: 'Puerto de origen - Embarque del vehículo'
                },
                {
                    name: 'Control Colchane',
                    coords: [-19.4167, -68.9333],
                    type: 'checkpoint',
                    description: 'Control fronterizo Chile'
                },
                {
                    name: 'Control Pisiga',
                    coords: [-19.4167, -68.9333],
                    type: 'checkpoint',
                    description: 'Control fronterizo Bolivia'
                },
                {
                    name: 'Depósito Oruro',
                    coords: [-17.9667, -66.8333],
                    type: 'warehouse',
                    description: 'Depósito temporal en Oruro'
                },
                {
                    name: 'Transporte La Paz',
                    coords: [-16.5000, -68.1500],
                    type: 'transit',
                    description: 'En transporte hacia Cochabamba'
                },
                {
                    name: 'Almacén Cochabamba',
                    coords: [-17.3895, -66.1568],
                    type: 'destination',
                    description: 'Almacén final - Entrega al cliente'
                }
            ];
        }

        /**
         * Inicializar mapa
         * @param {string} containerId - ID del contenedor del mapa
         */
        async init(containerId = 'trackingMap') {
            if (this.isInitialized) {
                console.log('🗺️ Mapa ya inicializado');
                return this;
            }

            if (typeof L === 'undefined') {
                console.error('❌ Leaflet no está cargado');
                return this;
            }

            const container = document.getElementById(containerId);
            if (!container) {
                console.error('❌ Contenedor del mapa no encontrado:', containerId);
                return this;
            }

            // Destruir mapa anterior si existe
            if (this.map) {
                this.map.remove();
                this.map = null;
            }

            // Limpiar marcadores y ruta
            this.markers = [];
            this.routeLine = null;

            try {
                // Inicializar mapa centrado en el medio de la ruta
                this.map = L.map(containerId).setView([-18.5, -68.5], 6);

                // Agregar capa base de OpenStreetMap
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                    maxZoom: 18
                }).addTo(this.map);

                // Dibujar ruta inicial (async con OSRM)
                await this.drawRoute();

                // Agregar marcadores
                this.addMarkers();

                this.isInitialized = true;
                console.log('✅ Mapa inicializado correctamente');

                return this;
            } catch (error) {
                console.error('❌ Error al inicializar mapa:', error);
                return this;
            }
        }

        /**
         * Dibujar línea de ruta usando OSRM (rutas reales por carretera)
         */
        async drawRoute() {
            if (!this.map) return;

            // Verificar si ya hay ruta dibujada
            if (this.routeLine) return;

            const coordinates = this.getRouteCoordinates();

            // Convertir coordenadas a formato lng,lat para OSRM
            const osrmCoords = coordinates.map(coord => `${coord[1]},${coord[0]}`).join(';');

            try {
                // Hacer petición a OSRM API pública
                const response = await fetch(`http://router.project-osrm.org/route/v1/driving/${osrmCoords}?overview=full&geometries=polyline`);

                if (!response.ok) {
                    throw new Error('Error en OSRM API');
                }

                const data = await response.json();

                if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
                    // Decodificar geometría polyline
                    const geometry = data.routes[0].geometry;

                    if (typeof polyline !== 'undefined' && polyline.decode) {
                        // Decodificar usando librería polyline
                        const decodedCoords = polyline.decode(geometry);

                        // Dibujar ruta real por carretera
                        this.routeLine = L.polyline(decodedCoords, {
                            color: '#667eea',
                            weight: 4,
                            opacity: 0.7,
                            smoothFactor: 1
                        }).addTo(this.map);

                        console.log('✅ Ruta OSRM cargada correctamente');
                    } else {
                        throw new Error('Librería polyline no disponible');
                    }
                } else {
                    throw new Error('No se encontró ruta en OSRM');
                }
            } catch (error) {
                console.warn('⚠️ Error al cargar ruta OSRM, usando ruta recta:', error.message);

                // Fallback: usar ruta recta
                this.routeLine = L.polyline(coordinates, {
                    color: '#667eea',
                    weight: 4,
                    opacity: 0.7,
                    smoothFactor: 1
                }).addTo(this.map);

                console.log('✅ Usando ruta recta como fallback');
            }

            // Ajustar vista para mostrar toda la ruta
            this.map.fitBounds(this.routeLine.getBounds(), {
                padding: [50, 50]
            });
        }

        /**
         * Crear icono personalizado para marcador
         */
        createCustomIcon(type) {
            const colors = {
                origin: '#28a745',
                destination: '#dc3545',
                checkpoint: '#ffc107',
                warehouse: '#a855f7',
                transit: '#667eea',
                current: '#00d4ff'
            };

            const icons = {
                origin: 'fa-ship',
                destination: 'fa-warehouse',
                checkpoint: 'fa-clipboard-check',
                warehouse: 'fa-warehouse',
                transit: 'fa-truck',
                current: 'fa-truck'
            };

            const color = colors[type] || '#667eea';
            const iconClass = icons[type] || 'fa-map-marker-alt';

            return L.divIcon({
                className: 'custom-marker',
                html: `<div style="
                    background: ${color};
                    border: 3px solid white;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                    ${type === 'current' ? 'animation: pulse 2s infinite;' : ''}
                ">
                    <i class="fas ${iconClass}" style="color: white; font-size: 14px;"></i>
                </div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15],
                popupAnchor: [0, -20]
            });
        }

        /**
         * Agregar marcadores a la ruta
         */
        addMarkers() {
            if (!this.map) return;

            // Verificar si ya hay marcadores
            if (this.markers.length > 0) return;

            const points = this.getRoutePoints();

            points.forEach((point, index) => {
                const marker = L.marker(point.coords, {
                    icon: this.createCustomIcon(point.type)
                }).addTo(this.map);

                // Agregar popup con información
                const popupContent = `
                    <div style="min-width: 200px;">
                        <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
                            <i class="fas ${point.type === 'origin' ? 'fa-ship' : point.type === 'destination' ? 'fa-warehouse' : 'fa-map-marker-alt'}"></i>
                            ${point.name}
                        </h4>
                        <p style="margin: 4px 0; font-size: 12px; color: #666;">${point.description}</p>
                        <small style="color: #888; font-size: 11px; display: block; margin-top: 8px;">
                            Paso ${index + 1} de ${points.length}
                        </small>
                    </div>
                `;

                marker.bindPopup(popupContent);
                this.markers.push(marker);
            });
        }

        /**
         * Actualizar posición actual del vehículo
         * @param {number} progress - Progreso actual (0-100)
         * @param {string} status - Estado del pedido
         */
        updateCurrentPosition(progress, status) {
            if (!this.map) return;

            // Eliminar marcador anterior si existe
            if (this.currentMarker) {
                this.map.removeLayer(this.currentMarker);
            }

            // Calcular posición interpolada según progreso
            const coordinates = this.getRouteCoordinates();
            const totalSegments = coordinates.length - 1;
            const progressPerSegment = 100 / totalSegments;

            // Determinar segmento actual
            const currentSegment = Math.min(Math.floor(progress / progressPerSegment), totalSegments - 1);
            const segmentProgress = (progress % progressPerSegment) / progressPerSegment;

            // Interpolar coordenadas
            const startCoords = coordinates[currentSegment];
            const endCoords = coordinates[currentSegment + 1];
            const currentCoords = [
                startCoords[0] + (endCoords[0] - startCoords[0]) * segmentProgress,
                startCoords[1] + (endCoords[1] - startCoords[1]) * segmentProgress
            ];

            // Crear marcador de posición actual
            this.currentMarker = L.marker(currentCoords, {
                icon: this.createCustomIcon('current')
            }).addTo(this.map);

            // Popup con estado actual
            const popupContent = `
                <div style="min-width: 200px;">
                    <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
                        <i class="fas fa-truck"></i> Posición Actual
                    </h4>
                    <p style="margin: 4px 0; font-size: 12px; color: #666;">Estado: ${status}</p>
                    <p style="margin: 4px 0; font-size: 12px; color: #666;">Progreso: ${progress}%</p>
                </div>
            `;

            this.currentMarker.bindPopup(popupContent);

            // Centrar mapa en posición actual
            this.map.panTo(currentCoords, {
                animate: true,
                duration: 1
            });
        }

        /**
         * Resaltar paso específico de la ruta
         * @param {number} stepIndex - Índice del paso (0-based)
         */
        highlightStep(stepIndex) {
            if (!this.map || stepIndex < 0 || stepIndex >= this.markers.length) return;

            // Abrir popup del marcador
            this.markers[stepIndex].openPopup();

            // Centrar mapa en el marcador
            const coords = this.markers[stepIndex].getLatLng();
            this.map.panTo(coords, {
                animate: true,
                duration: 1
            });
        }

        /**
         * Destruir mapa y limpiar recursos
         */
        destroy() {
            if (this.map) {
                this.map.remove();
                this.map = null;
            }
            this.routeLine = null;
            this.markers = [];
            this.currentMarker = null;
            this.isInitialized = false;
            console.log('🗺️ Mapa destruido');
        }

        /**
         * Verificar si el mapa está inicializado
         */
        isReady() {
            return this.isInitialized && this.map !== null;
        }
    }

    // Crear instancia global
    window.Importadora.Components.MapService = new MapService();

    console.log('🗺️ Map Service cargado');

})(window);
