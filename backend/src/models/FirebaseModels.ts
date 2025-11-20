import { firestore } from '../config/firebase';
import { isFirestoreAvailable } from '../utils/firebaseUtils';

// Verificar que Firebase esté inicializado
if (!isFirestoreAvailable()) {
  console.error('❌ Firebase Firestore no está inicializado. Por favor configura las variables de entorno.');
}

// Interfaces para los datos
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

export interface CreateUserData {
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface PestAnalysis {
  id: string;
  userId: string;
  imageUrl: string;
  imageData?: string; // Base64 para almacenamiento local
  analysisResult: {
    hasPest: boolean;
    detections: Array<{
      pestType: string;
      confidence: number;
      description: string;
      treatment: string;
      severity: 'low' | 'medium' | 'high';
    }>;
    imageAnalysis: {
      brightness: number;
      contrast: number;
      quality: 'good' | 'fair' | 'poor';
      dimensions: { width: number; height: number };
      fileSize: number;
    };
    recommendations: string[];
  };
  metadata?: {
    cropType?: string;
    location?: string;
    notes?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  userId: string;
  totalAnalyses: number;
  pestDetections: number;
  mostCommonPest?: string;
  averageConfidence: number;
  recentAnalyses: number; // últimos 7 días
  pestTypesCount: Record<string, number>;
  lastAnalysisAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Clase para manejar usuarios en Firestore
export class UserModel {
  private static getCollection() {
    if (!isFirestoreAvailable()) {
      throw new Error('Firebase no está configurado. Por favor configura las variables de entorno.');
    }
    return firestore!.collection('users');
  }

  // Crear usuario
  static async create(userData: CreateUserData): Promise<User> {
    const now = new Date();
    const user: User = {
      uid: '', // Se asignará después
      email: userData.email,
      displayName: userData.displayName,
      photoURL: userData.photoURL,
      emailVerified: false,
      createdAt: now,
      updatedAt: now,
      isActive: true
    };

    const docRef = await this.getCollection().add(user);
    const createdUser = { ...user, uid: docRef.id };
    
    // Actualizar el documento con el UID
    await docRef.update({ uid: docRef.id });
    
    return createdUser;
  }

  // Buscar usuario por UID
  static async findByUid(uid: string): Promise<User | null> {
    const doc = await this.getCollection().doc(uid).get();
    if (!doc.exists) return null;
    
    return { uid: doc.id, ...doc.data() } as User;
  }

  // Buscar usuario por email
  static async findByEmail(email: string): Promise<User | null> {
    const snapshot = await this.getCollection().where('email', '==', email).limit(1).get();
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return { uid: doc.id, ...doc.data() } as User;
  }

  // Actualizar usuario
  static async update(uid: string, updates: Partial<User>): Promise<User | null> {
    const docRef = this.getCollection().doc(uid);
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };
    
    await docRef.update(updateData);
    return this.findByUid(uid);
  }

  // Actualizar última sesión
  static async updateLastLogin(uid: string): Promise<void> {
    await this.getCollection().doc(uid).update({
      lastLoginAt: new Date(),
      updatedAt: new Date()
    });
  }

  // Eliminar usuario
  static async delete(uid: string): Promise<boolean> {
    try {
      await this.getCollection().doc(uid).delete();
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  // Obtener todos los usuarios (para admin)
  static async getAllUsers(): Promise<User[]> {
    const snapshot = await this.getCollection().get();
    return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User));
  }
}

// Clase para manejar análisis de plagas
export class PestAnalysisModel {
  private static get collection() {
    if (!isFirestoreAvailable()) {
      throw new Error('Firebase Firestore no está disponible');
    }
    return firestore!.collection('pestAnalyses');
  }

  // Crear análisis
  static async create(analysisData: Omit<PestAnalysis, 'id' | 'createdAt' | 'updatedAt'> & { photoTimestamp?: Date }): Promise<PestAnalysis> {
    console.log('🔍 PestAnalysisModel.create - analysisData:', { 
      userId: analysisData.userId, 
      hasImageData: !!analysisData.imageData,
      hasAnalysisResult: !!analysisData.analysisResult 
    });
    
    if (!isFirestoreAvailable()) {
      throw new Error('Firebase no está configurado. Por favor configura las variables de entorno.');
    }
    
    try {
      const now = new Date();
      const { photoTimestamp, ...restData } = analysisData;
      
      // Usar photoTimestamp si está disponible, sino usar fecha actual
      const createdAt = photoTimestamp || now;
      
      console.log('📅 Timestamp que se va a guardar:', {
        photoTimestamp: photoTimestamp,
        photoTimestampType: typeof photoTimestamp,
        photoTimestampExists: !!photoTimestamp,
        createdAt: createdAt,
        createdAtType: typeof createdAt,
        createdAtString: createdAt.toString(),
        isUsingPhotoTimestamp: !!photoTimestamp,
        isUsingCurrentTime: !photoTimestamp
      });
      
      const analysis: Omit<PestAnalysis, 'id'> = {
        ...restData,
        createdAt: createdAt,
        updatedAt: now
      };

      console.log('📊 Creando documento en Firestore...');
      if (!isFirestoreAvailable()) {
        throw new Error('Firebase no está configurado. Por favor configura las variables de entorno.');
      }
      const docRef = await firestore!.collection('pestAnalyses').add(analysis);
      console.log('✅ Documento creado con ID:', docRef.id);
      
      return { id: docRef.id, ...analysis };
    } catch (error) {
      console.error('❌ Error in PestAnalysisModel.create:', error);
      throw error;
    }
  }

  // Buscar análisis por ID
  static async findById(id: string): Promise<PestAnalysis | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    
    return { id: doc.id, ...doc.data() } as PestAnalysis;
  }

  // Obtener análisis de un usuario
  static async findByUserId(userId: string, limit: number = 50): Promise<PestAnalysis[]> {
    console.log('🔍 PestAnalysisModel.findByUserId - userId:', userId, 'limit:', limit);
    
    if (!isFirestoreAvailable()) {
      throw new Error('Firebase no está configurado. Por favor configura las variables de entorno.');
    }
    
    try {
      // Consulta simple sin orderBy para evitar necesidad de índice compuesto
      const snapshot = await firestore!.collection('pestAnalyses')
        .where('userId', '==', userId)
        .limit(limit * 2) // Obtener más documentos para ordenar en memoria
        .get();
      
      console.log('📊 Firestore query result - docs count:', snapshot.docs.length);
      
      const analyses = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('📄 Document data:', { id: doc.id, userId: data.userId, createdAt: data.createdAt, createdAtType: typeof data.createdAt });
        
        // Convertir Firebase Timestamp a Date si es necesario
        const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt;
        const updatedAt = data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt;
        
        console.log('📅 Fechas convertidas:', { 
          id: doc.id, 
          createdAt: createdAt, 
          updatedAt: updatedAt,
          createdAtType: typeof createdAt 
        });
        
        return { 
          id: doc.id, 
          ...data, 
          createdAt: createdAt,
          updatedAt: updatedAt
        } as PestAnalysis;
      });
      
      // Ordenar por createdAt en memoria (más reciente primero)
      analyses.sort((a, b) => {
        // Asegurar que ambas fechas sean objetos Date válidos
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
        
        // Verificar que las fechas sean válidas
        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
          console.warn('⚠️ Fechas inválidas en ordenación:', { 
            idA: a.id, createdAtA: a.createdAt, 
            idB: b.id, createdAtB: b.createdAt 
          });
          return 0;
        }
        
        return dateB.getTime() - dateA.getTime();
      });
      
