import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnalysisHistoryItem, historyService } from '../services/historyService';
import { FiTrash2, FiUser } from 'react-icons/fi';
import { UserConfigModal } from './UserConfigModal';
import { HistoryDetailModal } from './HistoryDetailModal';

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
    padding: 30px 40px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const UserSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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

const Logo = styled.div`
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  border: 2px solid #10B981;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  
  @media (min-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const LogoText = styled.div`
  font-weight: bold;
  font-size: 12px;
  color: #2F6E62;
  text-align: center;
  line-height: 1.1;
  
  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const LogoSubtext = styled.div`
  font-size: 8px;
  color: #2F6E62;
  text-align: center;
  
  @media (min-width: 768px) {
    font-size: 10px;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 20px 0;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  
  @media (min-width: 768px) {
    padding: 25px;
  }
`;

const CardTitle = styled.h2`
  color: #2F6E62;
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 20px 0;
  text-align: center;
  
  @media (min-width: 768px) {
    font-size: 28px;
  }
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const HistoryItem = styled.div`
  display: flex;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid #E0E0E0;
  cursor: pointer;
  transition: background 0.2s ease;
  border-radius: 8px;
  padding: 12px;
  margin: -12px;
  margin-bottom: 4px;
  
  &:hover {
    background: #F5F5F5;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const ImagePreview = styled.img`
  width: 80px;
  height: 80px;
  background: #E0E0E0;
  border-radius: 8px;
  flex-shrink: 0;
  object-fit: cover;
`;

const ItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ItemDate = styled.div`
  color: #2F6E62;
  font-size: 13px;
  font-weight: 700;
  
  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const ItemTitle = styled.div`
  color: #2F6E62;
  font-size: 15px;
  font-weight: 700;
  
  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const ItemSubtitle = styled.div`
  color: #2F6E62;
  font-size: 13px;
  
  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const DeleteButton = styled.button`
  background: #2F6E62;
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    background: #23564D;
    transform: scale(1.05);
  }
  
  @media (min-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const BottomButton = styled.button`
  background: white;
  color: #2F6E62;
  border: 2px solid #2F6E62;
  padding: 16px 32px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  width: 100%;
  transition: all 0.2s ease;
  
  &:hover {
    background: #2F6E62;
    color: white;
  }
  
  @media (min-width: 768px) {
    padding: 18px 36px;
    font-size: 18px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #2F6E62;
  font-size: 16px;
`;

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
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 20px 0;
  text-align: center;
`;

const ConfirmIcon = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #EF4444;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const XIcon = styled.div`
  color: white;
  font-size: 40px;
  font-weight: 700;
  line-height: 1;
`;

const ConfirmMessage = styled.p`
  color: #2F6E62;
  font-size: 16px;
  text-align: center;
  margin: 0 0 20px 0;
  line-height: 1.5;
`;

const ConfirmItemPreview = styled.div`
  width: 100%;
  background: #F5F5F5;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
  align-items: center;
`;

const ConfirmItemImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
`;

const ConfirmItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ConfirmItemText = styled.div`
  color: #2F6E62;
  font-size: 13px;
  font-weight: 700;
`;

const ConfirmItemSubtext = styled.div`
  color: #2F6E62;
  font-size: 12px;
`;

const ConfirmButtons = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;

const CancelButton = styled.button`
  flex: 1;
  background: white;
  color: #2F6E62;
  border: 2px solid #2F6E62;
  padding: 14px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #F5F5F5;
  }
`;

const ConfirmDeleteButton = styled.button`
  flex: 1;
  background: #EF4444;
  color: white;
  border: none;
  padding: 14px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #DC2626;
    transform: translateY(-1px);
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

function BirdLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      {/* Bird body */}
      <ellipse cx="12" cy="16" rx="6" ry="4" fill="#2F6E62" />
      {/* Bird head */}
      <circle cx="12" cy="10" r="4" fill="#2F6E62" />
      {/* Beak */}
      <polygon points="12,8 10,6 14,6" fill="#F19B18" />
      {/* Feet */}
      <path d="M10 20l-1 2M14 20l1 2" stroke="#F19B18" strokeWidth="1.5" strokeLinecap="round" />
      {/* Leaf */}
      <path d="M18 8c-2 0-3 1-3 2s1 2 3 2c1 0 2-1 2-2s-1-2-2-2" fill="#10B981" />
    </svg>
  );
}

interface HistoryModalProps {
  onClose: () => void;
}

export function HistoryModal({ onClose }: HistoryModalProps) {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [itemToDelete, setItemToDelete] = useState<AnalysisHistoryItem | null>(null);
  const [showUserConfig, setShowUserConfig] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AnalysisHistoryItem | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const historyData = historyService.getHistory();
    setHistory(historyData);
  };

  const confirmDelete = (item: AnalysisHistoryItem) => {
    setItemToDelete(item);
  };

  const deleteAnalysis = () => {
    if (itemToDelete) {
      historyService.deleteAnalysis(itemToDelete.id);
      setItemToDelete(null);
      loadHistory();
    }
  };

  const cancelDelete = () => {
    setItemToDelete(null);
  };

  const handleItemClick = (item: AnalysisHistoryItem) => {
    setSelectedItem(item);
  };

  const handleDeleteFromDetail = (item: AnalysisHistoryItem) => {
    historyService.deleteAnalysis(item.id);
    loadHistory();
    setSelectedItem(null);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getPestName = (item: AnalysisHistoryItem) => {
    if (item.result.hasPest && item.result.detections.length > 0) {
      return item.result.detections[0].pestType;
    }
    return 'Sin plagas detectadas';
  };

  const handleGoHome = () => {
    onClose();
  };

  return (
    <Modal>
      <Container>
        <Header>
          <UserSection>
            <Avatar onClick={() => setShowUserConfig(true)} style={{ cursor: 'pointer' }}>
              <UserAvatarSVG />
            </Avatar>
            <Username>Usuario</Username>
          </UserSection>
        </Header>

        <MainContent>
          <Card>
            <CardTitle>Historial</CardTitle>
            
            <HistoryList>
              {history.length === 0 ? (
                <EmptyState>
                  No hay análisis en el historial
                </EmptyState>
              ) : (
                history.map((item) => (
                  <HistoryItem key={item.id} onClick={() => handleItemClick(item)}>
                    <ImagePreview 
                      src={item.imageData} 
                      alt="Imagen analizada"
                    />
                    <ItemContent>
                      <ItemDate>
                        Fecha y hora
                      </ItemDate>
                      <ItemDate>
                        {formatDate(item.timestamp)}
                      </ItemDate>
                      <ItemTitle>
                        Plaga detectada
                      </ItemTitle>
                      <ItemSubtitle>
                        {getPestName(item)}
                      </ItemSubtitle>
                    </ItemContent>
                    <DeleteButton onClick={(e) => {
                      e.stopPropagation();
                      confirmDelete(item);
                    }}>
                      <FiTrash2 />
                    </DeleteButton>
                  </HistoryItem>
                ))
              )}
            </HistoryList>
          </Card>
          
          <BottomButton onClick={handleGoHome}>
            Volver al inicio
          </BottomButton>
        </MainContent>
      </Container>

      {/* Modal de confirmación de eliminación */}
      {itemToDelete && (
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
                src={itemToDelete.imageData} 
                alt="Miniatura"
              />
              <ConfirmItemInfo>
                <ConfirmItemText>Fecha y hora</ConfirmItemText>
                <ConfirmItemSubtext>
                  {formatDate(itemToDelete.timestamp)}
                </ConfirmItemSubtext>
                <ConfirmItemText>Plaga detectada</ConfirmItemText>
                <ConfirmItemSubtext>
                  {getPestName(itemToDelete)}
                </ConfirmItemSubtext>
              </ConfirmItemInfo>
            </ConfirmItemPreview>
            
            <ConfirmButtons>
              <CancelButton onClick={cancelDelete}>
                Cancelar
              </CancelButton>
              <ConfirmDeleteButton onClick={deleteAnalysis}>
                Eliminar
              </ConfirmDeleteButton>
            </ConfirmButtons>
          </ConfirmCard>
        </ConfirmModal>
      )}

      {/* Modal de configuración de usuario */}
      {showUserConfig && (
        <UserConfigModal onClose={() => setShowUserConfig(false)} />
      )}

      {/* Modal de detalles del item del historial */}
      {selectedItem && (
        <HistoryDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onDelete={handleDeleteFromDetail}
          onOpenUserConfig={() => setShowUserConfig(true)}
        />
      )}
    </Modal>
  );
}