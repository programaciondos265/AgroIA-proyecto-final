import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: ${({ theme }) => theme.colors.background};
  color: white;
  font-family: system-ui;
`;

const ErrorTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 16px;
`;

const ErrorMessage = styled.p`
  margin-bottom: 16px;
  text-align: center;
`;

const ReloadButton = styled.button`
  padding: 12px 24px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const ErrorDetails = styled.details`
  margin-top: 20px;
  max-width: 600px;
`;

const ErrorSummary = styled.summary`
  cursor: pointer;
  margin-bottom: 10px;
`;

const ErrorPre = styled.pre`
  background: rgba(0, 0, 0, 0.2);
  padding: 12px;
  border-radius: 8px;
  overflow: auto;
  font-size: 12px;
`;

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>⚠️ Error en la aplicación</ErrorTitle>
          <ErrorMessage>
            {this.state.error?.message || 'Ha ocurrido un error inesperado'}
          </ErrorMessage>
          <ReloadButton onClick={() => window.location.reload()}>
            Recargar página
          </ReloadButton>
          <ErrorDetails>
            <ErrorSummary>Detalles del error</ErrorSummary>
            <ErrorPre>{this.state.error?.stack}</ErrorPre>
          </ErrorDetails>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

