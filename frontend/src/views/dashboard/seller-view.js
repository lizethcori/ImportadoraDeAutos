/**
 * Importadora Nissan - Seller Dashboard View
 * Vista del dashboard del vendedor
 */

(function(window) {
    'use strict';

    window.Importadora = window.Importadora || {};
    window.Importadora.Views = window.Importadora.Views || {};

    /**
     * Seller Dashboard View
     * Extiende BaseView para funcionalidad común
     */
    class SellerView extends window.Importadora.Core.BaseView {
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
                                <i class="fas fa-car"></i>
                                <h1>Importadora Nissan</h1>
                            </div>
                        </div>
                        <div class="header-right">
                            <div class="user-info">
                                <div class="user-avatar">
                                    <i class="fas fa-user-tie"></i>
                                </div>
                                <div class="user-details">
                                    <span class="user-name" id="userName">${this.currentUser?.name || 'Vendedor'}</span>
                                    <span class="user-role">Vendedor</span>
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
                                        <a href="#" class="nav-link active" data-section="overview">
                                            <i class="fas fa-tachometer-alt"></i>
                                            <span>Panel General</span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a href="#" class="nav-link" data-section="clients">
                                            <i class="fas fa-users"></i>
                                            <span>Mis Clientes</span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a href="#" class="nav-link" data-section="orders">
                                            <i class="fas fa-shopping-cart"></i>
                                            <span>Pedidos</span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a href="#" class="nav-link" data-section="vehicles">
                                            <i class="fas fa-car"></i>
                                            <span>Autos Disponibles</span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a href="#" class="nav-link" data-section="quotes">
                                            <i class="fas fa-file-invoice-dollar"></i>
                                            <span>Cotizaciones</span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a href="#" class="nav-link" data-section="tracking">
                                            <i class="fas fa-map-marker-alt"></i>
                                            <span>Seguimiento</span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a href="#" class="nav-link" data-section="communication">
                                            <i class="fas fa-comments"></i>
                                            <span>Comunicación</span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a href="#" class="nav-link" data-section="commission">
                                            <i class="fas fa-dollar-sign"></i>
                                            <span>Comisiones</span>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </aside>

                        <!-- Content Area -->
                        <main class="dashboard-content">
                            <!-- Overview Section -->
                            <section id="overview" class="content-section active">
                                <div class="section-header">
                                    <h2>Panel General</h2>
                                    <p class="section-description">Resumen de tus ventas y desempeño</p>
                                </div>

                                <div class="stats-grid">
                                    <div class="stat-card">
                                        <div class="stat-icon"><i class="fas fa-dollar-sign"></i></div>
                                        <div class="stat-content">
                                            <div class="stat-number" id="salesMonth">$45,280</div>
                                            <div class="stat-label">Ventas del Mes</div>
                                            <div class="stat-change positive">+18%</div>
                                        </div>
                                    </div>
                                    <div class="stat-card">
                                        <div class="stat-icon"><i class="fas fa-users"></i></div>
                                        <div class="stat-content">
                                            <div class="stat-number" id="activeClients">28</div>
                                            <div class="stat-label">Clientes Activos</div>
                                            <div class="stat-change positive">+5%</div>
                                        </div>
                                    </div>
                                    <div class="stat-card">
                                        <div class="stat-icon"><i class="fas fa-shopping-cart"></i></div>
                                        <div class="stat-content">
                                            <div class="stat-number" id="pendingOrders">-</div>
                                            <div class="stat-label">Pedidos Pendientes</div>
                                            <div class="stat-change negative">-2%</div>
                                        </div>
                                    </div>
                                    <div class="stat-card">
                                        <div class="stat-icon"><i class="fas fa-trophy"></i></div>
                                        <div class="stat-content">
                                            <div class="stat-number">85%</div>
                                            <div class="stat-label">Meta de Ventas</div>
                                            <div class="stat-change positive">+12%</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="content-grid">
                                    <div class="card">
                                        <h3>Comisión Acumulada</h3>
                                        <div class="commission-info">
                                            <div class="commission-amount">$3,450</div>
                                            <div class="commission-details">
                                                <p>Este mes: $2,280</p>
                                                <p>Mes anterior: $1,170</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card">
                                        <h3>Acciones Rápidas</h3>
                                        <div class="quick-actions">
                                            <button class="btn btn-primary">
                                                <i class="fas fa-user-plus"></i>
                                                Nuevo Cliente
                                            </button>
                                            <button class="btn btn-primary">
                                                <i class="fas fa-file-invoice"></i>
                                                Nueva Cotización
                                            </button>
                                            <button class="btn btn-primary">
                                                <i class="fas fa-car"></i>
                                                Agregar Auto
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <!-- Clients Section -->
                            <section id="clients" class="content-section">
                                <div class="section-header">
                                    <h2>Mis Clientes</h2>
                                    <p class="section-description">Gestiona tu cartera de clientes</p>
                                </div>
                                <div class="card">
                                    <div class="client-list" id="clientList">
                                        <p style="text-align:center; padding:20px;">Cargando clientes...</p>
                                    </div>
                                </div>
                            </section>

                            <!-- Orders Section -->
                            <section id="orders" class="content-section">
                                <div class="section-header">
                                    <h2>Gestión de Pedidos</h2>
                                    <p class="section-description">Crea y procesa pedidos de clientes</p>
                                </div>
                                <div class="card">
                                    <div class="orders-filters">
                                        <button class="btn btn-primary active" data-filter="all">Todos</button>
                                        <button class="btn btn-outline" data-filter="pending">Pendientes</button>
                                        <button class="btn btn-outline" data-filter="processing">En Proceso</button>
                                        <button class="btn btn-outline" data-filter="completed">Completados</button>
                                    </div>
                                    <div class="orders-list" id="ordersList">
                                        <p style="text-align:center; padding:20px;">Cargando pedidos...</p>
                                    </div>
                                </div>
                            </section>

                            <!-- Vehicles Section -->
                            <section id="vehicles" class="content-section">
                                <div class="section-header">
                                    <h2>Autos Disponibles</h2>
                                    <p class="section-description">Sube fotos y gestiona tu inventario</p>
                                </div>
                                <div class="card">
                                    <div class="vehicle-grid" id="vehicleGrid">
                                        <p style="text-align:center; padding:20px;">Cargando vehículos...</p>
                                    </div>
                                </div>
                            </section>

                            <!-- Placeholder Sections -->
                            <section id="quotes" class="content-section">
                                <div class="section-header"><h2>Cotizaciones de Importación</h2><p class="section-description">Crea cotizaciones para clientes</p></div>
                                <div class="card"><p>Formulario de cotización en desarrollo...</p></div>
                            </section>
                            <section id="tracking" class="content-section">
                                <div class="section-header"><h2>Seguimiento de Pedidos</h2><p class="section-description">Estado actual de tus pedidos</p></div>
                                <div class="card"><p>Mapa de seguimiento en desarrollo...</p></div>
                            </section>
                            <section id="communication" class="content-section">
                                <div class="section-header"><h2>Comunicación con Clientes</h2><p class="section-description">Chats con tus clientes</p></div>
                                <div class="card">
                                    <div class="chat-container">
                                        <div class="chat-messages" id="sellerChatMessages"></div>
                                        <input type="text" id="sellerChatInput" placeholder="Escribe tu mensaje...">
                                        <button class="btn btn-primary" id="sendSellerMessage">Enviar</button>
                                    </div>
                                </div>
                            </section>
                            <section id="commission" class="content-section">
                                <div class="section-header"><h2>Detalles de Comisión</h2><p class="section-description">Historial y detalles de tus comisiones</p></div>
                                <div class="card"><p>Historial de comisiones en desarrollo...</p></div>
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
                const vehicles = await this.vehicleService.getAvailable();
                const orders = await this.mockBackend.getOrders();
                const pendingOrders = orders.filter(o => o.status !== 'Entregado');

                const el = (id) => document.getElementById(id);
                if (el('pendingOrders')) el('pendingOrders').textContent = pendingOrders.length;

                this.loadOrdersList(orders);
                this.loadVehicleGrid(vehicles);
                this.loadClientList();

            } catch (error) {
                console.error('❌ Error cargando datos del dashboard:', error);
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
                        <div class="order-detail-item"><i class="fas fa-user"></i><span>Cliente: ${order.client}</span></div>
                        <div class="order-detail-item"><i class="fas fa-calendar"></i><span>Fecha: ${order.date}</span></div>
                        <div class="order-detail-item"><i class="fas fa-dollar-sign"></i><span>Total: ${order.total || 'N/A'}</span></div>
                    </div>
                    <div class="order-actions">
                        <button class="btn btn-outline btn-sm">Ver Detalles</button>
                        <button class="btn btn-primary btn-sm">Seguimiento</button>
                        <button class="btn btn-success btn-sm">Chat con Cliente</button>
                    </div>
                </div>
            `).join('');
        }

        loadVehicleGrid(vehicles) {
            const grid = document.getElementById('vehicleGrid');
            if (!grid) return;

            grid.innerHTML = vehicles.map(v => `
                <div class="vehicle-card">
                    <div class="vehicle-image">
                        <img src="${v.image}" alt="${v.brand} ${v.model}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                        <div class="vehicle-image-placeholder" style="display:none"><i class="fas fa-truck"></i></div>
                    </div>
                    <div class="vehicle-info">
                        <h4>${v.brand} ${v.model}</h4>
                        <p class="vehicle-year">Año: ${v.year}</p>
                        <p class="vehicle-price">USD ${v.price?.toLocaleString()}</p>
                        <span class="vehicle-badge ${v.available ? 'available' : 'unavailable'}">${v.available ? 'Disponible' : 'No disponible'}</span>
                        <div class="vehicle-actions">
                            <button class="btn btn-outline">Ver detalles</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        loadClientList() {
            const list = document.getElementById('clientList');
            if (!list) return;

            const clients = [
                { name: 'Juan Pérez', email: 'juan.perez@email.com', status: 'active', statusLabel: 'Activo' },
                { name: 'María García', email: 'maria.garcia@email.com', status: 'pending', statusLabel: 'Pendiente' }
            ];

            list.innerHTML = clients.map(c => `
                <div class="client-item">
                    <div class="client-info">
                        <h4>${c.name}</h4>
                        <p>${c.email}</p>
                    </div>
                    <div class="client-status">
                        <span class="status-badge ${c.status}">${c.statusLabel}</span>
                    </div>
                </div>
            `).join('');
        }

        /**
         * Configurar eventos
         * Extiende setupEvents() de BaseView
         */
        setupEvents() {
            // Eventos comunes (logout, navegación)
            super.setupEvents();

            // Order filters
            this.setupOrderFilters();

            // Chat
            this.setupChat();
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
                messagesId: 'sellerChatMessages',
                inputId: 'sellerChatInput',
                sendBtnId: 'sendSellerMessage',
                responderName: 'Cliente',
                autoReplyMessage: 'Entendido, gracias por la información.'
            });
        }

    }

    // Crear instancia global
    window.Importadora.Views.SellerView = new SellerView();

    // Auto-inicialización
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.Importadora.Views.SellerView.init();
        });
    } else {
        window.Importadora.Views.SellerView.init();
    }

})(window);
