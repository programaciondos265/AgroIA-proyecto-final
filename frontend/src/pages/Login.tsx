import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GoogleAuthButton } from '../components/GoogleAuthButton';

const Page = styled.main`
  min-height: 100%;
  display: grid;
  place-items: center;
  padding: 24px 16px;
`;

const Shell = styled.div`
  width: 100%;
  max-width: 480px;
`;

const LogoWrap = styled.div`
  display: grid; place-items: center;
  margin: 12px 0 8px;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const LogoCircle = styled.div`
  width: 280px;
  height: auto;
  border-radius: 20px;
  background: #fff;
  display: grid;
  place-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 15px;
  overflow: hidden;
  
  @media (min-width: 768px) {
    width: 320px;
  }
`;

const LogoImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 15px;
  display: block;
`;

const BrandName = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: #0b3b33;
  text-align: center;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.div`
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  margin-top: -4px;
`;

const Title = styled.h1`
  text-align: center;
  color: ${({ theme }) => theme.colors.textOnMint};
  margin: 8px 0 20px;
  font-size: 40px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textOnSurface};
  border-radius: 28px;
  box-shadow: ${({ theme }) => theme.shadow.soft};
  padding: 22px 18px 24px;
`;

const Field = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-weight: 700;
  color: #0b3b33;
  margin-bottom: 8px;
`;

const InputWrap = styled.div`
  display: grid; grid-template-columns: 44px 1fr; align-items: center;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
`;

const IconCell = styled.div`
  display: grid; place-items: center; color: ${({ theme }) => theme.colors.primary};
`;

const Input = styled.input`
  border: none; outline: none; padding: 12px 12px; font-size: 16px;
`;

const PrimaryBtn = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff; border: none;
  padding: 16px 18px; border-radius: 16px; font-weight: 800; cursor: pointer;
  transition: .2s ease; margin-top: 4px;
  &:hover { background: ${({ theme }) => theme.colors.primaryDark}; transform: translateY(-1px); }
`;

const OutlineBtn = styled.button`
  width: 100%;
  background: transparent; color: ${({ theme }) => theme.colors.accentOrange};
  border: 3px solid ${({ theme }) => theme.colors.accentOrange};
  padding: 14px 18px; border-radius: 16px; font-weight: 800; cursor: pointer;
  margin-top: 14px;
`;

const ErrorMsg = styled.div`
  color: #b91c1c;
  background: ${({ theme }) => theme.colors.errorLight};
  border: 1px solid ${({ theme }) => theme.colors.errorBorder};
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 12px;
  font-size: 14px;
`;

const LinkText = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
  margin-top: 12px;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
  }
  
  span {
    padding: 0 16px;
    color: #6b7280;
    font-size: 14px;
  }
`;

function UserIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="8" r="4" fill="#2F6E62" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="#2F6E62" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" fill="#2F6E62" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="#2F6E62" strokeWidth="2" fill="none" />
      <rect x="11" y="14" width="2" height="3" rx="1" fill="#fff" />
    </svg>
  );
}

function BirdLogo() {
  return (
    <svg width="80" height="80" viewBox="0 0 100 100" aria-hidden>
      {/* Logo del pájaro - Cuerpo negro/gris oscuro */}
      <ellipse cx="42" cy="58" rx="14" ry="10" fill="#2a2a2a" />
      {/* Cabeza del pájaro - más grande y redondeada */}
      <circle cx="40" cy="30" r="14" fill="#2a2a2a" />
      {/* Alas pequeñas visibles */}
      <ellipse cx="30" cy="55" rx="8" ry="5" fill="#333" transform="rotate(-20 30 55)" />
      <ellipse cx="50" cy="55" rx="8" ry="5" fill="#333" transform="rotate(20 50 55)" />
      {/* Ojos grandes blancos con expresión amigable */}
      <circle cx="35" cy="28" r="7" fill="#fff" />
      <circle cx="45" cy="28" r="7" fill="#fff" />
      {/* Pupilas negras pequeñas */}
      <circle cx="35" cy="28" r="3" fill="#000" />
      <circle cx="45" cy="28" r="3" fill="#000" />
      {/* Pico naranja vibrante */}
      <polygon points="40,22 35,16 45,16" fill="#FF6B35" />
      {/* Patas naranjas con tres dedos cada una */}
      <path d="M 35 68 L 33 75 L 32 75 M 35 68 L 35 75 M 35 68 L 37 75 L 38 75" stroke="#FF6B35" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M 49 68 L 47 75 L 46 75 M 49 68 L 49 75 M 49 68 L 51 75 L 52 75" stroke="#FF6B35" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Hoja verde a la derecha del pájaro, ligeramente debajo */}
      <path 
        d="M 68 52 Q 72 48 76 52 Q 72 56 68 60 Q 64 56 68 52 Z" 
        fill="#10B981" 
      />
      <path 
        d="M 68 52 L 68 60" 
        stroke="#0ea571" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setError('Por favor, completa usuario y contraseña.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  }

  function handleRegister() {
    navigate('/register');
  }

  function handleForgotPassword() {
    navigate('/forgot-password');
  }

  function handleGoogleSuccess() {
    navigate('/dashboard');
  }

  function handleGoogleError(error: string) {
    setError(error);
  }

  return (
    <Page>
      <Shell>
        <LogoWrap>
          <LogoCircle>
            <LogoImage 
              src="/logo.jpg" 
              alt="AgroIA - Detección de plagas"
              onError={(e) => {
                // Si el logo JPG no carga, ocultar el contenedor
                const target = e.target as HTMLImageElement;
                const container = target.parentElement;
                if (container) {
                  container.style.display = 'none';
                }
              }}
            />
          </LogoCircle>
        </LogoWrap>
        <Title>Bienvenido</Title>
        <Card as="form" onSubmit={handleSubmit}>
          {error && <ErrorMsg role="alert">{error}</ErrorMsg>}

          <Field>
            <Label htmlFor="email">Nombre de usuario</Label>
            <InputWrap>
              <IconCell><UserIcon /></IconCell>
              <Input id="email" type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} />
            </InputWrap>
          </Field>

          <Field>
            <Label htmlFor="password">Contraseña</Label>
            <InputWrap>
              <IconCell><LockIcon /></IconCell>
              <Input id="password" type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
            </InputWrap>
          </Field>

          <PrimaryBtn type="submit" disabled={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </PrimaryBtn>
          
          <LinkText type="button" onClick={handleForgotPassword} disabled={isLoading}>
            ¿Olvidaste tu contraseña?
          </LinkText>

          <Divider>
            <span>o</span>
          </Divider>

          <GoogleAuthButton 
            disabled={isLoading}
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
          
          <OutlineBtn type="button" onClick={handleRegister} disabled={isLoading}>
            Crear cuenta
          </OutlineBtn>
        </Card>
      </Shell>
    </Page>
  );
}


