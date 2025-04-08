import { useContext, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { authContext } from '../../context/Auth/Auth';

type RedirectIfAuthenticatedProps = {
  children: ReactNode;
};

export default function RedirectIfAuthenticated({
  children,
}: RedirectIfAuthenticatedProps) {
  const auth = useContext(authContext);

  if (!auth) {
    throw new Error('authContext must be used within an AuthProvider');
  }

  const { userToken } = auth;

  if (userToken) {
    return <Navigate to="/" />;
  }

  return children;
}
