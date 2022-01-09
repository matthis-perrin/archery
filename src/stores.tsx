import {createMapStore} from './map_data_store';
import {Session, SessionId} from './models';

const sessionsStore = createMapStore<SessionId, Session>('session', console.error);
export const getSession = sessionsStore.getData;
export const setSession = sessionsStore.setData;
export const useSession = sessionsStore.useData;
export const useSessions = sessionsStore.useAllData;
export const deleteSession = sessionsStore.deleteData;

export async function awaitStoresLoaded(): Promise<void> {
  await Promise.all([sessionsStore.awaitLoaded()]);
}
