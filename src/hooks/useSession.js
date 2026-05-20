// src/hooks/useSession.js
import { useState } from 'react'

export function useSession() {
  const [session, setSessionState] = useState(() => {
    const data = sessionStorage.getItem("smarthire_session");
    return data ? JSON.parse(data) : null;
  });

  const setSession = (newSession) => {
    if (newSession) {
      sessionStorage.setItem("smarthire_session", JSON.stringify(newSession));
      setSessionState(newSession);
    } else {
      sessionStorage.removeItem("smarthire_session");
      setSessionState(null);
    }
  };

  const logout = () => {
    setSession(null);
  };

  return { session, setSession, logout };
}
