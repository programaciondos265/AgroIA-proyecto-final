# 🌱 AgroIA - Sistema de Detección de Plagas POO

## 🚀 Comandos para Ejecutar la Aplicación

### Prerrequisitos
- Node.js instalado
- Proyecto Firebase configurado

### 1. Instalar Dependencias

**En PowerShell/Terminal:**
```bash
cd backend
npm install

cd frontend
npm install
```

### 2. Configurar Variables de Entorno

**Crear archivos .env:**
dichos archivos se encontraran en un .txt el cual tendra las indicaciones a seguir se haran llegar por correo 

**Backend** (`backend/.env`):
```env
PORT=3001
NODE_ENV=development
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_PRIVATE_KEY_ID=tu-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ntu-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=tu-service-account@tu-proyecto.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=tu-client-id
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:3001/api
VITE_FIREBASE_API_KEY=tu-api-key
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
VITE_FIREBASE_APP_ID=tu-app-id
```

### 3. Ejecutar la Aplicación

**Opción A - Automática (PowerShell):**
```bash
.\start-dev.bat
```

**Opción B - Manual (2 PowerShell separados):**

**PowerShell 1:**
```bash
cd backend
npm run dev
```

**PowerShell 2:**
```bash
cd frontend
npm run dev
```

### 4. Acceder
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

¡Listo!
