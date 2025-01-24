import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const AuthPage = () => {
  const navigate = useNavigate();
  const { authStatus } = useAuthenticator();

  useEffect(() => {
    if (authStatus === 'authenticated') {
      navigate('/');
    }
  }, [authStatus, navigate]);

  return (
    <div className="auth-container">
      <Authenticator />
    </div>
  );
};