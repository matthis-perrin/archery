import {End, isValueScore, NO_SCORE, Score, Session, SessionId} from './models';

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

export function newEnd(endSize: number): End {
  return {ts: Date.now(), scores: [...new Array(endSize)].map(() => NO_SCORE)};
}

export function endIsEmpty(end: End): boolean {
  return end.scores.every(s => s === NO_SCORE);
}

export function sessionIsEmpty(session: Session): boolean {
  return session.ends.length === 0 || session.ends.every(endIsEmpty);
}

export function averageByEnd(session: Session): Score {
  const arrowAvg = averageByArrow(session);
  return arrowAvg === NO_SCORE ? arrowAvg : {value: arrowAvg.value * session.endSize};
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

export function endCount(session: Session): number {
  return session.ends.filter(end => !endIsEmpty(end)).length;
}

export function isEndFull(session: Session, end: End): boolean {
  return end.scores.filter(s => s !== NO_SCORE).length >= session.endSize;
}

export function sessionDay(session: Session): number {
  const d = new Date(session.ts);
  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d.getTime();
}
