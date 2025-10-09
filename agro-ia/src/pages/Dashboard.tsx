import styled from 'styled-components';
import { FiCamera } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { HistoryModal } from '../components/HistoryModal';
import { UserConfigModal } from '../components/UserConfigModal';
import { useNavigate, useLocation } from 'react-router-dom';

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
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #3F8C82;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  
  @media (min-width: 768px) {
    width: 100px;
    height: 100px;
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
  position: absolute;
  top: 20px;
  right: 20px;
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  border: 2px solid #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  
  @media (min-width: 768px) {
    width: 100px;
    height: 100px;
    top: 30px;
    right: 40px;
  }
`;

const LogoText = styled.div`
  font-weight: bold;
  font-size: 12px;
  color: #333;
  text-align: center;
  line-height: 1.1;
  
  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const LogoSubtext = styled.div`
  font-size: 8px;
  color: #666;
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
  padding: 0 20px 40px;
  
  @media (min-width: 768px) {
    padding: 0 40px 60px;
  }
`;

const Title = styled.h1`
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 40px;
  text-align: center;
  
  @media (min-width: 768px) {
    font-size: 32px;
    margin-bottom: 60px;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px 20px;
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (min-width: 768px) {
    max-width: 400px;
    padding: 40px 30px;
  }
`;

const CameraIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  color: #3F8C82;
  
  @media (min-width: 768px) {
    margin-bottom: 40px;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  
  @media (min-width: 768px) {
    gap: 20px;
  }
`;

const ActionButton = styled.button`
  background: #70C2B8;
  color: white;
  border: none;
  padding: 16px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  width: 100%;
  transition: all 0.2s ease;
  
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

function BirdLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      {/* Bird body */}
      <ellipse cx="12" cy="16" rx="6" ry="4" fill="#333" />
      {/* Bird head */}
      <circle cx="12" cy="10" r="4" fill="#333" />
      {/* Beak */}
      <polygon points="12,8 10,6 14,6" fill="#F19B18" />
      {/* Feet */}
      <path d="M10 20l-1 2M14 20l1 2" stroke="#F19B18" strokeWidth="1.5" strokeLinecap="round" />
      {/* Leaf */}
      <path d="M18 8c-2 0-3 1-3 2s1 2 3 2c1 0 2-1 2-2s-1-2-2-2" fill="#10B981" />
    </svg>
  );
}

function CameraSVG({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden>
      {/* Flash lines */}
      <path d="M40 15v8M30 18l3 6M50 18l-3 6" stroke="#3F8C82" strokeWidth="4" strokeLinecap="round" fill="none"/>
      {/* Camera body */}
      <rect x="15" y="30" width="50" height="30" rx="8" fill="#3F8C82" />
      <rect x="32" y="25" width="16" height="8" rx="2" fill="#3F8C82" />
      {/* Lens ring */}
      <circle cx="40" cy="45" r="12" stroke="#FFFFFF" strokeWidth="4" fill="none" />
      {/* Decorative stripe */}
      <path d="M15 45h15" stroke="#FFFFFF" strokeWidth="4"/>
      <path d="M50 45h15" stroke="#FFFFFF" strokeWidth="4"/>
    </svg>
  );
}

export function Dashboard() {
  const [showHistory, setShowHistory] = useState(false);
  const [showUserConfig, setShowUserConfig] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
            <Username>Usuario</Username>
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


