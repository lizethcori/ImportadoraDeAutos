// Dashboard Vendedor JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!auth.isAuthenticated()) {
        window.location.href = '../pages/index.html';
        return;
    }

    // Check if user is vendedor
    const currentUser = auth.getCurrentUser();
    if (currentUser.role !== 'vendedor') {
        auth.showMessage('No tienes permisos para acceder a esta página', 'error');
        setTimeout(() => {
            window.location.href = '../pages/index.html';
        }, 2000);
        return;
    }

    // Update user info
    updateUserInfo();

    // Setup navigation
    setupNavigation();

    // Setup logout
    setupLogout();

    // Load initial data
    loadSellerData();

    console.log('Dashboard vendedor loaded');
});

// Funciones para el Modal de Seguimiento
function showOrderTracking(orderId) {
    // Cargar datos específicos del pedido
    loadOrderTrackingData(orderId);
    
    // Mostrar modal
    const modal = document.getElementById('trackingModal');
    if (modal) {
        modal.style.display = 'block';
        
        // Inicializar mapa si es necesario
        setTimeout(() => {
            initializeModalMap();
        }, 100);
    }
}

function closeTrackingModal() {
    const modal = document.getElementById('trackingModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function loadOrderTrackingData(orderId) {
    // Datos de ejemplo para diferentes pedidos
    const orderData = {
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
    
    const data = orderData[orderId] || orderData['ORD-001'];
    
    // Actualizar estado y ubicación
    const statusElement = document.getElementById('modalCurrentStatus');
    const locationElement = document.getElementById('modalCurrentLocation');
    const progressElement = document.getElementById('modalProgressFill');
    
    if (statusElement) statusElement.textContent = data.status;
    if (locationElement) locationElement.textContent = data.location;
    if (progressElement) progressElement.style.width = data.progress + '%';
    
    // Actualizar pasos del progreso
    updateProgressSteps(data.currentStep);
}

function updateProgressSteps(currentStep) {
    const steps = document.querySelectorAll('#trackingModal .step');
    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        const icon = step.querySelector('.step-icon');
        
        if (stepNumber < currentStep) {
            // Pasos completados
            step.classList.add('completed');
            icon.innerHTML = '<i class="fas fa-check"></i>';
        } else if (stepNumber === currentStep) {
            // Paso actual
            step.classList.add('active');
            icon.innerHTML = '<i class="fas fa-clock"></i>';
        } else {
            // Pasos futuros
            step.classList.remove('completed', 'active');
        }
    });
}

function initializeModalMap() {
    const mapContainer = document.getElementById('modalTrackingMap');
    if (!mapContainer || mapContainer._leaflet) return; // Evitar inicialización múltiple
    
    // Inicializar mapa (similar al del dashboard cliente)
    const map = L.map('modalTrackingMap').setView([-16.290154, -63.588653], 5);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Guardar referencia al mapa
    mapContainer._leaflet = map;
    
    // Agregar marcadores de ruta (ejemplo)
    const routePoints = [
        {lat: -20.220633, lng: -70.147321, name: "Iquique, Chile"},
        {lat: -19.571940, lng: -65.755943, name: "Colchane, Bolivia"},
        {lat: -17.966831, lng: -67.110236, name: "Oruro, Bolivia"},
        {lat: -16.500000, lng: -68.150000, name: "La Paz, Bolivia"},
        {lat: -17.413977, lng: -66.165321, name: "Cochabamba, Bolivia"}
    ];
    
    routePoints.forEach(point => {
        L.marker([point.lat, point.lng])
            .addTo(map)
            .bindPopup(point.name);
    });
}

function resetModalMapView() {
    const mapContainer = document.getElementById('modalTrackingMap');
    if (mapContainer && mapContainer._leaflet) {
        mapContainer._leaflet.setView([-16.290154, -63.588653], 5);
    }
}

function toggleModalRouteVisibility() {
    // Implementar visibilidad de ruta si es necesario
    console.log('Toggle route visibility');
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('trackingModal');
    if (event.target === modal) {
        closeTrackingModal();
    }
}

function updateUserInfo() {
    const currentUser = auth.getCurrentUser();
    const userNameElement = document.getElementById('userName');
    if (userNameElement && currentUser) {
        userNameElement.textContent = auth.formatUserName(currentUser);
    }
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all links
            navLinks.forEach(l => l.parentElement.classList.remove('active'));

            // Add active class to clicked link
            this.parentElement.classList.add('active');

            // Show corresponding section
            const sectionId = this.dataset.section;
            showSection(sectionId);
        });
    });
}

function setupLogout() {
    const logoutBtn = document.querySelector('button[onclick="logout()"]');
    if (logoutBtn) {
        logoutBtn.onclick = function(e) {
            e.preventDefault();
            auth.logout();
        };
    }
}

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));

    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
}

function loadSellerData() {
    // Mock seller data
    const sellerStats = {
        monthlySales: 45280,
        activeClients: 28,
        pendingOrders: 12,
        salesGoal: 85,
        commission: 3450,
        thisMonthCommission: 2280,
        lastMonthCommission: 1170
    };

    // Update stats
    updateSellerStats(sellerStats);

    // Load clients
    loadClients();

    // Load vehicles
    loadVehicles();
}

