/**
 * Importadora Nissan - Admin Dashboard View
 * Vista del dashboard del administrador
 */

(function(window) {
    'use strict';

    window.Importadora = window.Importadora || {};
    window.Importadora.Views = window.Importadora.Views || {};

    /**
     * Admin Dashboard View
     * Extiende BaseView para funcionalidad común
     */
    class AdminView extends window.Importadora.Core.BaseView {
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
                                    <i class="fas fa-user-shield"></i>
                                </div>
                                <div class="user-details">
                                    <span class="user-name" id="userName">${this.currentUser?.name || 'Administrador'}</span>
                                    <span class="user-role">Admin</span>
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
                                        <a href="#" class="nav-link" data-section="users">
                                            <i class="fas fa-users"></i>
                                            <span>Usuarios</span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a href="#" class="nav-link" data-section="vehicles">
                                            <i class="fas fa-car"></i>
                                            <span>Vehículos</span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a href="#" class="nav-link" data-section="orders">
                                            <i class="fas fa-shopping-cart"></i>
                                            <span>Pedidos</span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a href="#" class="nav-link" data-section="imports">
                                            <i class="fas fa-ship"></i>
                                            <span>Importaciones</span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a href="#" class="nav-link" data-section="finance">
                                            <i class="fas fa-dollar-sign"></i>
                                            <span>Finanzas</span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a href="#" class="nav-link" data-section="reports">
                                            <i class="fas fa-chart-bar"></i>
                                            <span>Reportes</span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a href="#" class="nav-link" data-section="settings">
                                            <i class="fas fa-cog"></i>
                                            <span>Configuración</span>
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
                                    <p class="section-description">Vista general del sistema</p>
                                </div>

                                <div class="stats-grid">
                                    <div class="stat-card">
                                        <div class="stat-icon">
                                            <i class="fas fa-users"></i>
                                        </div>
                                        <div class="stat-content">
                                            <div class="stat-number" id="totalUsers">-</div>
                                            <div class="stat-label">Usuarios Totales</div>
                                            <div class="stat-change positive">+12%</div>
                                        </div>
                                    </div>
                                    <div class="stat-card">
                                        <div class="stat-icon">
                                            <i class="fas fa-car"></i>
                                        </div>
                                        <div class="stat-content">
                                            <div class="stat-number" id="totalVehicles">-</div>
                                            <div class="stat-label">Vehículos</div>
                                            <div class="stat-change positive">+8%</div>
                                        </div>
                                    </div>
                                    <div class="stat-card">
                                        <div class="stat-icon">
                                            <i class="fas fa-shopping-cart"></i>
                                        </div>
                                        <div class="stat-content">
                                            <div class="stat-number" id="totalOrders">-</div>
                                            <div class="stat-label">Pedidos Activos</div>
                                            <div class="stat-change negative">-3%</div>
                                        </div>
                                    </div>
                                    <div class="stat-card">
                                        <div class="stat-icon">
                                            <i class="fas fa-dollar-sign"></i>
                                        </div>
                                        <div class="stat-content">
                                            <div class="stat-number" id="totalRevenue">$1.2M</div>
                                            <div class="stat-label">Ingresos</div>
                                            <div class="stat-change positive">+15%</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="content-grid">
                                    <div class="card">
                                        <h3>Actividad Reciente</h3>
                                        <div class="activity-list" id="activityList">
                                            <div class="activity-item">
                                                <div class="activity-icon"><i class="fas fa-spinner fa-spin"></i></div>
                                                <div class="activity-content">
                                                    <div class="activity-title">Cargando actividad...</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card">
                                        <h3>Acciones Rápidas</h3>
                                        <div class="quick-actions">
                                            <button class="btn btn-primary">
                                                <i class="fas fa-user-plus"></i>
                                                Agregar Usuario
                                            </button>
                                            <button class="btn btn-primary">
                                                <i class="fas fa-car"></i>
                                                Agregar Vehículo
                                            </button>
                                            <button class="btn btn-primary">
                                                <i class="fas fa-chart-bar"></i>
                                                Ver Reportes
                                            </button>
                                            <button class="btn btn-primary">
                                                <i class="fas fa-cog"></i>
                                                Configuración
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <!-- Users Section -->
                            <section id="users" class="content-section">
                                <div class="section-header">
                                    <h2>Gestión de Usuarios</h2>
                                    <p class="section-description">Administrar usuarios del sistema</p>
                                </div>
                                <div class="content-grid">
                                    <div class="card">
                                        <div class="card-header">
                                            <h3>Lista de Usuarios</h3>
                                            <button class="btn btn-primary">
                                                <i class="fas fa-user-plus"></i> Agregar Usuario
                                            </button>
                                        </div>
                                        <div class="filters-section">
                                            <div class="search-bar">
                                                <input type="text" id="userSearch" placeholder="Buscar usuario por nombre, email o rol...">
                                                <button class="search-btn"><i class="fas fa-search"></i></button>
                                            </div>
                                            <div class="filter-buttons">
                                                <button class="btn btn-outline active" data-filter="all">Todos</button>
                                                <button class="btn btn-outline" data-filter="admin">Admin</button>
                                                <button class="btn btn-outline" data-filter="vendedor">Vendedor</button>
                                                <button class="btn btn-outline" data-filter="cliente">Cliente</button>
                                            </div>
                                        </div>
                                        <div class="table-container">
                                            <table class="users-table">
                                                <thead>
                                                    <tr>
                                                        <th>Usuario</th>
                                                        <th>Email</th>
                                                        <th>Rol</th>
                                                        <th>Estado</th>
                                                        <th>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="usersTableBody">
                                                    <tr><td colspan="5" style="text-align:center; padding:20px;">Cargando usuarios...</td></tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <!-- Vehicles Section -->
                            <section id="vehicles" class="content-section">
                                <div class="section-header">
                                    <h2>Gestión de Vehículos</h2>
                                    <p class="section-description">Administrar inventario de vehículos</p>
                                </div>
                                <div class="content-grid">
                                    <div class="card">
                                        <div class="card-header">
                                            <h3>Inventario de Vehículos</h3>
                                            <button class="btn btn-primary">
                                                <i class="fas fa-car"></i> Agregar Vehículo
                                            </button>
                                        </div>
                                        <div class="table-container">
                                            <table class="vehicles-table">
                                                <thead>
                                                    <tr>
                                                        <th>Vehículo</th>
                                                        <th>Año</th>
                                                        <th>Precio</th>
                                                        <th>Estado</th>
                                                        <th>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="vehiclesTableBody">
                                                    <tr><td colspan="5" style="text-align:center; padding:20px;">Cargando vehículos...</td></tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <!-- Orders Section -->
                            <section id="orders" class="content-section">
                                <div class="section-header">
                                    <h2>Gestión de Pedidos</h2>
                                    <p class="section-description">Todos los pedidos del sistema</p>
                                </div>
                                <div class="card">
                                    <div class="orders-list" id="ordersListAdmin">
                                        <p style="text-align:center; padding:20px;">Cargando pedidos...</p>
                                    </div>
                                </div>
                            </section>

                            <!-- Imports Section -->
                            <section id="imports" class="content-section">
                                <div class="section-header">
                                    <div class="section-header-content">
                                        <h2>Gestión de Importaciones</h2>
                                        <p class="section-description">Control de vehículos en proceso de importación</p>
                                    </div>
                                </div>
                                <div class="content-grid">
                                    <div class="card">
                                        <div class="card-header">
                                            <h3>Importaciones Activas</h3>
                                            <button class="btn btn-primary" id="addImportBtn">
                                                <i class="fas fa-plus"></i> Nueva Importación
                                            </button>
                                        </div>
                                        <div class="imports-list" id="importsList">
                                            <p style="text-align:center; padding:20px;">Cargando importaciones...</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <!-- Finance Section -->
                            <section id="finance" class="content-section">
                                <div class="section-header">
                                    <div class="section-header-content">
                                        <h2>Estado Financiero</h2>
                                        <p class="section-description">Gestión financiera del negocio</p>
                                    </div>
                                </div>
                                <div class="content-grid">
                                    <div class="card">
                                        <div class="section-header">
                                            <h3>Resumen Financiero</h3>
                                        </div>
                                        <div class="finance-summary">
                                            <div class="finance-item income">
                                                <div class="finance-icon"><i class="fas fa-arrow-up"></i></div>
                                                <div class="finance-info">
                                                    <span class="finance-label">Ingresos Totales</span>
                                                    <span class="finance-value">$1,250,000</span>
                                                </div>
                                            </div>
                                            <div class="finance-item expense">
                                                <div class="finance-icon"><i class="fas fa-arrow-down"></i></div>
                                                <div class="finance-info">
                                                    <span class="finance-label">Egresos Totales</span>
                                                    <span class="finance-value">$850,000</span>
                                                </div>
                                            </div>
                                            <div class="finance-item profit">
                                                <div class="finance-icon"><i class="fas fa-chart-line"></i></div>
                                                <div class="finance-info">
                                                    <span class="finance-label">Ganancia Neta</span>
                                                    <span class="finance-value">$400,000</span>
                                                </div>
                                            </div>
                                            <div class="finance-item margin">
                                                <div class="finance-icon"><i class="fas fa-percentage"></i></div>
                                                <div class="finance-info">
                                                    <span class="finance-label">Margen de Rentabilidad</span>
                                                    <span class="finance-value">32%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card">
                                        <div class="section-header">
                                            <h3>Gestión de Pagos</h3>
                                            <button class="btn btn-primary btn-sm">
                                                <i class="fas fa-plus"></i> Nuevo Pago
                                            </button>
                                        </div>
                                        <div class="payments-list">
                                            <div class="payment-item pending">
                                                <div class="payment-info">
                                                    <span class="payment-client">Cliente: Juan Pérez</span>
                                                    <span class="payment-amount">$85,000</span>
                                                </div>
                                                <span class="payment-status">Pendiente</span>
                                            </div>
                                            <div class="payment-item pending">
                                                <div class="payment-info">
                                                    <span class="payment-client">Cliente: María López</span>
                                                    <span class="payment-amount">$82,000</span>
                                                </div>
                                                <span class="payment-status">Pendiente</span>
                                            </div>
                                            <div class="payment-item paid">
                                                <div class="payment-info">
                                                    <span class="payment-client">Cliente: Carlos Ruiz</span>
                                                    <span class="payment-amount">$98,000</span>
                                                </div>
                                                <span class="payment-status">Pagado</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card">
                                        <div class="section-header">
                                            <h3>Costos de Importación</h3>
                                        </div>
                                        <div class="import-costs-breakdown">
                                            <div class="cost-breakdown-item">
                                                <span class="cost-breakdown-label">Aranceles</span>
                                                <span class="cost-breakdown-value">$37,500</span>
                                            </div>
                                            <div class="cost-breakdown-item">
                                                <span class="cost-breakdown-label">Transporte</span>
                                                <span class="cost-breakdown-value">$25,000</span>
                                            </div>
                                            <div class="cost-breakdown-item">
                                                <span class="cost-breakdown-label">Aduana</span>
                                                <span class="cost-breakdown-value">$15,000</span>
                                            </div>
                                            <div class="cost-breakdown-item">
                                                <span class="cost-breakdown-label">Gastos Operativos</span>
                                                <span class="cost-breakdown-value">$22,500</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card">
                                        <div class="section-header">
                                            <h3>Facturación</h3>
                                            <button class="btn btn-primary btn-sm">
                                                <i class="fas fa-file-invoice"></i> Nueva Factura
                                            </button>
                                        </div>
                                        <div class="invoices-list">
                                            <div class="invoice-item">
                                                <div class="invoice-info">
                                                    <span class="invoice-number">FAC-001</span>
                                                    <span class="invoice-client">Juan Pérez</span>
                                                </div>
                                                <span class="invoice-amount">$85,000</span>
                                                <span class="invoice-status pending">Pendiente</span>
                                            </div>
                                            <div class="invoice-item">
                                                <div class="invoice-info">
                                                    <span class="invoice-number">FAC-002</span>
                                                    <span class="invoice-client">María López</span>
                                                </div>
                                                <span class="invoice-amount">$82,000</span>
                                                <span class="invoice-status pending">Pendiente</span>
                                            </div>
                                            <div class="invoice-item">
                                                <div class="invoice-info">
                                                    <span class="invoice-number">FAC-003</span>
                                                    <span class="invoice-client">Carlos Ruiz</span>
                                                </div>
                                                <span class="invoice-amount">$98,000</span>
                                                <span class="invoice-status paid">Pagada</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <!-- Reports Section -->
                            <section id="reports" class="content-section">
                                <div class="section-header">
                                    <div class="section-header-content">
                                        <h2>Reportes y Métricas</h2>
                                        <p class="section-description">Análisis y estadísticas del negocio</p>
                                    </div>
                                    <div class="reports-actions">
                                        <button class="btn btn-outline btn-sm">
                                            <i class="fas fa-file-pdf"></i> Exportar PDF
                                        </button>
                                        <button class="btn btn-outline btn-sm">
                                            <i class="fas fa-file-excel"></i> Exportar Excel
                                        </button>
                                    </div>
                                </div>
                                <div class="content-grid">
                                    <div class="card">
                                        <div class="section-header">
                                            <h3>Reportes de Ventas</h3>
                                        </div>
                                        <div class="reports-summary">
                                            <div class="report-item">
                                                <span class="report-label">Ventas del Mes</span>
                                                <span class="report-value">$425,000</span>
                                                <span class="report-change positive">+15%</span>
                                            </div>
                                            <div class="report-item">
                                                <span class="report-label">Ventas Anuales</span>
                                                <span class="report-value">$1,250,000</span>
                                                <span class="report-change positive">+22%</span>
                                            </div>
                                            <div class="report-item">
                                                <span class="report-label">Top Cliente</span>
                                                <span class="report-value">Juan Pérez</span>
                                                <span class="report-change">3 compras</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card">
                                        <div class="section-header">
                                            <h3>Vehículos Más Vendidos</h3>
                                        </div>
                                        <div class="top-vehicles-list">
                                            <div class="top-vehicle-item">
                                                <span class="vehicle-rank">#1</span>
                                                <span class="vehicle-name">Nissan Atlas 2024</span>
                                                <span class="vehicle-sales">12 ventas</span>
                                            </div>
                                            <div class="top-vehicle-item">
                                                <span class="vehicle-rank">#2</span>
                                                <span class="vehicle-name">Nissan Frontier 2023</span>
                                                <span class="vehicle-sales">8 ventas</span>
                                            </div>
                                            <div class="top-vehicle-item">
                                                <span class="vehicle-rank">#3</span>
                                                <span class="vehicle-name">Nissan Patrol 2023</span>
                                                <span class="vehicle-sales">6 ventas</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card">
                                        <div class="section-header">
                                            <h3>Importaciones por Mes</h3>
                                        </div>
                                        <div class="import-stats">
                                            <div class="import-stat-item">
                                                <span class="import-month">Enero</span>
                                                <span class="import-count">5</span>
                                                <div class="import-bar" style="width: 50%"></div>
                                            </div>
                                            <div class="import-stat-item">
                                                <span class="import-month">Febrero</span>
                                                <span class="import-count">8</span>
                                                <div class="import-bar" style="width: 80%"></div>
                                            </div>
                                            <div class="import-stat-item">
                                                <span class="import-month">Marzo</span>
                                                <span class="import-count">6</span>
                                                <div class="import-bar" style="width: 60%"></div>
                                            </div>
                                            <div class="import-stat-item">
                                                <span class="import-month">Abril</span>
                                                <span class="import-count">10</span>
                                                <div class="import-bar" style="width: 100%"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card">
                                        <div class="section-header">
                                            <h3>KPIs del Negocio</h3>
                                        </div>
                                        <div class="kpis-grid">
                                            <div class="kpi-card">
                                                <div class="kpi-icon"><i class="fas fa-chart-line"></i></div>
                                                <div class="kpi-info">
                                                    <span class="kpi-label">Tasa de Conversión</span>
                                                    <span class="kpi-value">68%</span>
                                                </div>
                                            </div>
                                            <div class="kpi-card">
                                                <div class="kpi-icon"><i class="fas fa-clock"></i></div>
                                                <div class="kpi-info">
                                                    <span class="kpi-label">Tiempo Promedio Entrega</span>
                                                    <span class="kpi-value">35 días</span>
                                                </div>
                                            </div>
                                            <div class="kpi-card">
                                                <div class="kpi-icon"><i class="fas fa-users"></i></div>
                                                <div class="kpi-info">
                                                    <span class="kpi-label">Clientes Activos</span>
                                                    <span class="kpi-value">24</span>
                                                </div>
                                            </div>
                                            <div class="kpi-card">
                                                <div class="kpi-icon"><i class="fas fa-dollar-sign"></i></div>
                                                <div class="kpi-info">
                                                    <span class="kpi-label">Valor Promedio Venta</span>
                                                    <span class="kpi-value">$52,083</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card">
                                        <div class="section-header">
                                            <h3>Rendimiento Financiero</h3>
                                        </div>
                                        <div class="financial-performance">
                                            <div class="perf-item">
                                                <span class="perf-label">Margen Promedio</span>
                                                <span class="perf-value">32%</span>
                                            </div>
                                            <div class="perf-item">
                                                <span class="perf-label">ROI del Mes</span>
                                                <span class="perf-value">18%</span>
                                            </div>
                                            <div class="perf-item">
                                                <span class="perf-label">Costos Operativos</span>
                                                <span class="perf-value">68% de ingresos</span>
                                            </div>
                                            <div class="perf-item">
                                                <span class="perf-label">Ganancia por Vehículo</span>
                                                <span class="perf-value">$16,667</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card">
                                        <div class="section-header">
                                            <h3>Reportes Disponibles</h3>
                                        </div>
                                        <div class="available-reports">
                                            <button class="report-btn">
                                                <i class="fas fa-chart-bar"></i>
                                                <span>Reporte de Ventas Mensuales</span>
                                            </button>
                                            <button class="report-btn">
                                                <i class="fas fa-car"></i>
                                                <span>Inventario y Rotación</span>
                                            </button>
                                            <button class="report-btn">
                                                <i class="fas fa-ship"></i>
                                                <span>Análisis de Importaciones</span>
                                            </button>
                                            <button class="report-btn">
                                                <i class="fas fa-wallet"></i>
                                                <span>Estado Financiero Completo</span>
                                            </button>
                                            <button class="report-btn">
                                                <i class="fas fa-user-tie"></i>
                                                <span>Rendimiento por Cliente</span>
                                            </button>
                                            <button class="report-btn">
                                                <i class="fas fa-calendar-alt"></i>
                                                <span>Comparación Año vs Año</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <!-- Settings Section -->
                            <section id="settings" class="content-section">
                                <div class="section-header">
                                    <div class="section-header-content">
                                        <h2>Configuración del Sistema</h2>
                                        <p class="section-description">Ajustes y preferencias del negocio</p>
                                    </div>
                                </div>
                                <div class="content-grid">
                                    <div class="card">
                                        <div class="section-header">
                                            <h3>Configuración General</h3>
                                        </div>
                                        <div class="settings-form">
                                            <div class="form-group">
                                                <label>Nombre del Negocio</label>
                                                <input type="text" class="form-input" value="Importadora Nissan">
                                            </div>
                                            <div class="form-group">
                                                <label>Moneda Principal</label>
                                                <select class="form-input">
                                                    <option value="USD" selected>USD - Dólar Estadounidense</option>
                                                    <option value="BOB">BOB - Boliviano</option>
                                                    <option value="EUR">EUR - Euro</option>
                                                </select>
                                            </div>
                                            <div class="form-group">
                                                <label>Zona Horaria</label>
                                                <select class="form-input">
                                                    <option value="America/La_Paz" selected>America/La Paz (UTC-4)</option>
                                                    <option value="America/New_York">America/New York (UTC-5)</option>
                                                    <option value="Europe/Madrid">Europe/Madrid (UTC+1)</option>
                                                </select>
                                            </div>
                                            <div class="form-group">
                                                <label>Idioma</label>
                                                <select class="form-input">
                                                    <option value="es" selected>Español</option>
                                                    <option value="en">English</option>
                                                    <option value="pt">Português</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card">
                                        <div class="section-header">
                                            <h3>Configuración de Negocio</h3>
                                        </div>
                                        <div class="settings-form">
                                            <div class="form-group">
                                                <label>Margen de Ganancia (%)</label>
                                                <input type="number" class="form-input" value="32">
                                            </div>
                                            <div class="form-group">
                                                <label>Costo de Envío Base (USD)</label>
                                                <input type="number" class="form-input" value="5000">
                                            </div>
                                            <div class="form-group">
                                                <label>Tasa de Impuesto (%)</label>
                                                <input type="number" class="form-input" value="13">
                                            </div>
                                            <div class="form-group">
                                                <label>Tiempo Estimado de Entrega (días)</label>
                                                <input type="number" class="form-input" value="35">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card">
                                        <div class="section-header">
                                            <h3>Notificaciones</h3>
                                        </div>
                                        <div class="settings-form">
                                            <div class="form-group checkbox-group">
                                                <label><input type="checkbox" checked> Notificaciones por Email</label>
                                                <label><input type="checkbox" checked> Alertas de Nuevos Pedidos</label>
                                                <label><input type="checkbox" checked> Notificaciones de Pagos</label>
                                                <label><input type="checkbox"> Notificaciones SMS</label>
                                                <label><input type="checkbox"> Alertas de Inventario Bajo</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card">
                                        <div class="section-header">
                                            <h3>Integraciones</h3>
                                        </div>
                                        <div class="integrations-list">
                                            <div class="integration-item">
                                                <div class="integration-info">
                                                    <i class="fas fa-envelope integration-icon"></i>
                                                    <span class="integration-name">Email Service</span>
                                                </div>
                                                <span class="integration-status connected">Conectado</span>
                                            </div>
                                            <div class="integration-item">
                                                <div class="integration-info">
                                                    <i class="fas fa-credit-card integration-icon"></i>
                                                    <span class="integration-name">Pasarela de Pagos</span>
                                                </div>
                                                <span class="integration-status connected">Conectado</span>
                                            </div>
                                            <div class="integration-item">
                                                <div class="integration-info">
                                                    <i class="fas fa-truck integration-icon"></i>
                                                    <span class="integration-name">Servicio de Envío</span>
                                                </div>
                                                <span class="integration-status disconnected">Desconectado</span>
                                            </div>
                                            <div class="integration-item">
                                                <div class="integration-info">
                                                    <i class="fas fa-chart-bar integration-icon"></i>
                                                    <span class="integration-name">Analytics</span>
                                                </div>
                                                <span class="integration-status disconnected">Desconectado</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card">
                                        <div class="section-header">
                                            <h3>Seguridad</h3>
                                        </div>
                                        <div class="settings-form">
                                            <div class="form-group">
                                                <label>Política de Contraseña</label>
                                                <select class="form-input">
                                                    <option value="standard" selected>Estándar (8 caracteres)</option>
                                                    <option value="strong">Fuerte (12+ caracteres, símbolos)</option>
                                                    <option value="strict">Estricta (15+ caracteres, 2FA)</option>
                                                </select>
                                            </div>
                                            <div class="form-group checkbox-group">
                                                <label><input type="checkbox" checked> Autenticación de Dos Factores</label>
                                                <label><input type="checkbox" checked> Log de Actividades</label>
                                                <label><input type="checkbox"> Bloqueo después de 3 intentos fallidos</label>
                                                <label><input type="checkbox" checked> Sesión automática (30 días)</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card">
                                        <div class="section-header">
                                            <h3>Mantenimiento</h3>
                                        </div>
                                        <div class="maintenance-options">
                                            <div class="maintenance-item">
                                                <div class="maintenance-info">
                                                    <i class="fas fa-database maintenance-icon"></i>
                                                    <div class="maintenance-details">
                                                        <span class="maintenance-title">Copia de Seguridad</span>
                                                        <span class="maintenance-last">Última: Hace 2 horas</span>
                                                    </div>
                                                </div>
                                                <button class="btn btn-sm btn-outline">Ejecutar Ahora</button>
                                            </div>
                                            <div class="maintenance-item">
                                                <div class="maintenance-info">
                                                    <i class="fas fa-sync maintenance-icon"></i>
                                                    <div class="maintenance-details">
                                                        <span class="maintenance-title">Sincronización de Datos</span>
                                                        <span class="maintenance-last">Última: Hace 1 hora</span>
                                                    </div>
                                                </div>
                                                <button class="btn btn-sm btn-outline">Sincronizar</button>
                                            </div>
                                            <div class="maintenance-item">
                                                <div class="maintenance-info">
                                                    <i class="fas fa-broom maintenance-icon"></i>
                                                    <div class="maintenance-details">
                                                        <span class="maintenance-title">Limpieza de Cache</span>
                                                        <span class="maintenance-last">Última: Hace 6 horas</span>
                                                    </div>
                                                </div>
                                                <button class="btn btn-sm btn-outline">Limpiar</button>
                                            </div>
                                            <div class="maintenance-item">
                                                <div class="maintenance-info">
                                                    <i class="fas fa-download maintenance-icon"></i>
                                                    <div class="maintenance-details">
                                                        <span class="maintenance-title">Exportar Logs</span>
                                                        <span class="maintenance-last">Última: Hace 1 día</span>
                                                    </div>
                                                </div>
                                                <button class="btn btn-sm btn-outline">Exportar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="settings-actions">
                                    <button class="btn btn-primary">
                                        <i class="fas fa-save"></i> Guardar Cambios
                                    </button>
                                    <button class="btn btn-outline">
                                        <i class="fas fa-undo"></i> Restablecer Valores
                                    </button>
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
                const el = (id) => document.getElementById(id);

                if (el('totalVehicles')) el('totalVehicles').textContent = vehicles.length;

                const orders = await this.mockBackend.getOrders();
                if (el('totalOrders')) el('totalOrders').textContent = orders.length;

                const users = await this.mockBackend.getUsers();
                if (el('totalUsers')) el('totalUsers').textContent = users.length;

                this.loadActivityList(orders);
                this.loadUsersTable(users);
                this.loadVehiclesTable(vehicles);
                this.loadOrdersList(orders);
                this.loadImportsList();

            } catch (error) {
                console.error('❌ Error cargando datos del dashboard:', error);
            }
        }

        loadActivityList(orders) {
            const list = document.getElementById('activityList');
            if (!list || !orders.length) return;

            list.innerHTML = orders.slice(0, 3).map(order => `
                <div class="activity-item">
                    <div class="activity-icon"><i class="fas fa-shopping-cart"></i></div>
                    <div class="activity-content">
                        <div class="activity-title">Pedido ${order.id}</div>
                        <div class="activity-description">${order.vehicle} - ${order.client}</div>
                        <div class="activity-time">${order.date}</div>
                    </div>
                </div>
            `).join('');
        }

        loadUsersTable(users) {
            const tbody = document.getElementById('usersTableBody');
            if (!tbody) return;

            const roleIcons = { admin: 'fa-user-shield', vendedor: 'fa-user-tie', cliente: 'fa-user' };
            tbody.innerHTML = users.map(u => `
                <tr data-role="${u.role}">
                    <td>
                        <div class="user-cell">
                            <div class="user-avatar-small"><i class="fas ${roleIcons[u.role] || 'fa-user'}"></i></div>
                            <div class="user-info">
                                <span class="user-name">${u.name}</span>
                                <span class="user-id">${u.id}</span>
                            </div>
                        </div>
                    </td>
                    <td>${u.email}</td>
                    <td><span class="badge badge-${u.role}">${u.role.charAt(0).toUpperCase() + u.role.slice(1)}</span></td>
                    <td><span class="status-active">Activo</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');
        }

        loadVehiclesTable(vehicles) {
            const tbody = document.getElementById('vehiclesTableBody');
            if (!tbody) return;

            tbody.innerHTML = vehicles.map(v => `
                <tr>
                    <td>
                        <div class="vehicle-info">
                            <img src="${v.image}" alt="${v.brand} ${v.model}" class="vehicle-thumbnail" onerror="this.style.display='none'">
                            <span class="vehicle-name">${v.brand} ${v.model}</span>
                        </div>
                    </td>
                    <td>${v.year}</td>
                    <td>USD ${v.price?.toLocaleString()}</td>
                    <td><span class="${v.available ? 'status-active' : 'status-inactive'}">${v.available ? 'Disponible' : 'No disponible'}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');
        }

        loadOrdersList(orders) {
            const list = document.getElementById('ordersListAdmin');
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
                </div>
            `).join('');
        }

        loadImportsList() {
            const list = document.getElementById('importsList');
            if (!list) return;

            const imports = [
                {
                    id: 'IMP-001',
                    vehicle: 'Nissan Atlas 2024',
                    origin: 'Japón',
                    destination: 'Bolivia',
                    status: 'En Tránsito',
                    progress: 65,
                    estimatedArrival: '2026-06-15',
                    cost: 85000,
                    customs: 12000,
                    documents: ['Factura', 'Bill of Lading', 'Certificado de Origen']
                },
                {
                    id: 'IMP-002',
                    vehicle: 'Nissan Frontier 2023',
                    origin: 'Japón',
                    destination: 'Bolivia',
                    status: 'En Aduana',
                    progress: 85,
                    estimatedArrival: '2026-05-20',
                    cost: 82000,
                    customs: 11500,
                    documents: ['Factura', 'Bill of Lading']
                },
                {
                    id: 'IMP-003',
                    vehicle: 'Nissan Patrol 2023',
                    origin: 'Japón',
                    destination: 'Bolivia',
                    status: 'Pendiente',
                    progress: 15,
                    estimatedArrival: '2026-07-01',
                    cost: 98000,
                    customs: 14000,
                    documents: ['Factura']
                }
            ];

            const statusClass = { 'En Tránsito': 'processing', 'En Aduana': 'pending', 'Entregado': 'completed', 'Pendiente': 'pending' };
            list.innerHTML = imports.map(imp => `
                <div class="import-card" data-status="${statusClass[imp.status] || 'pending'}">
                    <div class="import-header">
                        <div class="import-info">
                            <h3 class="import-vehicle">${imp.vehicle}</h3>
                            <span class="import-id">#${imp.id}</span>
                        </div>
                        <span class="import-status status-${statusClass[imp.status] || 'pending'}">${imp.status}</span>
                    </div>
                    <div class="import-details">
                        <div class="import-detail-item"><i class="fas fa-plane-departure"></i><span>Origen: ${imp.origin}</span></div>
                        <div class="import-detail-item"><i class="fas fa-plane-arrival"></i><span>Destino: ${imp.destination}</span></div>
                        <div class="import-detail-item"><i class="fas fa-calendar"></i><span>Llegada estimada: ${imp.estimatedArrival}</span></div>
                    </div>
                    <div class="import-progress">
                        <div class="progress-bar"><div class="progress-fill" style="width: ${imp.progress}%"></div></div>
                        <span class="progress-text">${imp.progress}% completado</span>
                    </div>
                    <div class="import-costs">
                        <div class="cost-item"><span class="cost-label">Costo:</span><span class="cost-value">USD ${imp.cost.toLocaleString()}</span></div>
                        <div class="cost-item"><span class="cost-label">Aranceles:</span><span class="cost-value">USD ${imp.customs.toLocaleString()}</span></div>
                    </div>
                    <div class="import-documents">
                        <span class="documents-label">Documentos:</span>
                        <div class="documents-list">
                            ${imp.documents.map(doc => `<span class="document-tag">${doc}</span>`).join('')}
                        </div>
                    </div>
                    <div class="import-actions">
                        <button class="btn btn-sm btn-outline"><i class="fas fa-eye"></i> Ver Detalles</button>
                        <button class="btn btn-sm btn-outline"><i class="fas fa-edit"></i> Editar</button>
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

            // User filters
            this.setupUserFilters();
            this.setupUserSearch();

            // Quick actions
            document.querySelectorAll('.quick-actions .btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const text = btn.textContent.trim();
                    if (text.includes('Usuario')) this.showSection('users');
                    else if (text.includes('Vehículo')) this.showSection('vehicles');
                    else if (text.includes('Reportes')) this.showSection('reports');
                    else if (text.includes('Configuración')) this.showSection('settings');
                });
            });

            // Add user button
            const addUserBtn = document.querySelector('#users .btn-primary');
            if (addUserBtn) addUserBtn.addEventListener('click', () => this.showUserModal());

            // Add vehicle button
            const addVehicleBtn = document.querySelector('#vehicles .btn-primary');
            if (addVehicleBtn) addVehicleBtn.addEventListener('click', () => this.showVehicleModal());

            // Add import button
            const addImportBtn = document.getElementById('addImportBtn');
            if (addImportBtn) addImportBtn.addEventListener('click', () => this.showImportModal());

            // Edit/delete buttons (delegation)
            document.addEventListener('click', (e) => {
                const editBtn = e.target.closest('.btn-outline[data-action="edit"]') || (e.target.closest('.btn-outline')?.querySelector('.fa-edit') ? e.target.closest('.btn-outline') : null);
                const deleteBtn = e.target.closest('.btn-danger[data-action="delete"]') || (e.target.closest('.btn-danger')?.querySelector('.fa-trash') ? e.target.closest('.btn-danger') : null);

                if (editBtn) {
                    const row = editBtn.closest('tr');
                    if (row) this.showToast('Función de edición en desarrollo', 'info');
                }
                if (deleteBtn) {
                    const row = deleteBtn.closest('tr');
                    if (row && confirm('¿Estás seguro de que deseas eliminar este registro?')) {
                        row.remove();
                        this.showToast('Registro eliminado', 'success');
                    }
                }
            });
        }

        setupUserFilters() {
            const DOM = window.Importadora.Utils.DOM;
            DOM.qsa('.filter-buttons .btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    DOM.setActive(DOM.qsa('.filter-buttons .btn'), btn);
                    DOM.filterByData('#usersTableBody tr', 'role', btn.getAttribute('data-filter'));
                });
            });
        }

        setupUserSearch() {
            const DOM = window.Importadora.Utils.DOM;
            const input = DOM.id('userSearch');
            const searchBtn = DOM.qs('.search-btn');
            if (!input) return;

            const search = () => DOM.filterRows('#usersTableBody tr', input.value);
            input.addEventListener('input', search);
            if (searchBtn) searchBtn.addEventListener('click', search);
        }

        showUserModal() {
            const modal = window.Importadora.Components.Modal;
            const toast = window.Importadora.Components.Toast;

            modal.open({
                title: 'Agregar Usuario',
                body: `
                    <form id="userForm" class="modal-form">
                        <div class="form-group">
                            <label>Nombre</label>
                            <input type="text" id="modalUserName" class="form-input" placeholder="Nombre completo" required>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="modalUserEmail" class="form-input" placeholder="correo@ejemplo.com" required>
                        </div>
                        <div class="form-group">
                            <label>Rol</label>
                            <select id="modalUserRole" class="form-input">
                                <option value="cliente">Cliente</option>
                                <option value="vendedor">Vendedor</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Contraseña</label>
                            <input type="password" id="modalUserPassword" class="form-input" placeholder="Contraseña">
                        </div>
                    </form>
                `,
                onSave: async () => {
                    const name = document.getElementById('modalUserName').value;
                    const email = document.getElementById('modalUserEmail').value;
                    const role = document.getElementById('modalUserRole').value;
                    const password = document.getElementById('modalUserPassword').value;

                    if (!name || !email) {
                        toast.error('Completa los campos requeridos');
                        return false;
                    }

                    try {
                        // Add user to mockBackend
                        const newUser = {
                            id: 'USR-' + String(Date.now()).slice(-6),
                            name: name,
                            email: email,
                            role: role,
                            password: password || '123456',
                            status: 'activo'
                        };

                        await this.mockBackend.addUser(newUser);

                        // Reload users table
                        const users = await this.mockBackend.getUsers();
                        this.loadUsersTable(users);

                        // Update total users count
                        const totalUsersEl = document.getElementById('totalUsers');
                        if (totalUsersEl) totalUsersEl.textContent = users.length;

                        toast.success('Usuario agregado exitosamente');
                        return true;
                    } catch (error) {
                        console.error('Error al agregar usuario:', error);
                        toast.error('Error al agregar usuario');
                        return false;
                    }
                }
            });
        }

        showVehicleModal() {
            const modal = window.Importadora.Components.Modal;
            const toast = window.Importadora.Components.Toast;

            modal.open({
                title: 'Agregar Vehículo',
                body: `
                    <form id="vehicleForm" class="modal-form">
                        <div class="form-group">
                            <label>Marca</label>
                            <input type="text" id="modalVehicleBrand" class="form-input" placeholder="Nissan" required>
                        </div>
                        <div class="form-group">
                            <label>Modelo</label>
                            <input type="text" id="modalVehicleModel" class="form-input" placeholder="Atlas" required>
                        </div>
                        <div class="form-group">
                            <label>Año</label>
                            <input type="number" id="modalVehicleYear" class="form-input" placeholder="2024" required>
                        </div>
                        <div class="form-group">
                            <label>Precio (USD)</label>
                            <input type="number" id="modalVehiclePrice" class="form-input" placeholder="85000" required>
                        </div>
                        <div class="form-group">
                            <label>Tipo</label>
                            <select id="modalVehicleType" class="form-input">
                                <option value="camion">Camión</option>
                                <option value="importacion">Importación</option>
                                <option value="sedán">Sedán</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Imagen del Vehículo</label>
                            <input type="file" id="modalVehicleImage" class="form-input" accept="image/*">
                            <small style="color: var(--text-secondary);">Selecciona una imagen desde tus archivos</small>
                        </div>
                    </form>
                `,
                onSave: async () => {
                    const brand = document.getElementById('modalVehicleBrand').value;
                    const model = document.getElementById('modalVehicleModel').value;
                    const year = document.getElementById('modalVehicleYear').value;
                    const price = document.getElementById('modalVehiclePrice').value;
                    const type = document.getElementById('modalVehicleType').value;
                    const imageInput = document.getElementById('modalVehicleImage');

                    if (!brand || !model || !year || !price) {
                        toast.error('Completa los campos requeridos');
                        return false;
                    }

                    try {
                        // Process image file if provided
                        let imageUrl = 'https://via.placeholder.com/400x300?text=No+Image';
                        if (imageInput.files && imageInput.files[0]) {
                            imageUrl = await this.readFileAsDataURL(imageInput.files[0]);
                        }

                        // Add vehicle to mockBackend
                        const newVehicle = {
                            id: 'VEH-' + String(Date.now()).slice(-6),
                            brand: brand,
                            model: model,
                            year: parseInt(year),
                            price: parseFloat(price),
                            type: type,
                            image: imageUrl,
                            available: true
                        };

                        await this.mockBackend.addVehicle(newVehicle);

                        // Reload vehicles table
                        const vehicles = await this.mockBackend.getVehicles();
                        this.loadVehiclesTable(vehicles);

                        // Update total vehicles count
                        const totalVehiclesEl = document.getElementById('totalVehicles');
                        if (totalVehiclesEl) totalVehiclesEl.textContent = vehicles.length;

                        toast.success('Vehículo agregado exitosamente');
                        return true;
                    } catch (error) {
                        console.error('Error al agregar vehículo:', error);
                        toast.error('Error al agregar vehículo');
                        return false;
                    }
                }
            });
        }

        readFileAsDataURL(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = (e) => reject(e);
                reader.readAsDataURL(file);
            });
        }

        showImportModal() {
            const modal = window.Importadora.Components.Modal;
            const toast = window.Importadora.Components.Toast;

            modal.open({
                title: 'Nueva Importación',
                body: `
                    <form id="importForm" class="modal-form">
                        <div class="form-group">
                            <label>Vehículo</label>
                            <input type="text" id="modalImportVehicle" class="form-input" placeholder="Nissan Atlas 2024" required>
                        </div>
                        <div class="form-group">
                            <label>Origen</label>
                            <select id="modalImportOrigin" class="form-input">
                                <option value="Japón">Japón</option>
                                <option value="EE.UU.">EE.UU.</option>
                                <option value="Alemania">Alemania</option>
                                <option value="Corea del Sur">Corea del Sur</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Destino</label>
                            <select id="modalImportDestination" class="form-input">
                                <option value="Bolivia">Bolivia</option>
                                <option value="Perú">Perú</option>
                                <option value="Chile">Chile</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Costo (USD)</label>
                            <input type="number" id="modalImportCost" class="form-input" placeholder="85000" required>
                        </div>
                        <div class="form-group">
                            <label>Aranceles (USD)</label>
                            <input type="number" id="modalImportCustoms" class="form-input" placeholder="12000" required>
                        </div>
                        <div class="form-group">
                            <label>Fecha Estimada de Llegada</label>
                            <input type="date" id="modalImportArrival" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label>Documentos</label>
                            <div class="checkbox-group">
                                <label><input type="checkbox" id="docInvoice" value="Factura"> Factura</label>
                                <label><input type="checkbox" id="docBL" value="Bill of Lading"> Bill of Lading</label>
                                <label><input type="checkbox" id="docCO" value="Certificado de Origen"> Certificado de Origen</label>
                                <label><input type="checkbox" id="docInsurance" value="Seguro"> Seguro</label>
                            </div>
                        </div>
                    </form>
                `,
                onSave: () => {
                    const vehicle = document.getElementById('modalImportVehicle').value;
                    const origin = document.getElementById('modalImportOrigin').value;
                    const destination = document.getElementById('modalImportDestination').value;
                    const cost = document.getElementById('modalImportCost').value;
                    const customs = document.getElementById('modalImportCustoms').value;
                    const arrival = document.getElementById('modalImportArrival').value;

                    if (!vehicle || !cost || !arrival) {
                        toast.error('Completa los campos requeridos');
                        return false;
                    }

                    // Collect selected documents
                    const documents = [];
                    if (document.getElementById('docInvoice').checked) documents.push('Factura');
                    if (document.getElementById('docBL').checked) documents.push('Bill of Lading');
                    if (document.getElementById('docCO').checked) documents.push('Certificado de Origen');
                    if (document.getElementById('docInsurance').checked) documents.push('Seguro');

                    toast.success('Importación registrada exitosamente');
                    this.loadImportsList();
                    return true;
                }
            });
        }

        showToast(message, type = 'info') {
            window.Importadora.Components.Toast.show(message, type);
        }
    }

    // Crear instancia global
    window.Importadora.Views.AdminView = new AdminView();

    // Auto-inicialización
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.Importadora.Views.AdminView.init();
        });
    } else {
        window.Importadora.Views.AdminView.init();
    }

})(window);
