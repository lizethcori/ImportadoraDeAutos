// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!auth.isAuthenticated()) {
        window.location.href = '../pages/index.html';
        return;
    }
    
    // Check if user is admin
    const currentUser = auth.getCurrentUser();
    if (currentUser.role !== 'admin') {
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
    
    console.log('Dashboard admin loaded');
});

// Update user information
function updateUserInfo() {
    const currentUser = auth.getCurrentUser();
    const userNameEl = document.getElementById('userName');
    
    if (userNameEl && currentUser) {
        userNameEl.textContent = currentUser.name || currentUser.username || 'Administrador';
    }
}

// Setup navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const targetSection = this.getAttribute('data-section');
            const sectionEl = document.getElementById(targetSection);
            if (sectionEl) {
                sectionEl.classList.add('active');
            }
        });
    });
}

// Setup logout
function setupLogout() {
    const logoutBtn = document.querySelector('[onclick="logout()"]');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            auth.logout();
        });
    }
}

// Global logout function
function logout() {
    auth.logout();
}

// Handle quick actions
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) {
        const btnText = e.target.textContent.trim();
        
        // Show loading state
        const originalText = e.target.innerHTML;
        e.target.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        e.target.disabled = true;
        
        // Simulate action
        setTimeout(() => {
            e.target.innerHTML = originalText;
            e.target.disabled = false;
            
            // Show message based on action
            if (btnText.includes('Usuario')) {
                auth.showMessage('Función de usuarios en desarrollo', 'info');
            } else if (btnText.includes('Vehículo')) {
                auth.showMessage('Función de vehículos en desarrollo', 'info');
            } else if (btnText.includes('Reportes')) {
                auth.showMessage('Función de reportes en desarrollo', 'info');
            } else if (btnText.includes('Configuración')) {
                auth.showMessage('Función de configuración en desarrollo', 'info');
            }
        }, 1000);
    }
});

// Handle keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + L to logout
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        logout();
    }
});

// Add some interactivity to stat cards
document.addEventListener('DOMContentLoaded', function() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach(card => {
        card.addEventListener('click', function() {
            const statNumber = this.querySelector('.stat-number');
            const statLabel = this.querySelector('.stat-label');
            
            if (statNumber && statLabel) {
                auth.showMessage(`Ver detalles de ${statLabel.textContent}`, 'info');
            }
        });
    });
    
    // Setup user filters
    setupUserFilters();
    
    // Setup user search
    setupUserSearch();
    
    // Setup vehicle filters
    setupVehicleFilters();
    
    // Setup vehicle search
    setupVehicleSearch();
    
    // Setup order filters
    setupOrderFilters();
    
    // Setup order search
    setupOrderSearch();
    
    // Setup import filters
    setupImportFilters();
    
    // Setup import search
    setupImportSearch();
    
    // Setup finance filters
    setupFinanceFilters();
    
    // Setup finance search
    setupFinanceSearch();
    
    // Setup settings navigation
    setupSettingsNavigation();
});

// User Management Functions
function setupUserFilters() {
    const filterButtons = document.querySelectorAll('.filter-buttons .btn');
    const userRows = document.querySelectorAll('#usersTableBody tr');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter users
            const filterType = this.dataset.filter;
            filterUsers(filterType);
        });
    });
}

function filterUsers(filterType) {
    const userRows = document.querySelectorAll('#usersTableBody tr');
    
    userRows.forEach(row => {
        if (filterType === 'all') {
            row.style.display = 'table-row';
        } else {
            const userRole = row.dataset.role;
            if (userRole === filterType) {
                row.style.display = 'table-row';
            } else {
                row.style.display = 'none';
            }
        }
    });
}

function setupUserSearch() {
    const searchInput = document.getElementById('userSearch');
    const searchBtn = document.querySelector('.search-btn');
    
    if (!searchInput || !searchBtn) return;
    
    const performSearch = function() {
        const searchTerm = searchInput.value.toLowerCase();
        const userRows = document.querySelectorAll('#usersTableBody tr');
        
        userRows.forEach(row => {
            const userName = row.querySelector('.user-name').textContent.toLowerCase();
            const userEmail = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const userRole = row.querySelector('.badge').textContent.toLowerCase();
            
            if (userName.includes(searchTerm) || userEmail.includes(searchTerm) || userRole.includes(searchTerm)) {
                row.style.display = 'table-row';
            } else {
                row.style.display = 'none';
            }
        });
    };
    
    searchInput.addEventListener('input', performSearch);
    searchBtn.addEventListener('click', performSearch);
}

