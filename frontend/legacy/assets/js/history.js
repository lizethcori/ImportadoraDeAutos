// History Module
document.addEventListener('DOMContentLoaded', function() {
    setupHistoryFilters();
    setupHistoryStats();
});

function setupHistoryFilters() {
    const filterButtons = document.querySelectorAll('.history-filters .btn');
    const historyItems = document.querySelectorAll('.vehicle-history-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter history items
            const filterType = this.dataset.filter;
            filterHistoryItems(filterType);
        });
    });
}

function filterHistoryItems(filterType) {
    const historyItems = document.querySelectorAll('.vehicle-history-item');
    
    historyItems.forEach(item => {
        if (filterType === 'all') {
            item.style.display = 'flex';
        } else if (filterType === 'vehicles') {
            // Show only vehicles, hide stats
            const isVehicle = item.classList.contains('vehicle-history-item');
            item.style.display = isVehicle ? 'flex' : 'none';
        } else if (filterType === 'stats') {
            // Show only stats, hide vehicles
            const isVehicle = item.classList.contains('vehicle-history-item');
            item.style.display = isVehicle ? 'none' : 'flex';
        }
    });
}

function setupHistoryStats() {
    console.log('History stats setup completed');
    
    // Calculate stats from the displayed vehicles
    const vehicles = [
        {
            model: 'Nissan Atlas 2024',
            price: 75000,
            deliveryDate: '15/04/2026',
            status: 'delivered'
        },
        {
            model: 'Nissan Frontier 2023',
            price: 82000,
            deliveryDate: '20/03/2026',
            status: 'delivered'
        },
        {
            model: 'Nissan Patrol 2023',
            price: 98000,
            deliveryDate: '10/02/2026',
            status: 'delivered'
        }
    ];
    
    // Update stats display
    updateStatsDisplay(vehicles);
}

function updateStatsDisplay(vehicles) {
    const totalVehicles = vehicles.length;
    const totalInvested = vehicles.reduce((sum, vehicle) => sum + vehicle.price, 0);
    const averageDeliveryTime = 35; // days
    const lastPurchaseYear = 2024;
    
    // Update DOM elements
    const vehiclesCountElement = document.querySelector('.stat-number');
    const totalInvestedElement = document.querySelectorAll('.stat-number')[1];
    const avgDeliveryElement = document.querySelectorAll('.stat-number')[2];
    const lastPurchaseElement = document.querySelectorAll('.stat-number')[3];
    
    if (vehiclesCountElement) {
        vehiclesCountElement.textContent = totalVehicles;
    }
    
    if (totalInvestedElement) {
        totalInvestedElement.textContent = `$${totalInvested.toLocaleString()}`;
    }
    
    if (avgDeliveryElement) {
        avgDeliveryElement.textContent = `${averageDeliveryTime} días`;
    }
    
    if (lastPurchaseElement) {
        lastPurchaseElement.textContent = lastPurchaseYear;
    }
}

