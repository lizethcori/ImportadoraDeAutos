// Servidor simple para desarrollo
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// Ruta principal - servir el login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/pages/index.html'));
});

// Rutas para las páginas (para que funcionen las redirecciones)
app.get('/pages/:page', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, `frontend/pages/${page}`));
});

// Rutas para assets
app.get('/assets/:type/:file', (req, res) => {
    const type = req.params.type;
    const file = req.params.file;
    
    // Headers para evitar caché
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.sendFile(path.join(__dirname, `frontend/assets/${type}/${file}`));
});

// API endpoint simple para login (simulado)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    // Usuarios predefinidos
    const users = {
        'admin': { 
            id: '1', 
            username: 'admin', 
            role: 'admin', 
            name: 'Administrador',
            email: 'admin@importadora.com'
        },
        'vendedor': { 
            id: '2', 
            username: 'vendedor', 
            role: 'vendedor', 
            name: 'Vendedor',
            email: 'vendedor@importadora.com'
        },
        'cliente': { 
            id: '3', 
            username: 'cliente', 
            role: 'cliente', 
            name: 'Cliente',
            email: 'cliente@importadora.com'
        }
    };
    
    const passwords = {
        'admin': 'admin123',
        'vendedor': 'vendedor123',
        'cliente': 'cliente123'
    };
    
    const user = users[username];
    if (user && passwords[username] === password) {
        res.json({ 
            success: true, 
            user: user
        });
    } else {
        res.json({ 
            success: false, 
            message: 'Usuario o contraseña incorrectos' 
        });
    }
});

// API para catálogo de vehículos
app.get('/api/vehicles', (req, res) => {
    const vehicles = [
        {
            id: 1,
            brand: 'Nissan',
            model: 'Sentra',
            year: 2024,
            price: 18500,
            type: 'Sedán',
            transmission: 'Automática',
            fuel: 'Gasolina',
            seats: 5,
            color: 'Blanco',
            image: '/assets/images/nissan-sentra.jpg',
            description: 'Sedán compacto con excelente rendimiento de combustible y tecnología avanzada.',
            features: ['Control crucero', 'Bluetooth', 'Cámara de reversa', 'Sensores de estacionamiento'],
            available: true
        },
        {
            id: 2,
            brand: 'Nissan',
            model: 'Versa',
            year: 2024,
            price: 15200,
            type: 'Hatchback',
            transmission: 'Manual',
            fuel: 'Gasolina',
            seats: 5,
            color: 'Gris',
            image: '/assets/images/nissan-versa.jpg',
            description: 'Hatchback versátil perfecto para la ciudad con gran espacio interior.',
            features: ['Pantalla táctil', 'Aire acondicionado', 'Frenos ABS', 'Airbags'],
            available: true
        },
        {
            id: 3,
            brand: 'Nissan',
            model: 'Altima',
            year: 2024,
            price: 24500,
            type: 'Sedán',
            transmission: 'Automática',
            fuel: 'Gasolina',
            seats: 5,
            color: 'Negro',
            image: '/assets/images/nissan-altima.jpg',
            description: 'Sedán deportivo con tecnología avanzada y lujo interior.',
            features: ['Asientos de cuero', 'Navegación GPS', 'Techo corredizo', 'Sistema de audio premium'],
            available: true
        },
        {
            id: 4,
            brand: 'Nissan',
            model: 'Kicks',
            year: 2024,
            price: 19800,
            type: 'SUV',
            transmission: 'Automática',
            fuel: 'Gasolina',
            seats: 5,
            color: 'Azul',
            image: '/assets/images/nissan-kicks.jpg',
            description: 'SUV compacto ideal para aventuras urbanas y familiares.',
            features: ['Tracción 4x4', 'Control de estabilidad', 'Cámara 360°', 'Asistente de carril'],
            available: true
        },
        {
            id: 5,
            brand: 'Nissan',
            model: 'Pathfinder',
            year: 2024,
            price: 32500,
            type: 'SUV',
            transmission: 'Automática',
            fuel: 'Gasolina',
            seats: 7,
            color: 'Plateado',
            image: '/assets/images/nissan-pathfinder.jpg',
            description: 'SUV familiar con capacidad para 7 pasajeros y gran potencia.',
            features: ['Tercera fila de asientos', 'Control de tracción', 'Sistema de entretenimiento', 'Porta equipajes'],
            available: true
        },
        {
            id: 6,
            brand: 'Nissan',
            model: 'Frontier',
            year: 2024,
            price: 28900,
            type: 'Pickup',
            transmission: 'Manual',
            fuel: 'Diesel',
            seats: 5,
            color: 'Rojo',
            image: '/assets/images/nissan-frontier.jpg',
            description: 'Pickup robusta perfecta para trabajo y aventuras.',
            features: ['Cabina doble', 'Capacidad de carga 1 ton', '4x4', 'Gancho de remolque'],
            available: true
        }
    ];
    
    res.json(vehicles);
});

