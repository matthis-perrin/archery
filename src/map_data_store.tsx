import AsyncStorageLib from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';

interface InternalData<T> {
  val: T | undefined;
  v: number;
}
type InternalListener<T> = (dataStore: InternalData<T>) => void;

interface MapStoreApi<Key, Value> {
  getData: (key: Key) => Value | undefined;
  getAllData: () => Map<Key, Value>;
  setData: (key: Key, value: Value) => void;
  batchSetData: (batch: {key: Key; value: Value}[]) => void;
  useData: (key: Key) => Value | undefined;
  useAllData: () => Map<Key, Value>;
  deleteData: (key: Key) => void;
  batchDeleteData: (batch: Key[]) => void;
  awaitLoaded: () => Promise<void>;
}

export function createMapStore<Key extends string, Value>(
  storageKey: string,
  storageError?: (err: unknown) => void
): MapStoreApi<Key, Value> {
  const keyPrefix = `${storageKey}_`;
  const data = new Map<Key, InternalData<Value>>();
  let rawData: InternalData<Map<Key, Value>> = {val: new Map<Key, Value>(), v: 0};
  const listeners = new Map<Key, InternalListener<Value>[]>();
  const multiListeners = new Set<InternalListener<Map<Key, Value>>>();

  // Intialize the list of awaiters that are waiting for the store to be loaded
  let loadedAwaiters: {resolve: () => void; reject: (err: unknown) => void}[] = [];
  let isLoaded = false;
  AsyncStorageLib.getAllKeys()
    .then(async keys => {
      const storeKeys = keys.filter(k => k.startsWith(keyPrefix));
      const entries = await AsyncStorageLib.multiGet(storeKeys);
      for (const [key, strValue] of entries) {
        // eslint-disable-next-line no-null/no-null
        if (strValue !== null) {
          const k = key.slice(keyPrefix.length);
          const value = JSON.parse(strValue) as Value;
          data.set(k as Key, {val: value, v: 0});
          rawData.val?.set(k as Key, value);
        }
      }
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
      isLoaded = true;
    });

  // Persistence function. Can be called any number of time, but will wait for
  // any in progress operation to complete before starting the next one
  const updatingKeys = new Set<Key>();
  function persist(key: Key): void {
    if (updatingKeys.has(key)) {
      return;
    }
    updatingKeys.add(key);
    const savedData = data.get(key)?.val;
    const k = `${keyPrefix}${key}`;
    const promise =
      savedData === undefined
        ? AsyncStorageLib.removeItem(k)
        : AsyncStorageLib.setItem(k, JSON.stringify(savedData));
    promise
      .catch(err => {
        storageError?.(err);
      })
      .finally(() => {
        updatingKeys.delete(key);
        if (data.get(key)?.val !== savedData) {
          persist(key);
        }
      });
  }

  function getData(key: Key): Value | undefined {
    return data.get(key)?.val;
  }

  function getAllData(): Map<Key, Value> {
    return rawData.val ?? new Map();
  }

  function setData(key: Key, value: Value): void {
    batchSetData([{key, value}]);
  }

  function batchSetData(batch: {key: Key; value: Value}[]): void {
    const newRawDataVal = new Map(rawData.val === undefined ? [] : [...rawData.val.entries()]);
    for (const {key, value} of batch) {
      const listenersForKey = listeners.get(key);
      const valueForKey = data.get(key);
      const v = (valueForKey?.v ?? -1) + 1;
      const newValueForKey = {val: value, v};

      data.set(key, newValueForKey);
      newRawDataVal.set(key, value);
      persist(key);

      for (const listener of listenersForKey ?? []) {
        listener(newValueForKey);
      }
    }

    rawData = {val: newRawDataVal, v: rawData.v + 1};
    for (const listener of multiListeners.values()) {
      listener(rawData);
    }
  }

  function deleteData(key: Key): void {
    batchDeleteData([key]);
  }

  function batchDeleteData(batch: Key[]): void {
    const newRawDataVal = new Map(rawData.val === undefined ? [] : [...rawData.val.entries()]);
    for (const key of batch) {
      const listenersForKey = listeners.get(key);
      const valueForKey = data.get(key);
      const v = (valueForKey?.v ?? -1) + 1;
      const newValueForKey = {val: undefined, v};

      data.set(key, newValueForKey);
      newRawDataVal.delete(key);
      persist(key);

      for (const listener of listenersForKey ?? []) {
        listener(newValueForKey);
      }
    }

    rawData = {val: newRawDataVal, v: rawData.v + 1};
    for (const listener of multiListeners.values()) {
      listener(rawData);
    }
  }

  function useData(key: Key): Value | undefined {
    const currentData = data.get(key);
    const [internalData, setInternalData] = useState(currentData);
    useEffect(() => {
      // In case the rev of the data store changed between the time we did the `useState`
      // and the time of the `useEffect` we need to refresh manually the state.
      if (internalData !== currentData) {
        setInternalData(currentData);
      }
      // Register the state setter to be called for any subsequent data store change
      const listenersForKey = listeners.get(key);
      if (listenersForKey === undefined) {
        listeners.set(key, [setInternalData]);
      } else {
        listenersForKey.push(setInternalData);
      }
      return () => {
        const listenersForKey = listeners.get(key);
        if (listenersForKey === undefined) {
          return;
        }
        listenersForKey.splice(listenersForKey.indexOf(setInternalData), 1);
      };
    }, [key]); /* eslint-disable-line react-hooks/exhaustive-deps */
    return internalData?.val;
  }

  function useAllData(): Map<Key, Value> {
    const [internalData, setInternalData] = useState(rawData);
    useEffect(() => {
      // In case the rev of the data store changed between the time we did the `useState`
      // and the time of the `useEffect` we need to refresh manually the state.
      if (internalData !== rawData) {
        setInternalData(rawData);
      }
      // Register the state setter to be called for any subsequent data store change
      multiListeners.add(setInternalData);
      return () => {
        multiListeners.delete(setInternalData);
      };
    }, []); /* eslint-disable-line react-hooks/exhaustive-deps */
    return internalData.val ?? new Map();
  }

  async function awaitLoaded(): Promise<void> {
    // Otherwise we return a promise and add it to the awaiters
    return new Promise<void>((resolve, reject) => {
      // If the data is already loaded, resolve immediately
      if (isLoaded) {
        resolve();
      } else {
        loadedAwaiters.push({resolve, reject});
      }
    });
  }

  return {
    getData,
    getAllData,
    setData,
    batchSetData,
    useData,
    useAllData,
    deleteData,
    batchDeleteData,
    awaitLoaded,
  };
}
