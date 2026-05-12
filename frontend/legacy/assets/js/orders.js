// Orders Module
document.addEventListener('DOMContentLoaded', function() {
    setupOrderFilters();
    setupOrderSearch();
    setupOrderActions();
});

function setupOrderFilters() {
    const filterButtons = document.querySelectorAll('.orders-filters .btn');
    const orderCards = document.querySelectorAll('.order-card');
    
    if (filterButtons.length === 0 || orderCards.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            console.log('Filter selected:', filter);
            
            // Filter order cards
            orderCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else {
                    const cardStatus = card.dataset.status;
                    if (cardStatus === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
}

function setupOrderSearch() {
    const searchInput = document.getElementById('orderSearch');
    const searchBtn = document.querySelector('.search-btn');
    const orderCards = document.querySelectorAll('.order-card');
    
    if (!searchInput || !searchBtn || orderCards.length === 0) return;
    
    const performSearch = function() {
        const searchTerm = searchInput.value.toLowerCase();
        console.log('Search term:', searchTerm);
        
        orderCards.forEach(card => {
            const vehicleName = card.querySelector('.order-vehicle').textContent.toLowerCase();
            const orderId = card.querySelector('.order-id').textContent.toLowerCase();
            
            if (vehicleName.includes(searchTerm) || orderId.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    };
    
    searchInput.addEventListener('input', performSearch);
    searchBtn.addEventListener('click', performSearch);
}

function setupOrderActions() {
    // Order action buttons are now handled by inline onclick in HTML
    console.log('Order actions setup completed');
}

// Order Details Functions
function showOrderDetails(orderId, vehicleName) {
    console.log('=== showOrderDetails START ===');
    console.log('Order ID:', orderId, 'Vehicle:', vehicleName);
    
    // Create a modal similar to vehicle details but for orders
    const modal = document.createElement('div');
    modal.className = 'order-details-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Detalles del Pedido</h2>
                <button class="modal-close" onclick="closeOrderDetailsModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="order-info-grid">
                    <div class="info-item">
                        <label>Número de Pedido:</label>
                        <span>${orderId}</span>
                    </div>
                    <div class="info-item">
                        <label>Vehículo:</label>
                        <span>${vehicleName}</span>
                    </div>
                    <div class="info-item">
                        <label>Fecha del Pedido:</label>
                        <span>15/04/2026</span>
                    </div>
                    <div class="info-item">
                        <label>Tipo:</label>
                        <span>Importación</span>
                    </div>
                    <div class="info-item">
                        <label>Precio:</label>
                        <span>USD 85,000</span>
                    </div>
                    <div class="info-item">
                        <label>Estado Actual:</label>
                        <span class="status-processing">En Proceso</span>
                    </div>
                    <div class="info-item">
                        <label>Entrega Estimada:</label>
                        <span>30-45 días</span>
                    </div>
                </div>
                <div class="order-timeline">
                    <h3>Timeline del Pedido</h3>
                    <div class="timeline-item completed">
                        <div class="timeline-icon">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="timeline-content">
                            <h4>Pedido Confirmado</h4>
                            <p>15/04/2026 - Tu pedido ha sido confirmado</p>
                        </div>
                    </div>
                    <div class="timeline-item completed">
                        <div class="timeline-icon">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="timeline-content">
                            <h4>Pago Procesado</h4>
                            <p>16/04/2026 - Tu pago ha sido verificado</p>
                        </div>
                    </div>
                    <div class="timeline-item active">
                        <div class="timeline-icon">
                            <i class="fas fa-ship"></i>
                        </div>
                        <div class="timeline-content">
                            <h4>En Tránsito</h4>
                            <p>Actualmente - Tu vehículo está en camino</p>
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-icon">
                            <i class="fas fa-home"></i>
                        </div>
                        <div class="timeline-content">
                            <h4>Entrega Programada</h4>
                            <p>Estimado - 30-45 días</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline" onclick="closeOrderDetailsModal()">Cerrar</button>
                <button class="btn btn-primary" onclick="directToOrderChat('${orderId}', '${vehicleName}')">Chat con Vendedor</button>
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
            closeOrderDetailsModal();
        }
    });
}

function closeOrderDetailsModal() {
    const modal = document.querySelector('.order-details-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function showOrderDocuments(orderId) {
    console.log('=== showOrderDocuments START ===');
    console.log('Order ID:', orderId);
    
    // Create documents modal
    const modal = document.createElement('div');
    modal.className = 'order-documents-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Documentos del Pedido ${orderId}</h2>
                <button class="modal-close" onclick="closeOrderDocumentsModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="documents-grid">
                    <div class="document-item">
                        <div class="document-icon">
                            <i class="fas fa-file-invoice"></i>
                        </div>
                        <div class="document-info">
                            <h4>Factura Proforma</h4>
                            <p>Factura inicial del pedido</p>
                            <button class="btn btn-outline btn-sm">Descargar</button>
                        </div>
                    </div>
                    <div class="document-item">
                        <div class="document-icon">
                            <i class="fas fa-file-contract"></i>
                        </div>
                        <div class="document-info">
                            <h4>Contrato de Compra</h4>
                            <p>Contrato firmado de la transacción</p>
                            <button class="btn btn-outline btn-sm">Descargar</button>
                        </div>
                    </div>
                    <div class="document-item">
                        <div class="document-icon">
                            <i class="fas fa-file-alt"></i>
                        </div>
                        <div class="document-info">
                            <h4>Orden de Compra</h4>
                            <p>Orden de compra confirmada</p>
                            <button class="btn btn-outline btn-sm">Descargar</button>
                        </div>
                    </div>
                    <div class="document-item">
                        <div class="document-icon">
                            <i class="fas fa-receipt"></i>
                        </div>
                        <div class="document-info">
                            <h4>Comprobante de Pago</h4>
                            <p>Recibo del pago realizado</p>
                            <button class="btn btn-outline btn-sm">Descargar</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline" onclick="closeOrderDocumentsModal()">Cerrar</button>
                <button class="btn btn-primary" onclick="uploadNewDocument('${orderId}')">Subir Documento</button>
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
            closeOrderDocumentsModal();
        }
    });
}

function closeOrderDocumentsModal() {
    const modal = document.querySelector('.order-documents-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function directToOrderChat(orderId, vehicleName) {
    console.log('=== directToOrderChat START ===');
    console.log('Order ID:', orderId, 'Vehicle:', vehicleName);
    
    // Navigate to chat section
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
        
        // Add message to chat
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            const message = document.createElement('div');
            message.className = 'chat-message system';
            message.innerHTML = `
                <div class="message-content">
                    <p>📋 Consulta sobre el pedido ${orderId} - ${vehicleName}</p>
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

function uploadNewDocument(orderId) {
    console.log('=== uploadNewDocument START ===');
    console.log('Order ID:', orderId);
    
    // Create file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx,.jpg,.png';
    fileInput.multiple = true;
    
    fileInput.addEventListener('change', function(e) {
        const files = e.target.files;
        if (files.length > 0) {
            console.log('Files selected:', files);
            // Here you would upload the files to the server
            alert(`Se subirán ${files.length} archivo(s) para el pedido ${orderId}`);
        }
    });
    
    // Trigger file selection
    fileInput.click();
}
