import {createDataStore} from './data_store';
import {createMapStore} from './map_data_store';
import {Session, SessionId} from './models';

interface AppState {
  page: string;
}

const stateStore = createDataStore<AppState>('state', {page: 'test'}, console.error);
export const getAppState = stateStore.getData;
export const setAppState = stateStore.setData;
export const useAppState = stateStore.useData;

//

const sessionsStore = createMapStore<SessionId, Session>('session', console.error);
export const getSession = sessionsStore.getData;
export const setSession = sessionsStore.setData;
export const useSession = sessionsStore.useData;
export const useSessions = sessionsStore.useAllData;
export const deleteSession = sessionsStore.deleteData;

export async function awaitStoresLoaded(): Promise<void> {
  await Promise.all([stateStore.awaitLoaded(), sessionsStore.awaitLoaded()]);
}
