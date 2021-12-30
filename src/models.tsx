import {NO_SCORE} from './session';
import {Brand} from './type_utils';

export type SessionId = Brand<string, 'SessionId'>;

export interface ValueScore {
  value: number;
}

export function isValueScore(s: Score): s is ValueScore {
  return s !== NO_SCORE;
}

export type NoScore = null;
export type Score = ValueScore | NoScore;

export interface End {
  scores: (Score | NoScore)[];
  ts: number;
}

export type EndSize = 3 | 4 | 5 | 6;

export interface Session {
  id: SessionId;
  ends: End[];
  endSize: EndSize;
  ts: number;
}

export function generateSessionId(): SessionId {
  // return Array.from({length: 3}, () => {
  //   // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  //   return String.fromCharCode(Math.floor(Math.random() * 2 ** 16));
  // }).join('') as SessionId;
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  return Math.random().toString(36).slice(2) as SessionId;
}
