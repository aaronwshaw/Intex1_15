import React, { useState, useEffect, createContext } from 'react';
import { Navigate } from 'react-router-dom';
import { pingAuth } from '../api/IntexAPI';

const UserContext = createContext<User | null>(null);

interface User {
  email: string;
}

function AuthorizeView(props: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  let emptyuser: User = { email: '' };
  const [user, setUser] = useState(emptyuser);

  useEffect(() => {
    async function authorizeUser() {
      const result = await pingAuth();
      if (result.ok) {
        setUser({ email: result.email });
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
      setLoading(false);
    }

    authorizeUser();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (authorized) {
    return (
      <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
    );
  }

  return <Navigate to="/login" />;
}

export function AuthorizedUser(props: { value: string }) {
  const user = React.useContext(UserContext);

  if (!user) return null;

  return props.value === 'email' ? <>{user.email}</> : null;
}

export default AuthorizeView;
