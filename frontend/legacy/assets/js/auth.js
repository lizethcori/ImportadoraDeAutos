// AuthManager - Sistema de Autenticación
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.sessionTimeout = null;
        this.init();
    }

    init() {
        this.restoreSession();
        this.setupSessionTimeout();
    }

    // Login method
    async login(credentials) {
        console.log('AuthManager.login called with:', credentials);
        try {
            this.showLoading(true);
            
            // Simulate API call
            const response = await this.simulateLogin(credentials);
            console.log('AuthManager.login response:', response);
            
            if (response.success) {
                this.currentUser = response.user;
                console.log('User set:', this.currentUser);
                this.saveSession();
                this.setupSessionTimeout();
                
                this.showMessage('Inicio de sesión exitoso', 'success');
                
                // Redirect based on role
                setTimeout(() => {
                    console.log('Redirecting to dashboard...');
                    this.redirectToDashboard();
                }, 1500);
                
                return { success: true, user: response.user };
            } else {
                console.log('Login failed:', response.message);
                this.showMessage(response.message || 'Error de autenticación', 'error');
                return { success: false, error: response.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showMessage('Error de conexión', 'error');
            return { success: false, error: 'Error de conexión' };
        } finally {
            this.showLoading(false);
        }
    }

    // Real API login call
    async simulateLogin(credentials) {
        console.log('simulateLogin called with:', credentials);
        try {
            console.log('Making API call to /api/login');
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });
            
            console.log('API response status:', response.status);
            const data = await response.json();
            console.log('API response data:', data);
            return data;
        } catch (error) {
            console.error('API login error:', error);
            return {
                success: false,
                message: 'Error de conexión con el servidor'
            };
        }
    }

    // Get password by username
    getPasswordByUser(username) {
        const passwords = {
            'admin': 'admin123',
            'vendedor': 'vendedor123',
            'cliente': 'cliente123'
        };
        return passwords[username] || '';
    }

    // Logout method
    logout() {
        this.currentUser = null;
        sessionStorage.removeItem('userSession');
        localStorage.removeItem('rememberedUser');
        
        if (this.sessionTimeout) {
            clearTimeout(this.sessionTimeout);
            this.sessionTimeout = null;
        }
        
        this.showMessage('Sesión cerrada', 'info');
        
        // Redirect to login
        setTimeout(() => {
            window.location.href = '../pages/index.html';
        }, 1000);
    }

    // Save session to sessionStorage
    saveSession() {
        if (this.currentUser) {
            sessionStorage.setItem('userSession', JSON.stringify(this.currentUser));
        }
    }

    // Restore session from sessionStorage
    restoreSession() {
        const savedSession = sessionStorage.getItem('userSession');
        if (savedSession) {
            try {
                this.currentUser = JSON.parse(savedSession);
                this.setupSessionTimeout();
            } catch (error) {
                console.error('Error restoring session:', error);
                this.logout();
            }
        }
    }

    // Setup session timeout
    setupSessionTimeout() {
        if (this.sessionTimeout) {
            clearTimeout(this.sessionTimeout);
        }
        
        // Auto logout after 30 minutes
        this.sessionTimeout = setTimeout(() => {
            this.showMessage('Sesión expirada', 'warning');
            this.logout();
        }, 30 * 60 * 1000);
    }

    // Redirect to appropriate dashboard
    redirectToDashboard() {
        if (!this.currentUser) return;
        
        let targetRoute;
        switch (this.currentUser.role) {
            case 'admin':
                targetRoute = '../pages/dashboard-admin.html';
                break;
            case 'vendedor':
                targetRoute = '../pages/dashboard-vendedor.html';
                break;
            case 'cliente':
                targetRoute = '../pages/dashboard-cliente.html';
                break;
            default:
                targetRoute = '../pages/index.html';
        }
        
        window.location.href = targetRoute;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check user permissions
    hasPermission(permission) {
        const permissions = {
            'admin': ['read', 'write', 'delete', 'manage_users', 'manage_system'],
            'vendedor': ['read', 'write', 'manage_vehicles', 'manage_sales'],
            'cliente': ['read', 'manage_profile', 'make_purchases']
        };
        
        const userPermissions = permissions[this.currentUser.role] || [];
        return userPermissions.includes(permission);
    }

    // Show loading overlay
    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.toggle('hidden', !show);
        }
    }

    // Show message
    showMessage(message, type = 'info') {
        const container = document.getElementById('messageContainer');
        if (!container) return;
        
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.innerHTML = `
            <i class="fas fa-${this.getIconForType(type)}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(messageEl);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 5000);
    }

    // Get icon for message type
    getIconForType(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Remember user functionality
    rememberUser(username) {
        const rememberCheckbox = document.getElementById('remember');
        if (rememberCheckbox && rememberCheckbox.checked) {
            localStorage.setItem('rememberedUser', username);
        } else {
            localStorage.removeItem('rememberedUser');
        }
    }

    // Load remembered user
    loadRememberedUser() {
        const rememberedUser = localStorage.getItem('rememberedUser');
        const usernameInput = document.getElementById('username');
        const rememberCheckbox = document.getElementById('remember');
        
        if (rememberedUser && usernameInput) {
            usernameInput.value = rememberedUser;
            if (rememberCheckbox) {
                rememberCheckbox.checked = true;
            }
        }
    }

    // Validate form
    validateForm(formData) {
        const errors = [];
        
        if (!formData.username) {
            errors.push('El usuario es requerido');
        }
        
        if (!formData.password) {
            errors.push('La contraseña es requerida');
        }
        
        if (formData.password && formData.password.length < 6) {
            errors.push('La contraseña debe tener al menos 6 caracteres');
        }
        
        return errors;
    }

    // Format user display name
    formatUserName(user) {
        if (!user) return '';
        return user.name || user.username || 'Usuario';
    }

    // Get user initials for avatar
    getUserInitials(user) {
        if (!user) return 'U';
        
        const name = user.name || user.username || '';
        const parts = name.split(' ');
        
        if (parts.length >= 2) {
            return parts[0][0] + parts[1][0];
        } else {
            return name.substring(0, 2).toUpperCase();
        }
    }
}

// Create global auth instance
const auth = new AuthManager();
