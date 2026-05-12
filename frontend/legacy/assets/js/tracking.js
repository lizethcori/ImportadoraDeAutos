// Tracking Module
let trackingMap;
let routeControl;
let markers = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeTracking();
    setupMapInteractions();
});

function initializeTracking() {
    console.log('=== initializeTracking START ===');
    
    // Initialize map when tracking section is active
    const trackingSection = document.getElementById('tracking');
    if (trackingSection) {
        // Check if map container exists
        const mapContainer = document.getElementById('trackingMap');
        if (mapContainer) {
            setupMap();
        }
    }
}

function setupMap() {
    console.log('=== setupMap START ===');
    
    // Asegurar que el contenedor tenga tamaño antes de inicializar
    const mapContainer = document.getElementById('trackingMap');
    if (!mapContainer) return;
    
    // Forzar dimensiones del contenedor para que ocupe todo el espacio
    const mapWrapper = mapContainer.parentElement;
    mapContainer.style.width = '100%';
    mapContainer.style.height = '100%';
    mapContainer.style.minHeight = '400px';
    mapContainer.style.position = 'absolute';
    mapContainer.style.top = '0';
    mapContainer.style.left = '0';
    mapContainer.style.right = '0';
    mapContainer.style.bottom = '0';
    
    // Inicializar el mapa centrado en Bolivia
    trackingMap = L.map('trackingMap', {
        center: [-17.3895, -66.1568],
        zoom: 6,
        zoomControl: true,
        preferCanvas: true
    });
    
    // Añadir capa de mapa optimizada con mejor rendimiento
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
        updateWhenIdle: true,
        updateWhenZooming: false,
        keepBuffer: 2,
        tileSize: 256,
        zoomOffset: 0,
        detectRetina: false
    }).addTo(trackingMap);
    
    // Forzar que el mapa ocupe todo el contenedor y ajustar vista
    setTimeout(() => {
        trackingMap.invalidateSize();
        // Ajustar vista para mostrar toda la ruta detallada
        const detailedRouteCoordinates = [
            [-20.2208, -70.1375], // Puerto Iquique
            [-20.1000, -70.0000], // Salida de Iquique
            [-19.8000, -69.8000], // Ruta hacia la frontera
            [-19.6000, -69.6000], // Aproximándose a Colchane
            [-19.4000, -68.6333], // Colchane
            [-19.3500, -68.6000], // Salida de Colchane
            [-19.2500, -68.5500], // Ruta intermedia
            [-19.1667, -68.5167], // Pisiga
            [-19.1000, -68.5000], // Salida de Pisiga
            [-18.8000, -68.2000], // Ruta hacia Oruro
            [-18.5000, -67.8000], // Continuación
            [-18.2000, -67.5000], // Aproximándose a Oruro
            [-17.9667, -67.1167], // Oruro
            [-17.9000, -67.0000], // Salida de Oruro
            [-17.5000, -67.5000], // Ruta intermedia
            [-17.2000, -67.8000], // Continuación
            [-16.8000, -68.0000], // Aproximándose a La Paz
            [-16.5000, -68.1500], // La Paz
            [-16.4000, -68.1000], // Salida de La Paz
            [-16.8000, -67.8000], // Ruta intermedia
            [-17.0000, -67.5000], // Continuación
            [-17.2000, -67.2000], // Más adelante
            [-17.3000, -66.8000], // Aproximándose
            [-17.3895, -66.1568]  // Cochabamba
        ];
        const bounds = L.latLngBounds(detailedRouteCoordinates);
        trackingMap.fitBounds(bounds, { padding: [20, 20] });
    }, 300);
    
    // Escuchar cambios de tamaño de ventana y ajustar mapa
    window.addEventListener('resize', () => {
        setTimeout(() => {
            trackingMap.invalidateSize();
            // Reajustar la vista al tamaño del contenedor con ruta detallada
            const detailedRouteCoordinates = [
                [-20.2208, -70.1375], [-20.1000, -70.0000], [-19.8000, -69.8000], [-19.6000, -69.6000],
                [-19.4000, -68.6333], [-19.3500, -68.6000], [-19.2500, -68.5500], [-19.1667, -68.5167],
                [-19.1000, -68.5000], [-18.8000, -68.2000], [-18.5000, -67.8000], [-18.2000, -67.5000],
                [-17.9667, -67.1167], [-17.9000, -67.0000], [-17.5000, -67.5000], [-17.2000, -67.8000],
                [-16.8000, -68.0000], [-16.5000, -68.1500], [-16.4000, -68.1000], [-16.8000, -67.8000],
                [-17.0000, -67.5000], [-17.2000, -67.2000], [-17.3000, -66.8000], [-17.3895, -66.1568]
            ];
            const bounds = L.latLngBounds(detailedRouteCoordinates);
            trackingMap.fitBounds(bounds, { padding: [20, 20] });
        }, 100);
    });
}

