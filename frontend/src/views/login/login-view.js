/**
 * Importadora Nissan - Login View
 * Vista de login con formulario y autenticación
 */

(function(window) {
    'use strict';

    window.Importadora = window.Importadora || {};
    window.Importadora.Views = window.Importadora.Views || {};

    /**
     * Login View - Vista de autenticación
     */
    class LoginView {
        constructor() {
            this.isLoading = false;
            this.eventBus = null;
            this.authService = null;
            this.router = null;
        }

        /**
         * Inicializar la vista
         */
        init() {
            this.eventBus = window.Importadora.Core.EventBus;
            this.authService = window.Importadora.Services.AuthService;
            this.router = window.Importadora.Core.Router;
            
            if (!this.authService) {
                console.error('❌ AuthService no disponible');
                return;
            }
        }

        /**
         * Mostrar la vista de login
         */
        show() {
            // Renderizar formulario
            this.render();
            
            // Configurar eventos
            this.setupEvents();
        }

        /**
         * Renderizar el formulario de login
         */
        render() {
            const appContainer = document.getElementById('app');
            if (!appContainer) {
                console.error('❌ Contenedor #app no encontrado');
                return;
            }

            appContainer.innerHTML = `
                <div class="login-container">
                    <div class="login-card">
                        <div class="login-header">
                            <div class="logo">
                                <img src="/public/logo.png" alt="Logo" class="logo-img">
                                <h1>Importadora Nissan</h1>
                                <span class="tagline">Sistema Profesional</span>
                            </div>
                        </div>
                        
                        <div class="login-body">
                            <form id="loginForm" class="login-form">
                                <div class="form-group">
                                    <label for="username">
                                        <i class="fas fa-user"></i>
                                        Usuario
                                    </label>
                                    <input type="text" id="username" name="username" required
                                           placeholder="Ingrese su usuario" autocomplete="username">
                                </div>
                                
                                <div class="form-group">
                                    <label for="password">
                                        <i class="fas fa-lock"></i>
                                        Contraseña
                                    </label>
                                    <div class="password-input">
                                        <input type="password" id="password" name="password" required
                                               placeholder="Ingrese su contraseña" autocomplete="current-password">
                                        <button type="button" class="toggle-password" id="togglePasswordBtn">
                                            <i class="fas fa-eye" id="togglePasswordIcon"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="form-options">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="remember">
                                        <span class="checkmark"></span>
                                        Recordarme
                                    </label>
                                    <a href="#" class="forgot-link">¿Olvidaste tu contraseña?</a>
                                </div>
                                
                                <button type="button" id="loginBtn" class="btn btn-primary btn-full">
                                    <i class="fas fa-sign-in-alt" id="loginBtnIcon"></i>
                                    <span id="loginBtnText">Iniciar Sesión</span>
                                </button>
                                
                                <div id="loginError" class="message error" style="display: none;">
                                    <i class="fas fa-exclamation-circle"></i>
                                    <span id="loginErrorMsg"></span>
                                </div>
                            </form>
                            
                            <div class="auth-divider">
                                <span>O accede como</span>
                            </div>
                            
                            <div class="demo-accounts">
                                <button class="btn btn-outline" data-demo="admin">
                                    <i class="fas fa-user-shield"></i>
                                    Administrador
                                </button>
                                <button class="btn btn-outline" data-demo="vendedor">
                                    <i class="fas fa-user-tie"></i>
                                    Vendedor
                                </button>
                                <button class="btn btn-outline" data-demo="cliente">
                                    <i class="fas fa-user"></i>
                                    Cliente
                                </button>
                            </div>
                        </div>
                        
                        <div class="login-footer">
                            <p>&copy; 2024 Importadora Nissan. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </div>
                
                <div id="loadingOverlay" class="loading-overlay hidden">
                    <div class="spinner"></div>
                    <p>Iniciando sesión...</p>
                </div>
                
                <div id="messageContainer" class="message-container"></div>
            `;
        }

        /**
         * Configurar eventos del formulario
         */
        setupEvents() {
            const loginBtn = document.getElementById('loginBtn');
            
            if (!loginBtn) {
                console.error('❌ Botón de login no encontrado');
                return;
            }

            // Botón principal de login
            loginBtn.addEventListener('click', () => this.handleLogin());

            // Submit con Enter en los inputs
            const form = document.getElementById('loginForm');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleLogin();
                });
            }

            // Botones de demo
            document.querySelectorAll('[data-demo]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const role = btn.getAttribute('data-demo');
                    this.loginDemo(role);
                });
            });

            // Toggle visibilidad contraseña
            const toggleBtn = document.getElementById('togglePasswordBtn');
            const toggleIcon = document.getElementById('togglePasswordIcon');
            const passwordInput = document.getElementById('password');
            if (toggleBtn && passwordInput) {
                toggleBtn.addEventListener('click', () => {
                    const isPassword = passwordInput.type === 'password';
                    passwordInput.type = isPassword ? 'text' : 'password';
                    toggleIcon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
                });
            }

            // Limpiar error al escribir
            ['username', 'password'].forEach(id => {
                const input = document.getElementById(id);
                if (input) input.addEventListener('input', () => this.hideError());
            });
        }

        /**
         * Manejar el proceso de login
         */
        async handleLogin() {
            if (this.isLoading) return;

            const username = document.getElementById('username')?.value?.trim();
            const password = document.getElementById('password')?.value;

            if (!username || !password) {
                this.showError('Por favor complete todos los campos');
                return;
            }

            this.setLoginBtn(true);
            this.hideError();

            try {
                const result = await this.authService.login({ username, password });
                
                if (result.success) {
                    // Emitir evento de éxito
                    this.eventBus.emit('login:success', { user: result.user });
                    
                    // Redirigir según rol
                    this.redirectByRole(result.user.role);
                    
                } else {
                    this.showError(result.message || 'Credenciales incorrectas');
                    
                    // Emitir evento de error
                    this.eventBus.emit('login:error', { message: result.message });
                }
                
            } catch (error) {
                console.error('🔐 Error en login:', error);
                this.showError('Error de conexión. Intente nuevamente.');
                
                // Emitir evento de error
                this.eventBus.emit('login:error', { error });
                
            } finally {
                this.setLoginBtn(false);
            }
        }

        /**
         * Redirigir según el rol del usuario
         */
        redirectByRole(role) {
            const routes = {
                'admin': '/dashboard/admin',
                'vendedor': '/dashboard/vendedor',
                'cliente': '/dashboard/cliente'
            };

            const targetRoute = routes[role];
            if (targetRoute) {
                this.router.navigate(targetRoute);
            } else {
                console.error('❌ Rol no reconocido:', role);
                this.showError('Rol de usuario no válido');
            }
        }

        /**
         * Mostrar estado de carga
         */
        setLoginBtn(loading) {
            this.isLoading = loading;

            const loginBtn = document.getElementById('loginBtn');
            const btnIcon = document.getElementById('loginBtnIcon');
            const btnText = document.getElementById('loginBtnText');
            const overlay = document.getElementById('loadingOverlay');

            if (loginBtn) loginBtn.disabled = loading;

            if (loading) {
                if (btnIcon) btnIcon.className = 'fas fa-spinner fa-spin';
                if (btnText) btnText.textContent = 'Iniciando sesión...';
                if (overlay) overlay.classList.remove('hidden');
            } else {
                if (btnIcon) btnIcon.className = 'fas fa-sign-in-alt';
                if (btnText) btnText.textContent = 'Iniciar Sesión';
                if (overlay) overlay.classList.add('hidden');
            }
        }

        /**
         * Mostrar mensaje de error
         */
        showError(message) {
            const errorElement = document.getElementById('loginError');
            const errorMsg = document.getElementById('loginErrorMsg');

            if (errorElement && errorMsg) {
                errorMsg.textContent = message;
                errorElement.style.display = 'flex';

                setTimeout(() => this.hideError(), 5000);
            }
        }

        /**
         * Ocultar mensaje de error
         */
        hideError() {
            const errorElement = document.getElementById('loginError');
            if (errorElement) errorElement.style.display = 'none';
        }

        /**
         * Login rápido con credenciales de demo
         */
        async loginDemo(role) {
            const credentials = {
                'admin':    { username: 'admin',    password: 'admin123' },
                'vendedor': { username: 'vendedor', password: 'vendedor123' },
                'cliente':  { username: 'cliente',  password: 'cliente123' }
            };

            const cred = credentials[role];
            if (!cred) return;

            // Rellenar los campos visualmente
            const usernameEl = document.getElementById('username');
            const passwordEl = document.getElementById('password');
            if (usernameEl) usernameEl.value = cred.username;
            if (passwordEl) passwordEl.value = cred.password;

            // Ejecutar login
            await this.handleLogin();
        }

        /**
         * Limpiar vista
         */
        destroy() {}
    }

    // Crear instancia global
    window.Importadora.Views.LoginView = new LoginView();

    // Auto-inicialización
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.Importadora.Views.LoginView.init();
        });
    } else {
        window.Importadora.Views.LoginView.init();
    }

})(window);
