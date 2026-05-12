/**
 * Servidor de Desarrollo - Importadora Nissan
 * Servidor HTTP simple usando solo Node.js (sin dependencias externas)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuración
const PORT = 3000;
const HOST = 'localhost';
const PUBLIC_DIR = path.join(__dirname, 'frontend');

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

/**
 * Obtener MIME type basado en extensión de archivo
 */
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Servir archivo estático
 */
function serveFile(filePath, res) {
    // Verificar si el archivo existe
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // Si no existe, servir index.html (para SPA)
            if (path.basename(filePath) !== 'index.html') {
                serveFile(path.join(__dirname, 'frontend', 'public', 'index.html'), res);
                return;
            }
            
            // 404 si ni siquiera index.html existe
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>404 - Página no encontrada</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                        h1 { color: #f44336; }
                    </style>
                </head>
                <body>
                    <h1>404 - Página no encontrada</h1>
                    <p>El archivo solicitado no existe: ${filePath}</p>
                    <a href="/">Volver al inicio</a>
                </body>
                </html>
            `);
            return;
        }

        // Leer y servir el archivo
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>500 - Error del servidor</title>
                        <style>
                            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                            h1 { color: #f44336; }
                        </style>
                    </head>
                    <body>
                        <h1>500 - Error del servidor</h1>
                        <p>No se pudo leer el archivo: ${err.message}</p>
                        <a href="/">Volver al inicio</a>
                    </body>
                    </html>
                `);
                return;
            }

            const mimeType = getMimeType(filePath);
            res.writeHead(200, { 
                'Content-Type': mimeType,
                'Cache-Control': 'no-cache', // Para desarrollo
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            });
            res.end(data);
        });
    });
}

/**
 * Manejar CORS preflight requests
 */
function handleCORS(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return true;
    }
    return false;
}

/**
 * Crear servidor HTTP
 */
const server = http.createServer((req, res) => {
    // Manejar CORS
    if (handleCORS(req, res)) {
        return;
    }

    // Log de la solicitud
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);

    // Caso especial: servir index.html para la raíz
    if (req.url === '/' || req.url === '') {
        serveFile(path.join(__dirname, 'frontend', 'public', 'index.html'), res);
        return;
    }

    // Parsear URL
    const parsedUrl = new URL(req.url, `http://${HOST}:${PORT}`);
    let pathname = parsedUrl.pathname;

    // Construir ruta completa del archivo
    const filePath = path.join(PUBLIC_DIR, pathname);

    // Evitar directory traversal
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>403 - Acceso denegado</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    h1 { color: #f44336; }
                </style>
            </head>
            <body>
                <h1>403 - Acceso denegado</h1>
                <p>No tienes permiso para acceder a este recurso.</p>
                <a href="/">Volver al inicio</a>
            </body>
            </html>
        `);
        return;
    }

    // Servir archivo
    serveFile(filePath, res);
});

/**
 * Manejar errores del servidor
 */
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ El puerto ${PORT} ya está en uso.`);
        console.log(`💡 Intenta usar otro puerto o cierra la aplicación que está usando el puerto ${PORT}`);
    } else {
        console.error('❌ Error del servidor:', err);
    }
    process.exit(1);
});

/**
 * Iniciar servidor
 */
server.listen(PORT, HOST, () => {
    console.log('🚀 Servidor de desarrollo iniciado');
    console.log(`📍 URL: http://${HOST}:${PORT}`);
    console.log(`📂 Directorio público: ${PUBLIC_DIR}`);
    console.log('⏹️  Presiona Ctrl+C para detener el servidor');
    console.log('');
    console.log('🌐 Disponible en:');
    console.log(`   • http://localhost:${PORT}`);
    console.log(`   • http://127.0.0.1:${PORT}`);
    console.log('');
    console.log('🔧 Modo de desarrollo activado:');
    console.log('   • No cache de archivos');
    console.log('   • CORS habilitado');
    console.log('   • Logs detallados');
});

/**
 * Manejar cierre graceful
 */
process.on('SIGINT', () => {
    console.log('\n⏹️  Cerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n⏹️  Cerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
    });
});