function setupMapInteractions() {
    console.log('=== setupMapInteractions START ===');
    
    // Coordenadas de las ubicaciones clave con marcadores mejorados
    const locations = {
        'origin': {
            name: 'Puerto Iquique, Chile',
            lat: -20.2208,
            lng: -70.1375,
            status: 'Punto de Partida',
            icon: 'fa-ship',
            color: '#28a745'
        },
        'colchane': {
            name: 'Control Colchane',
            lat: -19.4000,
            lng: -68.6333,
            status: 'Control Fronterizo',
            icon: 'fa-passport',
            color: '#ffc107'
        },
        'pisiga': {
            name: 'Control Pisiga',
            lat: -19.1667,
            lng: -68.5167,
            status: 'Control Fronterizo',
            icon: 'fa-passport',
            color: '#ffc107'
        },
        'oruro': {
            name: 'Depósito Oruro',
            lat: -17.9667,
            lng: -67.1167,
            status: 'En Depósito',
            icon: 'fa-warehouse',
            color: '#17a2b8'
        },
        'lapaz': {
            name: 'Transporte La Paz',
            lat: -16.5000,
            lng: -68.1500,
            status: 'En Transporte',
            icon: 'fa-truck',
            color: '#667eea'
        },
        'cochabamba': {
            name: 'Almacén Cochabamba',
            lat: -17.3895,
            lng: -66.1568,
            status: 'En Almacén',
            icon: 'fa-store',
            color: '#dc3545'
        },
        'current': {
            name: 'Ubicación Actual',
            lat: -19.4000,
            lng: -68.6333,
            status: 'En Tránsito',
            icon: 'fa-map-marker-alt',
            color: '#90EE90'
        }
    };
    
    // Añadir marcadores para cada ubicación con iconos personalizados
    Object.entries(locations).forEach(([key, location]) => {
        const isDestination = key === 'cochabamba';
        const isOrigin = key === 'origin';
        const isCurrent = key === 'current';
        
        const marker = L.marker([location.lat, location.lng], {
            icon: L.divIcon({
                html: `<div class="custom-marker ${key === 'current' ? 'current' : ''} ${isOrigin ? 'origin' : ''} ${isDestination ? 'destination' : ''}">
                        <i class="fas ${location.icon}"></i>
                        ${isOrigin ? '<span class="marker-label">ORIGEN</span>' : ''}
                        ${isDestination ? '<span class="marker-label">DESTINO</span>' : ''}
                        ${isCurrent ? '<span class="marker-label">ACTUAL</span>' : ''}
                    </div>`,
                className: 'custom-div-icon',
                iconSize: isOrigin || isDestination ? [50, 50] : [35, 35],
                iconAnchor: isOrigin || isDestination ? [25, 50] : [17, 35]
            })
        }).addTo(trackingMap);
        
        // Popup con información mejorada
        marker.bindPopup(`
            <div class="map-popup">
                <h4><i class="fas ${location.icon}" style="color: ${location.color}"></i> ${location.name}</h4>
                <p>Estado: <span class="status-${location.status.toLowerCase()}" style="color: ${location.color}">${location.status}</span></p>
                <small>Coordenadas: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}</small>
                ${isOrigin ? '<br><small><strong>Punto de Partida</strong></small>' : ''}
                ${isDestination ? '<br><small><strong>Destino Final</strong></small>' : ''}
                ${isCurrent ? '<br><small><strong>Ubicación Actual del Vehículo</strong></small>' : ''}
            </div>
        `);
        
        markers.push(marker);
    });
    
    // Crear ruta detallada estilo Google Maps con muchos puntos intermedios
    const detailedRouteCoordinates = [
        // Puerto Iquique a Colchane (ruta detallada)
        [-20.2208, -70.1375], // Puerto Iquique
        [-20.1000, -70.0000], // Salida de Iquique
        [-19.8000, -69.8000], // Ruta hacia la frontera
        [-19.6000, -69.6000], // Aproximándose a Colchane
        [-19.4000, -68.6333], // Colchane
        
        // Colchane a Pisiga
        [-19.3500, -68.6000], // Salida de Colchane
        [-19.2500, -68.5500], // Ruta intermedia
        [-19.1667, -68.5167], // Pisiga
        
        // Pisiga a Oruro (ruta detallada)
        [-19.1000, -68.5000], // Salida de Pisiga
        [-18.8000, -68.2000], // Ruta hacia Oruro
        [-18.5000, -67.8000], // Continuación
        [-18.2000, -67.5000], // Aproximándose a Oruro
        [-17.9667, -67.1167], // Oruro
        
        // Oruro a La Paz (ruta detallada)
        [-17.9000, -67.0000], // Salida de Oruro
        [-17.5000, -67.5000], // Ruta intermedia
        [-17.2000, -67.8000], // Continuación
        [-16.8000, -68.0000], // Aproximándose a La Paz
        [-16.5000, -68.1500], // La Paz
        
        // La Paz a Cochabamba (ruta detallada)
        [-16.4000, -68.1000], // Salida de La Paz
        [-16.8000, -67.8000], // Ruta intermedia
        [-17.0000, -67.5000], // Continuación
        [-17.2000, -67.2000], // Más adelante
        [-17.3000, -66.8000], // Aproximándose
        [-17.3895, -66.1568]  // Cochabamba (destino)
    ];
    
    // Crear línea de ruta principal estilo Google Maps (azul brillante)
    const routeLine = L.polyline(detailedRouteCoordinates, {
        color: '#4285F4', // Azul Google Maps
        weight: 5,
        opacity: 0.9,
        smoothFactor: 1,
        lineCap: 'round',
        lineJoin: 'round'
    }).addTo(trackingMap);
    
    // Añadir borde blanco para mayor visibilidad (estilo Google)
    const routeBorder = L.polyline(detailedRouteCoordinates, {
        color: '#FFFFFF',
        weight: 7,
        opacity: 1,
        smoothFactor: 1,
        lineCap: 'round',
        lineJoin: 'round'
    }).addTo(trackingMap);
    
    // Poner la línea azul sobre el borde blanco
    routeLine.bringToFront();
    
    // Añadir puntos intermedios pequeños para mostrar el camino
    detailedRouteCoordinates.forEach((coord, index) => {
        if (index % 3 === 0) { // Cada 3 puntos añadir un marcador pequeño
            L.circleMarker(coord, {
                radius: 3,
                fillColor: '#4285F4',
                color: '#FFFFFF',
                weight: 2,
                opacity: 1,
                fillOpacity: 1
            }).addTo(trackingMap);
        }
    });
    
    // Ajustar el zoom para mostrar toda la ruta detallada
    const bounds = L.latLngBounds(detailedRouteCoordinates);
    trackingMap.fitBounds(bounds, { padding: [50, 50] });
    
    // Añadir animación de movimiento en la ruta detallada
    animateRouteMovement(detailedRouteCoordinates);
}

