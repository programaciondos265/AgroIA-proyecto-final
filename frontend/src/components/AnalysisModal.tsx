import styled from 'styled-components';
import { AnalysisResult } from '../services/pestAnalysisService';
import { FiUser, FiClock, FiAlertTriangle, FiSave, FiCamera, FiHome, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { UserConfigModal } from './UserConfigModal';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #70C2B8;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow-y: auto;
`;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background: #70C2B8;
  padding: 20px;
  
  @media (min-width: 768px) {
    max-width: 1200px;
    margin: 0 auto;
    min-height: 100vh;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  position: relative;
  
  @media (min-width: 768px) {
    padding: 30px 40px;
  }
`;

const UserSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  
  @media (min-width: 768px) {
    margin-top: 30px;
  }
`;

const Avatar = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #3F8C82;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  
  @media (min-width: 768px) {
    width: 80px;
    height: 80px;
  }
`;

const Username = styled.div`
  color: white;
  font-weight: 600;
  font-size: 16px;
  
  @media (min-width: 768px) {
    font-size: 18px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: #2F6E62;
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
  transition: all 0.3s ease;
  z-index: 10;
  
  &:hover {
    background: #1F4E42;
    transform: scale(1.05);
  }
  
  @media (min-width: 768px) {
    width: 60px;
    height: 60px;
    font-size: 28px;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  padding: 20px 0;
  
  @media (min-width: 768px) {
    gap: 30px;
    padding: 30px 0;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 25px;
  padding: 30px 20px;
  width: 100%;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  @media (min-width: 768px) {
    max-width: 600px;
    padding: 40px 30px;
    border-radius: 30px;
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  width: 100%;
`;

const TitleIcon = styled.div`
  color: #2E7D32;
  font-size: 24px;
  
  @media (min-width: 768px) {
    font-size: 28px;
  }
`;

const TitleText = styled.h1`
  color: #2F6E62;
  font-size: 22px;
  font-weight: bold;
  margin: 0;
  
  @media (min-width: 768px) {
    font-size: 24px;
  }
`;

const Separator = styled.div`
  width: 100%;
  height: 2px;
  background: #2F6E62;
  margin-bottom: 20px;
`;

const ImagePlaceholder = styled.div`
  width: 150px;
  height: 150px;
  background: #2F6E62;
  border-radius: 12px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  
  @media (min-width: 768px) {
    width: 180px;
    height: 180px;
    font-size: 16px;
  }
`;

const PestName = styled.h2`
  color: #2F6E62;
  font-size: 26px;
  font-weight: bold;
  margin: 0 0 20px 0;
  text-align: center;
  
  @media (min-width: 768px) {
    font-size: 28px;
  }
`;

const DateTime = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2F6E62;
  font-size: 14px;
  margin-bottom: 30px;
  
  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const ProgressCircle = styled.div<{ percentage: number }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(#70C2B8 ${({ percentage }) => percentage * 3.6}deg, #E0E0E0 0deg);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 10px;
  
  &::before {
    content: '';
    position: absolute;
    width: 80px;
    height: 80px;
    background: white;
    border-radius: 50%;
  }
  
  @media (min-width: 768px) {
    width: 140px;
    height: 140px;
    
    &::before {
      width: 100px;
      height: 100px;
    }
  }
`;

const ProgressText = styled.div`
  color: #2F6E62;
  font-size: 18px;
  font-weight: bold;
  z-index: 1;
  
  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-bottom: 20px;
  
  @media (min-width: 768px) {
    flex-direction: row;
    gap: 16px;
  }
`;

const SaveButton = styled.button`
  background: white;
  color: #F19B18;
  border: 2px solid #F19B18;
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #F19B18;
    color: white;
  }
  
  @media (min-width: 768px) {
    flex: 1;
    padding: 14px 24px;
    font-size: 16px;
  }
`;

const RetakeButton = styled.button`
  background: #2F6E62;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #23564D;
    transform: translateY(-1px);
  }
  
  @media (min-width: 768px) {
    flex: 1;
    padding: 14px 24px;
    font-size: 16px;
  }
