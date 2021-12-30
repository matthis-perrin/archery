import {useCallback, useMemo} from 'react';

import {generateSessionId, INITIAL_SESSION_END_SIZE, Session} from './models';
import {useNav} from './navigation';
import {newEnd, sortSessions} from './session';
import {setSession, useSessions} from './stores';

export function useNewSessionCallback(): () => void {
  const nav = useNav();
  const sessions = useSessions();
  const sortedSession = useMemo(() => sortSessions(sessions), [sessions]);
  const endSize = sortedSession[0]?.endSize ?? INITIAL_SESSION_END_SIZE;

  return useCallback(() => {
    const newSessionId = generateSessionId();
    const newSession: Session = {
      id: newSessionId,
      ends: [newEnd(endSize)],
      endSize,
      ts: Date.now(),
    };
    setSession(newSessionId, newSession);
    nav.navigate('Session', {sessionId: newSessionId});
  }, [endSize, nav]);
}