function showVehicleHistoryDetails(vehicleName, orderId) {
    console.log('=== showVehicleHistoryDetails START ===');
    console.log('Vehicle:', vehicleName, 'Order ID:', orderId);
    
    // Create modal for vehicle history details
    const modal = document.createElement('div');
    modal.className = 'vehicle-history-details-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Detalles del Vehículo Comprado</h2>
                <button class="modal-close" onclick="closeVehicleHistoryDetailsModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="vehicle-history-info">
                    <div class="vehicle-image-section">
                        <img src="../assets/images/nissan-atlas-2024.jpg" alt="${vehicleName}" class="vehicle-history-image">
                    </div>
                    <div class="vehicle-details-section">
                        <h3>${vehicleName}</h3>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <label>Pedido:</label>
                                <span>${orderId}</span>
                            </div>
                            <div class="detail-item">
                                <label>Fecha de Compra:</label>
                                <span>15/04/2026</span>
                            </div>
                            <div class="detail-item">
                                <label>Fecha de Entrega:</label>
                                <span>15/04/2026</span>
                            </div>
                            <div class="detail-item">
                                <label>Precio Final:</label>
                                <span>USD 75,000</span>
                            </div>
                            <div class="detail-item">
                                <label>Estado:</label>
                                <span class="status-completed">Entregado</span>
                            </div>
                            <div class="detail-item">
                                <label>Kilometraje:</label>
                                <span>0 km</span>
                            </div>
                            <div class="detail-item">
                                <label>Garantía:</label>
                                <span>2 años o 40,000 km</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="vehicle-documents-section">
                    <h3>Documentos del Vehículo</h3>
                    <div class="documents-grid">
                        <div class="document-item">
                            <div class="document-icon">
                                <i class="fas fa-file-invoice"></i>
                            </div>
                            <div class="document-info">
                                <h4>Factura de Compra</h4>
                                <p>Factura final de la transacción</p>
                                <button class="btn btn-outline btn-sm">Descargar PDF</button>
                            </div>
                        </div>
                        <div class="document-item">
                            <div class="document-icon">
                                <i class="fas fa-certificate"></i>
                            </div>
                            <div class="document-info">
                                <h4>Título de Propiedad</h4>
                                <p>Título del vehículo a tu nombre</p>
                                <button class="btn btn-outline btn-sm">Descargar PDF</button>
                            </div>
                        </div>
                        <div class="document-item">
                            <div class="document-icon">
                                <i class="fas fa-file-contract"></i>
                            </div>
                            <div class="document-info">
                                <h4>Garantía</h4>
                                <p>Certificado de garantía del vehículo</p>
                                <button class="btn btn-outline btn-sm">Descargar PDF</button>
                            </div>
                        </div>
                        <div class="document-item">
                            <div class="document-icon">
                                <i class="fas fa-car"></i>
                            </div>
                            <div class="document-info">
                                <h4>Manual del Propietario</h4>
                                <p>Manual de usuario y mantenimiento</p>
                                <button class="btn btn-outline btn-sm">Descargar PDF</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline" onclick="closeVehicleHistoryDetailsModal()">Cerrar</button>
                <button class="btn btn-primary" onclick="requestMaintenance('${vehicleName}')">Solicitar Mantenimiento</button>
                <button class="btn btn-success" onclick="buySimilarVehicle('${vehicleName}')">Comprar Similar</button>
            </div>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('active');
    }, 100);
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeVehicleHistoryDetailsModal();
        }
    });
}

function closeVehicleHistoryDetailsModal() {
    const modal = document.querySelector('.vehicle-history-details-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function requestMaintenance(vehicleName) {
    console.log('=== requestMaintenance START ===');
    console.log('Vehicle:', vehicleName);
    
    // Navigate to chat with maintenance request
    const chatSection = document.getElementById('chat');
    const chatLink = document.querySelector('[data-section="chat"]');
    
    if (chatSection && chatLink) {
        // Remove active class from all sections and links
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.parentElement.classList.remove('active');
        });
        
        // Add active class to chat
        chatSection.classList.add('active');
        chatLink.parentElement.classList.add('active');
        
        // Add maintenance request message to chat
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            const message = document.createElement('div');
            message.className = 'chat-message system';
            message.innerHTML = `
                <div class="message-content">
                    <p>🔧 Solicitar mantenimiento para: ${vehicleName}</p>
                    <small>Cliente - ${new Date().toLocaleString()}</small>
                </div>
            `;
            chatMessages.appendChild(message);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // Focus on chat input
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.focus();
        }
    }
}

function buySimilarVehicle(vehicleName) {
    console.log('=== buySimilarVehicle START ===');
    console.log('Vehicle:', vehicleName);
    
    // Navigate to catalog with search for similar vehicle
    const catalogSection = document.getElementById('catalog');
    const catalogLink = document.querySelector('[data-section="catalog"]');
    
    if (catalogSection && catalogLink) {
        // Remove active class from all sections and links
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.parentElement.classList.remove('active');
        });
        
        // Add active class to catalog
        catalogSection.classList.add('active');
        catalogLink.parentElement.classList.add('active');
        
        // Set search input to vehicle name
        const searchInput = document.getElementById('catalogSearch');
        if (searchInput) {
            searchInput.value = vehicleName;
            searchInput.dispatchEvent(new Event('input'));
        }
    }
}
