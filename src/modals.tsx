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

const modalContext = createContext<ModalContext>({
  push() {
    throw new Error("used useModals outside of ModalProvider");
  },
  pop() {
    throw new Error("used useModals outside of ModalProvider");
  },
});

export function ModalProvider(
  {
    backgroundStyle,
    zIndex,
    children,
  }: {
    backgroundStyle: ModalCSSProperties;
    zIndex: number;
    children: ReactNode;
  } = { backgroundStyle: {}, zIndex: 100, children: undefined }
): JSX.Element {
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
            inset: 0,
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
  return useContext(modalContext);
}
