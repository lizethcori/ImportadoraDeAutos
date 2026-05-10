# Importadora Nissan

Sistema de gestión para importadora de vehículos Nissan.

## Estructura del Proyecto

```
ImportadoraDeAutos/
├── frontend/                    # Código del cliente
│   ├── pages/                   # Páginas HTML
│   ├── assets/                  # Recursos estáticos
│   │   ├── css/                 # Estilos
│   │   ├── js/                  # JavaScript
│   │   └── images/              # Imágenes
│   └── README.md                # Documentación frontend
├── backend/                     # Código del servidor
│   ├── src/                     # Código fuente
│   │   ├── controllers/         # Lógica de negocio
│   │   ├── routes/              # Rutas API
│   │   ├── middleware/          # Middleware
│   │   └── utils/               # Utilidades
│   ├── data/                    # Datos JSON
│   ├── server.js                # Servidor principal
│   └── README.md                # Documentación backend
└── README.md                    # Documentación general
```

## Funcionalidades

- 🚗 Catálogo de vehículos
- 👥 Gestión de usuarios (Admin, Cliente, Vendedor)
- 📊 Dashboards personalizados
- 🔐 Sistema de autenticación
- 📋 Gestión de pedidos
- 🚢 Sistema de importación

## Tecnologías

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Node.js, Express
- **Datos:** JSON (temporal)

## Instalación

1. Clonar el repositorio
2. Instalar dependencias: `npm install`
3. Iniciar servidor: `npm start`

## Desarrollo

- Frontend en `frontend/`
- Backend en `backend/`
- Datos en `backend/data/`
