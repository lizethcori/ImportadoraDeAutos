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
                                <i class="fas fa-car"></i>
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

                            <!-- Placeholder Sections -->
                            <section id="imports" class="content-section">
                                <div class="section-header"><h2>Importaciones</h2><p class="section-description">Gestión de importaciones</p></div>
                                <div class="card"><p>Módulo de importaciones en desarrollo...</p></div>
                            </section>
                            <section id="finance" class="content-section">
                                <div class="section-header"><h2>Finanzas</h2><p class="section-description">Estado financiero</p></div>
                                <div class="card"><p>Módulo de finanzas en desarrollo...</p></div>
                            </section>
                            <section id="reports" class="content-section">
                                <div class="section-header"><h2>Reportes</h2><p class="section-description">Reportes del sistema</p></div>
                                <div class="card"><p>Módulo de reportes en desarrollo...</p></div>
                            </section>
                            <section id="settings" class="content-section">
                                <div class="section-header"><h2>Configuración</h2><p class="section-description">Ajustes del sistema</p></div>
                                <div class="card"><p>Módulo de configuración en desarrollo...</p></div>
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
                onSave: () => {
                    const name = document.getElementById('modalUserName').value;
                    const email = document.getElementById('modalUserEmail').value;
                    if (!name || !email) { toast.error('Completa los campos requeridos'); return false; }
                    toast.success('Usuario guardado exitosamente');
                    return true;
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
                            <label>Modelo</label>
                            <input type="text" id="modalVehicleModel" class="form-input" placeholder="Nissan Atlas" required>
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
                    </form>
                `,
                onSave: () => {
                    const model = document.getElementById('modalVehicleModel').value;
                    const year = document.getElementById('modalVehicleYear').value;
                    if (!model || !year) { toast.error('Completa los campos requeridos'); return false; }
                    toast.success('Vehículo guardado exitosamente');
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
