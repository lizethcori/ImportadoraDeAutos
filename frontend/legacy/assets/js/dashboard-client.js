// Dashboard Cliente JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!auth.isAuthenticated()) {
        window.location.href = '../pages/index.html';
        return;
    }

    // Check if user is client
    const currentUser = auth.getCurrentUser();
    if (currentUser.role !== 'cliente') {
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

    // Initialize all modules
    initializeModules();

    console.log('Dashboard cliente loaded');
});


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
    
    // Inicializar mapa (similar al del dashboard vendedor)
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

// Función para el Modal de Seguimiento (definida al final para evitar sobrescritura)
function showOrderTracking(orderId) {
    console.log('showOrderTracking called with orderId:', orderId);
    
    // Cargar datos específicos del pedido
    loadOrderTrackingData(orderId);
    
    // Mostrar modal
    const modal = document.getElementById('trackingModal');
    console.log('Modal element found:', modal);
    if (modal) {
        console.log('Setting modal display to block');
        modal.style.display = 'block';
        modal.style.zIndex = '9999';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        
        // Inicializar mapa si es necesario
        setTimeout(() => {
            initializeModalMap();
        }, 100);
    }
}

function initializeModules() {
    // Load all module scripts dynamically
    const modules = [
        'catalog.js',
        'orders.js',
        'notifications.js',
        'tracking.js',
        'history.js',
        'chat.js',
        'modals.js'
    ];
    
    modules.forEach(module => {
        const script = document.createElement('script');
        script.src = `../assets/js/${module}`;
        script.async = true;
        document.head.appendChild(script);
    });
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

async function loadCatalog() {
    try {
        const response = await fetch('/api/vehicles');
        const vehicles = await response.json();

        const catalogGrid = document.querySelector('.vehicle-grid');
        if (catalogGrid) {
            catalogGrid.innerHTML = vehicles.map(vehicle => `
                <div class="vehicle-card">
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzFiMzA1YiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjMDBiNGQ4IiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPk5pc3NhbiBBdXRvPC90ZXh0Pjwvc3ZnPg==" alt="${vehicle.brand} ${vehicle.model}" class="vehicle-image">
                    <div class="vehicle-info">
                        <h4>${vehicle.brand} ${vehicle.model} ${vehicle.year}</h4>
                        <div class="vehicle-specs">
                            <span><i class="fas fa-car"></i> ${vehicle.type}</span>
                            <span><i class="fas fa-cogs"></i> ${vehicle.transmission}</span>
                            <span><i class="fas fa-gas-pump"></i> ${vehicle.fuel}</span>
                            <span><i class="fas fa-users"></i> ${vehicle.seats} asientos</span>
                        </div>
                        <p class="vehicle-description">${vehicle.description}</p>
                        <div class="vehicle-features">
                            ${vehicle.features.slice(0, 3).map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                        </div>
                        <div class="vehicle-price-action">
                            <div class="price">$${vehicle.price.toLocaleString()}</div>
                            <button class="btn btn-primary" onclick="showVehicleDetails(${vehicle.id})">Ver Detalles</button>
                            <button class="btn btn-secondary" onclick="purchaseVehicle(${vehicle.id})">Comprar</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading catalog:', error);
        auth.showMessage('Error al cargar el catálogo', 'error');
    }
}

async function showVehicleDetails(vehicleId) {
    try {
        const response = await fetch(`/api/vehicles/${vehicleId}`);
        const vehicle = await response.json();
        
        // Create modal for vehicle details
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${vehicle.brand} ${vehicle.model} ${vehicle.year}</h2>
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="vehicle-detail">
                        <img src="../assets/images/nissan-${vehicle.model.toLowerCase()}.jpg" alt="${vehicle.brand} ${vehicle.model}" class="vehicle-detail-image" onerror="this.src='https://picsum.photos/seed/${vehicle.brand}-${vehicle.model}/400/300.jpg'">
                        <div class="vehicle-detail-info">
                            <div class="price-tag">$${vehicle.price.toLocaleString()}</div>
                            <p class="vehicle-description">${vehicle.description}</p>
                            
                            <div class="vehicle-specifications">
                                <h3>Especificaciones</h3>
                                <div class="spec-grid">
                                    <div class="spec-item">
                                        <i class="fas fa-car"></i>
                                        <span>Tipo: ${vehicle.type}</span>
                                    </div>
                                    <div class="spec-item">
                                        <i class="fas fa-cogs"></i>
                                        <span>Transmisión: ${vehicle.transmission}</span>
                                    </div>
                                    <div class="spec-item">
                                        <i class="fas fa-gas-pump"></i>
                                        <span>Combustible: ${vehicle.fuel}</span>
                                    </div>
                                    <div class="spec-item">
                                        <i class="fas fa-users"></i>
                                        <span>Asientos: ${vehicle.seats}</span>
                                    </div>
                                    <div class="spec-item">
                                        <i class="fas fa-palette"></i>
                                        <span>Color: ${vehicle.color}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="vehicle-features-detail">
                                <h3>Características</h3>
                                <div class="features-list">
                                    ${vehicle.features.map(feature => `<div class="feature-item"><i class="fas fa-check"></i> ${feature}</div>`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeModal()">Cerrar</button>
                    <button class="btn btn-primary" onclick="purchaseVehicle(${vehicle.id})">Comprar Ahora</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
    } catch (error) {
        console.error('Error loading vehicle details:', error);
        auth.showMessage('Error al cargar detalles del vehículo', 'error');
    }
}

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

async function purchaseVehicle(vehicleId) {
    try {
        const currentUser = auth.getCurrentUser();
        
        // Show loading
        auth.showLoading(true);
        
        const response = await fetch('/api/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                vehicleId: vehicleId,
                customerInfo: {
                    userId: currentUser.id,
                    name: currentUser.name,
                    email: currentUser.email
                }
            })
        });
        
        const result = await response.json();
        
        auth.showLoading(false);
        
        if (result.success) {
            auth.showMessage(`Pedido #${result.order.id} procesado exitosamente`, 'success');
            closeModal();
            
            // Update orders section
            setTimeout(() => {
                document.querySelector('[data-section="orders"]').click();
            }, 1500);
        } else {
            auth.showMessage('Error al procesar la compra', 'error');
        }
        
    } catch (error) {
        console.error('Error processing purchase:', error);
        auth.showLoading(false);
        auth.showMessage('Error de conexión', 'error');
    }
}


function switchTab(tabName) {
    console.log('Switching to tab:', tabName);
    
    // Remove active class from all buttons and panes
    const buttons = document.querySelectorAll('.tab-btn');
    const panes = document.querySelectorAll('.tab-pane');
    
    console.log('Found buttons:', buttons.length);
    console.log('Found panes:', panes.length);
    
    buttons.forEach(btn => btn.classList.remove('active'));
    panes.forEach(pane => pane.classList.remove('active'));
    
    // Add active class to clicked button
    const targetButton = document.querySelector(`[data-tab="${tabName}"]`);
    const targetPane = document.getElementById(`${tabName}-content`);
    
    console.log('Target button:', targetButton);
    console.log('Target pane:', targetPane);
    
    if (targetButton) {
        targetButton.classList.add('active');
        console.log('Button activated');
    }
    
    if (targetPane) {
        targetPane.classList.add('active');
        console.log('Pane activated:', targetPane.id);
    } else {
        console.error('Pane not found:', `${tabName}-content`);
    }
}

// Vehicle Modal Functions
let modalOpen = false;
let currentVehicleName = '';
let currentVehicleType = '';

function showVehicleDetails(vehicleName, vehicleType) {
    console.log('=== showVehicleDetails START ===');
    console.log('showVehicleDetails called with:', vehicleName, vehicleType);
    
    // Prevenir múltiples llamadas
    if (modalOpen) {
        console.log('Modal already open, ignoring call');
        return;
    }
    
    modalOpen = true;
    currentVehicleName = vehicleName;
    currentVehicleType = vehicleType;
    console.log('ModalOpen flag set to true');
    
    const vehicleData = getVehicleData(vehicleName, vehicleType);
    
    if (!vehicleData) {
        console.error('Vehicle data not found:', vehicleName);
        modalOpen = false;
        return;
    }
    
    console.log('Vehicle data found:', vehicleData);
    
    // Update modal content
    document.getElementById('modalVehicleTitle').textContent = `Detalles - ${vehicleData.model}`;
    document.getElementById('modalVehicleImage').src = vehicleData.image;
    document.getElementById('modalVehicleModel').textContent = vehicleData.model;
    document.getElementById('modalVehicleYear').textContent = vehicleData.year;
    document.getElementById('modalVehiclePrice').textContent = vehicleData.price;
    document.getElementById('modalVehicleType').textContent = vehicleData.type;
    document.getElementById('modalVehicleEngine').textContent = vehicleData.engine;
    document.getElementById('modalVehiclePower').textContent = vehicleData.power;
    document.getElementById('modalVehicleTransmission').textContent = vehicleData.transmission;
    document.getElementById('modalVehicleCapacity').textContent = vehicleData.capacity;
    document.getElementById('modalDeliveryInfo').textContent = vehicleData.deliveryInfo;
    
    // Update features
    const featuresList = document.getElementById('modalVehicleFeatures');
    featuresList.innerHTML = vehicleData.features.map(feature => 
        `<li><i class="fas fa-check"></i> ${feature}</li>`
    ).join('');
    
    // Update action button
    const actionBtn = document.getElementById('modalActionBtn');
    console.log('Action button found:', !!actionBtn);
    
    if (vehicleType === 'warehouse') {
        actionBtn.textContent = 'Comprar Ahora';
        actionBtn.className = 'btn btn-success';
        console.log('Configurado botón de compra');
    } else {
        actionBtn.textContent = 'Solicitar Importación';
        actionBtn.className = 'btn btn-primary';
        console.log('Configurado botón de importación');
    }
    
    // Show modal
    const modal = document.getElementById('vehicleModal');
    modal.classList.add('active');
    modal.style.display = 'flex !important';
    modal.style.visibility = 'visible !important';
    modal.style.opacity = '1 !important';
    modal.style.zIndex = '10000 !important';
    
    // Mostrar botón flotante
    const floatingBtn = document.getElementById('floatingActionBtn');
    if (floatingBtn) {
        floatingBtn.style.display = 'block';
        console.log('Floating button shown');
    }
    
    console.log('Modal opened for:', vehicleName);
    console.log('Modal styles:', modal.style.cssText);
}

function closeModalAndGoToChat() {
    console.log('=== closeModalAndGoToChat START ===');
    console.log('Current vehicle:', currentVehicleName, currentVehicleType);
    
    if (!currentVehicleName || !currentVehicleType) {
        console.log('Using fallback: Nissan Big Thumb importación');
        currentVehicleName = 'Nissan Big Thumb';
        currentVehicleType = 'import';
    }
    
    closeVehicleModal();
    
    const actionType = currentVehicleType === 'warehouse' ? 'compra' : 'importación';
    redirectToChat(currentVehicleName, actionType);
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

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update URL without page reload
    history.pushState(null, '', `#${sectionId}`);
}

function logout() {
    console.log('=== logout START ===');
    if (typeof auth !== 'undefined' && auth.logout) {
        auth.logout();
        window.location.href = '../pages/index.html';
    } else {
        console.log('Auth not available, redirecting to login');
        window.location.href = '../pages/index.html';
    }
}

function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

// Profile Functions
function showProfileModal() {
    console.log('=== showProfileModal START ===');
    
    // Get current user data
    const currentUser = auth.getCurrentUser();
    if (currentUser) {
        // Pre-fill form with current data
        document.getElementById('editName').value = currentUser.name || 'Juan Pérez';
        document.getElementById('editEmail').value = currentUser.email || 'juan.perez@email.com';
        document.getElementById('editPhone').value = currentUser.phone || '+591 70000000';
        document.getElementById('editAddress').value = currentUser.address || 'Calle Principal 123';
        document.getElementById('editCity').value = currentUser.city || 'Cochabamba';
        document.getElementById('editCountry').value = currentUser.country || 'Bolivia';
    }
    
    // Show modal
    const modal = document.getElementById('profileModal');
    modal.classList.add('active');
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeProfileModal();
        }
    });
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    modal.classList.remove('active');
}

function saveProfile() {
    console.log('=== saveProfile START ===');
    
    // Get form values
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;
    const phone = document.getElementById('editPhone').value;
    const address = document.getElementById('editAddress').value;
    const city = document.getElementById('editCity').value;
    const country = document.getElementById('editCountry').value;
    
    // Update user info in auth
    const currentUser = auth.getCurrentUser();
    if (currentUser) {
        currentUser.name = name;
        currentUser.email = email;
        currentUser.phone = phone;
        currentUser.address = address;
        currentUser.city = city;
        currentUser.country = country;
        
        // Update UI
        document.getElementById('profileName').textContent = name;
        document.getElementById('profileEmail').textContent = email;
        document.getElementById('userName').textContent = name;
    }
    
    // Close modal
    closeProfileModal();
    
    // Show success message
    if (auth.showMessage) {
        auth.showMessage('Perfil actualizado exitosamente', 'success');
    }
    
    console.log('Profile saved:', { name, email, phone, address, city, country });
}
