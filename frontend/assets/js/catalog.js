// Catalog Module
document.addEventListener('DOMContentLoaded', function() {
    setupCatalogTabs();
    setupCatalogFilters();
});

function setupCatalogTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (tabButtons.length === 0 || tabPanes.length === 0) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            const targetPane = document.getElementById(`${targetTab}-content`);
            if (targetPane) {
                targetPane.classList.add('active');
                console.log('Pane activated:', targetPane.id);
            } else {
                console.error('Pane not found:', `${targetTab}-content`);
            }
        });
    });
}

function setupCatalogFilters() {
    const filterButtons = document.querySelectorAll('.catalog-filters .btn');
    const vehicleCards = document.querySelectorAll('.vehicle-card');
    
    if (filterButtons.length === 0 || vehicleCards.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            console.log('Catalog filter selected:', filter);
            
            // Filter vehicle cards
            vehicleCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else {
                    const cardType = card.dataset.type;
                    if (cardType === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
}