      // Limitar a la cantidad solicitada
      const limitedAnalyses = analyses.slice(0, limit);
      
      console.log('✅ Returning analyses:', limitedAnalyses.length);
      return limitedAnalyses;
    } catch (error) {
      console.error('❌ Error in PestAnalysisModel.findByUserId:', error);
      throw error;
    }
  }

  // Eliminar análisis
  static async delete(id: string): Promise<boolean> {
    try {
      await this.collection.doc(id).delete();
      return true;
    } catch (error) {
      console.error('Error deleting analysis:', error);
      return false;
    }
  }

  // Obtener estadísticas de un usuario
  static async getUserStats(userId: string): Promise<UserStats> {
    const analyses = await this.findByUserId(userId, 1000); // Obtener más análisis para estadísticas
    
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const totalAnalyses = analyses.length;
    const pestDetections = analyses.filter(a => a.analysisResult.hasPest).length;
    const recentAnalyses = analyses.filter(a => a.createdAt >= weekAgo).length;
    
    // Contar tipos de plagas
    const allPests = analyses.flatMap(a => 
      a.analysisResult.detections.map(d => d.pestType)
    );
    const pestTypesCount = allPests.reduce((acc, pest) => {
      acc[pest] = (acc[pest] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostCommonPest = Object.keys(pestTypesCount).length > 0 
      ? Object.keys(pestTypesCount).reduce((a, b) => pestTypesCount[a] > pestTypesCount[b] ? a : b)
      : undefined;
    
    const averageConfidence = analyses.length > 0
      ? analyses.reduce((sum, a) => 
          sum + a.analysisResult.detections.reduce((detSum, d) => detSum + d.confidence, 0) / Math.max(a.analysisResult.detections.length, 1), 0
        ) / analyses.length
      : 0;
    
    const lastAnalysisAt = analyses.length > 0 ? analyses[0].createdAt : undefined;
    
    return {
      userId,
      totalAnalyses,
      pestDetections,
      mostCommonPest,
      averageConfidence,
      recentAnalyses,
      pestTypesCount,
      lastAnalysisAt,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}
