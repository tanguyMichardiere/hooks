import {
  createContext,
  CSSProperties,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

type ModalCSSProperties = Omit<
  CSSProperties,
  | "position"
  | "inset"
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "display"
  | "alignItems"
  | "justifyContent"
  | "zIndex"
>;

interface Options {
  backgroundStyle?: ModalCSSProperties;
  closeOnClickOutside?: boolean;
}

interface ModalContext {
  /**
   * Push a component in the modals stack.
   */
  push(modal: ReactNode, options?: Options): void;
  /**
   * Pop the last modal.
   */
  pop(): void;
  /**
   * Pop all the modals.
   */
  popAll(): void;
}

const modalContext = createContext<ModalContext | undefined>(undefined);

/**
 * Context provider for {@link useModals}.
 *
 * Make sure to wrap any component that will push modals (typically your entire app) in a {@link ModalProvider}:
 *
 * ```tsx
 * export default function Index() {
 *   return <ModalProvider><App /></ModalProvider>;
 * }
 * ```
 */
export function ModalProvider({
  backgroundStyle = {},
  zIndex = 100,
  children,
}: {
  backgroundStyle?: ModalCSSProperties;
  zIndex?: number;
  children: ReactNode;
}): JSX.Element {
  const [modals, setModals] = useState<
    { modal: ReactNode; options: Required<Options> }[]
  >([]);

  const push = useCallback(function (
    modal: ReactNode,
    { backgroundStyle = {}, closeOnClickOutside = false }: Options = {}
  ) {
    setModals((modals) => [
      ...modals,
      { modal, options: { backgroundStyle, closeOnClickOutside } },
    ]);
  },
  []);

  const pop = useCallback(function () {
    setModals((modals) => modals.slice(0, -1));
  }, []);

  const popAll = useCallback(function () {
    setModals([]);
  }, []);

  return (
    <modalContext.Provider value={{ push, pop, popAll }}>
      {children}
      {modals.map(({ modal, options }, index) => (
        <div
          onClick={
            options.closeOnClickOutside
              ? function (event) {
                  if (event.target === event.currentTarget) {
                    pop();
                  }
                }
              : undefined
          }
          key={index}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: zIndex + index,
            ...backgroundStyle,
            ...options.backgroundStyle,
          }}
        >
          {modal}
        </div>
      ))}
    </modalContext.Provider>
  );
}

/**
 * Push and pop modals to and from the screen (like a stack).
 *
 * Make sure to wrap any component that will push modals (typically your entire app) in a {@link ModalProvider}:
 *
 * ```tsx
 * export default function App() {
 *   return <ModalProvider><App /></ModalProvider>;
 * }
 * ```
 *
 * Usage:
 *
 * ```tsx
 * const modals = useModals();
 * return (
 *   <button
 *     onClick={function () {
 *       modals.push(
 *         <div>
 *           <h2>Modal</h2>
 *           <button onClick={modals.pop}>Close modal</button>
 *         </div>
 *       );
 *     }}
 *   >
 *     Show modal
 *   </button>
 * );
 * ```
 */
export function useModals(): ModalContext {
  const modals = useContext(modalContext);
  if (modals === undefined) {
    throw new Error("used useModals outside of ModalProvider");
  }
  return modals;
}
