import {useCallback, useMemo} from 'react';

import {generateSessionId, getInitialSessionTemplate, Session} from './models';
import {useNav} from './navigation';
import {newEnd, sortSessions} from './session';
import {setSession, useSessions} from './stores';

export function useNewSessionCallback(): () => void {
  const nav = useNav();
  const sessions = useSessions();
  const sortedSession = useMemo(() => sortSessions(sessions), [sessions]);
  const templateSession = useMemo(
    () => sortedSession[0] ?? getInitialSessionTemplate(),
    [sortedSession]
  );

  return useCallback(() => {
    const newSessionId = generateSessionId();
    const newSession: Session = {
      ...templateSession,
      id: newSessionId,
      ends: [newEnd(templateSession.endSize)],
      ts: Date.now(), // - Math.random() * 10 * 3600 * 1000 - 4 * 24 * 3600 * 1000,
    };
    setSession(newSessionId, newSession);
    nav.navigate('Session', {sessionId: newSessionId});
  }, [nav, templateSession]);
}
