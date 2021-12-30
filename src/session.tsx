import {End, EndSize, isValueScore, NoScore, Score, Session, SessionId} from './models';

// eslint-disable-next-line no-null/no-null
export const NO_SCORE: NoScore = null;
export const INITIAL_SESSION_END_SIZE: EndSize = 6;

export function sortSessions(sessions: Map<SessionId, Session>): Session[] {
  return [...sessions.values()].sort((s1, s2) => s2.ts - s1.ts);
}

export function endScore(end: End): Score {
  if (endIsEmpty(end)) {
    return NO_SCORE;
  }
  return {value: end.scores.reduce((sum, curr) => sum + (curr?.value ?? 0), 0)};
}

export function sessionScore(session: Session): Score {
  const scores = session.ends.flatMap(end => end.scores.filter(isValueScore));
  return scores.length === 0
    ? NO_SCORE
    : {value: scores.reduce((sum, score) => sum + score.value, 0)};
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

export function averageByEnd(session: Session): Score {
  const ends = session.ends.filter(end => !endIsEmpty(end));
  const total = sessionScore(session);
  return scoreAverage(total, ends.length);
}

export function scoreAverage(total: Score, count: number): Score {
  return total === NO_SCORE ? total : {value: total.value / count};
}

export function endAverage(end: End): Score {
  if (endIsEmpty(end)) {
    return NO_SCORE;
  }
  const arrows = end.scores.filter(isValueScore);
  const total = arrows.reduce((sum, arrow) => sum + arrow.value, 0);
  return {value: total / arrows.length};
}

export function averageByArrow(session: Session): Score {
  const arrows = session.ends.flatMap(end => end.scores.filter(isValueScore));
  if (arrows.length === 0) {
    return NO_SCORE;
  }
  const total = arrows.reduce((sum, arrow) => sum + arrow.value, 0);
  return {value: total / arrows.length};
}

export function bestEnd(session: Session): {end: End; index: number} {
  let best: End = {ts: Date.now(), scores: []};
  let bestIndex = -1;
  let bestAvg = 0;
  for (const [index, end] of session.ends.entries()) {
    const avg = endAverage(end);
    if (avg !== NO_SCORE && avg.value > bestAvg) {
      best = end;
      bestIndex = index;
      bestAvg = avg.value;
    }
  }
  return {end: best, index: bestIndex};
}

export function worstEnd(session: Session): {end: End; index: number} {
  let best: End = {ts: Date.now(), scores: []};
  let bestIndex = -1;
  let bestAvg = Number.MAX_VALUE;
  for (const [index, end] of session.ends.entries()) {
    const avg = endAverage(end);
    if (avg !== NO_SCORE && avg.value < bestAvg) {
      best = end;
      bestIndex = index;
      bestAvg = avg.value;
    }
  }
  return {end: best, index: bestIndex};
}
