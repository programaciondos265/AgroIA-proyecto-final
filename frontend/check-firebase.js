// Script para verificar configuración de Firebase
import { auth } from './src/firebase/config.js';

console.log('🔍 Verificando configuración de Firebase...');

// Verificar si Firebase está inicializado
console.log('Auth object:', auth);
console.log('Auth app:', auth.app);
console.log('Auth config:', auth.app.options);

// Verificar configuración
const config = auth.app.options;
console.log('\n📋 Configuración de Firebase:');
console.log('API Key:', config.apiKey ? '✅ Configurada' : '❌ Faltante');
console.log('Auth Domain:', config.authDomain ? '✅ Configurada' : '❌ Faltante');
console.log('Project ID:', config.projectId ? '✅ Configurada' : '❌ Faltante');
console.log('Storage Bucket:', config.storageBucket ? '✅ Configurada' : '❌ Faltante');
console.log('Messaging Sender ID:', config.messagingSenderId ? '✅ Configurada' : '❌ Faltante');
console.log('App ID:', config.appId ? '✅ Configurada' : '❌ Faltante');

console.log('\n🌐 URLs de Firebase:');
console.log('Auth Domain:', config.authDomain);
console.log('Project ID:', config.projectId);