function showAddUserModal() {
    console.log('=== showAddUserModal START ===');
    
    // Clear form
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userPassword = document.getElementById('userPassword');
    const userRole = document.getElementById('userRole');
    const userStatus = document.getElementById('userStatus');
    const userPhone = document.getElementById('userPhone');
    
    if (userName) userName.value = '';
    if (userEmail) userEmail.value = '';
    if (userPassword) userPassword.value = '';
    if (userRole) userRole.value = 'cliente';
    if (userStatus) userStatus.value = 'active';
    if (userPhone) userPhone.value = '';
    
    // Set modal title
    const modalTitle = document.getElementById('userModalTitle');
    if (modalTitle) modalTitle.textContent = 'Agregar Usuario';
    
    // Show modal
    const modal = document.getElementById('userModal');
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex !important';
        modal.style.opacity = '1 !important';
        modal.style.visibility = 'visible !important';
        
        console.log('Modal shown successfully');
    } else {
        console.error('Modal not found');
    }
    
    // Close on outside click
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeUserModal();
            }
        });
    }
}

function closeUserModal() {
    const modal = document.getElementById('userModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
        console.log('Modal closed successfully');
    }
}

function editUser(userId) {
    console.log('=== editUser START ===', userId);
    
    // Find user data (simulated)
    const userData = findUserById(userId);
    if (userData) {
        // Fill form with user data
        document.getElementById('userName').value = userData.name;
        document.getElementById('userEmail').value = userData.email;
        document.getElementById('userPassword').value = '';
        document.getElementById('userRole').value = userData.role;
        document.getElementById('userStatus').value = userData.status;
        document.getElementById('userPhone').value = userData.phone || '';
        
        // Set modal title
        document.getElementById('userModalTitle').textContent = 'Editar Usuario';
        
        // Show modal
        const modal = document.getElementById('userModal');
        modal.classList.add('active');
        
        // Close on outside click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeUserModal();
            }
        });
    }
}

function findUserById(userId) {
    // Simulated user data lookup
    const users = {
        'ADM-001': { name: 'Admin Principal', email: 'admin@importadora.com', role: 'admin', status: 'active', phone: '+591 70000000' },
        'VEN-001': { name: 'Carlos Mendoza', email: 'carlos@importadora.com', role: 'vendedor', status: 'active', phone: '+591 70000001' },
        'VEN-002': { name: 'Ana Rodríguez', email: 'ana@importadora.com', role: 'vendedor', status: 'active', phone: '+591 70000002' },
        'CLI-001': { name: 'Juan Pérez', email: 'juan.perez@email.com', role: 'cliente', status: 'active', phone: '+591 70000003' },
        'CLI-002': { name: 'María García', email: 'maria.garcia@email.com', role: 'cliente', status: 'inactive', phone: '+591 70000004' }
    };
    
    return users[userId];
}

function saveUser() {
    console.log('=== saveUser START ===');
    
    // Get form values
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;
    const role = document.getElementById('userRole').value;
    const status = document.getElementById('userStatus').value;
    const phone = document.getElementById('userPhone').value;
    
    // Validate form
    if (!name || !email) {
        auth.showMessage('Por favor completa los campos requeridos', 'error');
        return;
    }
    
    // Here you would save the user data to the server
    console.log('User data:', { name, email, role, status, phone });
    
    // Close modal
    closeUserModal();
    
    // Show success message
    auth.showMessage('Usuario guardado exitosamente', 'success');
}

function deleteUser(userId) {
    console.log('=== deleteUser START ===', userId);
    
    // Confirm deletion
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        // Here you would delete the user from the server
        console.log('Deleting user:', userId);
        
        // Show success message
        auth.showMessage('Usuario eliminado exitosamente', 'success');
    }
}

// Vehicle Management Functions
function setupVehicleFilters() {
    const filterButtons = document.querySelectorAll('#vehicles .filter-buttons .btn');
    const vehicleRows = document.querySelectorAll('#vehiclesTableBody tr');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter vehicles
            const filterType = this.dataset.filter;
            filterVehicles(filterType);
        });
    });
}

function filterVehicles(filterType) {
    const vehicleRows = document.querySelectorAll('#vehiclesTableBody tr');
    
    vehicleRows.forEach(row => {
        if (filterType === 'all') {
            row.style.display = 'table-row';
        } else if (filterType === 'disponible') {
            const status = row.querySelector('.status-active');
            row.style.display = status ? 'table-row' : 'none';
        } else {
            const vehicleType = row.dataset.type;
            if (vehicleType === filterType) {
                row.style.display = 'table-row';
            } else {
                row.style.display = 'none';
            }
        }
    });
}

