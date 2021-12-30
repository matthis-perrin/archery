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

export function sessionScore(session: Session): number {
  return session.ends.reduce((sum, end) => sum + endScore(end), 0);
}

export function newEnd(session: Session): End {
  return {ts: Date.now(), scores: [...new Array(session.endSize)].map(() => NO_SCORE)};
}

export function endIsEmpty(end: End): boolean {
  return end.scores.every(s => s === NO_SCORE);
}

export function sessionIsEmpty(session: Session): boolean {
  return session.ends.length === 0 || session.ends.every(endIsEmpty);
}

export function averageByEnd(session: Session): number {
  const ends = session.ends.filter(end => !endIsEmpty(end));
  const total = sessionScore(session);
  return total / ends.length;
}
