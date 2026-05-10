// Modals Module
let modalOpen = false;

// Generic modal functions
function createModal(title, content, footerButtons = []) {
    const modal = document.createElement('div');
    modal.className = 'generic-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="modal-close" onclick="closeGenericModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-footer">
                ${footerButtons.map(btn => `<button class="${btn.className}" onclick="${btn.onclick}">${btn.text}</button>`).join('')}
            </div>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('active');
        modalOpen = true;
    }, 100);
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeGenericModal();
        }
    });
    
    return modal;
}

function closeGenericModal() {
    const modals = document.querySelectorAll('.generic-modal');
    modals.forEach(modal => {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    });
    modalOpen = false;
}

// Alert modal
function showAlert(title, message, type = 'info') {
    const modal = createModal(title, `
        <div class="alert-content">
            <div class="alert-icon">
                <i class="fas ${getAlertIcon(type)}"></i>
            </div>
            <div class="alert-message">
                <p>${message}</p>
            </div>
        </div>
    `, [
        {
            text: 'OK',
            className: `btn ${getAlertButtonClass(type)}`,
            onclick: 'closeGenericModal()'
        }
    ]);
}

function getAlertIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || icons['info'];
}

function getAlertButtonClass(type) {
    const classes = {
        'success': 'btn-success',
        'error': 'btn-danger',
        'warning': 'btn-warning',
        'info': 'btn-primary'
    };
    return classes[type] || classes['info'];
}

// Loading modal
function showLoading(title = 'Cargando...') {
    const modal = createModal(title, `
        <div class="loading-content">
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
            <p>Procesando tu solicitud...</p>
        </div>
    `);
    
    // Prevent closing
    modal.querySelector('.modal-close').style.display = 'none';
    
    return modal;
}

function hideLoading() {
    const modals = document.querySelectorAll('.generic-modal');
    modals.forEach(modal => {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    });
    modalOpen = false;
}
