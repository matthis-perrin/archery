import {Brand} from './type_utils';

export type SessionId = Brand<string, 'SessionId'>;

export interface Score {
  value: number;
}

export interface End {
  scores: Score[];
  ts: number;
}

export interface Session {
  id: SessionId;
  ends: End[];
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
