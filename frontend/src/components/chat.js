/**
 * Importadora Nissan - Chat Component
 * Componente reutilizable de chat/mensajería
 */

(function(window) {
    'use strict';

    window.Importadora = window.Importadora || {};
    window.Importadora.Components = window.Importadora.Components || {};

    class Chat {
        /**
         * Inicializar chat en un contenedor
         * @param {Object} options - { messagesId, inputId, sendBtnId, responderName, autoReply }
         */
        init(options = {}) {
            const {
                messagesId,
                inputId,
                sendBtnId,
                responderName = 'Sistema',
                autoReply = true,
                autoReplyMessage = 'Recibido, te respondo a la brevedad.',
                autoReplyDelay = 1500
            } = options;

            const messagesEl = document.getElementById(messagesId);
            const inputEl = document.getElementById(inputId);
            const sendBtn = document.getElementById(sendBtnId);

            if (!messagesEl || !inputEl || !sendBtn) return;

            const sendMessage = () => {
                const text = inputEl.value.trim();
                if (!text) return;

                // Add user message
                this.addMessage(messagesEl, text, 'user');
                inputEl.value = '';

                // Auto reply
                if (autoReply) {
                    setTimeout(() => {
                        this.addMessage(messagesEl, `${responderName}: ${autoReplyMessage}`, 'system');
                    }, autoReplyDelay);
                }
            };

            sendBtn.addEventListener('click', sendMessage);
            inputEl.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage();
            });
        }

        /**
         * Agregar mensaje al chat
         */
        addMessage(container, text, type = 'user') {
            const now = new Date();
            const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

            const msg = document.createElement('div');
            msg.className = `chat-message ${type}`;
            msg.innerHTML = `
                <div class="message-content">
                    <div class="message-text">${text}</div>
                    <div class="message-time">${time}</div>
                </div>
            `;

            container.appendChild(msg);
            container.scrollTop = container.scrollHeight;
        }

        /**
         * Agregar mensaje del sistema
         */
        addSystemMessage(containerId, text) {
            const container = document.getElementById(containerId);
            if (!container) return;
            this.addMessage(container, text, 'system');
        }
    }

    // Singleton
    window.Importadora.Components.Chat = new Chat();

})(window);
