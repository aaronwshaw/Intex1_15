import React, { useState, useEffect, createContext } from 'react';
import { Navigate } from 'react-router-dom';
import { pingAuth } from '../api/IntexAPI';

interface User {
  email: string;
}

// ✅ Export the context so other files can import it
export const UserContext = createContext<User | null>(null);

function AuthorizeView(props: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User>({ email: '' });

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

// Still works for any use of <AuthorizedUser value="email" />
export function AuthorizedUser(props: { value: string }) {
  const user = React.useContext(UserContext);
  if (!user) return null;

  return props.value === 'email' ? <>{user.email}</> : null;
}

export default AuthorizeView;
