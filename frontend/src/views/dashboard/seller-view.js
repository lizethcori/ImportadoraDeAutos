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
                                <img src="/public/logo.png" alt="Logo" class="logo-img">
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

                            <!-- Quotes Section -->
                            <section id="quotes" class="content-section">
                                <div class="section-header">
                                    <div class="section-header-content">
                                        <h2>Cotizaciones de Importación</h2>
                                        <p class="section-description">Crea y gestiona cotizaciones para clientes</p>
                                    </div>
                                    <button class="btn btn-primary" id="newQuoteBtn">
                                        <i class="fas fa-plus"></i> Nueva Cotización
                                    </button>
                                </div>
                                <div class="content-grid">
                                    <div class="card">
                                        <div class="section-header">
                                            <h3>Métricas de Cotizaciones</h3>
                                        </div>
                                        <div class="quotes-metrics">
                                            <div class="metric-item">
                                                <span class="metric-label">Tasa de Conversión</span>
                                                <span class="metric-value">68%</span>
                                            </div>
                                            <div class="metric-item">
                                                <span class="metric-label">Cotizaciones Pendientes</span>
                                                <span class="metric-value">12</span>
                                            </div>
                                            <div class="metric-item">
                                                <span class="metric-label">Monto Total Pendiente</span>
                                                <span class="metric-value">$485,000</span>
                                            </div>
                                            <div class="metric-item">
                                                <span class="metric-label">Cotizaciones Este Mes</span>
                                                <span class="metric-value">28</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card">
                                        <div class="section-header">
                                            <h3>Cotizaciones Enviadas</h3>
                                            <div class="quotes-filters">
                                                <button class="btn btn-sm btn-outline active" data-filter="all">Todas</button>
                                                <button class="btn btn-sm btn-outline" data-filter="pending">Pendientes</button>
                                                <button class="btn btn-sm btn-outline" data-filter="accepted">Aceptadas</button>
                                                <button class="btn btn-sm btn-outline" data-filter="rejected">Rechazadas</button>
                                            </div>
                                        </div>
                                        <div class="quotes-list" id="quotesList">
                                            <p style="text-align:center; padding:20px;">Cargando cotizaciones...</p>
                                        </div>
                                    </div>
                                </div>
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
                            <!-- Commission Section -->
                            <section id="commission" class="content-section">
                                <div class="section-header">
                                    <div class="section-header-content">
                                        <h2>Detalles de Comisión</h2>
                                        <p class="section-description">Historial y métricas de tus comisiones</p>
                                    </div>
                                </div>
                                <div class="content-grid">
                                    <div class="card">
                                        <div class="section-header">
                                            <h3>Resumen de Comisiones</h3>
                                        </div>
                                        <div class="commission-summary">
                                            <div class="commission-item">
                                                <span class="commission-label">Total Acumulado</span>
                                                <span class="commission-value">$12,450</span>
                                            </div>
                                            <div class="commission-item">
                                                <span class="commission-label">Este Mes</span>
                                                <span class="commission-value">$3,450</span>
                                            </div>
                                            <div class="commission-item">
                                                <span class="commission-label">Mes Anterior</span>
                                                <span class="commission-value">$2,280</span>
                                            </div>
                                            <div class="commission-item">
                                                <span class="commission-label">Pendientes de Pago</span>
                                                <span class="commission-value">$1,170</span>
                                            </div>
                                            <div class="commission-item">
                                                <span class="commission-label">Tasa de Comisión</span>
                                                <span class="commission-value">5%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card">
                                        <div class="section-header">
                                            <h3>Información de Pago</h3>
                                        </div>
                                        <div class="payment-info">
                                            <div class="payment-info-item">
                                                <span class="payment-label">Próxima Fecha de Pago</span>
                                                <span class="payment-value">30 de mayo 2026</span>
                                            </div>
                                            <div class="payment-info-item">
                                                <span class="payment-label">Monto Estimado</span>
                                                <span class="payment-value">$3,450</span>
                                            </div>
                                            <div class="payment-info-item">
                                                <span class="payment-label">Método de Pago</span>
                                                <span class="payment-value">Transferencia Bancaria</span>
                                            </div>
                                            <div class="payment-info-item">
                                                <span class="payment-label">Último Pago</span>
                                                <span class="payment-value">30 de abril 2026 - $2,280</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card">
                                        <div class="section-header">
                                            <h3>Métricas de Desempeño</h3>
                                        </div>
                                        <div class="performance-metrics">
                                            <div class="perf-metric">
                                                <span class="perf-label">Promedio por Venta</span>
                                                <span class="perf-value">$575</span>
                                            </div>
                                            <div class="perf-metric">
                                                <span class="perf-label">Meta Mensual</span>
                                                <span class="perf-value">$4,000</span>
                                            </div>
                                            <div class="perf-metric">
                                                <span class="perf-label">Progreso</span>
                                                <span class="perf-value">86%</span>
                                            </div>
                                            <div class="perf-metric">
                                                <span class="perf-label">Top Venta del Mes</span>
                                                <span class="perf-value">$1,250 (Nissan Patrol)</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card">
                                        <div class="section-header">
                                            <h3>Proyecciones</h3>
                                        </div>
                                        <div class="projections">
                                            <div class="projection-item">
                                                <span class="projection-label">Proyección del Mes</span>
                                                <span class="projection-value">$3,850</span>
                                            </div>
                                            <div class="projection-item">
                                                <span class="projection-label">Basado en Ventas Pendientes</span>
                                                <span class="projection-value">$400 adicional</span>
                                            </div>
                                            <div class="projection-item">
                                                <span class="projection-label">Escenario Optimista</span>
                                                <span class="projection-value">$4,200</span>
                                            </div>
                                            <div class="projection-item">
                                                <span class="projection-label">Escenario Pesimista</span>
                                                <span class="projection-value">$3,500</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="card">
                                    <div class="section-header">
                                        <h3>Historial de Comisiones</h3>
                                        <div class="commission-filters">
                                            <button class="btn btn-sm btn-outline active" data-filter="all">Todas</button>
                                            <button class="btn btn-sm btn-outline" data-filter="paid">Pagadas</button>
                                            <button class="btn btn-sm btn-outline" data-filter="pending">Pendientes</button>
                                        </div>
                                    </div>
                                    <div class="commissions-list" id="commissionsList">
                                        <p style="text-align:center; padding:20px;">Cargando comisiones...</p>
                                    </div>
                                </div>
                                <div class="card">
                                    <div class="section-header">
                                        <h3>Comisiones por Mes</h3>
                                    </div>
                                    <div class="monthly-commissions">
                                        <div class="monthly-commission-item">
                                            <span class="month-label">Enero 2026</span>
                                            <span class="month-value">$2,100</span>
                                            <div class="commission-bar" style="width: 53%"></div>
                                        </div>
                                        <div class="monthly-commission-item">
                                            <span class="month-label">Febrero 2026</span>
                                            <span class="month-value">$2,450</span>
                                            <div class="commission-bar" style="width: 62%"></div>
                                        </div>
                                        <div class="monthly-commission-item">
                                            <span class="month-label">Marzo 2026</span>
                                            <span class="month-value">$2,890</span>
                                            <div class="commission-bar" style="width: 73%"></div>
                                        </div>
                                        <div class="monthly-commission-item">
                                            <span class="month-label">Abril 2026</span>
                                            <span class="month-value">$2,280</span>
                                            <div class="commission-bar" style="width: 58%"></div>
                                        </div>
                                        <div class="monthly-commission-item">
                                            <span class="month-label">Mayo 2026</span>
                                            <span class="month-value">$3,450</span>
                                            <div class="commission-bar" style="width: 87%"></div>
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
                const vehicles = await this.vehicleService.getAvailable();
                const orders = await this.mockBackend.getOrders();
                const pendingOrders = orders.filter(o => o.status !== 'Entregado');

                const el = (id) => document.getElementById(id);
                if (el('pendingOrders')) el('pendingOrders').textContent = pendingOrders.length;

                this.loadOrdersList(orders);
                this.loadVehicleGrid(vehicles);
                this.loadClientList();
                this.loadQuotesList();
                this.loadCommissionsList();

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

        loadQuotesList() {
            const list = document.getElementById('quotesList');
            if (!list) return;

            const quotes = [
                {
                    id: 'COT-001',
                    client: 'Juan Pérez',
                    vehicle: 'Nissan Atlas 2024',
                    amount: 92000,
                    status: 'pending',
                    date: '2026-05-10',
                    statusLabel: 'Pendiente'
                },
                {
                    id: 'COT-002',
                    client: 'María García',
                    vehicle: 'Nissan Frontier 2023',
                    amount: 89000,
                    status: 'accepted',
                    date: '2026-05-08',
                    statusLabel: 'Aceptada'
                },
                {
                    id: 'COT-003',
                    client: 'Carlos Ruiz',
                    vehicle: 'Nissan Patrol 2023',
                    amount: 105000,
                    status: 'rejected',
                    date: '2026-05-05',
                    statusLabel: 'Rechazada'
                },
                {
                    id: 'COT-004',
                    client: 'Ana López',
                    vehicle: 'Nissan Resona 2024',
                    amount: 98000,
                    status: 'pending',
                    date: '2026-05-12',
                    statusLabel: 'Pendiente'
                }
            ];

            const statusClass = { 'pending': 'pending', 'accepted': 'accepted', 'rejected': 'rejected', 'expired': 'expired' };
            list.innerHTML = quotes.map(q => `
                <div class="quote-card" data-status="${statusClass[q.status] || 'pending'}">
                    <div class="quote-header">
                        <div class="quote-info">
                            <h4 class="quote-vehicle">${q.vehicle}</h4>
                            <span class="quote-id">#${q.id}</span>
                        </div>
                        <span class="quote-status status-${statusClass[q.status] || 'pending'}">${q.statusLabel}</span>
                    </div>
                    <div class="quote-details">
                        <div class="quote-detail-item"><i class="fas fa-user"></i><span>Cliente: ${q.client}</span></div>
                        <div class="quote-detail-item"><i class="fas fa-calendar"></i><span>Fecha: ${q.date}</span></div>
                        <div class="quote-detail-item"><i class="fas fa-dollar-sign"></i><span>Monto: USD ${q.amount.toLocaleString()}</span></div>
                    </div>
                    <div class="quote-actions">
                        <button class="btn btn-sm btn-outline"><i class="fas fa-eye"></i> Ver Detalles</button>
                        <button class="btn btn-sm btn-outline"><i class="fas fa-file-pdf"></i> PDF</button>
                        ${q.status === 'accepted' ? '<button class="btn btn-sm btn-primary"><i class="fas fa-shopping-cart"></i> Convertir a Pedido</button>' : ''}
                        ${q.status === 'pending' ? '<button class="btn btn-sm btn-outline"><i class="fas fa-redo"></i> Reenviar</button>' : ''}
                    </div>
                </div>
            `).join('');
        }

        loadCommissionsList() {
            const list = document.getElementById('commissionsList');
            if (!list) return;

            const commissions = [
                {
                    id: 'COM-001',
                    saleDate: '2026-05-15',
                    vehicle: 'Nissan Atlas 2024',
                    saleAmount: 92000,
                    commissionAmount: 4600,
                    status: 'paid',
                    statusLabel: 'Pagada',
                    paymentDate: '2026-05-15'
                },
                {
                    id: 'COM-002',
                    saleDate: '2026-05-12',
                    vehicle: 'Nissan Frontier 2023',
                    saleAmount: 89000,
                    commissionAmount: 4450,
                    status: 'pending',
                    statusLabel: 'Pendiente',
                    paymentDate: '-'
                },
                {
                    id: 'COM-003',
                    saleDate: '2026-05-10',
                    vehicle: 'Nissan Patrol 2023',
                    saleAmount: 125000,
                    commissionAmount: 6250,
                    status: 'pending',
                    statusLabel: 'Pendiente',
                    paymentDate: '-'
                },
                {
                    id: 'COM-004',
                    saleDate: '2026-05-08',
                    vehicle: 'Nissan Resona 2024',
                    saleAmount: 95000,
                    commissionAmount: 4750,
                    status: 'paid',
                    statusLabel: 'Pagada',
                    paymentDate: '2026-05-08'
                },
                {
                    id: 'COM-005',
                    saleDate: '2026-05-05',
                    vehicle: 'Nissan Atlas 2024',
                    saleAmount: 85000,
                    commissionAmount: 4250,
                    status: 'paid',
                    statusLabel: 'Pagada',
                    paymentDate: '2026-05-05'
                }
            ];

            const statusClass = { 'paid': 'paid', 'pending': 'pending', 'processing': 'processing' };
            list.innerHTML = commissions.map(c => `
                <div class="commission-card" data-status="${statusClass[c.status] || 'pending'}">
                    <div class="commission-header">
                        <div class="commission-info">
                            <h4 class="commission-vehicle">${c.vehicle}</h4>
                            <span class="commission-id">#${c.id}</span>
                        </div>
                        <span class="commission-status status-${statusClass[c.status] || 'pending'}">${c.statusLabel}</span>
                    </div>
                    <div class="commission-details">
                        <div class="commission-detail-item"><i class="fas fa-calendar"></i><span>Fecha Venta: ${c.saleDate}</span></div>
                        <div class="commission-detail-item"><i class="fas fa-dollar-sign"></i><span>Monto Venta: USD ${c.saleAmount.toLocaleString()}</span></div>
                        <div class="commission-detail-item"><i class="fas fa-percentage"></i><span>Comisión: USD ${c.commissionAmount.toLocaleString()}</span></div>
                        <div class="commission-detail-item"><i class="fas fa-credit-card"></i><span>Pago: ${c.paymentDate}</span></div>
                    </div>
                    <div class="commission-actions">
                        <button class="btn btn-sm btn-outline"><i class="fas fa-eye"></i> Ver Detalles</button>
                        ${c.status === 'pending' ? '<button class="btn btn-sm btn-primary"><i class="fas fa-hand-holding-usd"></i> Solicitar Pago</button>' : ''}
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

            // Quote filters
            this.setupQuoteFilters();

            // Commission filters
            this.setupCommissionFilters();

            // New quote button
            const newQuoteBtn = document.getElementById('newQuoteBtn');
            if (newQuoteBtn) newQuoteBtn.addEventListener('click', () => this.showQuoteModal());

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

        setupQuoteFilters() {
            const DOM = window.Importadora.Utils.DOM;
            DOM.qsa('.quotes-filters .btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    DOM.setActive(DOM.qsa('.quotes-filters .btn'), btn);
                    DOM.filterByData('#quotesList .quote-card', 'status', btn.getAttribute('data-filter'));
                });
            });
        }

        setupCommissionFilters() {
            const DOM = window.Importadora.Utils.DOM;
            DOM.qsa('.commission-filters .btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    DOM.setActive(DOM.qsa('.commission-filters .btn'), btn);
                    DOM.filterByData('#commissionsList .commission-card', 'status', btn.getAttribute('data-filter'));
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

        showQuoteModal() {
            const modal = window.Importadora.Components.Modal;
            const toast = window.Importadora.Components.Toast;

            modal.open({
                title: 'Nueva Cotización',
                body: `
                    <form id="quoteForm" class="modal-form">
                        <div class="form-group">
                            <label>Cliente</label>
                            <select id="modalQuoteClient" class="form-input" required>
                                <option value="">Seleccionar cliente...</option>
                                <option value="juan.perez@email.com">Juan Pérez</option>
                                <option value="maria.garcia@email.com">María García</option>
                                <option value="carlos.ruiz@email.com">Carlos Ruiz</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Vehículo</label>
                            <select id="modalQuoteVehicle" class="form-input" required>
                                <option value="">Seleccionar vehículo...</option>
                                <option value="Nissan Atlas 2024">Nissan Atlas 2024 - $85,000</option>
                                <option value="Nissan Frontier 2023">Nissan Frontier 2023 - $82,000</option>
                                <option value="Nissan Patrol 2023">Nissan Patrol 2023 - $98,000</option>
                                <option value="Nissan Resona 2024">Nissan Resona 2024 - $95,000</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Cantidad</label>
                            <input type="number" id="modalQuoteQuantity" class="form-input" value="1" min="1" required>
                        </div>
                        <div class="form-group">
                            <label>Precio Unitario (USD)</label>
                            <input type="number" id="modalQuotePrice" class="form-input" placeholder="85000" required>
                        </div>
                        <div class="form-group">
                            <label>Costo de Envío (USD)</label>
                            <input type="number" id="modalQuoteShipping" class="form-input" placeholder="5000" required>
                        </div>
                        <div class="form-group">
                            <label>Impuestos (%)</label>
                            <input type="number" id="modalQuoteTax" class="form-input" value="13" required>
                        </div>
                        <div class="form-group">
                            <label>Descuento (USD)</label>
                            <input type="number" id="modalQuoteDiscount" class="form-input" value="0">
                        </div>
                        <div class="form-group">
                            <label>Notas Adicionales</label>
                            <textarea id="modalQuoteNotes" class="form-input" rows="3" placeholder="Detalles adicionales de la cotización..."></textarea>
                        </div>
                        <div class="quote-summary">
                            <div class="summary-item">
                                <span>Subtotal:</span>
                                <span id="quoteSubtotal">$0</span>
                            </div>
                            <div class="summary-item">
                                <span>Impuestos:</span>
                                <span id="quoteTaxAmount">$0</span>
                            </div>
                            <div class="summary-item">
                                <span>Descuento:</span>
                                <span id="quoteDiscountAmount">$0</span>
                            </div>
                            <div class="summary-item total">
                                <span>Total:</span>
                                <span id="quoteTotal">$0</span>
                            </div>
                        </div>
                    </form>
                `,
                onSave: () => {
                    const client = document.getElementById('modalQuoteClient').value;
                    const vehicle = document.getElementById('modalQuoteVehicle').value;
                    const quantity = document.getElementById('modalQuoteQuantity').value;
                    const price = document.getElementById('modalQuotePrice').value;
                    const shipping = document.getElementById('modalQuoteShipping').value;
                    const tax = document.getElementById('modalQuoteTax').value;
                    const discount = document.getElementById('modalQuoteDiscount').value;

                    if (!client || !vehicle || !quantity || !price || !shipping) {
                        toast.error('Completa los campos requeridos');
                        return false;
                    }

                    toast.success('Cotización creada exitosamente');
                    this.loadQuotesList();
                    return true;
                }
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
