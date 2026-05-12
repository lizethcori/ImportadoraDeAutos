/**
 * Importadora Nissan - DOM Helpers
 * Funciones utilitarias para manipulación del DOM
 */

(function(window) {
    'use strict';

    window.Importadora = window.Importadora || {};
    window.Importadora.Utils = window.Importadora.Utils || {};

    const DOM = {

        /**
         * Selector seguro por ID
         */
        id(elementId) {
            return document.getElementById(elementId);
        },

        /**
         * querySelector seguro
         */
        qs(selector, parent = document) {
            return parent.querySelector(selector);
        },

        /**
         * querySelectorAll como array
         */
        qsa(selector, parent = document) {
            return Array.from(parent.querySelectorAll(selector));
        },

        /**
         * Crear elemento con atributos y contenido
         */
        create(tag, attrs = {}, children = '') {
            const el = document.createElement(tag);
            Object.entries(attrs).forEach(([key, val]) => {
                if (key === 'className') el.className = val;
                else if (key === 'dataset') Object.assign(el.dataset, val);
                else if (key.startsWith('on')) el.addEventListener(key.slice(2).toLowerCase(), val);
                else el.setAttribute(key, val);
            });
            if (typeof children === 'string') el.innerHTML = children;
            else if (children instanceof HTMLElement) el.appendChild(children);
            return el;
        },

        /**
         * Establecer texto en elemento por ID (seguro)
         */
        setText(elementId, text) {
            const el = document.getElementById(elementId);
            if (el) el.textContent = text;
        },

        /**
         * Establecer HTML en elemento por ID (seguro)
         */
        setHTML(elementId, html) {
            const el = document.getElementById(elementId);
            if (el) el.innerHTML = html;
        },

        /**
         * Toggle clase active en un grupo de elementos
         */
        setActive(elements, activeElement, className = 'active') {
            elements.forEach(el => el.classList.remove(className));
            if (activeElement) activeElement.classList.add(className);
        },

        /**
         * Mostrar/ocultar secciones por ID
         */
        showSection(sectionId, containerSelector = '.content-section', navSelector = '.nav-link') {
            DOM.qsa(containerSelector).forEach(s => s.classList.remove('active'));
            DOM.qsa(navSelector).forEach(n => n.classList.remove('active'));

            const section = document.getElementById(sectionId);
            if (section) section.classList.add('active');

            const navLink = document.querySelector(`${navSelector}[data-section="${sectionId}"]`);
            if (navLink) navLink.classList.add('active');
        },

        /**
         * Filtrar filas de tabla por texto
         */
        filterRows(selector, term) {
            DOM.qsa(selector).forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(term.toLowerCase()) ? '' : 'none';
            });
        },

        /**
         * Filtrar elementos por data attribute
         */
        filterByData(selector, attribute, value) {
            DOM.qsa(selector).forEach(el => {
                if (value === 'all') el.style.display = '';
                else el.style.display = el.dataset[attribute] === value ? '' : 'none';
            });
        },

        /**
         * Delegación de eventos
         */
        delegate(parentSelector, eventType, childSelector, handler) {
            const parent = typeof parentSelector === 'string' 
                ? document.querySelector(parentSelector) 
                : parentSelector;
            if (!parent) return;

            parent.addEventListener(eventType, (e) => {
                const target = e.target.closest(childSelector);
                if (target && parent.contains(target)) {
                    handler(e, target);
                }
            });
        }
    };

    window.Importadora.Utils.DOM = DOM;

})(window);
