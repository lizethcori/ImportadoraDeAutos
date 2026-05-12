/**
 * Importadora Nissan - Modal Component
 * Componente reutilizable de modal/diálogo
 */

(function(window) {
    'use strict';

    window.Importadora = window.Importadora || {};
    window.Importadora.Components = window.Importadora.Components || {};

    class Modal {
        constructor() {
            this.currentModal = null;
        }

        /**
         * Abrir modal con contenido personalizado
         * @param {Object} options - { title, body, onSave, saveText, cancelText }
         */
        open(options = {}) {
            const {
                title = 'Modal',
                body = '',
                onSave = null,
                saveText = 'Guardar',
                cancelText = 'Cancelar',
                size = 'normal'
            } = options;

            this.close(); // Cerrar cualquier modal existente

            const modal = document.createElement('div');
            modal.className = 'modal active';
            modal.innerHTML = `
                <div class="modal-content ${size === 'large' ? 'modal-large' : ''}">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <button class="modal-close"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body">${body}</div>
                    ${onSave ? `
                    <div class="modal-footer">
                        <button class="btn btn-outline modal-cancel">${cancelText}</button>
                        <button class="btn btn-primary modal-save">${saveText}</button>
                    </div>` : ''}
                </div>
            `;

            document.body.appendChild(modal);
            this.currentModal = modal;

            // Event listeners
            const close = () => this.close();
            modal.querySelector('.modal-close').addEventListener('click', close);
            
            const cancelBtn = modal.querySelector('.modal-cancel');
            if (cancelBtn) cancelBtn.addEventListener('click', close);

            // Click outside to close
            modal.addEventListener('click', (e) => {
                if (e.target === modal) close();
            });

            // Save button
            if (onSave) {
                modal.querySelector('.modal-save').addEventListener('click', () => {
                    const result = onSave();
                    if (result !== false) close();
                });
            }

            // ESC to close
            this._escHandler = (e) => { if (e.key === 'Escape') close(); };
            document.addEventListener('keydown', this._escHandler);

            return modal;
        }

        /**
         * Abrir modal de confirmación
         */
        confirm(message, onConfirm) {
            this.open({
                title: 'Confirmar',
                body: `<p style="color: var(--text-primary); font-size: var(--font-size-md);">${message}</p>`,
                saveText: 'Confirmar',
                onSave: () => { onConfirm(); return true; }
            });
        }

        /**
         * Cerrar modal actual
         */
        close() {
            if (this.currentModal) {
                this.currentModal.remove();
                this.currentModal = null;
            }
            if (this._escHandler) {
                document.removeEventListener('keydown', this._escHandler);
                this._escHandler = null;
            }
        }
    }

    // Singleton
    window.Importadora.Components.Modal = new Modal();

})(window);