`;

const BottomButton = styled.button`
  background: white;
  color: #2F6E62;
  border: 2px solid #2F6E62;
  padding: 16px 32px;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 600;
  font-size: 18px;
  width: 90%;
  max-width: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  margin-top: 20px;
  
  &:hover {
    background: #F0F0F0;
    transform: translateY(-2px);
  }
  
  @media (min-width: 768px) {
    max-width: 500px;
    padding: 18px 36px;
    font-size: 20px;
  }
`;

function UserAvatarSVG() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden>
      <circle cx="15" cy="9" r="6" fill="#FFFFFF" />
      <path d="M6 24c0-6 4.5-9 9-9s9 3 9 9" fill="#FFFFFF" />
    </svg>
  );
}

interface AnalysisModalProps {
  result: AnalysisResult;
  onClose: () => void;
  imageData?: string;
  onSave?: () => void;
  timestamp?: Date | null;
}

export function AnalysisModal({ result, onClose, imageData, onSave, timestamp }: AnalysisModalProps) {
  const [showUserConfig, setShowUserConfig] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Obtener el nombre del usuario desde el contexto de autenticación
  const userName = user?.displayName || user?.email?.split('@')[0] || 'Usuario';
  
  console.log('🔍 AnalysisModal recibió result:', result);
  console.log('🔍 AnalysisModal - hasPest:', result?.hasPest);
  console.log('🔍 AnalysisModal - detections:', result?.detections);
  console.log('🔍 AnalysisModal - recommendations:', result?.recommendations);

  const formatDateTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('es-ES', options);
  };

  const handleSave = () => {
    // Lógica para guardar el resultado
    if (onSave) {
      onSave();
    }
  };

  const handleRetake = () => {
    onClose();
    navigate('/dashboard');
  };

  const handleGoHome = () => {
    onClose();
    navigate('/dashboard');
  };

  const handleClose = () => {
    onClose();
    navigate('/dashboard');
  };

  // Obtener datos del resultado
  const pestName = result.hasPest && result.detections.length > 0 
    ? result.detections.length === 1 
      ? result.detections[0].pestType
      : `${result.detections.length} plagas detectadas`
    : "Sin plagas detectadas";
  
  const confidence = result.hasPest && result.detections.length > 0 
    ? Math.round(result.detections.reduce((sum, detection) => sum + detection.confidence, 0) / result.detections.length * 100)
    : 0;

  return (
    <Modal>
      <Container>
        <CloseButton onClick={handleClose}>
          <FiX />
        </CloseButton>

        <Header>
          <UserSection>
            <Avatar onClick={() => setShowUserConfig(true)} style={{ cursor: 'pointer' }}>
              <UserAvatarSVG />
            </Avatar>
            <Username>{userName}</Username>
          </UserSection>
        </Header>

        <MainContent>
          <Card>
            <Title>
              <TitleIcon>
                <FiAlertTriangle />
              </TitleIcon>
              <TitleText>Resultados de detección</TitleText>
            </Title>
            
            <Separator />
            
            <ImagePlaceholder>
              {imageData ? (
                <img src={imageData} alt="Imagen escaneada" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
              ) : (
                'Imagen escaneada'
              )}
            </ImagePlaceholder>
            
            <PestName>{pestName}</PestName>
            
            <DateTime>
              <FiClock />
              Fecha y hora: {timestamp ? formatDateTime(timestamp) : 'Fecha no disponible'}
            </DateTime>
            
            <ProgressContainer>
              <ProgressCircle percentage={confidence}>
                <ProgressText>{confidence}%</ProgressText>
              </ProgressCircle>
            </ProgressContainer>
            
            <ActionButtons>
              <SaveButton onClick={handleSave}>
                <FiSave style={{ marginRight: '8px' }} />
                Guardar
              </SaveButton>
              <RetakeButton onClick={handleRetake}>
                <FiCamera style={{ marginRight: '8px' }} />
                Volver a tomar foto
              </RetakeButton>
            </ActionButtons>
          </Card>
          
          <BottomButton onClick={handleGoHome}>
            <FiHome style={{ marginRight: '8px' }} />
            Volver al inicio
          </BottomButton>
        </MainContent>
      </Container>

      {/* Modal de configuración de usuario */}
      {showUserConfig && (
        <UserConfigModal onClose={() => setShowUserConfig(false)} />
      )}
    </Modal>
  );
}