function setupVehicleSearch() {
    const searchInput = document.getElementById('vehicleSearch');
    const searchBtn = document.querySelector('#vehicles .search-btn');
    
    if (!searchInput || !searchBtn) return;
    
    const performSearch = function() {
        const searchTerm = searchInput.value.toLowerCase();
        const vehicleRows = document.querySelectorAll('#vehiclesTableBody tr');
        
        vehicleRows.forEach(row => {
            const vehicleName = row.querySelector('.vehicle-name').textContent.toLowerCase();
            const vehicleYear = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const vehicleType = row.querySelector('.badge').textContent.toLowerCase();
            
            if (vehicleName.includes(searchTerm) || vehicleYear.includes(searchTerm) || vehicleType.includes(searchTerm)) {
                row.style.display = 'table-row';
            } else {
                row.style.display = 'none';
            }
        });
    };
    
    searchInput.addEventListener('input', performSearch);
    searchBtn.addEventListener('click', performSearch);
}

function showAddVehicleModal() {
    console.log('=== showAddVehicleModal START ===');
    
    // Clear form
    document.getElementById('vehicleModel').value = '';
    document.getElementById('vehicleYear').value = '';
    document.getElementById('vehicleType').value = 'camion';
    document.getElementById('vehiclePrice').value = '';
    document.getElementById('vehicleStatus').value = 'available';
    document.getElementById('vehicleStock').value = '';
    document.getElementById('vehicleDescription').value = '';
    
    // Clear image preview
    resetImagePreview();
    
    // Set modal title
    document.getElementById('vehicleModalTitle').textContent = 'Agregar Vehículo';
    
    // Show modal
    const modal = document.getElementById('vehicleModal');
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex !important';
        modal.style.opacity = '1 !important';
        modal.style.visibility = 'visible !important';
        
        console.log('Modal shown successfully');
    } else {
        console.error('Modal not found');
    }
    
    // Close on outside click
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeVehicleModal();
            }
        });
    }
}

function closeVehicleModal() {
    const modal = document.getElementById('vehicleModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
        console.log('Modal closed successfully');
    }
}

function editVehicle(vehicleId) {
    console.log('=== editVehicle START ===', vehicleId);
    
    // Find vehicle data (simulated)
    const vehicleData = findVehicleById(vehicleId);
    if (vehicleData) {
        // Fill form with vehicle data
        document.getElementById('vehicleModel').value = vehicleData.model;
        document.getElementById('vehicleYear').value = vehicleData.year;
        document.getElementById('vehicleType').value = vehicleData.type;
        document.getElementById('vehiclePrice').value = vehicleData.price;
        document.getElementById('vehicleStatus').value = vehicleData.status;
        document.getElementById('vehicleStock').value = vehicleData.stock;
        document.getElementById('vehicleDescription').value = vehicleData.description || '';
        
        // Set modal title
        document.getElementById('vehicleModalTitle').textContent = 'Editar Vehículo';
        
        // Show modal
        const modal = document.getElementById('vehicleModal');
        if (modal) {
            modal.classList.add('active');
            modal.style.display = 'flex !important';
            modal.style.opacity = '1 !important';
            modal.style.visibility = 'visible !important';
        }
        
        // Close on outside click
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeVehicleModal();
                }
            });
        }
    }
}

function findVehicleById(vehicleId) {
    // Simulated vehicle data lookup
    const vehicles = {
        'VEH-001': { model: 'Nissan Big Thumb', year: '2024', type: 'camion', price: '85000', status: 'available', stock: '5', description: 'Camión de carga pesada' },
        'VEH-002': { model: 'Nissan Condor', year: '2024', type: 'camion', price: '65000', status: 'available', stock: '3', description: 'Camión mediano' },
        'VEH-003': { model: 'Nissan Atlas', year: '2024', type: 'importacion', price: '75000', status: 'transit', stock: '10', description: 'Vehículo de importación' },
        'VEH-004': { model: 'Nissan Quon', year: '2024', type: 'camion', price: '105000', status: 'available', stock: '2', description: 'Camión pesado de lujo' },
        'VEH-005': { model: 'Nissan Resona', year: '2024', type: 'importacion', price: '55000', status: 'available', stock: '8', description: 'Vehículo ligero de importación' }
    };
    
    return vehicles[vehicleId];
}

function saveVehicle() {
    console.log('=== saveVehicle START ===');
    
    // Get form values
    const model = document.getElementById('vehicleModel').value;
    const year = document.getElementById('vehicleYear').value;
    const type = document.getElementById('vehicleType').value;
    const price = document.getElementById('vehiclePrice').value;
    const status = document.getElementById('vehicleStatus').value;
    const stock = document.getElementById('vehicleStock').value;
    const description = document.getElementById('vehicleDescription').value;
    
    // Validate form
    if (!model || !year || !price) {
        auth.showMessage('Por favor completa los campos requeridos', 'error');
        return;
    }
    
    // Here you would save the vehicle data to the server
    console.log('Vehicle data:', { model, year, type, price, status, stock, description });
    
    // Close modal
    closeVehicleModal();
    
    // Show success message
    auth.showMessage('Vehículo guardado exitosamente', 'success');
}