// API para obtener vehículo específico
app.get('/api/vehicles/:id', (req, res) => {
    const vehicleId = parseInt(req.params.id);
    
    // Mock database
    const vehicles = [
        {
            id: 1,
            brand: 'Nissan',
            model: 'Sentra',
            year: 2024,
            price: 18500,
            type: 'Sedán',
            transmission: 'Automática',
            fuel: 'Gasolina',
            seats: 5,
            color: 'Blanco',
            image: '/assets/images/nissan-sentra.jpg',
            description: 'Sedán compacto con excelente rendimiento de combustible y tecnología avanzada.',
            features: ['Control crucero', 'Bluetooth', 'Cámara de reversa', 'Sensores de estacionamiento'],
            available: true
        },
        {
            id: 2,
            brand: 'Nissan',
            model: 'Versa',
            year: 2024,
            price: 15200,
            type: 'Hatchback',
            transmission: 'Manual',
            fuel: 'Gasolina',
            seats: 5,
            color: 'Gris',
            image: '/assets/images/nissan-versa.jpg',
            description: 'Hatchback versátil perfecto para la ciudad con gran espacio interior.',
            features: ['Pantalla táctil', 'Aire acondicionado', 'Frenos ABS', 'Airbags'],
            available: true
        }
    ];
    
    const vehicle = vehicles.find(v => v.id === vehicleId);
    
    if (vehicle) {
        res.json(vehicle);
    } else {
        res.status(404).json({ error: 'Vehículo no encontrado' });
    }
});

// API para procesar compra
app.post('/api/purchase', (req, res) => {
    const { vehicleId, customerInfo } = req.body;
    
    // Simulación de procesamiento
    const order = {
        id: Math.floor(Math.random() * 10000) + 1000,
        vehicleId: vehicleId,
        customerInfo: customerInfo,
        status: 'pending',
        createdAt: new Date(),
        estimatedDelivery: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días
    };
    
    // Simular delay de procesamiento
    setTimeout(() => {
        res.json({
            success: true,
            order: order,
            message: 'Pedido procesado exitosamente'
        });
    }, 1000);
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).send(`
        <html>
        <head>
            <title>Página no encontrada</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    background: #1b305b; 
                    color: white; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    min-height: 100vh; 
                    margin: 0;
                    text-align: center;
                }
                .container { 
                    background: rgba(255,255,255,0.1); 
                    padding: 2rem; 
                    border-radius: 10px; 
                    backdrop-filter: blur(10px);
                }
                h1 { color: #00b4d8; }
                a { color: #00b4d8; text-decoration: none; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚗 Página no encontrada</h1>
                <p>La página que buscas no existe.</p>
                <a href="/">Volver al login</a>
            </div>
        </body>
        </html>
    `);
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚗 Importadora Nissan - Servidor iniciado`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🔧 Modo: Desarrollo`);
    console.log(`📅 Fecha: ${new Date().toLocaleString()}`);
    console.log('');
    console.log('Credenciales de demo:');
    console.log('  Admin: admin / admin123');
    console.log('  Vendedor: vendedor / vendedor123');
    console.log('  Cliente: cliente / cliente123');
    console.log('');
});
