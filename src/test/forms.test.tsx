import { fireEvent, render, screen } from "@testing-library/react";
import { useCheckbox, useTextInput, useToggle } from "..";

test("toggle", function () {
  function App() {
    const [showMenu, toggleShowMenu] = useToggle();

    return (
      <>
        <button onClick={toggleShowMenu}>Show menu</button>
        {showMenu && <div>Menu</div>}
      </>
    );
  }
  render(<App />);
  const button = screen.getByText(/^Show menu$/);
  expect(screen.queryByText(/^Menu$/)).not.toBeInTheDocument();
  button.click();
  expect(screen.getByText(/^Menu$/)).toBeInTheDocument();
  button.click();
  expect(screen.queryByText(/^Menu$/)).not.toBeInTheDocument();
});

test("toggle with initial state", function () {
  function App() {
    const [showMenu, toggleShowMenu] = useToggle(true);

    return (
      <>
        <button onClick={toggleShowMenu}>Show menu</button>
        {showMenu && <div>Menu</div>}
      </>
    );
  }
  render(<App />);
  const button = screen.getByText(/^Show menu$/);
  expect(screen.getByText(/^Menu$/)).toBeInTheDocument();
  button.click();
  expect(screen.queryByText(/^Menu$/)).not.toBeInTheDocument();
  button.click();
  expect(screen.getByText(/^Menu$/)).toBeInTheDocument();
});

test("text input", function () {
  function App() {
    const name = useTextInput();

    return <input data-testid="input" type="text" {...name} />;
  }
  render(<App />);
  const input = screen.getByTestId("input") as HTMLInputElement;
  expect(input.value).toBe("");
  fireEvent.change(input, { target: { value: "test" } });
  expect(input.value).toBe("test");
  fireEvent.change(input, { target: { value: "" } });
  expect(input.value).toBe("");
});

test("text input with initial state", function () {
  function App() {
    const name = useTextInput("test");

    return <input data-testid="input" type="text" {...name} />;
  }
  render(<App />);
  const input = screen.getByTestId("input") as HTMLInputElement;
  expect(input.value).toBe("test");
  fireEvent.change(input, { target: { value: "" } });
  expect(input.value).toBe("");
  fireEvent.change(input, { target: { value: "test" } });
  expect(input.value).toBe("test");
});

test("checkbox", function () {
  function App() {
    const checkbox = useCheckbox();

    return <input data-testid="input" type="checkbox" {...checkbox} />;
  }
  render(<App />);
  const input = screen.getByTestId("input") as HTMLInputElement;
  expect(input.checked).toBe(false);
  input.click();
  expect(input.checked).toBe(true);
  input.click();
  expect(input.checked).toBe(false);
});

test("checkbox with initial value", function () {
  function App() {
    const checkbox = useCheckbox(true);

    return <input data-testid="input" type="checkbox" {...checkbox} />;
  }
  render(<App />);
  const input = screen.getByTestId("input") as HTMLInputElement;
  expect(input.checked).toBe(true);
  input.click();
  expect(input.checked).toBe(false);
  input.click();
  expect(input.checked).toBe(true);
});
