import { createContext, useEffect, useState } from 'react';

interface AuthContextType {
  userToken: string | null;
  setUserToken: React.Dispatch<React.SetStateAction<string | null>>;
}

export const authContext = createContext<AuthContextType | null>(null);

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export default function AuthContextProvider(props: AuthContextProviderProps) {
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      setUserToken(localStorage.getItem('authToken'));
    }
  }, []);

  return (
    <authContext.Provider value={{ userToken, setUserToken }}>
      {props.children}
    </authContext.Provider>
  );
}
