import styled from 'styled-components';
import { FiUser, FiCamera, FiLock, FiHeadphones, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerSupportModal } from './CustomerSupportModal';
import { useAuth } from '../contexts/AuthContext';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #70C2B8; /* Fondo verde claro igual al dashboard */
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

const Title = styled.h3`
  color: white;
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 10px 0;
  text-align: center;
  
  @media (min-width: 768px) {
    font-size: 32px;
    margin-bottom: 15px;
  }
`;

const Subtitle = styled.p`
  color: white;
  font-size: 16px;
  font-weight: 400;
  margin: 0 0 30px 0;
  text-align: center;
  
  @media (min-width: 768px) {
    font-size: 18px;
    margin-bottom: 40px;
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

const CardTitle = styled.h4`
  color: #2F6E62;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 20px 0;
  
  @media (min-width: 768px) {
    font-size: 22px;
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
  
  svg {
    width: 24px;
    height: 24px;
    color: #2F6E62;
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

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
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
  
  ${props => props.variant === 'primary' ? `
    background: #2F6E62;
    color: white;
    
    &:hover {
      background: #1F4E42;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(47, 110, 98, 0.3);
    }
  ` : `
    background: white;
    color: #2F6E62;
    border: 2px solid #2F6E62;
    
    &:hover {
      background: #F0F0F0;
      transform: translateY(-2px);
    }
  `}
  
  @media (min-width: 768px) {
    max-width: 450px;
    padding: 20px;
    font-size: 20px;
  }
`;

// Styled components para el modal de cambio de nombre
const ChangeUsernameModal = styled.div`
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

const ChangeUsernameCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px 20px;
  width: 100%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  position: relative;
`;

const ChangeUsernameHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
`;

const ChangeUsernameIconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #E8E8E8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 24px;
    height: 24px;
    color: #2F6E62;
  }
`;

const ChangeUsernameTitle = styled.h3`
  color: #2F6E62;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  flex: 1;
`;

const CloseIconButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #F0F0F0;
  }
  
  svg {
    width: 24px;
    height: 24px;
    color: #2F6E62;
  }
`;

const FormLabel = styled.label`
  color: #2F6E62;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
  display: block;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #E0E0E0;
  border-radius: 12px;
  font-size: 16px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #2F6E62;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const ErrorMessage = styled.div`
  color: #b91c1c;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 15px;
  font-size: 14px;
`;

const SaveButton = styled.button`
  width: 100%;
  padding: 15px;
  background: #70C2B8;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: #5FA89F;
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: #9CA3AF;
    cursor: not-allowed;
    transform: none;
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

interface UserConfigModalProps {
  onClose: () => void;
}

export function UserConfigModal({ onClose }: UserConfigModalProps) {
  const [showChangeUsername, setShowChangeUsername] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showCustomerSupport, setShowCustomerSupport] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Obtener el nombre del usuario desde el contexto de autenticación
  const userName = user?.displayName || user?.email?.split('@')[0] || 'Usuario';

  const handleChangeUsername = () => {
    setShowChangeUsername(true);
  };

  const handleSaveUsername = () => {
    if (newUsername.trim() && password.trim()) {
      alert(`Nombre de usuario cambiado a: ${newUsername}`);
      setShowChangeUsername(false);
      setNewUsername('');
      setPassword('');
    } else {
      alert('Por favor completa todos los campos');
    }
  };

  const handleCloseChangeUsername = () => {
    setShowChangeUsername(false);
    setNewUsername('');
    setPassword('');
  };

  const handleChangePhoto = () => {
    alert('Funcionalidad de cambiar foto de perfil');
  };

  const handleChangePassword = () => {
    setShowChangePassword(true);
  };

  const handleSavePassword = async () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setPasswordError('Por favor completa todos los campos');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!user || !user.email) {
      setPasswordError('Usuario no autenticado');
      return;
    }

    setIsChangingPassword(true);
    setPasswordError(null);

    try {
      // Reautenticar al usuario con la contraseña actual
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Actualizar la contraseña
      await updatePassword(user, newPassword);

      alert('Contraseña cambiada exitosamente');
      setShowChangePassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error changing password:', error);
      
      // Manejar errores específicos de Firebase
      switch (error.code) {
        case 'auth/wrong-password':
          setPasswordError('La contraseña actual es incorrecta');
          break;
        case 'auth/weak-password':
          setPasswordError('La nueva contraseña es muy débil');
          break;
        case 'auth/requires-recent-login':
          setPasswordError('Por seguridad, necesitas iniciar sesión nuevamente');
          break;
        default:
          setPasswordError('Error al cambiar la contraseña. Inténtalo de nuevo.');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleCloseChangePassword = () => {
    setShowChangePassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError(null);
  };

  const handleSupport = () => {
    setShowCustomerSupport(true);
  };

  const handleLogout = () => {
    // Cerrar sesión y redirigir al login
    navigate('/');
  };

  const handleBack = () => {
    onClose();
  };

  return (
    <Modal>
      <UserSection>
        <Avatar>
          <UserAvatarSVG />
        </Avatar>
        <Username>{userName}</Username>
      </UserSection>
      
      <Title>Configuración</Title>
      <Subtitle>de la cuenta</Subtitle>
      
      <Card>
        <CardTitle>Cuenta</CardTitle>
        <OptionButton onClick={handleChangeUsername}>
          <IconWrapper>
            <FiUser />
          </IconWrapper>
          <span>Cambiar nombre de usuario</span>
        </OptionButton>
        <OptionButton onClick={handleChangePhoto}>
          <IconWrapper>
            <FiCamera />
          </IconWrapper>
          <span>Cambiar foto de perfil</span>
        </OptionButton>
        <OptionButton onClick={handleChangePassword}>
          <IconWrapper>
            <FiLock />
          </IconWrapper>
          <span>Cambiar contraseña</span>
        </OptionButton>
      </Card>
      
      <Card>
        <CardTitle>Soporte</CardTitle>
        <OptionButton onClick={handleSupport}>
          <IconWrapper>
            <FiHeadphones />
          </IconWrapper>
          <span>Atención al cliente</span>
        </OptionButton>
      </Card>
      
      <ActionButton variant="primary" onClick={handleLogout}>
        Cerrar sesión
      </ActionButton>
      
      <ActionButton variant="secondary" onClick={handleBack}>
        Regresar
      </ActionButton>

      {/* Modal de cambio de nombre de usuario */}
      {showChangeUsername && (
        <ChangeUsernameModal>
          <ChangeUsernameCard>
            <CloseIconButton onClick={handleCloseChangeUsername}>
              <FiX />
            </CloseIconButton>
            
            <ChangeUsernameHeader>
              <ChangeUsernameIconWrapper>
                <FiUser />
              </ChangeUsernameIconWrapper>
              <ChangeUsernameTitle>Cambiar nombre de usuario:</ChangeUsernameTitle>
            </ChangeUsernameHeader>
            
            <FormLabel>Correo</FormLabel>
            <FormInput
              type="text"
              placeholder="Correo"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            
            <FormLabel>Ingresa tu contraseña:</FormLabel>
            <FormInput
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <SaveButton onClick={handleSaveUsername}>
              Guardar cambios
            </SaveButton>
          </ChangeUsernameCard>
        </ChangeUsernameModal>
      )}

      {/* Modal de cambio de contraseña */}
      {showChangePassword && (
        <ChangeUsernameModal>
          <ChangeUsernameCard>
            <CloseIconButton onClick={handleCloseChangePassword}>
              <FiX />
            </CloseIconButton>
            
            <ChangeUsernameHeader>
              <ChangeUsernameIconWrapper>
                <FiLock />
              </ChangeUsernameIconWrapper>
            </ChangeUsernameHeader>
            
            <FormLabel>Contraseña actual:</FormLabel>
            <FormInput
              type="password"
              placeholder="Contraseña actual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            
            <FormLabel>Contraseña nueva:</FormLabel>
            <FormInput
              type="password"
              placeholder="Contraseña nueva"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            
            <FormLabel>Confirmar contraseña</FormLabel>
            <FormInput
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            
            {passwordError && (
              <ErrorMessage role="alert">
                {passwordError}
              </ErrorMessage>
            )}
            
            <SaveButton 
              onClick={handleSavePassword}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? 'Cambiando contraseña...' : 'Guardar cambios'}
            </SaveButton>
          </ChangeUsernameCard>
        </ChangeUsernameModal>
      )}

      {/* Modal de atención al cliente */}
      {showCustomerSupport && (
        <CustomerSupportModal onClose={() => setShowCustomerSupport(false)} />
      )}
    </Modal>
  );
}

