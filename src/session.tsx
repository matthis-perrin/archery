import {End, EndSize, NoScore, Session, SessionId} from './models';

// eslint-disable-next-line no-null/no-null
export const NO_SCORE: NoScore = null;
export const INITIAL_SESSION_END_SIZE: EndSize = 6;

export function sortSessions(sessions: Map<SessionId, Session>): Session[] {
  return [...sessions.values()].sort((s1, s2) => s2.ts - s1.ts);
}

export function endScore(end: End): number {
  return end.scores.reduce((sum, curr) => sum + (curr?.value ?? 0), 0);
}

export function newEnd(session: Session): End {
  return {ts: Date.now(), scores: [...new Array(session.endSize)].map(() => NO_SCORE)};
}
