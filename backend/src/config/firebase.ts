import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Verificar que las variables de entorno estén configuradas
const requiredEnvVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY_ID', 
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_CLIENT_ID'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Variables de entorno de Firebase faltantes:', missingVars);
  console.error('📝 Por favor configura el archivo .env del backend con las credenciales de Firebase');
  console.error('🔗 Ve a Firebase Console > Project Settings > Service accounts para obtener las credenciales');
}

// Configuración de Firebase Admin
const firebaseConfig = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
};

// Inicializar Firebase Admin solo si las variables están configuradas
let auth: admin.auth.Auth;
let firestore: admin.firestore.Firestore;
let storage: admin.storage.Storage;

if (missingVars.length === 0) {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID
      });
    }
    
    auth = admin.auth();
    firestore = admin.firestore();
    storage = admin.storage();
    
    console.log('✅ Firebase Admin inicializado correctamente');
  } catch (error) {
    console.error('❌ Error inicializando Firebase Admin:', error);
  }
} else {
  console.error('❌ Firebase Admin no inicializado - variables de entorno faltantes');
}

// Exportar servicios (pueden ser undefined si no se inicializó Firebase)
export { auth, firestore, storage };
export default admin;