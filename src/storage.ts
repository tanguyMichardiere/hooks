import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

function parseAs<T>(text: string | null): T | null {
  return text !== null ? JSON.parse(text) : null;
}

/**
 * A wrapper around {@link useState} that saves the state in a {@link Storage}.
 * For example you can use {@link localStorage} or {@link sessionStorage}.
 *
 * Using this hook multiple times with the same storage and the same key will automatically synchronize the state.
 *
 * Setting a state as `null` will remove it from the {@link Storage}.
 *
 * Usage:
 *
 * ```tsx
 * const [auth, setAuth] = useStorage(localStorage, "auth")
 * if (auth !== null) {
 *   return <App />
 * } else {
 *   return <Login />
 * }
 * ```
 *
 * Note that a {@link Storage} only supports storing strings.
 * Any object you put in a {@link Storage} with this hook will be serialized with {@link JSON.stringify}.
 *
 * This hook returns an optional error as its third value.
 * An error can occur if the string stored in the storage is not valid JSON.
 * If an error occurs, the state will be valid but outdated.
 * Example usage:
 *
 * ```tsx
 * const [auth, setAuth, authError] = useStorage(localStorage, "auth")
 * if (authError !== undefined) {
 *   setAuth(null)
 * }
 * ```
 */
export function useStorage<T = unknown>(
  storage: Storage,
  key: string,
  initialValue?: T | (() => T)
): [T | null, Dispatch<SetStateAction<T | null>>, unknown] {
  const [error, setError] = useState<unknown>();

  // Initially, get state from storage
  const [value, _setValue] = useState<T | null>(function () {
    const computedInitialValue =
      initialValue instanceof Function ? initialValue() : initialValue ?? null;
    try {
      const value = storage.getItem(key);
      setError(undefined);
      return parseAs(value) ?? computedInitialValue;
    } catch (error) {
      setError(error);
      return computedInitialValue;
    }
  });

  // When updating the state, update storage and notify other hooks
  const setValue = useCallback(
    function (value: SetStateAction<T | null>) {
      _setValue(function (prevState) {
        try {
          const newState = value instanceof Function ? value(prevState) : value;
          const newValue = newState !== null ? JSON.stringify(newState) : null;
          if (newValue !== null) {
            storage.setItem(key, newValue);
          } else {
            storage.removeItem(key);
          }
          // We need to dispatch a StorageEvent because it is automatically dispatched only for other documents
          dispatchEvent(
            new StorageEvent("storage", {
              storageArea: storage,
              key: key,
              newValue,
            })
          );
          setError(undefined);
          return newState;
        } catch (error) {
          setError(error);
          return prevState;
        }
      });
    },
    [storage, key]
  );

  // When storage is modified in the context of another document or by another hook, update the state
  useEffect(
    function () {
      function updateState(storageEvent: StorageEvent) {
        if (storageEvent.storageArea === storage && storageEvent.key === key) {
          try {
            _setValue(parseAs(storageEvent.newValue));
            setError(undefined);
          } catch (error) {
            setError(error);
          }
        }
      }
      addEventListener("storage", updateState);
      return function () {
        removeEventListener("storage", updateState);
      };
    },
    [storage, key]
  );

  return [value, setValue, error];
}
