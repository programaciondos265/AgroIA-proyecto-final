import styled from 'styled-components';
import { AnalysisHistoryItem } from '../services/historyService';
import { FiClock, FiAlertTriangle, FiTrash2, FiHome, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { formatDateTime } from '../utils/dateUtils';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.background};
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
  background: ${({ theme }) => theme.colors.background};
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
  background: ${({ theme }) => theme.colors.avatarBg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  @media (min-width: 768px) {
    width: 80px;
    height: 80px;
  }
`;

const Username = styled.p`
  color: white;
  margin: 0;
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
  background: ${({ theme }) => theme.colors.primary};
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
    background: ${({ theme }) => theme.colors.primaryDarker};
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

const TitleText = styled.h2`
  color: #2F6E62;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  
  @media (min-width: 768px) {
    font-size: 24px;
  }
`;

const Separator = styled.div`
  width: 100%;
  height: 2px;
  background: ${({ theme }) => theme.colors.primary};
  margin-bottom: 25px;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  max-width: 280px;
  height: 200px;
  background: ${({ theme }) => theme.colors.borderLight};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 20px;
  overflow: hidden;
  
  @media (min-width: 768px) {
    max-width: 320px;
    height: 220px;
  }
`;

const PestName = styled.h3`
  color: #2F6E62;
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 15px 0;
  text-align: center;
  
  @media (min-width: 768px) {
    font-size: 26px;
  }
`;

const DateTime = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2F6E62;
  font-size: 14px;
  margin-bottom: 20px;
  
  svg {
    width: 18px;
    height: 18px;
  }
  
  @media (min-width: 768px) {
    font-size: 16px;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const ProgressContainer = styled.div`
  margin-bottom: 30px;
`;

const ProgressCircle = styled.div<{ percentage: number }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(
    #2F6E62 0% ${props => props.percentage}%,
    #E0E0E0 ${props => props.percentage}% 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::after {
    content: '';
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: white;
    position: absolute;
  }
  
  @media (min-width: 768px) {
    width: 140px;
    height: 140px;
    
    &::after {
      width: 110px;
      height: 110px;
    }
  }
`;

const ProgressText = styled.span`
  position: relative;
  z-index: 1;
  color: #2F6E62;
  font-size: 28px;
  font-weight: 700;
  
  @media (min-width: 768px) {
    font-size: 32px;
  }
`;

const DeleteButton = styled.button`
  background: ${({ theme }) => theme.colors.errorDark};
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.errorDarker};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
  }
  
  @media (min-width: 768px) {
    padding: 16px 32px;
    font-size: 18px;
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
    background: ${({ theme }) => theme.colors.grayLighter};
    transform: translateY(-2px);
  }
  
  @media (min-width: 768px) {
    max-width: 500px;
    padding: 18px 36px;
    font-size: 20px;
  }
`;

// Modal de confirmación de eliminación
const ConfirmModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;

const ConfirmCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px 20px;
  width: 100%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
`;

const ConfirmTitle = styled.h3`
  color: #2F6E62;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 20px 0;
  text-align: center;
`;

const ConfirmIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.errorDark};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const XIcon = styled.div`
  color: white;
  font-size: 48px;
  font-weight: 700;
`;

const ConfirmMessage = styled.p`
  color: #666;
  font-size: 16px;
  text-align: center;
  margin: 0 0 20px 0;
  line-height: 1.5;
`;

const ConfirmItemPreview = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.grayLightest};
  border-radius: 12px;
  padding: 15px;
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  align-items: center;
`;

const ConfirmItemImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
`;

const ConfirmItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ConfirmItemText = styled.p`
  color: #2F6E62;
  font-size: 12px;
  font-weight: 700;
  margin: 0;
`;

const ConfirmItemSubtext = styled.p`
  color: #666;
  font-size: 12px;
  margin: 0;
`;

const ConfirmButtons = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 12px;
  background: white;
  color: #2F6E62;
  border: 2px solid #2F6E62;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.grayLighter};
  }
`;

const ConfirmDeleteButton = styled.button`
  flex: 1;
  padding: 12px;
  background: ${({ theme }) => theme.colors.errorDark};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.errorDarker};
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

interface HistoryDetailModalProps {
  item: AnalysisHistoryItem;
  onClose: () => void;
  onDelete: (item: AnalysisHistoryItem) => void;
  onOpenUserConfig?: () => void;
}

export function HistoryDetailModal({ item, onClose, onDelete, onOpenUserConfig }: HistoryDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getPestName = (item: AnalysisHistoryItem) => {
    if (item.result.detections && item.result.detections.length > 0) {
      return item.result.detections[0].pestType;
    }
    return 'Sin plagas detectadas';
  };

  const getConfidence = (item: AnalysisHistoryItem) => {
    if (item.result.detections && item.result.detections.length > 0) {
      return Math.round(item.result.detections[0].confidence * 100);
    }
    return 0;
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(item);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const pestName = getPestName(item);
  const confidence = getConfidence(item);

  return (
    <Modal>
      <Container>
        <CloseButton onClick={onClose}>
          <FiX />
        </CloseButton>

        <Header>
          <UserSection>
            <Avatar onClick={onOpenUserConfig} style={{ cursor: 'pointer' }}>
              <UserAvatarSVG />
            </Avatar>
            <Username>Usuario</Username>
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
              {item.imageData ? (
                <img src={item.imageData} alt="Imagen escaneada" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
              ) : (
                'Imagen escaneada'
              )}
            </ImagePlaceholder>
            
            <PestName>{pestName}</PestName>
            
            <DateTime>
              <FiClock />
              Fecha y hora: {formatDateTime(item.timestamp)}
            </DateTime>
            
            <ProgressContainer>
              <ProgressCircle percentage={confidence}>
                <ProgressText>{confidence}%</ProgressText>
              </ProgressCircle>
            </ProgressContainer>
            
            <DeleteButton onClick={handleDeleteClick}>
              <FiTrash2 />
              Eliminar
            </DeleteButton>
          </Card>
          
          <BottomButton onClick={onClose}>
            <FiHome style={{ marginRight: '8px' }} />
            Volver al inicio
          </BottomButton>
        </MainContent>
      </Container>

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <ConfirmModal>
          <ConfirmCard>
            <ConfirmTitle>Eliminar</ConfirmTitle>
            
            <ConfirmIcon>
              <XIcon>X</XIcon>
            </ConfirmIcon>
            
            <ConfirmMessage>
              ¿Estás seguro que deseas eliminar este elemento?
            </ConfirmMessage>
            
            <ConfirmItemPreview>
              <ConfirmItemImage 
                src={item.imageData} 
                alt="Miniatura"
              />
              <ConfirmItemInfo>
                <ConfirmItemText>Fecha y hora</ConfirmItemText>
                <ConfirmItemSubtext>
                  {formatDateTime(item.timestamp)}
                </ConfirmItemSubtext>
                <ConfirmItemText>Plaga detectada</ConfirmItemText>
                <ConfirmItemSubtext>
                  {pestName}
                </ConfirmItemSubtext>
              </ConfirmItemInfo>
            </ConfirmItemPreview>
            
            <ConfirmButtons>
              <CancelButton onClick={handleCancelDelete}>
                Cancelar
              </CancelButton>
              <ConfirmDeleteButton onClick={handleConfirmDelete}>
                Eliminar
              </ConfirmDeleteButton>
            </ConfirmButtons>
          </ConfirmCard>
        </ConfirmModal>
      )}
    </Modal>
  );
}

