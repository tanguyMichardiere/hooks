import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";

/**
 * Usage:
 *
 * ```tsx
 * const [showMenu, toggleShowMenu] = useToggle();
 * return (
 *   <>
 *     <button onClick={toggleShowMenu}>Menu</button>
 *     {showMenu && <Menu />}
 *   </>
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
 *
 * ```tsx
 * const name = useTextInput();
 * return <input type="text" {...name} />;
 * ```
 */
export function useTextInput(initialState: string | (() => string) = ""): {
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
} {
  const [value, setValue] = useState(initialState);

  const onChange = useCallback(function (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setValue(event.target.value);
  },
  []);

  return { value, onChange };
}

/**
 * Usage:
 *
 * ```tsx
 * const checkbox = useCheckbox();
 * return <input type="checkbox" {...checkbox} />;
 * ```
 */
export function useCheckbox(initialState: boolean | (() => boolean) = false): {
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
} {
  const [checked, setChecked] = useState(initialState);

  const onChange = useCallback(function (event: ChangeEvent<HTMLInputElement>) {
    setChecked(event.target.checked);
  }, []);

  return { checked, onChange };
}
