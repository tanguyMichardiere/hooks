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
    }, 1000);

    return <div data-testid="count">{count}</div>;
  }
  render(<App />);
  expect(screen.getByTestId("count").textContent).toBe("0");
  await sleep(1000);
  expect(screen.getByTestId("count").textContent).toBe("1");
  await sleep(1000);
  expect(screen.getByTestId("count").textContent).toBe("2");
});