function deleteVehicle(vehicleId) {
    console.log('=== deleteVehicle START ===', vehicleId);
    
    // Confirm deletion
    if (confirm('¿Estás seguro de que deseas eliminar este vehículo?')) {
        // Here you would delete the vehicle from the server
        console.log('Deleting vehicle:', vehicleId);
        
        // Show success message
        auth.showMessage('Vehículo eliminado exitosamente', 'success');
    }
}

// Image Upload Functions
function previewVehicleImage(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('vehicleImagePreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = preview.querySelector('img');
            img.src = e.target.result;
            preview.classList.add('has-image');
        };
        reader.readAsDataURL(file);
    }
}

function resetImagePreview() {
    const preview = document.getElementById('vehicleImagePreview');
    const img = preview.querySelector('img');
    const input = document.getElementById('vehicleImage');
    
    preview.classList.remove('has-image');
    img.src = '';
    input.value = '';
}

// Order Management Functions
function setupOrderFilters() {
    const filterButtons = document.querySelectorAll('#orders .filter-buttons .btn');
    const orderRows = document.querySelectorAll('#ordersTableBody tr');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter orders
            const filterType = this.dataset.filter;
            filterOrders(filterType);
        });
    });
}

function filterOrders(filterType) {
    const orderRows = document.querySelectorAll('#ordersTableBody tr');
    
    orderRows.forEach(row => {
        if (filterType === 'all') {
            row.style.display = 'table-row';
        } else {
            const orderStatus = row.dataset.status;
            if (orderStatus === filterType) {
                row.style.display = 'table-row';
            } else {
                row.style.display = 'none';
            }
        }
    });
}

function setupOrderSearch() {
    const searchInput = document.getElementById('orderSearch');
    const searchBtn = document.querySelector('#orders .search-btn');
    
    if (!searchInput || !searchBtn) return;
    
    const performSearch = function() {
        const searchTerm = searchInput.value.toLowerCase();
        const orderRows = document.querySelectorAll('#ordersTableBody tr');
        
        orderRows.forEach(row => {
            const orderId = row.querySelector('.order-id').textContent.toLowerCase();
            const clientName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const vehicleName = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            
            if (orderId.includes(searchTerm) || clientName.includes(searchTerm) || vehicleName.includes(searchTerm)) {
                row.style.display = 'table-row';
            } else {
                row.style.display = 'none';
            }
        });
    };
    
    searchInput.addEventListener('input', performSearch);
    searchBtn.addEventListener('click', performSearch);
}

function viewOrder(orderId) {
    console.log('=== viewOrder START ===', orderId);
    
    // Find order data (simulated)
    const orderData = findOrderById(orderId);
    if (orderData) {
        // Fill form with order data
        document.getElementById('orderId').value = orderData.id;
        document.getElementById('orderClient').value = orderData.client;
        document.getElementById('orderVehicle').value = orderData.vehicle;
        document.getElementById('orderTotal').value = orderData.total;
        document.getElementById('orderStatus').value = orderData.status;
        document.getElementById('orderDate').value = orderData.date;
        document.getElementById('orderNotes').value = orderData.notes || '';
        
        // Set modal title
        document.getElementById('orderModalTitle').textContent = 'Detalles del Pedido';
        
        // Show modal
        const modal = document.getElementById('orderModal');
        if (modal) {
            modal.classList.add('active');
            modal.style.display = 'flex !important';
            modal.style.opacity = '1 !important';
            modal.style.visibility = 'visible !important';
        }
        
        // Close on outside click
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeOrderModal();
                }
            });
        }
    }
}

function editOrder(orderId) {
    console.log('=== editOrder START ===', orderId);
    viewOrder(orderId);
    document.getElementById('orderModalTitle').textContent = 'Editar Pedido';
}

function showAddOrderModal() {
    console.log('=== showAddOrderModal START ===');
    
    // Clear form
    document.getElementById('orderId').value = '';
    document.getElementById('orderClient').value = '';
    document.getElementById('orderVehicle').value = '';
    document.getElementById('orderTotal').value = '';
    document.getElementById('orderStatus').value = 'pending';
    document.getElementById('orderDate').value = '';
    document.getElementById('orderNotes').value = '';
    
    // Set modal title
    document.getElementById('orderModalTitle').textContent = 'Crear Nuevo Pedido';
    
    // Show modal
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex !important';
        modal.style.opacity = '1 !important';
        modal.style.visibility = 'visible !important';
    }
    
    // Close on outside click
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeOrderModal();
            }
        });
    }
}

function closeOrderModal() {
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
    }
}