function updateSellerStats(stats) {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 4) {
        statNumbers[0].textContent = `$${stats.monthlySales.toLocaleString()}`;
        statNumbers[1].textContent = stats.activeClients;
        statNumbers[2].textContent = stats.pendingOrders;
        statNumbers[3].textContent = `${stats.salesGoal}%`;
    }

    // Update commission
    const commissionAmount = document.querySelector('.commission-amount');
    if (commissionAmount) {
        commissionAmount.textContent = `$${stats.commission.toLocaleString()}`;
    }

    const commissionDetails = document.querySelector('.commission-details');
    if (commissionDetails) {
        commissionDetails.innerHTML = `
            <p>Este mes: $${stats.thisMonthCommission.toLocaleString()}</p>
            <p>Mes anterior: $${stats.lastMonthCommission.toLocaleString()}</p>
        `;
    }
}

function loadClients() {
    // Mock client data
    const clients = [
        {
            name: 'Juan Pérez',
            email: 'juan.perez@email.com',
            status: 'active',
            lastOrder: '2024-01-15'
        },
        {
            name: 'María García',
            email: 'maria.garcia@email.com',
            status: 'pending',
            lastOrder: null
        },
        {
            name: 'Carlos López',
            email: 'carlos.lopez@email.com',
            status: 'active',
            lastOrder: '2024-01-10'
        }
    ];

    const clientList = document.querySelector('.client-list');
    if (clientList) {
        clientList.innerHTML = clients.map(client => `
            <div class="client-item">
                <div class="client-info">
                    <h4>${client.name}</h4>
                    <p>${client.email}</p>
                    <small>Último pedido: ${client.lastOrder || 'Ninguno'}</small>
                </div>
                <div class="client-status">
                    <span class="status-badge ${client.status}">${client.status === 'active' ? 'Activo' : 'Pendiente'}</span>
                </div>
            </div>
        `).join('');
    }
}

function loadVehicles() {
    // Mock vehicle data
    const vehicles = [
        {
            id: 1,
            name: 'Nissan Sentra 2024',
            price: '$18,500',
            image: '../assets/images/nissan-sentra.jpg',
            available: true
        },
        {
            id: 2,
            name: 'Nissan Versa 2024',
            price: '$15,200',
            image: '../assets/images/nissan-versa.jpg',
            available: true
        }
    ];

    const vehicleGrid = document.querySelector('#vehicles .vehicle-grid');
    if (vehicleGrid) {
        vehicleGrid.innerHTML = vehicles.map(vehicle => `
            <div class="vehicle-card">
                <img src="${vehicle.image}" alt="${vehicle.name}" class="vehicle-image" onerror="this.src='../assets/images/default-car.jpg'">
                <h4>${vehicle.name}</h4>
                <p>Precio: ${vehicle.price}</p>
                <span class="status-badge ${vehicle.available ? 'available' : 'sold'}">${vehicle.available ? 'Disponible' : 'Vendido'}</span>
                <button class="btn btn-primary" onclick="editVehicle(${vehicle.id})">Editar</button>
            </div>
        `).join('');
    }
}

// Vehicle image upload
document.addEventListener('DOMContentLoaded', function() {
    const vehicleImageUpload = document.getElementById('vehicleImageUpload');
    if (vehicleImageUpload) {
        vehicleImageUpload.addEventListener('change', function(e) {
            const files = e.target.files;
            if (files.length > 0) {
                auth.showMessage(`${files.length} imagen(es) seleccionada(s) para subir`, 'info');
            }
        });
    }

    const uploadBtn = document.querySelector('#vehicles .btn-primary');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            const files = vehicleImageUpload.files;
            if (files.length === 0) {
                auth.showMessage('Por favor selecciona imágenes para subir', 'error');
                return;
            }

            // Simulate upload
            auth.showMessage('Imágenes subidas exitosamente', 'success');
            vehicleImageUpload.value = '';
            loadVehicles(); // Reload vehicles
        });
    }
});

// Chat functionality for seller
document.addEventListener('DOMContentLoaded', function() {
    const sendSellerMessageBtn = document.getElementById('sendSellerMessage');
    const sellerChatInput = document.getElementById('sellerChatInput');

    if (sendSellerMessageBtn && sellerChatInput) {
        sendSellerMessageBtn.addEventListener('click', sendSellerMessage);
        sellerChatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendSellerMessage();
            }
        });
    }
});

function sendSellerMessage() {
    const sellerChatInput = document.getElementById('sellerChatInput');
    const sellerChatMessages = document.getElementById('sellerChatMessages');

    if (!sellerChatInput || !sellerChatMessages) return;

    const message = sellerChatInput.value.trim();
    if (!message) return;

    // Add seller message
    const sellerMessage = document.createElement('div');
    sellerMessage.className = 'message seller-message';
    sellerMessage.innerHTML = `<p>${message}</p><span class="timestamp">${new Date().toLocaleTimeString()}</span>`;
    sellerChatMessages.appendChild(sellerMessage);

    // Clear input
    sellerChatInput.value = '';

    sellerChatMessages.scrollTop = sellerChatMessages.scrollHeight;
}

function editVehicle(vehicleId) {
    auth.showMessage(`Editando vehículo ${vehicleId}`, 'info');
    // Here you would implement the edit vehicle logic
}

function createNewClient() {
    auth.showMessage('Formulario de nuevo cliente en desarrollo', 'info');
}

function createNewQuote() {
    auth.showMessage('Formulario de cotización en desarrollo', 'info');
}

function addNewVehicle() {
    auth.showMessage('Formulario de nuevo vehículo en desarrollo', 'info');
}
