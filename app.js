// Archivo de inicio para Plesk - MueblesWow
// Este archivo evita problemas con Passenger y rutas

const path = require('path');
const fs = require('fs');

console.log('🚀 Iniciando MueblesWow desde app.js...');
console.log('📁 Directorio actual:', __dirname);

// Verificar que el archivo del backend existe
const backendPath = path.join(__dirname, 'backend', 'dist', 'index.js');
console.log('🔍 Buscando archivo en:', backendPath);

if (!fs.existsSync(backendPath)) {
    console.error('❌ Error: No se encontró el archivo backend/dist/index.js');
    console.error('📁 Archivos en backend:', fs.readdirSync(path.join(__dirname, 'backend')));
    process.exit(1);
}

console.log('✅ Archivo encontrado, iniciando aplicación...');

// Cambiar al directorio del backend
process.chdir(path.join(__dirname, 'backend'));

// Importar y ejecutar la aplicación
try {
    require('./dist/index.js');
} catch (error) {
    console.error('❌ Error al iniciar la aplicación:', error);
    process.exit(1);
}
