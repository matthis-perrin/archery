import AsyncStorageLib from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';

export interface DataStoreApi<T> {
  getData: () => T;
  setData: (data: T) => void;
  useData: () => T;
  awaitLoaded: () => Promise<void>;
}

// eslint-disable-next-line no-null/no-null
const NO_DATA = null;

export function createDataStore<T>(
  storageKey: string,
  initialValue: T,
  storageError?: (err: unknown) => void
): DataStoreApi<T> {
  // Initialize the data with the "not loaded" constant
  const DATA_NOT_LOADED_YET = undefined as unknown as T;
  let currentData = DATA_NOT_LOADED_YET;

  // Intialize the list of awaiters that are waiting for the store to be loaded
  let loadedAwaiters: {resolve: () => void; reject: (err: unknown) => void}[] = [];

  // Fetch data from the storage
  AsyncStorageLib.getItem(storageKey)
    .then(storedValue => {
      // Update the internal data with the stored value (or the default if there is none)
      // and call the awaiters as the store is now ready to be used
      currentData = storedValue === NO_DATA ? initialValue : (JSON.parse(storedValue) as T);
      for (const {resolve} of loadedAwaiters) {
        resolve();
      }
    })
    .catch(err => {
      for (const {reject} of loadedAwaiters) {
        reject(err);
      }
    })
    .finally(() => {
      loadedAwaiters = [];
    });

  // Initialize array of listeners for change in the store
  const storeListeners: ((dataStore: T) => void)[] = [];

  // Persistence function. Can be called any number of time, but will wait for
  // any in progress operation to complete before starting the next one
  let isUpdatingStorage = false;
  function persist(): void {
    if (isUpdatingStorage) {
      return;
    }
    isUpdatingStorage = true;
    const savedData = currentData;
    AsyncStorageLib.setItem(storageKey, JSON.stringify(savedData))
      .catch(err => {
        storageError?.(err);
      })
      .finally(() => {
        isUpdatingStorage = false;
        if (currentData !== savedData) {
          persist();
        }
      });
  }

  function getData(): T {
    if (currentData === DATA_NOT_LOADED_YET) {
      throw new Error(`Data store ${storageKey} is not initialized yet`);
    }
    return currentData;
  }

  function setData(data: T): void {
    // Update internal data
    currentData = data;
    // Asynchronously persist
    persist();
    // Trigger all the listeners
    for (const listener of storeListeners) {
      listener(currentData);
    }
  }

  function useData(): T {
    const [internalData, setInternalData] = useState(currentData);
    useEffect(() => {
      // In case the rev of the data store changed between the time we did the `useState`
      // and the time of the `useEffect` we need to refresh manually the state.
      if (internalData !== currentData) {
        setInternalData(currentData);
      }
      // Register the state setter to be called for any subsequent data store change
      storeListeners.push(setInternalData);
      return () => {
        storeListeners.splice(storeListeners.indexOf(setInternalData), 1);
      };
    }, []); /* eslint-disable-line react-hooks/exhaustive-deps */
    return internalData;
  }

  async function awaitLoaded(): Promise<void> {
    // Otherwise we return a promise and add it to the awaiters
    return new Promise<void>((resolve, reject) => {
      // If the data is already loaded, resolve immediately
      if (currentData !== NO_DATA) {
        resolve();
      } else {
        loadedAwaiters.push({resolve, reject});
      }
    });
  }

  return {getData, setData, useData, awaitLoaded};
}
