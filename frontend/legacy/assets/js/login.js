// Login Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');
    
    // Load remembered user if exists
    auth.loadRememberedUser();
    
    // Check if user is already logged in
    if (auth.isAuthenticated()) {
        auth.showMessage('Sesión activa como ' + auth.formatUserName(auth.getCurrentUser()), 'success');
        setTimeout(() => {
            auth.redirectToDashboard();
        }, 1500);
        return;
    }
    
    // Form submission handler
    if (loginForm) {
        console.log('Login form found, adding submit handler');
        loginForm.addEventListener('submit', async function(e) {
            console.log('Form submitted manually');
            e.preventDefault();
            
            const formData = {
                username: usernameInput.value.trim(),
                password: passwordInput.value
            };
            
            console.log('Form data:', formData);
            
            // Validate form
            const errors = auth.validateForm(formData);
            if (errors.length > 0) {
                console.log('Validation errors:', errors);
                auth.showMessage(errors[0], 'error');
                return;
            }
            
            console.log('Attempting manual login...');
            // Attempt login
            const result = await auth.login(formData);
            console.log('Login result:', result);
            
            if (result.success) {
                console.log('Manual login successful');
                // Remember user if checkbox is checked
                auth.rememberUser(formData.username);
            } else {
                console.log('Manual login failed:', result);
            }
        });
    } else {
        console.error('Login form not found!');
    }
    
    // Demo account buttons
    setupDemoButtons();
    
    // Password visibility toggle
    setupPasswordToggle();
    
    // Form field animations
    setupFieldAnimations();
});

// Setup demo account buttons
function setupDemoButtons() {
    const demoButtons = document.querySelectorAll('.demo-accounts .btn');
    
    demoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const role = this.textContent.toLowerCase().trim();
            const credentials = getDemoCredentials(role);
            
            if (credentials) {
                // Fill form fields
                document.getElementById('username').value = credentials.username;
                document.getElementById('password').value = credentials.password;
                
                // Show visual feedback
                auth.showMessage(`Credenciales de ${role} cargadas`, 'info');
                
                // Auto-submit after a short delay
                setTimeout(() => {
                    document.getElementById('loginForm').dispatchEvent(new Event('submit'));
                }, 1000);
            }
        });
    });
}

// Get demo credentials
function getDemoCredentials(role) {
    const credentials = {
        'administrador': { username: 'admin', password: 'admin123' },
        'vendedor': { username: 'vendedor', password: 'vendedor123' },
        'cliente': { username: 'cliente', password: 'cliente123' }
    };
    
    // Handle button text variations
    if (role.includes('admin')) return credentials['administrador'];
    if (role.includes('vendedor')) return credentials['vendedor'];
    if (role.includes('cliente')) return credentials['cliente'];
    
    return null;
}

// Setup password visibility toggle
function setupPasswordToggle() {
    const toggleButton = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    
    if (toggleButton && passwordInput) {
        toggleButton.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Update icon
            const icon = this.querySelector('i');
            if (icon) {
                icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
            }
        });
    }
}

// Setup field animations
function setupFieldAnimations() {
    const inputs = document.querySelectorAll('.form-group input');
    
    inputs.forEach(input => {
        // Focus animations
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if field has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
}

// Toggle password visibility (global function for onclick)
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleButton = document.querySelector('.toggle-password');
    
    if (passwordInput && toggleButton) {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = toggleButton.querySelector('i');
        if (icon) {
            icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        }
    }
}

// Login with demo account (global function for onclick)
function loginDemo(role) {
    const credentials = getDemoCredentials(role);
    
    if (credentials) {
        document.getElementById('username').value = credentials.username;
        document.getElementById('password').value = credentials.password;
        
        auth.showMessage(`Credenciales de ${role} cargadas`, 'info');
        
        setTimeout(() => {
            document.getElementById('loginForm').dispatchEvent(new Event('submit'));
        }, 1000);
    }
}

// Manual login function - DIRECT CALL
function manualLogin() {
    console.log('Manual login button clicked');

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    console.log('Username:', username, 'Password:', password);

    if (!username || !password) {
        console.log('Missing fields');
        auth.showMessage('Por favor ingresa usuario y contraseña', 'error');
        return;
    }

    // Direct API call
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        console.log('API Response status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('API Response data:', data);

        if (data.success) {
            console.log('Login successful, saving session');
            sessionStorage.setItem('userSession', JSON.stringify(data.user));
            auth.showMessage('Login exitoso', 'success');

            setTimeout(() => {
                console.log('Redirecting to dashboard');
                window.location.href = 'dashboard-admin.html';
            }, 1000);
        } else {
            console.log('Login failed:', data.message);
            auth.showMessage(data.message || 'Usuario o contraseña incorrectos', 'error');
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        auth.showMessage('Error de conexión', 'error');
    });
}

// Handle keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.dispatchEvent(new Event('submit'));
        }
    }

    // Escape to clear form
    if (e.key === 'Escape') {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.reset();
            auth.showMessage('Formulario limpiado', 'info');
        }
    }
});

// Add loading states to buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn') && e.target.type === 'submit') {
        const originalText = e.target.innerHTML;
        e.target.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
        e.target.disabled = true;
        
        // Reset after 5 seconds (in case of error)
        setTimeout(() => {
            e.target.innerHTML = originalText;
            e.target.disabled = false;
        }, 5000);
    }
});

// Handle network connectivity
window.addEventListener('online', function() {
    auth.showMessage('Conexión restaurada', 'success');
});

window.addEventListener('offline', function() {
    auth.showMessage('Sin conexión a internet', 'error');
});

// Add touch support for mobile
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
}

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    
    // Show performance warning if slow
    if (loadTime > 3000) {
        auth.showMessage('La página está cargando lentamente', 'warning');
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    auth.showMessage('Ocurrió un error inesperado', 'error');
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    auth.showMessage('Error de conexión', 'error');
});
