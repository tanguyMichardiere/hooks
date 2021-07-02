import { RefObject, useEffect, useRef } from "react";

function updateSize(
  canvas: HTMLCanvasElement,
  parent: HTMLElement,
  fontSize: number,
  drops: number[]
): number {
  if (parent.offsetWidth !== canvas.width) {
    canvas.width = parent.offsetWidth;
  }
  if (parent.offsetHeight !== canvas.height) {
    canvas.height = parent.offsetHeight;
  }
  const columns = Math.floor(canvas.width / fontSize);
  const offset = (canvas.width - fontSize * columns) / 2;
  if (columns > drops.length) {
    let i = drops.length;
    drops.length = columns;
    for (i; i < columns; ++i) {
      drops[i] = 1 - Math.floor((Math.random() * canvas.height) / fontSize);
    }
  } else if (columns < drops.length) {
    drops.length = columns;
  }
  return offset;
}

/**
 * @param {string} [chars=田由甲申甴电甶男甸甹町画甼甽甾甿畀畁畂畃畄畅畆畇畈畉畊畋界畍畎畏畐畑] - the characters that will randomly fall
 * @param {number} [fontSize=10] - the size of the characters
 * @param {string} [font=arial] - the font of the characters
 * @param {number} [interval=33] - the interval in ms between updates of the canvas
 *
 * Usage:
 * ```tsx
 * const matrixRef = useMatrix();
 * return <canvas ref={matrixRef} />;
 * ```
 */
export function useMatrix({
  chars = "田由甲申甴电甶男甸甹町画甼甽甾甿畀畁畂畃畄畅畆畇畈畉畊畋界畍畎畏畐畑",
  fontSize = 10,
  font = "arial",
  interval = 33,
}: {
  chars?: string;
  fontSize?: number;
  font?: string;
  interval?: number;
} = {}): RefObject<HTMLCanvasElement> {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(
    function () {
      const canvas = ref.current;
      if (canvas !== null) {
        const parent = canvas.parentElement;
        if (parent !== null) {
          const context = canvas.getContext("2d", {
            alpha: false,
          });
          if (context !== null) {
            context.font = fontSize + `px ${font}`;
            const drops: number[] = [];
            let offset = 0;
            const resize = () => {
              offset = updateSize(canvas, parent, fontSize, drops);
            };
            resize();
            window.addEventListener("resize", resize);
            const handle = setInterval(function () {
              context.fillStyle = "rgba(0, 0, 0, 0.05)";
              context.fillRect(0, 0, canvas.width, canvas.height);
              context.fillStyle = "#0F0";
              let char: string | undefined;
              let drop: number | undefined;
              for (let i = 0; i < drops.length; ++i) {
                char = chars[Math.floor(Math.random() * chars.length)];
                drop = drops[i];
                if (char !== undefined && drop !== undefined) {
                  context.fillText(
                    char,
                    i * fontSize + offset,
                    drop * fontSize
                  );
                  if (
                    drop * fontSize > canvas.height &&
                    Math.random() > 0.975
                  ) {
                    drops[i] = 0;
                  }
                  ++drops[i];
                }
              }
            }, interval);
            return function () {
              window.removeEventListener("resize", resize);
              clearInterval(handle);
            };
          }
        }
      }
      return undefined;
    },
    [chars, fontSize, font, interval]
  );

  return ref;
}
