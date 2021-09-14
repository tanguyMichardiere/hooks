import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

/**
 * A wrapper around {@link useState} that saves the state in a {@link Storage}.
 * For example you can use {@link localStorage} or {@link sessionStorage}.
 *
 * Using this hook multiple times with the same storage and the same key will automatically synchronize the states.
 *
 * Setting a state as `null` will remove it from the {@link Storage}.
 *
 * If initialValue is a function, it will behave the same as with {@link useState}, except it will not be called if the storage already contains a value.
 *
 * Usage:
 *
 * ```tsx
 * const [auth, setAuth] = useStorage(localStorage, "auth");
 * if (auth !== null) {
 *   return <App />;
 * } else {
 *   return <Login />;
 * }
 * ```
 *
 * Note that a {@link Storage} only supports storing strings.
 * Any object you want to put in a {@link Storage} with this hook has to be serializable.
 * The default option is {@link JSON.parse} and {@link JSON.stringify}, but you can set your own with the `options` parameter.
 *
 * This hook returns an optional error as its third value.
 * An error can occur if the storage is not accessible (private browsing, Node) or if the serializer or deserializer throws.
 * If an error occurs, the state will be valid but outdated.
 * Example usage:
 *
 * ```tsx
 * const [auth, setAuth, authError] = useStorage(localStorage, "auth");
 * if (authError !== undefined) {
 *   setAuth(null);
 * }
 * ```
 */
export function useStorage<T = unknown>(
  storage: Storage,
  key: string,
  initialValue: T | null | (() => T | null) = null,
  options: {
    deserializer: (text: string) => T;
    serializer: (value: T) => string;
  } = { deserializer: JSON.parse, serializer: JSON.stringify }
): [T | null, Dispatch<SetStateAction<T | null>>, unknown] {
  const { deserializer, serializer } = options;
  const parse = useCallback(
    (text: string | null) => (text !== null ? deserializer(text) : null),
    [deserializer]
  );
  const stringify = useCallback(
    (value: T | null) => (value !== null ? serializer(value) : null),
    [serializer]
  );

  const [error, setError] = useState<unknown>();

  // Initially, get state from storage
  const [value, _setValue] = useState<T | null>(function () {
    // If the storage is not accessible (private browsing) or if the deserializer throws, don't throw but set error
    try {
      const value = storage.getItem(key);
      setError(undefined);
      return (
        parse(value) ??
        (initialValue instanceof Function ? initialValue() : initialValue)
      );
    } catch (error) {
      setError(error);
      // If the function given as initialValue throws, the hook throws
      return initialValue instanceof Function ? initialValue() : initialValue;
    }
  });

  // When updating the state, update storage and notify other hooks
  const setValue = useCallback(
    function (value: SetStateAction<T | null>) {
      _setValue(function (prevState) {
        // If the storage is not accessible or the serializer throws, don't throw but set error
        try {
          const newState = value instanceof Function ? value(prevState) : value;
          const newValue = stringify(newState);
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
    [storage, key, stringify]
  );

  // When storage is modified in the context of another document or by another hook, update the state
  useEffect(
    function () {
      function updateState(storageEvent: StorageEvent) {
        if (storageEvent.storageArea === storage && storageEvent.key === key) {
          // If the deserializer throws, don't throw but set error
          try {
            _setValue(parse(storageEvent.newValue));
            setError(undefined);
          } catch (error) {
            setError(error);
          }
        }
      }
      window.addEventListener("storage", updateState);
      return function () {
        window.removeEventListener("storage", updateState);
      };
    },
    [storage, key, parse]
  );

  return [value, setValue, error];
}