function findOrderById(orderId) {
    // Simulated order data lookup
    const orders = {
        'ORD-001': { id: 'ORD-001', client: 'Juan Pérez', vehicle: 'Nissan Big Thumb 2024', total: '85000', status: 'pending', date: '2024-05-01', notes: 'Cliente interesado en camión de carga pesada' },
        'ORD-002': { id: 'ORD-002', client: 'María García', vehicle: 'Nissan Condor 2024', total: '65000', status: 'processing', date: '2024-05-02', notes: 'En proceso de documentación' },
        'ORD-003': { id: 'ORD-003', client: 'Carlos Mendoza', vehicle: 'Nissan Quon 2024', total: '105000', status: 'completed', date: '2024-04-15', notes: 'Entrega completada con éxito' },
        'ORD-004': { id: 'ORD-004', client: 'Ana Rodríguez', vehicle: 'Nissan Atlas 2024', total: '75000', status: 'pending', date: '2024-05-03', notes: 'Esperando confirmación de pago' },
        'ORD-005': { id: 'ORD-005', client: 'Roberto Sánchez', vehicle: 'Nissan Resona 2024', total: '55000', status: 'processing', date: '2024-05-04', notes: 'En preparación para envío' }
    };
    
    return orders[orderId];
}

function saveOrder() {
    console.log('=== saveOrder START ===');
    
    // Get form values
    const orderId = document.getElementById('orderId').value;
    const client = document.getElementById('orderClient').value;
    const vehicle = document.getElementById('orderVehicle').value;
    const total = document.getElementById('orderTotal').value;
    const status = document.getElementById('orderStatus').value;
    const date = document.getElementById('orderDate').value;
    const notes = document.getElementById('orderNotes').value;
    
    // Validate form
    if (!client || !vehicle || !total) {
        auth.showMessage('Por favor completa los campos requeridos', 'error');
        return;
    }
    
    // Here you would save the order data to the server
    console.log('Order data:', { orderId, client, vehicle, total, status, date, notes });
    
    // Close modal
    closeOrderModal();
    
    // Show success message
    auth.showMessage('Pedido guardado exitosamente', 'success');
}

// Import Management Functions
function setupImportFilters() {
    const filterButtons = document.querySelectorAll('#imports .filter-buttons .btn');
    const importRows = document.querySelectorAll('#importsTableBody tr');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter imports
            const filterType = this.dataset.filter;
            filterImports(filterType);
        });
    });
}

function filterImports(filterType) {
    const importRows = document.querySelectorAll('#importsTableBody tr');
    
    importRows.forEach(row => {
        if (filterType === 'all') {
            row.style.display = 'table-row';
        } else {
            const importStatus = row.dataset.status;
            if (importStatus === filterType) {
                row.style.display = 'table-row';
            } else {
                row.style.display = 'none';
            }
        }
    });
}

function setupImportSearch() {
    const searchInput = document.getElementById('importSearch');
    const searchBtn = document.querySelector('#imports .search-btn');
    
    if (!searchInput || !searchBtn) return;
    
    const performSearch = function() {
        const searchTerm = searchInput.value.toLowerCase();
        const importRows = document.querySelectorAll('#importsTableBody tr');
        
        importRows.forEach(row => {
            const importId = row.querySelector('.import-id').textContent.toLowerCase();
            const vehicleName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const clientName = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            
            if (importId.includes(searchTerm) || vehicleName.includes(searchTerm) || clientName.includes(searchTerm)) {
                row.style.display = 'table-row';
            } else {
                row.style.display = 'none';
            }
        });
    };
    
    searchInput.addEventListener('input', performSearch);
    searchBtn.addEventListener('click', performSearch);
}

function viewImport(importId) {
    console.log('=== viewImport START ===', importId);
    
    // Find import data (simulated)
    const importData = findImportById(importId);
    if (importData) {
        // Fill form with import data
        document.getElementById('importId').value = importData.id;
        document.getElementById('importTracking').value = importData.tracking;
        document.getElementById('importVehicle').value = importData.vehicle;
        document.getElementById('importClient').value = importData.client;
        document.getElementById('importOrigin').value = importData.origin;
        document.getElementById('importStatus').value = importData.status;
        document.getElementById('importArrivalDate').value = importData.arrivalDate;
        document.getElementById('importProgress').value = importData.progress;
        document.getElementById('importNotes').value = importData.notes || '';
        
        // Set modal title
        document.getElementById('importModalTitle').textContent = 'Detalles de Importación';
        
        // Show modal
        const modal = document.getElementById('importModal');
        if (modal) {
            modal.classList.add('active');
            modal.style.display = 'flex !important';
            modal.style.opacity = '1 !important';
            modal.style.visibility = 'visible !important';
        }
        
        // Close on outside click
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeImportModal();
                }
            });
        }
    }
}

function editImport(importId) {
    console.log('=== editImport START ===', importId);
    viewImport(importId);
    document.getElementById('importModalTitle').textContent = 'Editar Importación';
}

