// Script para crear usuario de prueba en Firebase
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './src/firebase/config.ts';

const testEmail = 'test@agroia.com';
const testPassword = 'test123456';

async function testFirebaseAuth() {
  console.log('🔍 Probando Firebase Authentication...');
  
  try {
    // Intentar crear un usuario de prueba
    console.log('📝 Creando usuario de prueba...');
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    console.log('✅ Usuario creado exitosamente:', userCredential.user.email);
    
    // Intentar hacer login
    console.log('🔐 Probando login...');
    const loginCredential = await signInWithEmailAndPassword(auth, testEmail, testPassword);
    console.log('✅ Login exitoso:', loginCredential.user.email);
    
  } catch (error: any) {
    console.error('❌ Error:', error.code, error.message);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️ El usuario ya existe, probando login...');
      try {
        const loginCredential = await signInWithEmailAndPassword(auth, testEmail, testPassword);
        console.log('✅ Login exitoso:', loginCredential.user.email);
      } catch (loginError: any) {
        console.error('❌ Error en login:', loginError.code, loginError.message);
      }
    }
  }
}

testFirebaseAuth();
