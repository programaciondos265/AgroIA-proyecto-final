import styled from 'styled-components';
import { FiCamera } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { HistoryModal } from '../components/HistoryModal';
import { UserConfigModal } from '../components/UserConfigModal';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Page = styled.main`
  min-height: 100vh;
  background: #70C2B8;
  padding: 0;
  position: relative;
`;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  
  @media (min-width: 768px) {
    max-width: 1200px;
    margin: 0 auto;
    min-height: 100vh;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: relative;
  gap: 20px;
  
  @media (min-width: 768px) {
    padding: 30px 40px;
    gap: 30px;
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

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 20px 0;
`;

const Title = styled.h1`
  color: white;
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 32px;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 20px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    padding: 25px;
    max-width: 450px;
  }
`;

const CameraIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #E8E8E8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    width: 100px;
    height: 100px;
    margin-bottom: 25px;
  }

  svg {
    width: 40px;
    height: 40px;
    color: #2F6E62;

    @media (min-width: 768px) {
      width: 50px;
      height: 50px;
    }
  }
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;

  @media (min-width: 768px) {
    gap: 20px;
  }
`;

const ActionButton = styled.button`
  background: #2F6E62;
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover {
    background: #5BA89A;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (min-width: 768px) {
    padding: 18px 24px;
    font-size: 18px;
  }
`;

function UserAvatarSVG() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden>
      <circle cx="20" cy="12" r="8" fill="#FFFFFF" />
      <path d="M8 32c0-8 6-12 12-12s12 4 12 12" fill="#FFFFFF" />
    </svg>
  );
}

function CameraSVG() {
  return (
    <svg width="50" height="50" viewBox="0 0 50 50" aria-hidden>
      {/* Camera body */}
      <rect x="8" y="15" width="34" height="24" rx="4" fill="#2F6E62"/>
      {/* Camera lens */}
      <circle cx="25" cy="27" r="8" fill="#1F4E42"/>
      <circle cx="25" cy="27" r="5" fill="#0E7C66"/>
      {/* Flash */}
      <rect x="35" y="18" width="4" height="3" rx="1" fill="#F19B18"/>
      {/* Viewfinder */}
      <rect x="20" y="12" width="10" height="6" rx="1" fill="#2F6E62"/>
      {/* Strap */}
      <path d="M15 20 Q10 15 5 20" stroke="#2F6E62" strokeWidth="2" fill="none"/>
      <path d="M35 20 Q40 15 45 20" stroke="#2F6E62" strokeWidth="2" fill="none"/>
      {/* Base */}
      <rect x="20" y="39" width="10" height="2" fill="#2F6E62"/>
    </svg>
  );
}

export function Dashboard() {
  const [showHistory, setShowHistory] = useState(false);
  const [showUserConfig, setShowUserConfig] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener el nombre del usuario desde el contexto de autenticación
  const userName = user?.displayName || user?.email?.split('@')[0] || 'Usuario';

  // Abrir historial automáticamente si venimos desde guardar
  useEffect(() => {
    const state = location.state as { openHistory?: boolean };
    if (state?.openHistory) {
      setShowHistory(true);
      // Limpiar el estado para que no se abra de nuevo
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const openCamera = () => {
    navigate('/scan');
  };

  const openUserConfig = () => {
    setShowUserConfig(true);
  };

  return (
    <Page>
      <Container>
        <Header>
          <UserSection>
            <Avatar onClick={openUserConfig} style={{ cursor: 'pointer' }}>
              <UserAvatarSVG />
            </Avatar>
            <Username>{userName}</Username>
          </UserSection>
        </Header>

        <MainContent>
          <Title>Menú principal</Title>

          <Card>
            <CameraIcon>
              <CameraSVG />
            </CameraIcon>

            <Actions>
              <ActionButton onClick={openCamera}>
                Escanear la plaga
              </ActionButton>
              <ActionButton onClick={() => setShowHistory(true)}>
                Historial de plagas
              </ActionButton>
            </Actions>
          </Card>
        </MainContent>
      </Container>

      {/* Modal de historial */}
      {showHistory && (
        <HistoryModal onClose={() => setShowHistory(false)} />
      )}

      {/* Modal de configuración de usuario */}
      {showUserConfig && (
        <UserConfigModal onClose={() => setShowUserConfig(false)} />
      )}
    </Page>
  );
}
