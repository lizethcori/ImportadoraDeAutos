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
                                <i class="fas fa-truck"></i>
                                <h1>Importadora</h1>
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
                            <div class="user-profile">
                                <div class="profile-avatar"><i class="fas fa-user"></i></div>
                                <div class="profile-info">
                                    <h3 class="profile-name" id="profileName">${this.currentUser?.name || 'Cliente'}</h3>
                                    <p class="profile-email" id="profileEmail">${this.currentUser?.email || 'cliente@email.com'}</p>
                                    <div class="profile-stats">
                                        <div class="stat">
                                            <span class="stat-value" id="totalPurchases">3</span>
                                            <span class="stat-label">Compras</span>
                                        </div>
                                        <div class="stat">
                                            <span class="stat-value" id="clientLevel">Oro</span>
                                            <span class="stat-label">Nivel</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

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
                                        <a href="#" class="nav-link" data-section="history">
                                            <i class="fas fa-history"></i>
                                            <span>Historial</span>
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

                            <!-- History Section -->
                            <section id="history" class="content-section">
                                <div class="section-header">
                                    <div class="section-header-content">
                                        <h2>Historial de Compras</h2>
                                        <p class="section-description">Revisa tus vehículos comprados y estadísticas</p>
                                    </div>
                                </div>
                                <div class="content-grid">
                                    <div class="card">
                                        <div class="section-header"><h3>Resumen de Actividad</h3></div>
                                        <div class="stats-grid">
                                            <div class="stat-item">
                                                <div class="stat-icon"><i class="fas fa-car"></i></div>
                                                <div class="stat-info"><span class="stat-number">3</span><span class="stat-label">Vehículos Comprados</span></div>
                                            </div>
                                            <div class="stat-item">
                                                <div class="stat-icon"><i class="fas fa-dollar-sign"></i></div>
                                                <div class="stat-info"><span class="stat-number">$255,000</span><span class="stat-label">Total Invertido</span></div>
                                            </div>
                                            <div class="stat-item">
                                                <div class="stat-icon"><i class="fas fa-clock"></i></div>
                                                <div class="stat-info"><span class="stat-number">35 días</span><span class="stat-label">Tiempo Promedio</span></div>
                                            </div>
                                            <div class="stat-item">
                                                <div class="stat-icon"><i class="fas fa-calendar"></i></div>
                                                <div class="stat-info"><span class="stat-number">2024</span><span class="stat-label">Última Compra</span></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card">
                                        <div class="section-header"><h3>Mis Vehículos Comprados</h3></div>
                                        <div class="vehicles-history" id="vehiclesHistory">
                                            <p style="text-align:center; padding:20px;">Cargando historial...</p>
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
                this.loadVehicleHistory();

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
                                <button class="btn btn-outline">Ver detalles</button>
                                <button class="btn btn-primary">Solicitar importación</button>
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
                                <button class="btn btn-outline">Ver detalles</button>
                                <button class="btn btn-success">Comprar Ahora</button>
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
                        <button class="btn btn-outline btn-sm">Ver Detalles</button>
                        <button class="btn btn-primary btn-sm">Seguimiento</button>
                        <button class="btn btn-success btn-sm">Chat con Vendedor</button>
                    </div>
                </div>
            `).join('');
        }

        loadVehicleHistory() {
            const history = document.getElementById('vehiclesHistory');
            if (!history) return;

            const vehicles = [
                { name: 'Nissan Atlas 2024', order: '#ORD-003', price: 'USD 75,000', date: '15/04/2026', invoice: '#FAC-003' },
                { name: 'Nissan Frontier 2023', order: '#ORD-004', price: 'USD 82,000', date: '20/03/2026', invoice: '#FAC-004' },
                { name: 'Nissan Patrol 2023', order: '#ORD-005', price: 'USD 98,000', date: '10/02/2026', invoice: '#FAC-005' }
            ];

            history.innerHTML = vehicles.map(v => `
                <div class="vehicle-history-item">
                    <div class="vehicle-history-info">
                        <div class="vehicle-history-header">
                            <h4 class="vehicle-history-name">${v.name}</h4>
                            <span class="vehicle-history-status status-completed">Entregado</span>
                        </div>
                        <div class="vehicle-history-details">
                            <div class="detail-item"><i class="fas fa-tag"></i><span>Pedido: ${v.order}</span></div>
                            <div class="detail-item"><i class="fas fa-dollar-sign"></i><span>Precio: ${v.price}</span></div>
                            <div class="detail-item"><i class="fas fa-calendar-check"></i><span>Entrega: ${v.date}</span></div>
                            <div class="detail-item"><i class="fas fa-file-contract"></i><span>Factura: ${v.invoice}</span></div>
                        </div>
                    </div>
                    <div class="vehicle-history-actions">
                        <button class="btn btn-outline btn-sm">Ver Documentos</button>
                        <button class="btn btn-outline btn-sm">Ver Detalles</button>
                        <button class="btn btn-primary btn-sm">Comprar Similar</button>
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

            // Chat
            this.setupChat();
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

        setupChat() {
            window.Importadora.Components.Chat.init({
                messagesId: 'chatMessages',
                inputId: 'chatInput',
                sendBtnId: 'sendMessage',
                responderName: 'Vendedor',
                autoReplyMessage: 'Recibido, te respondo a la brevedad.'
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
