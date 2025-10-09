import styled from 'styled-components';
import { FiX, FiHelpCircle, FiSend, FiPhone, FiMail } from 'react-icons/fi';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #70C2B8;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
  
  @media (min-width: 768px) {
    padding: 40px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: #2F6E62;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 24px;
  transition: all 0.3s ease;
  
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

const LogoContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 80px;
  background: white;
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (min-width: 768px) {
    right: 100px;
    padding: 10px 20px;
  }
`;

const LogoText = styled.div`
  font-weight: 700;
  color: #2F6E62;
  font-size: 16px;
  
  @media (min-width: 768px) {
    font-size: 18px;
  }
`;

const UserSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 30px;
  
  @media (min-width: 768px) {
    margin-top: 30px;
    margin-bottom: 40px;
  }
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #2F6E62;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  
  @media (min-width: 768px) {
    width: 120px;
    height: 120px;
    margin-bottom: 20px;
  }
  
  svg {
    width: 50px;
    height: 50px;
    color: white;
    
    @media (min-width: 768px) {
      width: 60px;
      height: 60px;
    }
  }
`;

const Username = styled.h2`
  color: white;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  
  @media (min-width: 768px) {
    font-size: 28px;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 20px;
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  @media (min-width: 768px) {
    padding: 25px;
    max-width: 450px;
  }
`;

const CardTitle = styled.h3`
  color: #2F6E62;
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #2F6E62;
  
  @media (min-width: 768px) {
    font-size: 24px;
  }
`;

const OptionButton = styled.button`
  width: 100%;
  background: transparent;
  border: none;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s ease;
  margin-bottom: 10px;
  
  &:hover {
    background: #F0F0F0;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
  
  span {
    color: #2F6E62;
    font-size: 16px;
    font-weight: 500;
    text-align: left;
    
    @media (min-width: 768px) {
      font-size: 18px;
    }
  }
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #E8E8E8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  svg {
    width: 24px;
    height: 24px;
    color: #2F6E62;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  color: #2F6E62;
  font-size: 16px;
  
  @media (min-width: 768px) {
    font-size: 18px;
  }
`;

const ContactLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  color: #2F6E62;
  font-weight: 600;
  font-size: 16px;
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  @media (min-width: 768px) {
    font-size: 18px;
  }
`;

const ActionButton = styled.button`
  width: 100%;
  max-width: 400px;
  padding: 18px;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  margin-bottom: 15px;
  background: white;
  color: #2F6E62;
  border: 2px solid #2F6E62;
  
  &:hover {
    background: #F0F0F0;
    transform: translateY(-2px);
  }
  
  @media (min-width: 768px) {
    max-width: 450px;
    padding: 20px;
    font-size: 20px;
  }
`;

const BirdLogo = () => {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cuerpo del pájaro */}
      <ellipse cx="15" cy="18" rx="8" ry="10" fill="#2F6E62"/>
      
      {/* Cabeza */}
      <circle cx="15" cy="10" r="6" fill="#2F6E62"/>
      
      {/* Ojo */}
      <circle cx="17" cy="9" r="1.5" fill="white"/>
      <circle cx="17.5" cy="8.5" r="0.8" fill="#000"/>
      
      {/* Pico */}
      <path d="M 20 10 L 24 9 L 20 11 Z" fill="#FF6B35"/>
      
      {/* Ala izquierda */}
      <path d="M 10 15 Q 5 13 4 18 Q 5 20 10 19 Z" fill="#4A9B8E"/>
      
      {/* Ala derecha */}
      <path d="M 20 15 Q 25 13 26 18 Q 25 20 20 19 Z" fill="#4A9B8E"/>
      
      {/* Hoja en la cabeza */}
      <path d="M 12 6 Q 10 4 11 2 Q 13 3 12 6 Z" fill="#8BC34A"/>
      <path d="M 11.5 4 L 12 6" stroke="#6B9B37" strokeWidth="0.5"/>
    </svg>
  );
};

const UserAvatarSVG = () => {
  return (
    <svg width="60" height="60" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cabeza */}
      <circle cx="15" cy="10" r="5" fill="#FFFFFF" />
      {/* Cuerpo */}
      <path d="M6 24c0-6 4.5-9 9-9s9 3 9 9" fill="#FFFFFF" />
    </svg>
  );
};

interface CustomerSupportModalProps {
  onClose: () => void;
}

export function CustomerSupportModal({ onClose }: CustomerSupportModalProps) {
  const handleFAQ = () => {
    alert('Abriendo preguntas frecuentes (FAQ)');
  };

  const handleReportProblem = () => {
    alert('Abriendo formulario de reporte de problema');
  };

  return (
    <Modal>
      <UserSection>
        <Avatar>
          <UserAvatarSVG />
        </Avatar>
        <Username>Usuario</Username>
      </UserSection>
      
      <Card>
        <CardTitle>Atención al cliente</CardTitle>
        <OptionButton onClick={handleFAQ}>
          <IconWrapper>
            <FiHelpCircle />
          </IconWrapper>
          <span>Preguntas frecuentes (FAQ)</span>
        </OptionButton>
        <OptionButton onClick={handleReportProblem}>
          <IconWrapper>
            <FiSend />
          </IconWrapper>
          <span>Enviar reporte del problema</span>
        </OptionButton>
      </Card>
      
      <Card>
        <ContactLabel>
          <FiPhone />
          Contacto:
        </ContactLabel>
        <ContactInfo>
          <IconWrapper>
            <FiPhone />
          </IconWrapper>
          <span>+503 2345 6784</span>
        </ContactInfo>
        <ContactInfo>
          <IconWrapper>
            <FiMail />
          </IconWrapper>
          <span>correo deprueba@agroia.com</span>
        </ContactInfo>
      </Card>
      
      <ActionButton onClick={onClose}>
        Regresar
      </ActionButton>
    </Modal>
  );
}

