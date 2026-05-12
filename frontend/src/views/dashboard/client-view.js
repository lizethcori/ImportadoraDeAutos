/**
 * Importadora Nissan - Client Dashboard View
 * Vista del dashboard del cliente
 */

(function(window) {
    'use strict';

    window.Importadora = window.Importadora || {};
    window.Importadora.Views = window.Importadora.Views || {};

    /**
     * Client Dashboard View
     * Extiende BaseView para funcionalidad común
     */
    class ClientView extends window.Importadora.Core.BaseView {
        constructor() {
            super();
            this.vehicleService = null;
            this.mockBackend = null;
        }

        /**
         * Inicializar la vista
         */
        init() {
            super.init();
            this.vehicleService = window.Importadora.Services.VehicleService;
            this.mockBackend = window.Importadora.Services.MockBackend;
        }

        /**
         * Renderizar el dashboard
         */
        render() {
            const appContainer = document.getElementById('app');
            if (!appContainer) {
                console.error('❌ Contenedor #app no encontrado');
                return;
            }

            appContainer.innerHTML = `
                <div class="dashboard-container">
                    <!-- Header -->
                    <header class="dashboard-header">
                        <div class="header-left">
                            <div class="logo">
                                <img src="/public/logo.png" alt="Logo" class="logo-img">
                                <h1>Importadora Nissan</h1>
                            </div>
                        </div>
                        <div class="header-right">
                            <div class="user-info">
                                <div class="user-avatar">
                                    <i class="fas fa-user"></i>
                                </div>
                                <div class="user-details">
                                    <span class="user-name" id="userName">${this.currentUser?.name || 'Cliente'}</span>
                                    <span class="user-role">Cliente</span>
                                </div>
                            </div>
                            <button class="btn btn-secondary" id="logoutBtn">
                                <i class="fas fa-sign-out-alt"></i>
                                Cerrar Sesión
                            </button>
                        </div>
                    </header>

                    <!-- Main Content -->
                    <div class="dashboard-main">
                        <!-- Sidebar -->
                        <aside class="sidebar">
                            <nav class="sidebar-nav">
                                <ul class="nav-list">
                                    <li class="nav-item">
                                        <a href="#" class="nav-link active" data-section="catalog">
                                            <i class="fas fa-car"></i>
                                            <span>Catálogo</span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a href="#" class="nav-link" data-section="orders">
                                            <i class="fas fa-shopping-cart"></i>
                                            <span>Mis Pedidos</span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a href="#" class="nav-link" data-section="tracking">
                                            <i class="fas fa-map-marker-alt"></i>
                                            <span>Seguimiento</span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a href="#" class="nav-link" data-section="chat">
                                            <i class="fas fa-comments"></i>
                                            <span>Chat</span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a href="#" class="nav-link" data-section="profile">
                                            <i class="fas fa-user"></i>
                                            <span>Perfil</span>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </aside>

                        <!-- Content Area -->
                        <main class="dashboard-content">
                            <!-- Catalog Section -->
                            <section id="catalog" class="content-section active">
                                <div class="content-grid">
                                    <div class="card">
                                        <div class="section-header">
                                            <h2>Catálogo de Vehículos</h2>
                                            <p class="section-description">Explora nuestros vehículos comerciales e industriales Nissan</p>
                                        </div>
                                        <div class="catalog-tabs">
                                            <button class="tab-btn active" data-tab="import">
                                                <i class="fas fa-ship"></i>
                                                <span>Autos para Importar</span>
                                            </button>
                                            <button class="tab-btn" data-tab="warehouse">
                                                <i class="fas fa-warehouse"></i>
                                                <span>Autos en Almacén</span>
                                            </button>
                                        </div>
                                        <div class="search-bar">
                                            <input type="text" id="catalogSearch" placeholder="Buscar por marca o modelo..." class="search-input">
                                            <button class="btn btn-secondary" id="clearSearchBtn">Limpiar</button>
                                        </div>
                                        <div class="tab-content">
                                            <div id="import-content" class="tab-pane active">
                                                <div class="vehicle-grid" id="importVehicleGrid">
                                                    <p style="text-align:center; padding:20px;">Cargando catálogo...</p>
                                                </div>
                                            </div>
                                            <div id="warehouse-content" class="tab-pane">
                                                <div class="warehouse-info">
                                                    <div class="info-banner">
                                                        <i class="fas fa-check-circle"></i>
                                                        <span>Vehículos disponibles para compra inmediata - Entrega en 24-48 horas</span>
                                                    </div>
                                                </div>
                                                <div class="vehicle-grid" id="warehouseVehicleGrid">
                                                    <p style="text-align:center; padding:20px;">Cargando almacén...</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <!-- Orders Section -->
                            <section id="orders" class="content-section">
                                <div class="section-header">
                                    <div class="section-header-content">
                                        <h2>Mis Pedidos</h2>
                                        <p class="section-description">Gestiona tus pedidos activos</p>
                                    </div>
                                    <div class="orders-filters">
                                        <button class="btn btn-outline active" data-filter="all">Todos</button>
                                        <button class="btn btn-outline" data-filter="pending">Pendientes</button>
                                        <button class="btn btn-outline" data-filter="processing">En Proceso</button>
                                        <button class="btn btn-outline" data-filter="completed">Completados</button>
                                    </div>
                                </div>
                                <div class="card">
                                    <div class="orders-list" id="ordersList">
                                        <p style="text-align:center; padding:20px;">Cargando pedidos...</p>
                                    </div>
                                </div>
                            </section>

                            <!-- Tracking Section -->
                            <section id="tracking" class="content-section">
                                <div class="section-header">
                                    <h2>Seguimiento de mi pedido</h2>
                                    <p class="section-description">Estado actual de tu importación</p>
                                </div>
                                <div class="card">
                                    <div class="tracking-status">
                                        <div class="status-info">
                                            <h3>Estado Actual: <span class="status-current" id="currentStatus">COTIZACIÓN</span></h3>
                                            <p>Ubicación estimada: <span class="location-current" id="currentLocation">Ubicación desconocida</span></p>
                                        </div>
                                    </div>
                                    <div class="progress-container">
                                        <div class="progress-line">
                                            <div class="progress-fill" id="progressFill"></div>
                                        </div>
                                        <div class="progress-steps">
                                            <div class="step" data-step="1"><div class="step-icon"><i class="fas fa-check"></i></div><div class="step-text">Pedido Confirmado</div></div>
                                            <div class="step" data-step="2"><div class="step-icon"><i class="fas fa-ship"></i></div><div class="step-text">En Puerto Iquique</div></div>
                                            <div class="step" data-step="3"><div class="step-icon"><i class="fas fa-clipboard-check"></i></div><div class="step-text">Control Colchane</div></div>
                                            <div class="step" data-step="4"><div class="step-icon"><i class="fas fa-truck"></i></div><div class="step-text">En Transporte</div></div>
                                            <div class="step" data-step="5"><div class="step-icon"><i class="fas fa-clipboard-check"></i></div><div class="step-text">Control Pisiga</div></div>
                                            <div class="step" data-step="6"><div class="step-icon"><i class="fas fa-warehouse"></i></div><div class="step-text">En Depósito Oruro</div></div>
                                            <div class="step" data-step="7"><div class="step-icon"><i class="fas fa-truck"></i></div><div class="step-text">En Transporte La Paz</div></div>
                                            <div class="step" data-step="8"><div class="step-icon"><i class="fas fa-warehouse"></i></div><div class="step-text">En Almacén Cochabamba</div></div>
                                            <div class="step" data-step="9"><div class="step-icon"><i class="fas fa-check-circle"></i></div><div class="step-text">Listo para Entrega</div></div>
                                        </div>
                                    </div>
                                    <div class="map-section">
                                        <div id="trackingMap" class="tracking-map"></div>
                                    </div>
                                    <div class="documents-section">
                                        <div class="section-header">
                                            <h3><i class="fas fa-folder"></i> Documentos del Pedido</h3>
                                        </div>
                                        <div class="upload-area" id="uploadArea">
                                            <div class="upload-content">
                                                <i class="fas fa-cloud-upload-alt"></i>
                                                <p>Arrastra archivos aquí o</p>
                                                <button class="btn btn-secondary" id="selectFileBtn">Seleccionar archivo</button>
                                                <input type="file" id="fileInput" style="display: none;" multiple>
                                            </div>
                                        </div>
                                        <div class="documents-list" id="documentsList">
                                            <p style="text-align:center; padding:20px; color:var(--text-secondary);">Cargando documentos...</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <!-- Chat Section -->
                            <section id="chat" class="content-section">
                                <div class="section-header">
                                    <div class="section-header-content">
                                        <h2>Chat con tu Vendedor</h2>
                                        <p class="section-description">Comunícate directamente con tu vendedor asignado</p>
                                    </div>
                                </div>
                                <div class="card">
                                    <div class="chat-container">
                                        <div class="chat-messages" id="chatMessages"></div>
                                        <input type="text" id="chatInput" placeholder="Escribe tu mensaje...">
                                        <button class="btn btn-primary" id="sendMessage">Enviar</button>
                                    </div>
                                </div>
                            </section>

                            <!-- Profile Section -->
                            <section id="profile" class="content-section">
                                <div class="section-header">
                                    <div class="section-header-content">
                                        <h2>Información Personal</h2>
                                        <p class="section-description">Gestiona tu información de perfil</p>
                                    </div>
                                </div>
                                <div class="content-grid">
                                    <div class="card">
                                        <div class="section-header">
                                            <h3>Datos del Perfil</h3>
                                        </div>
                                        <div class="profile-info-display">
                                            <div class="info-row">
                                                <span class="info-label">Nombre:</span>
                                                <span class="info-value" id="displayName">${this.currentUser?.name || 'Cliente'}</span>
                                            </div>
                                            <div class="info-row">
                                                <span class="info-label">Email:</span>
                                                <span class="info-value" id="displayEmail">${this.currentUser?.email || 'cliente@email.com'}</span>
                                            </div>
                                            <div class="info-row">
                                                <span class="info-label">Teléfono:</span>
                                                <span class="info-value">+1 234 567 890</span>
                                            </div>
                                            <div class="info-row">
                                                <span class="info-label">Dirección:</span>
                                                <span class="info-value">Av. Principal 123</span>
                                            </div>
                                            <div class="info-row">
                                                <span class="info-label">Nivel:</span>
                                                <span class="info-value">Oro</span>
                                            </div>
                                            <div class="info-row">
                                                <span class="info-label">Total de Compras:</span>
                                                <span class="info-value">3</span>
                                            </div>
                                        </div>
                                        <div class="form-actions">
                                            <button class="btn btn-primary" id="editProfileBtn">Editar Perfil</button>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </main>
                    </div>
                </div>
            `;
        }

        /**
         * Cargar datos del dashboard
         */
        async loadData() {
            try {
                const vehicles = await this.vehicleService.getAll();
                const orders = await this.mockBackend.getOrders();

                this.loadCatalog(vehicles);
                this.loadOrdersList(orders);

            } catch (error) {
                console.error('❌ Error cargando datos del dashboard:', error);
            }
        }

        loadCatalog(vehicles) {
            const importGrid = document.getElementById('importVehicleGrid');
            const warehouseGrid = document.getElementById('warehouseVehicleGrid');

            if (importGrid) {
                importGrid.innerHTML = vehicles.map(v => `
                    <div class="vehicle-card">
                        <div class="vehicle-image">
                            <img src="${v.image}" alt="${v.brand} ${v.model}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                            <div class="vehicle-image-placeholder" style="display:none"><i class="fas fa-truck"></i></div>
                        </div>
                        <div class="vehicle-info">
                            <h4>${v.brand} ${v.model}</h4>
                            <p class="vehicle-year">Año: ${v.year}</p>
                            <p class="vehicle-price">USD ${v.price?.toLocaleString()}</p>
                            <div class="vehicle-actions">
                                <button class="btn btn-outline vehicle-details-btn" data-vehicle-id="${v.id}">Ver detalles</button>
                                <button class="btn btn-primary request-import-btn" data-vehicle-id="${v.id}">Solicitar importación</button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }

            if (warehouseGrid) {
                const available = vehicles.filter(v => v.available);
                warehouseGrid.innerHTML = available.slice(0, 3).map(v => `
                    <div class="vehicle-card warehouse-card">
                        <div class="stock-badge"><i class="fas fa-warehouse"></i><span>En Stock</span></div>
                        <div class="vehicle-image">
                            <img src="${v.image}" alt="${v.brand} ${v.model}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                            <div class="vehicle-image-placeholder" style="display:none"><i class="fas fa-truck"></i></div>
                        </div>
                        <div class="vehicle-info">
                            <h4>${v.brand} ${v.model}</h4>
                            <p class="vehicle-year">Año: ${v.year}</p>
                            <p class="vehicle-price">USD ${v.price?.toLocaleString()}</p>
                            <div class="delivery-info"><i class="fas fa-truck"></i><span>Entrega: 24-48 horas</span></div>
                            <div class="vehicle-actions">
                                <button class="btn btn-outline vehicle-details-btn" data-vehicle-id="${v.id}">Ver detalles</button>
                                <button class="btn btn-success buy-now-btn" data-vehicle-id="${v.id}">Comprar Ahora</button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }

        loadOrdersList(orders) {
            const list = document.getElementById('ordersList');
            if (!list) return;

            const statusClass = { 'En Proceso': 'processing', 'Pendiente': 'pending', 'Entregado': 'completed', 'Cotización': 'pending' };
            list.innerHTML = orders.map(order => `
                <div class="order-card" data-status="${statusClass[order.status] || 'pending'}">
                    <div class="order-header">
                        <div class="order-info">
                            <h3 class="order-vehicle">${order.vehicle}</h3>
                            <span class="order-id">#${order.id}</span>
                        </div>
                        <span class="order-status status-${statusClass[order.status] || 'pending'}">${order.status}</span>
                    </div>
                    <div class="order-details">
                        <div class="order-detail-item"><i class="fas fa-calendar"></i><span>Fecha: ${order.date}</span></div>
                        <div class="order-detail-item"><i class="fas fa-dollar-sign"></i><span>Total: ${order.total || 'N/A'}</span></div>
                    </div>
                    <div class="order-progress">
                        <div class="progress-bar"><div class="progress-fill" style="width: ${order.progress || 0}%"></div></div>
                        <span class="progress-text">${order.progress || 0}% completado</span>
                    </div>
                    <div class="order-actions">
                        <button class="btn btn-outline btn-sm view-details-btn" data-order-id="${order.id}">Ver Detalles</button>
                        <button class="btn btn-primary btn-sm tracking-btn" data-order-id="${order.id}">Seguimiento</button>
                        <button class="btn btn-success btn-sm chat-seller-btn" data-order-id="${order.id}">Chat con Vendedor</button>
                    </div>
                </div>
            `).join('');
        }

        /**
         * Configurar eventos
         * Extiende setupEvents() de BaseView
         */
        setupEvents() {
            // Eventos comunes (logout, navegación sidebar)
            super.setupEvents();

            // Tabs del catálogo
            document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
                    btn.classList.add('active');
                    const pane = document.getElementById(btn.getAttribute('data-tab') + '-content');
                    if (pane) pane.classList.add('active');
                });
            });

            // Catalog search
            this.setupCatalogSearch();

            // Order filters
            this.setupOrderFilters();

            // Order action buttons
            this.setupOrderActionButtons();

            // Chat
            this.setupChat();

            // Document upload
            this.setupDocumentUpload();
        }

        setupCatalogSearch() {
            const DOM = window.Importadora.Utils.DOM;
            const input = DOM.id('catalogSearch');
            const clearBtn = DOM.id('clearSearchBtn');
            if (!input) return;

            const search = () => DOM.filterRows('.vehicle-card', input.value);

            input.addEventListener('input', search);
            if (clearBtn) clearBtn.addEventListener('click', () => { input.value = ''; search(); });
        }

        setupOrderFilters() {
            const DOM = window.Importadora.Utils.DOM;
            DOM.qsa('.orders-filters .btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    DOM.setActive(DOM.qsa('.orders-filters .btn'), btn);
                    DOM.filterByData('#ordersList .order-card', 'status', btn.getAttribute('data-filter'));
                });
            });
        }

        setupOrderActionButtons() {
            // View Details buttons
            document.querySelectorAll('.view-details-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const orderId = e.currentTarget.getAttribute('data-order-id');
                    this.showOrderDetails(orderId);
                });
            });

            // Tracking buttons
            document.querySelectorAll('.tracking-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const orderId = e.target.getAttribute('data-order-id');
                    this.showOrderTracking(orderId);
                });
            });

            // Chat with seller buttons
            document.querySelectorAll('.chat-seller-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const orderId = e.target.getAttribute('data-order-id');
                    this.openChatWithSeller(orderId);
                });
            });

            // Vehicle details buttons (catalog)
            document.querySelectorAll('.vehicle-details-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const vehicleId = e.target.getAttribute('data-vehicle-id');
                    this.showVehicleDetails(vehicleId);
                });
            });

            // Request import buttons (catalog)
            document.querySelectorAll('.request-import-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const vehicleId = e.target.getAttribute('data-vehicle-id');
                    await this.requestImport(vehicleId);
                });
            });

            // Buy now buttons (warehouse)
            document.querySelectorAll('.buy-now-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const vehicleId = e.target.getAttribute('data-vehicle-id');
                    await this.buyNow(vehicleId);
                });
            });
        }

        async showOrderTracking(orderId) {
            // Navigate to tracking section
            const trackingSection = document.getElementById('tracking');
            if (trackingSection) {
                // Update active section in sidebar
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                const trackingLink = document.querySelector('.nav-link[data-section="tracking"]');
                if (trackingLink) trackingLink.classList.add('active');

                // Show tracking section
                document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
                trackingSection.classList.add('active');

                // Update tracking info with order data
                try {
                    const order = await this.mockBackend.getOrderById(orderId);

                    if (order) {
                        const statusEl = document.getElementById('currentStatus');
                        const locationEl = document.getElementById('currentLocation');
                        const progressFill = document.getElementById('progressFill');

                        if (statusEl) statusEl.textContent = order.status;
                        if (locationEl) locationEl.textContent = order.location || 'En proceso';
                        if (progressFill) progressFill.style.width = `${order.progress || 0}%`;

                        // Initialize and update map
                        const mapService = window.Importadora.Components.MapService;
                        if (mapService && !mapService.isReady()) {
                            mapService.init('trackingMap');
                        }

                        // Update current position on map
                        if (mapService && mapService.isReady()) {
                            mapService.updateCurrentPosition(order.progress || 0, order.status);
                        }

                        // Load documents for this order
                        this.loadOrderDocuments(orderId);
                    }
                } catch (error) {
                    console.error('Error al cargar tracking:', error);
                    window.Importadora.Components.Toast.show('Error al cargar tracking', 'error');
                }
            }
        }

        async openChatWithSeller(orderId) {
            // Navigate to chat section
            const chatSection = document.getElementById('chat');
            if (chatSection) {
                // Update active section in sidebar
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                const chatLink = document.querySelector('.nav-link[data-section="chat"]');
                if (chatLink) chatLink.classList.add('active');

                // Show chat section
                document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
                chatSection.classList.add('active');

                // Add initial message about the order
                try {
                    const order = await this.mockBackend.getOrderById(orderId);

                    if (order) {
                        const chatMessages = document.getElementById('chatMessages');
                        if (chatMessages) {
                            chatMessages.innerHTML = `
                                <div class="message system-message">
                                    <p>Consultando información del pedido #${order.id} - ${order.vehicle}</p>
                                </div>
                            `;
                        }
                    }
                } catch (error) {
                    console.error('Error al cargar pedido para chat:', error);
                }
            }
        }

        setupChat() {
            window.Importadora.Components.Chat.init({
                messagesId: 'chatMessages',
                inputId: 'chatInput',
                sendBtnId: 'sendMessage',
                responderName: 'Vendedor',
                autoReplyMessage: 'Recibido, te respondo a la brevedad.'
            });
        }

        setupProfileEdit() {
            const editBtn = document.getElementById('editProfileBtn');
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    this.toggleProfileEdit();
                });
            }
        }

        toggleProfileEdit() {
            const profileDisplay = document.querySelector('.profile-info-display');
            const isEditing = profileDisplay.classList.contains('editing');

            if (isEditing) {
                // Save changes and return to display mode
                this.saveProfileChanges();
            } else {
                // Switch to edit mode
                this.showProfileEditForm();
            }
        }

        showProfileEditForm() {
            const profileDisplay = document.querySelector('.profile-info-display');
            const currentName = document.getElementById('displayName').textContent;
            const currentEmail = document.getElementById('displayEmail').textContent;

            profileDisplay.classList.add('editing');
            profileDisplay.innerHTML = `
                <div class="edit-profile-form">
                    <div class="form-group">
                        <label>Nombre Completo</label>
                        <input type="text" id="editName" value="${currentName}" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="editEmail" value="${currentEmail}" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Teléfono</label>
                        <input type="tel" id="editPhone" value="+1 234 567 890" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Dirección</label>
                        <input type="text" id="editAddress" value="Av. Principal 123" class="form-input">
                    </div>
                    <div class="form-actions">
                        <button class="btn btn-primary" id="saveProfileBtn">Guardar Cambios</button>
                        <button class="btn btn-outline" id="cancelProfileBtn">Cancelar</button>
                    </div>
                </div>
            `;

            // Add event listeners for the new buttons
            document.getElementById('saveProfileBtn').addEventListener('click', () => this.saveProfileChanges());
            document.getElementById('cancelProfileBtn').addEventListener('click', () => this.cancelProfileEdit());

            // Update the main button
            const editBtn = document.getElementById('editProfileBtn');
            editBtn.textContent = 'Cancelar Edición';
            editBtn.classList.remove('btn-primary');
            editBtn.classList.add('btn-outline');
        }

        saveProfileChanges() {
            const newName = document.getElementById('editName').value;
            const newEmail = document.getElementById('editEmail').value;
            const newPhone = document.getElementById('editPhone').value;
            const newAddress = document.getElementById('editAddress').value;

            // Update display
            document.getElementById('displayName').textContent = newName;
            document.getElementById('displayEmail').textContent = newEmail;

            // Update current user
            if (this.currentUser) {
                this.currentUser.name = newName;
                this.currentUser.email = newEmail;
            }

            // Show success message
            window.Importadora.Components.Toast.show('Perfil actualizado correctamente', 'success');

            // Return to display mode
            this.cancelProfileEdit();
        }

        cancelProfileEdit() {
            const profileDisplay = document.querySelector('.profile-info-display');
            const currentName = document.getElementById('displayName')?.textContent || 'Cliente';
            const currentEmail = document.getElementById('displayEmail')?.textContent || 'cliente@email.com';

            profileDisplay.classList.remove('editing');
            profileDisplay.innerHTML = `
                <div class="info-row">
                    <span class="info-label">Nombre:</span>
                    <span class="info-value" id="displayName">${currentName}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value" id="displayEmail">${currentEmail}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Teléfono:</span>
                    <span class="info-value">+1 234 567 890</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Dirección:</span>
                    <span class="info-value">Av. Principal 123</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Nivel:</span>
                    <span class="info-value">Oro</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Total de Compras:</span>
                    <span class="info-value">3</span>
                </div>
            `;

            // Update the main button
            const editBtn = document.getElementById('editProfileBtn');
            editBtn.textContent = 'Editar Perfil';
            editBtn.classList.remove('btn-outline');
            editBtn.classList.add('btn-primary');
        }

        /**
         * Comprar ahora - redirige al chat con vendedor
         */
        async buyNow(vehicleId) {
            try {
                const vehicle = await this.vehicleService.getById(vehicleId);

                // Navigate to chat section
                const chatSection = document.getElementById('chat');
                if (chatSection) {
                    // Update active section in sidebar
                    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                    document.querySelector('.nav-link[data-section="chat"]').classList.add('active');

                    // Show chat section
                    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
                    chatSection.classList.add('active');

                    // Add initial message about the purchase
                    const chatMessages = document.getElementById('chatMessages');
                    if (chatMessages && vehicle) {
                        chatMessages.innerHTML = `
                            <div class="message system-message">
                                <p>Interés en compra de: ${vehicle.brand} ${vehicle.model} (${vehicle.year})</p>
                                <p>Precio: USD ${vehicle.price?.toLocaleString()}</p>
                                <p>Disponible en almacén - Entrega 24-48 horas</p>
                            </div>
                        `;
                    }

                    // Focus on chat input
                    const chatInput = document.getElementById('chatInput');
                    if (chatInput) {
                        chatInput.focus();
                        chatInput.placeholder = `Escribe sobre la compra del ${vehicle.brand} ${vehicle.model}...`;
                    }
                }
            } catch (error) {
                console.error('Error al cargar vehículo para compra:', error);
                window.Importadora.Components.Toast.show('Error al cargar vehículo', 'error');
            }
        }

        /**
         * Solicitar importación - redirige al chat con vendedor
         */
        async requestImport(vehicleId) {
            try {
                const vehicle = await this.vehicleService.getById(vehicleId);

                // Navigate to chat section
                const chatSection = document.getElementById('chat');
                if (chatSection) {
                    // Update active section in sidebar
                    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                    document.querySelector('.nav-link[data-section="chat"]').classList.add('active');

                    // Show chat section
                    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
                    chatSection.classList.add('active');

                    // Add initial message about the import request
                    const chatMessages = document.getElementById('chatMessages');
                    if (chatMessages && vehicle) {
                        chatMessages.innerHTML = `
                            <div class="message system-message">
                                <p>Solicitud de importación para: ${vehicle.brand} ${vehicle.model} (${vehicle.year})</p>
                                <p>Precio: USD ${vehicle.price?.toLocaleString()}</p>
                            </div>
                        `;
                    }

                    // Focus on chat input
                    const chatInput = document.getElementById('chatInput');
                    if (chatInput) {
                        chatInput.focus();
                        chatInput.placeholder = `Escribe sobre la importación del ${vehicle.brand} ${vehicle.model}...`;
                    }
                }
            } catch (error) {
                console.error('Error al cargar vehículo para importación:', error);
                window.Importadora.Components.Toast.show('Error al cargar vehículo', 'error');
            }
        }

        /**
         * Mostrar detalles del vehículo en modal
         */
        async showVehicleDetails(vehicleId) {
            try {
                const vehicle = await this.vehicleService.getById(vehicleId);

                if (!vehicle) {
                    window.Importadora.Components.Toast.show('Vehículo no encontrado', 'error');
                    return;
                }

                const modalBody = `
                    <div class="vehicle-details-modal">
                        <div class="vehicle-detail-image">
                            <img src="${vehicle.image}" alt="${vehicle.brand} ${vehicle.model}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                            <div class="vehicle-image-placeholder" style="display:none"><i class="fas fa-truck"></i></div>
                        </div>
                        <div class="vehicle-detail-info">
                            <h3>${vehicle.brand} ${vehicle.model}</h3>
                            <div class="detail-row">
                                <span class="detail-label">Año:</span>
                                <span class="detail-value">${vehicle.year}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Tipo:</span>
                                <span class="detail-value">${vehicle.type}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Transmisión:</span>
                                <span class="detail-value">${vehicle.transmission}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Combustible:</span>
                                <span class="detail-value">${vehicle.fuel}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Asientos:</span>
                                <span class="detail-value">${vehicle.seats}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Color:</span>
                                <span class="detail-value">${vehicle.color}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Precio:</span>
                                <span class="detail-value">USD ${vehicle.price?.toLocaleString()}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Disponibilidad:</span>
                                <span class="detail-value ${vehicle.available ? 'status-completed' : 'status-pending'}">${vehicle.available ? 'Disponible' : 'No disponible'}</span>
                            </div>
                            <div class="vehicle-detail-description">
                                <p class="detail-label">Descripción:</p>
                                <p>${vehicle.description}</p>
                            </div>
                            <div class="vehicle-detail-features">
                                <p class="detail-label">Características:</p>
                                <ul>
                                    ${vehicle.features?.map(f => `<li>${f}</li>`).join('') || 'Sin características'}
                                </ul>
                            </div>
                        </div>
                    </div>
                `;

                window.Importadora.Components.Modal.open({
                    title: 'Detalles del Vehículo',
                    body: modalBody,
                    size: 'large'
                });
            } catch (error) {
                console.error('Error al cargar detalles del vehículo:', error);
                window.Importadora.Components.Toast.show('Error al cargar detalles', 'error');
            }
        }

        /**
         * Mostrar detalles del pedido en modal
         */
        async showOrderDetails(orderId) {
            try {
                const order = await this.mockBackend.getOrderById(orderId);

                if (!order) {
                    window.Importadora.Components.Toast.show('Pedido no encontrado', 'error');
                    return;
                }

                // Usar HTML simple con estilos inline para evitar problemas CSS
                const modalBody = `
                    <div style="color: white; padding: 10px;">
                        <h4 style="color: white; margin: 0 0 15px 0; border-bottom: 2px solid var(--secondary-color); padding-bottom: 8px;">Información del Pedido</h4>
                        <div style="margin: 10px 0;">
                            <strong style="color: white;">ID del Pedido:</strong> <span style="color: white;">#${order.id}</span>
                        </div>
                        <div style="margin: 10px 0;">
                            <strong style="color: white;">Vehículo:</strong> <span style="color: white;">${order.vehicle}</span>
                        </div>
                        <div style="margin: 10px 0;">
                            <strong style="color: white;">Estado:</strong> <span style="color: ${order.status === 'EN TRANSPORTE' ? '#ffa500' : order.status === 'Pendiente' ? '#ff6b6b' : '#51cf66'};">${order.status}</span>
                        </div>
                        <div style="margin: 10px 0;">
                            <strong style="color: white;">Fecha:</strong> <span style="color: white;">${order.date}</span>
                        </div>
                        <div style="margin: 10px 0;">
                            <strong style="color: white;">Total:</strong> <span style="color: white;">${order.total || 'N/A'}</span>
                        </div>
                        <div style="margin: 10px 0;">
                            <strong style="color: white;">Progreso:</strong> <span style="color: white;">${order.progress || 0}%</span>
                        </div>
                        <div style="margin: 10px 0;">
                            <strong style="color: white;">Ubicación:</strong> <span style="color: white;">${order.location || 'En proceso'}</span>
                        </div>
                    </div>
                `;

                window.Importadora.Components.Modal.open({
                    title: 'Detalles del Pedido',
                    body: modalBody,
                    size: 'normal'
                });
            } catch (error) {
                console.error('Error al cargar detalles del pedido:', error);
                window.Importadora.Components.Toast.show('Error al cargar detalles', 'error');
            }
        }

        /**
         * Cargar documentos del pedido
         * @param {string} orderId - ID del pedido
         */
        async loadOrderDocuments(orderId) {
            try {
                const order = await this.mockBackend.getOrderById(orderId);
                const documentsList = document.getElementById('documentsList');

                if (!documentsList) return;

                if (!order || !order.documents || order.documents.length === 0) {
                    documentsList.innerHTML = '<p class="no-documents">No hay documentos para este pedido</p>';
                    return;
                }

                documentsList.innerHTML = order.documents.map(doc => `
                    <div class="document-item" data-document-id="${doc.id}">
                        <div class="document-icon">
                            <i class="${this.getFileIcon(doc.type)}"></i>
                        </div>
                        <div class="document-info">
                            <h4>${doc.name}</h4>
                            <div class="document-meta">
                                <span>${doc.uploadDate}</span>
                                <span>•</span>
                                <span>${doc.size}</span>
                            </div>
                        </div>
                        <div class="document-actions">
                            <button class="btn btn-outline download-doc-btn" data-document-id="${doc.id}">
                                <i class="fas fa-download"></i>
                            </button>
                            <button class="btn btn-outline delete-doc-btn" data-document-id="${doc.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('');

                // Agregar event listeners para botones de documentos
                this.setupDocumentActions(orderId);

            } catch (error) {
                console.error('Error al cargar documentos:', error);
                const documentsList = document.getElementById('documentsList');
                if (documentsList) {
                    documentsList.innerHTML = '<p class="no-documents">Error al cargar documentos</p>';
                }
            }
        }

        /**
         * Configurar acciones de documentos (descargar, eliminar)
         * @param {string} orderId - ID del pedido
         */
        setupDocumentActions(orderId) {
            // Download buttons
            document.querySelectorAll('.download-doc-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const docId = e.currentTarget.getAttribute('data-document-id');
                    this.downloadDocument(docId);
                });
            });

            // Delete buttons
            document.querySelectorAll('.delete-doc-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const docId = e.currentTarget.getAttribute('data-document-id');
                    this.deleteDocument(docId, orderId);
                });
            });
        }

        /**
         * Obtener icono según tipo de archivo
         * @param {string} fileType - Tipo de archivo
         * @returns {string} Clase de icono Font Awesome
         */
        getFileIcon(fileType) {
            const iconMap = {
                'pdf': 'fas fa-file-pdf',
                'doc': 'fas fa-file-word',
                'docx': 'fas fa-file-word',
                'xls': 'fas fa-file-excel',
                'xlsx': 'fas fa-file-excel',
                'jpg': 'fas fa-file-image',
                'jpeg': 'fas fa-file-image',
                'png': 'fas fa-file-image',
                'zip': 'fas fa-file-archive',
                'rar': 'fas fa-file-archive'
            };
            return iconMap[fileType?.toLowerCase()] || 'fas fa-file';
        }

        /**
         * Descargar documento (simulado)
         * @param {string} docId - ID del documento
         */
        downloadDocument(docId) {
            console.log('📥 Descargando documento:', docId);
            window.Importadora.Components.Toast.show('Documento descargado (simulado)', 'success');
        }

        /**
         * Eliminar documento (simulado en memoria)
         * @param {string} docId - ID del documento
         * @param {string} orderId - ID del pedido
         */
        deleteDocument(docId, orderId) {
            console.log('🗑️ Eliminando documento:', docId, 'del pedido:', orderId);

            // En una implementación real, esto llamaría a la API
            // Por ahora, solo eliminamos del DOM
            const docItem = document.querySelector(`.document-item[data-document-id="${docId}"]`);
            if (docItem) {
                docItem.style.opacity = '0';
                setTimeout(() => docItem.remove(), 300);
            }

            window.Importadora.Components.Toast.show('Documento eliminado', 'success');
        }

        /**
         * Configurar subida de documentos (drag & drop)
         */
        setupDocumentUpload() {
            const uploadArea = document.getElementById('uploadArea');
            const selectFileBtn = document.getElementById('selectFileBtn');
            const fileInput = document.getElementById('fileInput');

            if (!uploadArea || !selectFileBtn || !fileInput) return;

            // Click en botón seleccionar archivo
            selectFileBtn.addEventListener('click', () => {
                fileInput.click();
            });

            // Click en área de subida
            uploadArea.addEventListener('click', (e) => {
                if (e.target === uploadArea || e.target.closest('.upload-content')) {
                    fileInput.click();
                }
            });

            // Cambio en input de archivo
            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });

            // Drag & drop
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });

            uploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                this.handleFileUpload(e.dataTransfer.files);
            });
        }

        /**
         * Manejar subida de archivos
         * @param {FileList} files - Archivos a subir
         */
        handleFileUpload(files) {
            if (!files || files.length === 0) return;

            Array.from(files).forEach(file => {
                console.log('📤 Subiendo archivo:', file.name, file.size, file.type);

                // Simular subida (en memoria)
                const newDoc = {
                    id: `doc-${Date.now()}`,
                    name: file.name,
                    type: file.name.split('.').pop().toLowerCase(),
                    size: this.formatFileSize(file.size),
                    uploadDate: new Date().toISOString().split('T')[0]
                };

                // Agregar a la lista visualmente
                this.addDocumentToList(newDoc);
            });

            window.Importadora.Components.Toast.show(`${files.length} archivo(s) subido(s)`, 'success');
        }

        /**
         * Formatear tamaño de archivo
         * @param {number} bytes - Tamaño en bytes
         * @returns {string} Tamaño formateado
         */
        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        /**
         * Agregar documento a la lista visual
         * @param {object} doc - Documento a agregar
         */
        addDocumentToList(doc) {
            const documentsList = document.getElementById('documentsList');
            if (!documentsList) return;

            // Eliminar mensaje de "no documentos" si existe
            const noDocsMsg = documentsList.querySelector('.no-documents');
            if (noDocsMsg) noDocsMsg.remove();

            const docHtml = `
                <div class="document-item" data-document-id="${doc.id}" style="animation: slideIn 0.3s ease;">
                    <div class="document-icon">
                        <i class="${this.getFileIcon(doc.type)}"></i>
                    </div>
                    <div class="document-info">
                        <h4>${doc.name}</h4>
                        <div class="document-meta">
                            <span>${doc.uploadDate}</span>
                            <span>•</span>
                            <span>${doc.size}</span>
                        </div>
                    </div>
                    <div class="document-actions">
                        <button class="btn btn-outline download-doc-btn" data-document-id="${doc.id}">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="btn btn-outline delete-doc-btn" data-document-id="${doc.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;

            documentsList.insertAdjacentHTML('beforeend', docHtml);

            // Agregar event listeners para los nuevos botones
            const newDocItem = documentsList.lastElementChild;
            newDocItem.querySelector('.download-doc-btn').addEventListener('click', () => {
                this.downloadDocument(doc.id);
            });
            newDocItem.querySelector('.delete-doc-btn').addEventListener('click', () => {
                this.deleteDocument(doc.id, null);
            });
        }

    }

    // Crear instancia global
    window.Importadora.Views.ClientView = new ClientView();

    // Auto-inicialización
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.Importadora.Views.ClientView.init();
        });
    } else {
        window.Importadora.Views.ClientView.init();
    }

})(window);
