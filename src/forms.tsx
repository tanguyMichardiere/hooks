import { ChangeEvent, useCallback, useState } from "react";

/**
 * Usage:
 * ```tsx
 * const [showMenu, toggleShowMenu] = useToggle();
 * return (
 *   <button onClick={toggleShowMenu}>Menu</button>
 *   {showMenu && <Menu />}
 * );
 * ```
 */
export function useToggle(
  initialState: boolean | (() => boolean) = false
): [boolean, () => void] {
  const [state, setState] = useState(initialState);

  const toggleState = useCallback(function () {
    setState((state) => !state);
  }, []);

  return [state, toggleState];
}

/**
 * Usage:
 * ```tsx
 * const [name, setName] = useTextInput();
 * return <input type="text" value={name} onChanged={setName} />;
 * ```
 */
export function useTextInput(
  initialState: string | (() => string) = ""
): [
  string,
  (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
] {
  const [state, _setState] = useState(initialState);

  const setState = useCallback(function (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    _setState(event.target.value);
  },
  []);

  return [state, setState];
}

/**
 * Usage:
 * ```tsx
 * const [checked, setChecked] = useCheckbox();
 * return <input type="checkbox" checked={checked} onChanged={setChecked} />;
 * ```
 */
export function useCheckbox(
  initialState: boolean | (() => boolean) = false
): [boolean, (event: ChangeEvent<HTMLInputElement>) => void] {
  const [state, _setState] = useState(initialState);

  const setState = useCallback(function (event: ChangeEvent<HTMLInputElement>) {
    _setState(event.target.checked);
  }, []);

  return [state, setState];
}
