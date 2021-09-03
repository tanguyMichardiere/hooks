import { act, render, screen } from "@testing-library/react";
import { useState } from "react";
import { useInterval } from "..";

async function sleep(ms: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

test("without timeout changes", async function () {
  function App() {
    const [count, setCount] = useState(0);

    useInterval(() => {
      act(function () {
        setCount((count) => count + 1);
      });
    }, 100);

    return <div data-testid="count">{count}</div>;
  }
  render(<App />);
  await sleep(50);
  expect(screen.getByTestId("count").textContent).toBe("0");
  await sleep(100);
  expect(screen.getByTestId("count").textContent).toBe("1");
  await sleep(100);
  expect(screen.getByTestId("count").textContent).toBe("2");
});

test("with timeout changes", async function () {
  function App() {
    const [ms, setMs] = useState(10);

    useInterval(
      () =>
        act(function () {
          setMs((ms) => ms * 2);
        }),
      ms
    );

    return <div data-testid="ms">{ms}</div>;
  }
  render(<App />);
  await sleep(5);
  expect(screen.getByTestId("ms").textContent).toBe("10");
  await sleep(15);
  expect(screen.getByTestId("ms").textContent).toBe("20");
  await sleep(30);
  expect(screen.getByTestId("ms").textContent).toBe("40");
  await sleep(60);
  expect(screen.getByTestId("ms").textContent).toBe("80");
  await sleep(120);
  expect(screen.getByTestId("ms").textContent).toBe("160");
  await sleep(240);
  expect(screen.getByTestId("ms").textContent).toBe("320");
});

test("with pausing", async function () {
  function App() {
    const [ms, setMs] = useState<number | null>(10);

    useInterval(
      () =>
        act(function () {
          setMs((ms) => (ms !== null ? ms * 2 : null));
        }),
      ms
    );

    return (
      <div data-testid="ms">
        {ms ?? "null"}
        <button
          data-testid="button"
          onClick={function () {
            setMs((ms) => (ms !== null ? null : 10));
          }}
        />
      </div>
    );
  }
  render(<App />);
  await sleep(5);
  expect(screen.getByTestId("ms").textContent).toBe("10");
  await sleep(15);
  expect(screen.getByTestId("ms").textContent).toBe("20");
  await sleep(30);
  expect(screen.getByTestId("ms").textContent).toBe("40");
  screen.getByTestId("button").click();
  expect(screen.getByTestId("ms").textContent).toBe("null");
  await sleep(100);
  expect(screen.getByTestId("ms").textContent).toBe("null");
  screen.getByTestId("button").click();
  await sleep(5);
  expect(screen.getByTestId("ms").textContent).toBe("10");
  await sleep(15);
  expect(screen.getByTestId("ms").textContent).toBe("20");
  await sleep(30);
  expect(screen.getByTestId("ms").textContent).toBe("40");
});
