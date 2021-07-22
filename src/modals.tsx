import React, {
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
  push(modal: ReactNode, options?: Options): void;
  pop(): void;
}

const modalContext = createContext<ModalContext | undefined>(undefined);

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
    setModals((modals) => [...modals.slice(0, modals.length - 1)]);
  }, []);

  return (
    <modalContext.Provider value={{ push, pop }}>
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

export function useModals(): ModalContext {
  const modals = useContext(modalContext);
  if (modals === undefined) {
    throw new Error("used useModals outside of ModalProvider");
  }
  return modals;
}
