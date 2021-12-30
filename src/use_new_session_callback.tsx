import {useCallback, useMemo} from 'react';

import {generateSessionId, Session} from './models';
import {useNav} from './navigation';
import {INITIAL_SESSION_END_SIZE, sortSessions} from './session';
import {setSession, useSessions} from './stores';

export function useNewSessionCallback(): () => void {
  const nav = useNav();
  const sessions = useSessions();
  const sortedSession = useMemo(() => sortSessions(sessions), [sessions]);

  return useCallback(() => {
    const newSessionId = generateSessionId();
    const newSession: Session = {
      id: newSessionId,
      ends: [],
      endSize: sortedSession[0]?.endSize ?? INITIAL_SESSION_END_SIZE,
      ts: Date.now(),
    };
    setSession(newSessionId, newSession);
    nav.navigate('Session', {sessionId: newSessionId});
  }, [nav, sortedSession]);
}
