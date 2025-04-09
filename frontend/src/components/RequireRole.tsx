import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './AuthorizeView';

interface Props {
  role: string;
  children: React.ReactNode;
}

const RequireRole = ({ role, children }: Props) => {
  const user = useContext(UserContext);

  if (!user) return <Navigate to="/login" />;
  if (!user.roles.includes(role)) return <Navigate to="/home" />;

  return <>{children}</>;
};

export default RequireRole;
