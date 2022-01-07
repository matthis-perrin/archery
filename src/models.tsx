import {Brand} from './type_utils';

export type SessionId = Brand<string, 'SessionId'>;

// eslint-disable-next-line no-null/no-null
export const NO_SCORE: NoScore = null;

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
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
export const ALL_END_SIZE: EndSize[] = [3, 4, 5, 6];

export enum TargetType {
  Fita45 = 'Fita45',
  Fita60 = 'Fita60',
  Fita80 = 'Fita80',
  Fita122 = 'Fita122',
}
export interface Session {
  id: SessionId;
  ends: End[];
  endSize: EndSize;
  distance: number;
  diameter: TargetType;
  ts: number;
}

export function getInitialSessionTemplate(): Session {
  return {
    id: '' as SessionId,
    ends: [],
    endSize: 3,
    ts: 0,
    diameter: TargetType.Fita45,
    distance: 18,
  };
}

export function generateSessionId(): SessionId {
  // return Array.from({length: 3}, () => {
  //   // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  //   return String.fromCharCode(Math.floor(Math.random() * 2 ** 16));
  // }).join('') as SessionId;
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  return Math.random().toString(36).slice(2) as SessionId;
}
