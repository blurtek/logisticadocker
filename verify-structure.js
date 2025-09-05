// Script de verificación de estructura para Plesk
// Ejecutar: node verify-structure.js

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando estructura de archivos para Plesk...\n');

const requiredFiles = [
    'app.js',
    'package.json',
    'backend/dist/index.js',
    'frontend/dist/index.html',
    'public/dist/index.html'
];

const requiredDirs = [
    'backend',
    'frontend',
    'public',
    'shared'
];

let allGood = true;

// Verificar archivos
console.log('📄 Verificando archivos:');
requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - NO ENCONTRADO`);
        allGood = false;
    }
});

console.log('\n📁 Verificando directorios:');
requiredDirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (fs.existsSync(dirPath)) {
        console.log(`✅ ${dir}/`);
    } else {
        console.log(`❌ ${dir}/ - NO ENCONTRADO`);
        allGood = false;
    }
});

console.log('\n🔧 Verificando configuración:');

// Verificar package.json
try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    if (packageJson.main === 'app.js') {
        console.log('✅ package.json main apunta a app.js');
    } else {
        console.log(`❌ package.json main apunta a ${packageJson.main}, debería ser app.js`);
        allGood = false;
    }
} catch (error) {
    console.log('❌ Error leyendo package.json:', error.message);
    allGood = false;
}

// Verificar app.js
try {
    const appJs = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
    if (appJs.includes('require(\'./dist/index.js\')')) {
        console.log('✅ app.js configuración correcta');
    } else {
        console.log('❌ app.js no tiene la configuración correcta');
        allGood = false;
    }
} catch (error) {
    console.log('❌ Error leyendo app.js:', error.message);
    allGood = false;
}

console.log('\n' + '='.repeat(50));

if (allGood) {
    console.log('🎉 ¡Estructura verificada correctamente!');
    console.log('✅ Plesk debería poder detectar y ejecutar la aplicación');
    console.log('\n📋 Configuración en Plesk:');
    console.log('• Archivo de inicio: app.js');
    console.log('• Raíz de aplicación: / (directorio actual)');
    console.log('• Puerto: 3000');
} else {
    console.log('❌ Hay problemas en la estructura');
    console.log('🔧 Ejecuta ./install-simple.sh para corregir');
}

console.log('\n🚀 Para probar manualmente:');
console.log('node app.js');
console.log('\n📋 URLs de prueba:');
console.log('• Panel Admin: http://localhost:3000');
console.log('• Panel Clientes: http://localhost:3000/client');
console.log('• API Health: http://localhost:3000/health');
