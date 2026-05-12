// Notifications Module
let notifications = [];
let notificationId = 0;

document.addEventListener('DOMContentLoaded', function() {
    setupNotificationSystem();
    setupNotificationsPage();
});

function setupNotificationSystem() {
    const notificationToggle = document.getElementById('notificationToggle');
    
    // Navigate to notifications page when clicking on bell
    if (notificationToggle) {
        notificationToggle.addEventListener('click', function() {
            console.log('Navigating to notifications page');
            showSection('notifications');
        });
    }
    
    // Initialize with some demo notifications
    addNotification('status-change', 'Tu importación ha cambiado de estado', 'Nissan Big Thumb: Procesando → En Transporte', 'processing');
    addNotification('info', 'Nuevo mensaje del vendedor', 'Tienes una respuesta sobre tu pedido #ORD-002', 'info');
    addNotification('success', 'Pedido completado', 'Nissan Atlas ha sido entregado exitosamente', 'success');
}

function addNotification(type, title, message, category = 'info') {
    const notification = {
        id: ++notificationId,
        type: type,
        category: category,
        title: title,
        message: message,
        timestamp: new Date(),
        read: false
    };
    
    notifications.unshift(notification);
    updateNotificationUI();
    
    console.log('Notification added:', notification);
}

function markAllNotificationsAsRead() {
    notifications.forEach(notification => {
        notification.read = true;
    });
    updateNotificationUI();
}

function clearAllNotifications() {
    notifications = [];
    updateNotificationUI();
    console.log('All notifications cleared');
}

function updateNotificationUI() {
    const notificationList = document.getElementById('fullNotificationList');
    const notificationBadge = document.getElementById('notificationBadge');
    
    if (!notificationList || !notificationBadge) return;
    
    // Update badge count
    const unreadCount = notifications.filter(n => !n.read).length;
    notificationBadge.textContent = unreadCount;
    notificationBadge.style.display = unreadCount > 0 ? 'block' : 'none';
    
    // Update notification list
    if (notifications.length === 0) {
        notificationList.innerHTML = `
            <div class="notification-empty">
                <i class="fas fa-bell-slash"></i>
                <p>No tienes notificaciones</p>
            </div>
        `;
    } else {
        notificationList.innerHTML = notifications.map(notification => `
            <div class="notification-item ${!notification.read ? 'unread' : ''}" data-id="${notification.id}" data-category="${notification.category}">
                <div class="notification-header-content">
                    <div class="notification-icon ${getNotificationIconClass(notification.category)}">
                        <i class="fas ${getNotificationIcon(notification.category)}"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">${notification.title}</div>
                        <div class="notification-message">${notification.message}</div>
                        <div class="notification-time">${formatNotificationTime(notification.timestamp)}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function getNotificationIconClass(category) {
    switch (category) {
        case 'status-change': return 'status-change';
        case 'info': return 'info';
        case 'success': return 'success';
        default: return 'info';
    }
}

function getNotificationIcon(category) {
    switch (category) {
        case 'status-change': return 'fa-exchange-alt';
        case 'info': return 'fa-info-circle';
        case 'success': return 'fa-check-circle';
        default: return 'fa-info-circle';
    }
}

function formatNotificationTime(timestamp) {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} h`;
    return `Hace ${days} días`;
}

// Notifications Page Functionality
function setupNotificationsPage() {
    // Setup notification filters
    setupNotificationFilters();
    
    // Setup notification search
    setupNotificationSearch();
    
    // Setup notification actions
    setupNotificationActions();
}

function setupNotificationFilters() {
    const filterButtons = document.querySelectorAll('.notifications-filters .btn');
    const notificationItems = document.querySelectorAll('.notification-item');
    
    if (filterButtons.length === 0 || notificationItems.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            console.log('Notification filter selected:', filter);
            
            // Filter notification items
            notificationItems.forEach(item => {
                if (filter === 'all') {
                    item.style.display = 'block';
                } else {
                    const itemCategory = item.dataset.category;
                    const isUnread = !item.classList.contains('read');
                    
                    if (filter === 'unread' && isUnread) {
                        item.style.display = 'block';
                    } else if (filter === 'status-change' && itemCategory === 'status-change') {
                        item.style.display = 'block';
                    } else if (filter === 'info' && itemCategory === 'info') {
                        item.style.display = 'block';
                    } else if (filter === 'success' && itemCategory === 'success') {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
        });
    });
}

function setupNotificationSearch() {
    const searchInput = document.getElementById('notificationSearch');
    const searchBtn = document.querySelector('.search-btn');
    
    if (!searchInput || !searchBtn) return;
    
    const performSearch = function() {
        const searchTerm = searchInput.value.toLowerCase();
        console.log('Notification search term:', searchTerm);
        
        const notificationItems = document.querySelectorAll('.notification-item');
        notificationItems.forEach(item => {
            const title = item.querySelector('.notification-title').textContent.toLowerCase();
            const message = item.querySelector('.notification-message').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || message.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    };
    
    searchInput.addEventListener('input', performSearch);
    searchBtn.addEventListener('click', performSearch);
}

function setupNotificationActions() {
    const markAllBtn = document.getElementById('markAllAsRead');
    const clearAllBtn = document.getElementById('clearAllNotifications');
    
    if (markAllBtn) {
        markAllBtn.addEventListener('click', function() {
            markAllNotificationsAsRead();
            console.log('All notifications marked as read');
        });
    }
    
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', function() {
            clearAllNotifications();
            console.log('All notifications cleared');
        });
    }
}

// Helper function to show sections
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        console.log(`${sectionId} section activated`);
    }
}