function showAddImportModal() {
    console.log('=== showAddImportModal START ===');
    
    // Clear form
    document.getElementById('importId').value = '';
    document.getElementById('importTracking').value = '';
    document.getElementById('importVehicle').value = '';
    document.getElementById('importClient').value = '';
    document.getElementById('importOrigin').value = '';
    document.getElementById('importStatus').value = 'transit';
    document.getElementById('importArrivalDate').value = '';
    document.getElementById('importProgress').value = '';
    document.getElementById('importNotes').value = '';
    
    // Set modal title
    document.getElementById('importModalTitle').textContent = 'Nueva Importación';
    
    // Show modal
    const modal = document.getElementById('importModal');
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex !important';
        modal.style.opacity = '1 !important';
        modal.style.visibility = 'visible !important';
    }
    
    // Close on outside click
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeImportModal();
            }
        });
    }
}

function closeImportModal() {
    const modal = document.getElementById('importModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
    }
}

function findImportById(importId) {
    // Simulated import data lookup
    const imports = {
        'IMP-001': { id: 'IMP-001', tracking: 'TRK-2024-001', vehicle: 'Nissan Big Thumb 2024', client: 'Juan Pérez', origin: 'Japón', status: 'transit', arrivalDate: '2024-06-15', progress: '25', notes: 'En tránsito marítimo' },
        'IMP-002': { id: 'IMP-002', tracking: 'TRK-2024-002', vehicle: 'Nissan Condor 2024', client: 'María García', origin: 'Corea del Sur', status: 'customs', arrivalDate: '2024-06-10', progress: '50', notes: 'En proceso de aduana' },
        'IMP-003': { id: 'IMP-003', tracking: 'TRK-2024-003', vehicle: 'Nissan Quon 2024', client: 'Carlos Mendoza', origin: 'Japón', status: 'warehouse', arrivalDate: '2024-06-01', progress: '75', notes: 'En bodega de destino' },
        'IMP-004': { id: 'IMP-004', tracking: 'TRK-2024-004', vehicle: 'Nissan Atlas 2024', client: 'Ana Rodríguez', origin: 'China', status: 'delivered', arrivalDate: '2024-04-20', progress: '100', notes: 'Entrega completada' },
        'IMP-005': { id: 'IMP-005', tracking: 'TRK-2024-005', vehicle: 'Nissan Resona 2024', client: 'Roberto Sánchez', origin: 'Tailandia', status: 'transit', arrivalDate: '2024-06-25', progress: '15', notes: 'Recién iniciado' }
    };
    
    return imports[importId];
}

function saveImport() {
    console.log('=== saveImport START ===');
    
    // Get form values
    const importId = document.getElementById('importId').value;
    const tracking = document.getElementById('importTracking').value;
    const vehicle = document.getElementById('importVehicle').value;
    const client = document.getElementById('importClient').value;
    const origin = document.getElementById('importOrigin').value;
    const status = document.getElementById('importStatus').value;
    const arrivalDate = document.getElementById('importArrivalDate').value;
    const progress = document.getElementById('importProgress').value;
    const notes = document.getElementById('importNotes').value;
    
    // Validate form
    if (!vehicle || !client || !origin) {
        auth.showMessage('Por favor completa los campos requeridos', 'error');
        return;
    }
    
    // Here you would save the import data to the server
    console.log('Import data:', { importId, tracking, vehicle, client, origin, status, arrivalDate, progress, notes });
    
    // Close modal
    closeImportModal();
    
    // Show success message
    auth.showMessage('Importación guardada exitosamente', 'success');
}

// Finance Management Functions
function setupFinanceFilters() {
    const filterButtons = document.querySelectorAll('#finance .filter-buttons .btn');
    const financeRows = document.querySelectorAll('#financeTableBody tr');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter transactions
            const filterType = this.dataset.filter;
            filterFinance(filterType);
        });
    });
}

function filterFinance(filterType) {
    const financeRows = document.querySelectorAll('#financeTableBody tr');
    
    financeRows.forEach(row => {
        if (filterType === 'all') {
            row.style.display = 'table-row';
        } else if (filterType === 'completed') {
            const transactionStatus = row.dataset.status;
            row.style.display = transactionStatus === 'completed' ? 'table-row' : 'none';
        } else {
            const transactionType = row.dataset.type;
            if (transactionType === filterType) {
                row.style.display = 'table-row';
            } else {
                row.style.display = 'none';
            }
        }
    });
}

function setupFinanceSearch() {
    const searchInput = document.getElementById('financeSearch');
    const searchBtn = document.querySelector('#finance .search-btn');
    
    if (!searchInput || !searchBtn) return;
    
    const performSearch = function() {
        const searchTerm = searchInput.value.toLowerCase();
        const financeRows = document.querySelectorAll('#financeTableBody tr');
        
        financeRows.forEach(row => {
            const transactionId = row.querySelector('.transaction-id').textContent.toLowerCase();
            const category = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            const reference = row.querySelector('td:nth-child(7)').textContent.toLowerCase();
            
            if (transactionId.includes(searchTerm) || category.includes(searchTerm) || reference.includes(searchTerm)) {
                row.style.display = 'table-row';
            } else {
                row.style.display = 'none';
            }
        });
    };
    
    searchInput.addEventListener('input', performSearch);
    searchBtn.addEventListener('click', performSearch);
}

