import styled from 'styled-components';
import { useState, useRef, useEffect } from 'react';
import { FiCamera, FiArrowLeft, FiImage } from 'react-icons/fi';
import { pestAnalysisService, AnalysisResult } from '../services/pestAnalysisService';
import { AnalysisModal } from '../components/AnalysisModal';
import { historyService } from '../services/historyService';
import { useNavigate } from 'react-router-dom';

const Page = styled.main`
  min-height: 100vh;
  background: #2F6E62;
  padding: 0;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  
  @media (min-width: 768px) {
    max-width: 1200px;
    margin: 0 auto;
  }
`;

const CameraView = styled.div`
  flex: 1;
  background: #2F6E62;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CapturedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const BottomBar = styled.div`
  background: black;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 120px;
  
  @media (min-width: 768px) {
    padding: 30px 40px;
    min-height: 140px;
  }
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  @media (min-width: 768px) {
    font-size: 28px;
    padding: 12px;
  }
`;

const CaptureButton = styled.button`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #2F6E62;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (min-width: 768px) {
    width: 100px;
    height: 100px;
    font-size: 40px;
  }
`;

const CaptureText = styled.div`
  color: white;
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
  font-weight: 500;
  
  @media (min-width: 768px) {
    font-size: 16px;
    margin-top: 15px;
  }
`;

const Controls = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  
  @media (min-width: 768px) {
    bottom: 30px;
    gap: 30px;
  }
`;

const ControlButton = styled.button`
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  @media (min-width: 768px) {
    padding: 16px 32px;
    font-size: 16px;
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 24px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
  
  @media (min-width: 768px) {
    top: 30px;
    left: 30px;
    width: 60px;
    height: 60px;
    font-size: 28px;
  }
`;

export function ScanPage() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    openCamera();
    
    // Limpieza al desmontar el componente
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('🎥 Cámara detenida:', track.kind);
      });
      videoRef.current.srcObject = null;
      setIsCameraOpen(false);
    }
  };

  const openCamera = async () => {
    try {
      // Detener cámara anterior si existe
      stopCamera();
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Usar cámara trasera en móviles
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
        console.log('🎥 Cámara iniciada');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('No se pudo acceder a la cámara. Por favor, permite el acceso a la cámara.');
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        
        // Detener la cámara después de tomar la foto
        stopCamera();
        console.log('📸 Foto tomada y cámara detenida');
      }
    }
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;
    
    setIsAnalyzing(true);
    try {
      console.log('🔍 Iniciando análisis de imagen...');
      
      // Convertir base64 a File
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
      
      console.log('📁 Archivo creado:', file.name, file.size, 'bytes');
      
      const result = await pestAnalysisService.analyzeImage(file);
      
      console.log('✅ Resultado del análisis:', result);
      console.log('🔍 Estructura del resultado:', {
        hasPest: result.hasPest,
        detectionsCount: result.detections?.length || 0,
        recommendationsCount: result.recommendations?.length || 0,
        imageAnalysis: result.imageAnalysis
      });
      
      // El análisis ya se guarda automáticamente en Firebase cuando se llama a analyzeImage
      // No necesitamos llamar a historyService.saveAnalysis aquí
      
      setAnalysisResult(result);
      console.log('🎯 AnalysisResult establecido en el estado');
    } catch (error) {
      console.error('❌ Error analyzing image:', error);
      alert('Error al analizar la imagen. Inténtalo de nuevo.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    openCamera(); // openCamera ya detiene la cámara anterior automáticamente
  };

  const goBack = () => {
    stopCamera(); // Detener cámara antes de navegar
    navigate('/dashboard');
  };

  const closeAnalysisModal = () => {
    setAnalysisResult(null);
    setCapturedImage(null);
    openCamera(); // openCamera ya detiene la cámara anterior automáticamente
  };

  const handleSaveAndGoToHistory = () => {
    // El resultado ya se guardó automáticamente en analyzeImage
    // Mostrar confirmación y navegar al historial
    alert('✅ Análisis guardado exitosamente en el historial');
    navigate('/dashboard', { state: { openHistory: true } });
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCapturedImage(result);
        setIsCameraOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <Page>
      <Container>
        <BackButton onClick={goBack}>
          <FiArrowLeft />
        </BackButton>

        <CameraView>
          {!capturedImage ? (
            <Video ref={videoRef} autoPlay playsInline />
          ) : (
            <CapturedImage src={capturedImage} alt="Captured" />
          )}
        </CameraView>

        <BottomBar>
          <ActionButton onClick={openFilePicker}>
            <FiImage />
          </ActionButton>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CaptureButton onClick={capturedImage ? undefined : captureImage}>
              <FiCamera />
            </CaptureButton>
            <CaptureText>Tomar foto para escanear</CaptureText>
          </div>
          
          <ActionButton onClick={goBack}>
            <FiArrowLeft />
          </ActionButton>
        </BottomBar>

        {capturedImage && (
          <Controls>
            <ControlButton onClick={retakePhoto}>
              Tomar otra foto
            </ControlButton>
            <ControlButton onClick={analyzeImage} disabled={isAnalyzing}>
              {isAnalyzing ? 'Analizando...' : 'Analizar imagen'}
            </ControlButton>
          </Controls>
        )}
      </Container>

      {/* Canvas oculto para captura */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Input file oculto para selección de archivos */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Modal de resultados de análisis */}
      {analysisResult && (
        <AnalysisModal 
          result={analysisResult} 
          onClose={closeAnalysisModal}
          imageData={capturedImage || undefined}
          onSave={handleSaveAndGoToHistory}
        />
      )}
    </Page>
  );
}