function animateRouteMovement(coordinates) {
    let currentIndex = 0;
    
    setInterval(() => {
        if (currentIndex < coordinates.length - 1) {
            // Crear marcador animado que se mueve
            if (window.movingMarker) {
                trackingMap.removeLayer(window.movingMarker);
            }
            
            window.movingMarker = L.marker(coordinates[currentIndex], {
                icon: L.divIcon({
                    html: '<div class="moving-marker"><i class="fas fa-truck"></i></div>',
                    className: 'moving-div-icon',
                    iconSize: [40, 40],
                    iconAnchor: [20, 20]
                })
            }).addTo(trackingMap);
            
            currentIndex++;
        } else {
            currentIndex = 0; // Reiniciar al final
        }
    }, 3000); // Mover cada 3 segundos
}

// Functions for map controls
function resetMapView() {
    if (trackingMap) {
        const detailedRouteCoordinates = [
            [-20.2208, -70.1375], [-20.1000, -70.0000], [-19.8000, -69.8000], [-19.6000, -69.6000],
            [-19.4000, -68.6333], [-19.3500, -68.6000], [-19.2500, -68.5500], [-19.1667, -68.5167],
            [-19.1000, -68.5000], [-18.8000, -68.2000], [-18.5000, -67.8000], [-18.2000, -67.5000],
            [-17.9667, -67.1167], [-17.9000, -67.0000], [-17.5000, -67.5000], [-17.2000, -67.8000],
            [-16.8000, -68.0000], [-16.5000, -68.1500], [-16.4000, -68.1000], [-16.8000, -67.8000],
            [-17.0000, -67.5000], [-17.2000, -67.2000], [-17.3000, -66.8000], [-17.3895, -66.1568]
        ];
        const bounds = L.latLngBounds(detailedRouteCoordinates);
        trackingMap.fitBounds(bounds, { padding: [50, 50] });
    }
}

function toggleRouteVisibility() {
    console.log('Toggle route visibility - functionality would be implemented here');
}