function viewTransaction(transactionId) {
    console.log('=== viewTransaction START ===', transactionId);
    
    // Find transaction data (simulated)
    const transactionData = findTransactionById(transactionId);
    if (transactionData) {
        // Fill form with transaction data
        document.getElementById('transactionId').value = transactionData.id;
        document.getElementById('transactionType').value = transactionData.type;
        document.getElementById('transactionCategory').value = transactionData.category;
        document.getElementById('transactionAmount').value = transactionData.amount;
        document.getElementById('transactionStatus').value = transactionData.status;
        document.getElementById('transactionDate').value = transactionData.date;
        document.getElementById('transactionReference').value = transactionData.reference;
        document.getElementById('transactionDescription').value = transactionData.description || '';
        
        // Set modal title
        document.getElementById('transactionModalTitle').textContent = 'Detalles de Transacción';
        
        // Show modal
        const modal = document.getElementById('transactionModal');
        if (modal) {
            modal.classList.add('active');
            modal.style.display = 'flex !important';
            modal.style.opacity = '1 !important';
            modal.style.visibility = 'visible !important';
        }
        
        // Close on outside click
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeTransactionModal();
                }
            });
        }
    }
}

function editTransaction(transactionId) {
    console.log('=== editTransaction START ===', transactionId);
    viewTransaction(transactionId);
    document.getElementById('transactionModalTitle').textContent = 'Editar Transacción';
}

function showAddTransactionModal() {
    console.log('=== showAddTransactionModal START ===');
    
    // Clear form
    document.getElementById('transactionId').value = '';
    document.getElementById('transactionType').value = 'income';
    document.getElementById('transactionCategory').value = 'sale';
    document.getElementById('transactionAmount').value = '';
    document.getElementById('transactionStatus').value = 'pending';
    document.getElementById('transactionDate').value = '';
    document.getElementById('transactionReference').value = '';
    document.getElementById('transactionDescription').value = '';
    
    // Set modal title
    document.getElementById('transactionModalTitle').textContent = 'Nueva Transacción';
    
    // Show modal
    const modal = document.getElementById('transactionModal');
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex !important';
        modal.style.opacity = '1 !important';
        modal.style.visibility = 'visible !important';
    }
    
    // Close on outside click
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeTransactionModal();
            }
        });
    }
}

function closeTransactionModal() {
    const modal = document.getElementById('transactionModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
    }
}

function findTransactionById(transactionId) {
    // Simulated transaction data lookup
    const transactions = {
        'FIN-001': { id: 'FIN-001', type: 'income', category: 'sale', amount: '85000', status: 'completed', date: '2024-05-01', reference: 'ORD-001', description: 'Venta de Nissan Big Thumb' },
        'FIN-002': { id: 'FIN-002', type: 'expense', category: 'purchase', amount: '45000', status: 'completed', date: '2024-05-02', reference: 'IMP-001', description: 'Compra de vehículo en Japón' },
        'FIN-003': { id: 'FIN-003', type: 'expense', category: 'freight', amount: '12000', status: 'completed', date: '2024-05-03', reference: 'IMP-001', description: 'Flete marítimo internacional' },
        'FIN-004': { id: 'FIN-004', type: 'income', category: 'sale', amount: '65000', status: 'completed', date: '2024-05-04', reference: 'ORD-002', description: 'Venta de Nissan Condor' },
        'FIN-005': { id: 'FIN-005', type: 'expense', category: 'taxes', amount: '8500', status: 'pending', date: '2024-05-05', reference: 'IMP-002', description: 'Impuestos de aduana pendientes' },
        'FIN-006': { id: 'FIN-006', type: 'income', category: 'sale', amount: '105000', status: 'completed', date: '2024-05-06', reference: 'ORD-003', description: 'Venta de Nissan Quon' },
        'FIN-007': { id: 'FIN-007', type: 'expense', category: 'salary', amount: '15000', status: 'completed', date: '2024-05-07', reference: 'Mensual', description: 'Pago de salarios mensuales' }
    };
    
    return transactions[transactionId];
}

