// src/config/firebase.ts
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Verificar variables de entorno requeridas
const requiredVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_CLIENT_ID',
];

const missingVars = requiredVars.filter((varName) => !process.env[varName]);

const firebaseConfig = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`,
};

// Inicializar Firebase Admin solo si las variables están configuradas
let auth: admin.auth.Auth | undefined;
let firestore: admin.firestore.Firestore | undefined;

if (missingVars.length === 0) {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    }
    auth = admin.auth();
    firestore = admin.firestore();
    console.log('✅ Firebase Admin inicializado correctamente');
  } catch (error) {
    console.error('❌ Error inicializando Firebase Admin:', error);
  }
} else {
  console.error('❌ Firebase Admin no inicializado - variables de entorno faltantes');
}

export { auth, firestore };
export default admin;
