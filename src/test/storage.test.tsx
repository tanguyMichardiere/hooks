import { act, render, screen } from "@testing-library/react";
import { useStorage } from "..";

test("localStorage state is correct", function () {
  localStorage.clear();
  function App() {
    const [auth, setAuth, authError] = useStorage<{ userName: string }>(
      localStorage,
      "auth"
    );

    if (authError !== undefined) {
      return <div>auth error</div>;
    } else if (auth !== null) {
      return <div>logged in: {auth.userName}</div>;
    } else {
      return (
        <button
          onClick={function () {
            setAuth({ userName: "test" });
          }}
        >
          log in
        </button>
      );
    }
  }
  render(<App />);
  const button = screen.getByText(/^log in$/);
  expect(button).toBeInTheDocument();
  button.click();
  expect(screen.getByText(/^logged in: /)).toBeInTheDocument();
});

test("initial state comes from localStorage", function () {
  localStorage.clear();
  localStorage.setItem("auth", JSON.stringify({ userName: "test" }));
  function App() {
    const [auth, setAuth, authError] = useStorage<{ userName: string }>(
      localStorage,
      "auth"
    );

    if (authError !== undefined) {
      return <div>auth error</div>;
    } else if (auth !== null) {
      return <div>logged in: {auth.userName}</div>;
    } else {
      return (
        <button
          onClick={function () {
            setAuth({ userName: "test" });
          }}
        >
          log in
        </button>
      );
    }
  }
  render(<App />);
  expect(screen.getByText(/^logged in: /)).toBeInTheDocument();
});

test("invalid string in storage returns an error", function () {
  localStorage.clear();
  localStorage.setItem("auth", '{"userName":"test"');
  function App() {
    const [auth, setAuth, authError] = useStorage<{ userName: string }>(
      localStorage,
      "auth"
    );

    if (authError !== undefined) {
      return <div>auth error</div>;
    } else if (auth !== null) {
      return <div>logged in: {auth.userName}</div>;
    } else {
      return (
        <button
          onClick={function () {
            setAuth({ userName: "test" });
          }}
        >
          log in
        </button>
      );
    }
  }
  render(<App />);
  expect(screen.getByText(/^auth error$/)).toBeInTheDocument();
});

test("throwing in the state update returns an error", function () {
  localStorage.clear();
  function App() {
    const [auth, setAuth, authError] = useStorage<{ userName: string }>(
      localStorage,
      "auth"
    );

    if (authError !== undefined) {
      return <div>auth error</div>;
    } else if (auth !== null) {
      return <div>logged in: {auth.userName}</div>;
    } else {
      return (
        <button
          onClick={function () {
            setAuth(function () {
              throw new Error("");
              return { userName: "test" };
            });
          }}
        >
          log in
        </button>
      );
    }
  }
  render(<App />);
  screen.getByText(/^log in$/).click();
  expect(screen.getByText(/^auth error$/)).toBeInTheDocument();
});

test("invalid storage value after initialValue returns an error", function () {
  localStorage.clear();
  function App() {
    const [auth, , authError] = useStorage<{ userName: string }>(
      localStorage,
      "auth"
    );

    if (authError !== undefined) {
      return <div>auth error</div>;
    } else if (auth !== null) {
      return <div>logged in: {auth.userName}</div>;
    } else {
      return <button>log in</button>;
    }
  }
  render(<App />);
  expect(screen.getByText(/^log in$/)).toBeInTheDocument();
  act(function () {
    localStorage.setItem("auth", "???");
    dispatchEvent(
      new StorageEvent("storage", {
        storageArea: localStorage,
        key: "auth",
        newValue: "???",
      })
    );
  });
  expect(screen.getByText(/^auth error$/)).toBeInTheDocument();
});

test("unrelated StorageEvent doesn't update state", function () {
  localStorage.clear();
  function App() {
    const [auth, , authError] = useStorage<{ userName: string }>(
      localStorage,
      "auth"
    );

    if (authError !== undefined) {
      return <div>auth error</div>;
    } else if (auth !== null) {
      return <div>logged in: {auth.userName}</div>;
    } else {
      return <button>log in</button>;
    }
  }
  render(<App />);
  expect(screen.getByText(/^log in$/)).toBeInTheDocument();
  act(function () {
    localStorage.setItem("auth", "???");
    dispatchEvent(
      new StorageEvent("storage", {
        storageArea: sessionStorage,
        key: "auth",
        newValue: "???",
      })
    );
    dispatchEvent(
      new StorageEvent("storage", {
        storageArea: localStorage,
        key: "auth2",
        newValue: "???",
      })
    );
  });
  expect(screen.getByText(/^log in$/)).toBeInTheDocument();
});

test("simple initial value", function () {
  localStorage.clear();
  function App() {
    const [auth, setAuth, authError] = useStorage<{ userName: string }>(
      localStorage,
      "auth",
      { userName: "test" }
    );

    if (authError !== undefined) {
      return <div>auth error</div>;
    } else if (auth !== null) {
      return <div>logged in: {auth.userName}</div>;
    } else {
      return (
        <button
          onClick={function () {
            setAuth({ userName: "test" });
          }}
        >
          log in
        </button>
      );
    }
  }
  render(<App />);
  expect(screen.getByText(/^logged in: /)).toBeInTheDocument();
});

test("lambda initial value", function () {
  localStorage.clear();
  function App() {
    const [auth, setAuth, authError] = useStorage<{ userName: string }>(
      localStorage,
      "auth",
      () => ({ userName: "test" })
    );

    if (authError !== undefined) {
      return <div>auth error</div>;
    } else if (auth !== null) {
      return <div>logged in: {auth.userName}</div>;
    } else {
      return (
        <button
          onClick={function () {
            setAuth({ userName: "test" });
          }}
        >
          log in
        </button>
      );
    }
  }
  render(<App />);
  expect(screen.getByText(/^logged in: /)).toBeInTheDocument();
});

test("multiple hooks are synced", function () {
  localStorage.clear();
  function App() {
    const [state1, setState1] = useStorage<number>(localStorage, "key");
    const [state2] = useStorage<number>(localStorage, "key");

    return (
      <>
        <div data-testid="state1">{state1}</div>
        <div data-testid="state2">{state2}</div>
        <button
          data-testid="button"
          onClick={function () {
            setState1(Date.now());
          }}
        >
          update
        </button>
      </>
    );
  }
  render(<App />);
  expect(screen.getByTestId("state1").textContent).toBe(
    screen.getByTestId("state2").textContent
  );
  const button = screen.getByTestId("button");
  button.click();
  expect(screen.getByTestId("state1").textContent).toBe(
    screen.getByTestId("state2").textContent
  );
});

test("setting to null removes the entry", function () {
  localStorage.clear();
  function App() {
    const [auth, setAuth, authError] = useStorage<{ userName: string }>(
      localStorage,
      "auth",
      () => ({ userName: "test" })
    );

    if (authError !== undefined) {
      return <div>auth error</div>;
    } else if (auth !== null) {
      return (
        <button
          onClick={function () {
            setAuth(null);
          }}
        >
          logged in: {auth.userName}
        </button>
      );
    } else {
      return (
        <button
          onClick={function () {
            setAuth({ userName: "test" });
          }}
        >
          log in
        </button>
      );
    }
  }
  render(<App />);
  expect(screen.getByText(/^logged in: /)).toBeInTheDocument();
  screen.getByText(/^logged in: /).click();
  expect(screen.getByText(/^log in$/)).toBeInTheDocument();
});