function saveTransaction() {
    console.log('=== saveTransaction START ===');
    
    // Get form values
    const transactionId = document.getElementById('transactionId').value;
    const type = document.getElementById('transactionType').value;
    const category = document.getElementById('transactionCategory').value;
    const amount = document.getElementById('transactionAmount').value;
    const status = document.getElementById('transactionStatus').value;
    const date = document.getElementById('transactionDate').value;
    const reference = document.getElementById('transactionReference').value;
    const description = document.getElementById('transactionDescription').value;
    
    // Validate form
    if (!amount || !date) {
        auth.showMessage('Por favor completa los campos requeridos', 'error');
        return;
    }
    
    // Here you would save the transaction data to the server
    console.log('Transaction data:', { transactionId, type, category, amount, status, date, reference, description });
    
    // Close modal
    closeTransactionModal();
    
    // Show success message
    auth.showMessage('Transacción guardada exitosamente', 'success');
}

// Settings Management Functions
function setupSettingsNavigation() {
    const navItems = document.querySelectorAll('.settings-nav-item');
    const sections = document.querySelectorAll('.settings-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all nav items and sections
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked nav item
            this.classList.add('active');
            
            // Show corresponding section
            const targetSection = this.dataset.section;
            const section = document.getElementById(targetSection + '-settings');
            if (section) {
                section.classList.add('active');
            }
        });
    });
}

function saveCompanySettings() {
    console.log('=== saveCompanySettings START ===');
    
    // Here you would save the company settings to the server
    const companyName = document.querySelector('#company-settings input[type="text"]').value;
    const ruc = document.querySelector('#company-settings input[type="text"]:nth-of-type(2)').value;
    const phone = document.querySelector('#company-settings input[type="tel"]').value;
    const email = document.querySelector('#company-settings input[type="email"]').value;
    const address = document.querySelector('#company-settings input[type="text"]:nth-of-type(3)').value;
    const website = document.querySelector('#company-settings input[type="url"]').value;
    const description = document.querySelector('#company-settings textarea').value;
    
    console.log('Company settings:', { companyName, ruc, phone, email, address, website, description });
    
    // Show success message
    auth.showMessage('Configuración de empresa guardada exitosamente', 'success');
}

function saveUserSettings() {
    console.log('=== saveUserSettings START ===');
    
    // Here you would save the user settings to the server
    const userRegistration = document.querySelector('#users-settings select').value;
    const passwordLevel = document.querySelector('#users-settings select:nth-of-type(2)').value;
    const sessionExpiration = document.querySelector('#users-settings input[type="number"]').value;
    const maxLoginAttempts = document.querySelector('#users-settings input[type="number"]:nth-of-type(2)').value;
    const twoFactor = document.getElementById('twoFactor').checked;
    
    console.log('User settings:', { userRegistration, passwordLevel, sessionExpiration, maxLoginAttempts, twoFactor });
    
    // Show success message
    auth.showMessage('Configuración de usuarios guardada exitosamente', 'success');
}

function saveVehicleSettings() {
    console.log('=== saveVehicleSettings START ===');
    
    // Here you would save the vehicle settings to the server
    const currency = document.querySelector('#vehicles-settings select').value;
    const importTax = document.querySelector('#vehicles-settings input[type="number"]').value;
    const profitMargin = document.querySelector('#vehicles-settings input[type="number"]:nth-of-type(2)').value;
    const warrantyDays = document.querySelector('#vehicles-settings input[type="number"]:nth-of-type(3)').value;
    const autoNotifications = document.getElementById('autoNotifications').checked;
    
    console.log('Vehicle settings:', { currency, importTax, profitMargin, warrantyDays, autoNotifications });
    
    // Show success message
    auth.showMessage('Configuración de vehículos guardada exitosamente', 'success');
}

function saveSystemSettings() {
    console.log('=== saveSystemSettings START ===');
    
    // Here you would save the system settings to the server
    const timezone = document.querySelector('#system-settings select').value;
    const language = document.querySelector('#system-settings select:nth-of-type(2)').value;
    const dateFormat = document.querySelector('#system-settings select:nth-of-type(3)').value;
    const autoBackup = document.getElementById('autoBackup').checked;
    const backupFrequency = document.querySelector('#system-settings select:nth-of-type(4)').value;
    
    console.log('System settings:', { timezone, language, dateFormat, autoBackup, backupFrequency });
    
    // Show success message
    auth.showMessage('Configuración del sistema guardada exitosamente', 'success');
}

function saveNotificationSettings() {
    console.log('=== saveNotificationSettings START ===');
    
    // Here you would save the notification settings to the server
    const emailNotifications = document.getElementById('emailNotifications').checked;
    const orderNotifications = document.getElementById('orderNotifications').checked;
    const importNotifications = document.getElementById('importNotifications').checked;
    const financialNotifications = document.getElementById('financialNotifications').checked;
    const weeklyReports = document.getElementById('weeklyReports').checked;
    
    console.log('Notification settings:', { emailNotifications, orderNotifications, importNotifications, financialNotifications, weeklyReports });
    
    // Show success message
    auth.showMessage('Configuración de notificaciones guardada exitosamente', 'success');
}
