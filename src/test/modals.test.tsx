import { render, screen } from "@testing-library/react";
import { ModalProvider, useModals } from "..";

test("using useModals outside of ModalProvider throws", function () {
  function App() {
    const modals = useModals();

    return (
      <button
        onClick={function () {
          modals.push(
            <div>
              <h2>Modal</h2>
              <button onClick={modals.pop}>Close modal</button>
            </div>
          );
        }}
      >
        Show modal
      </button>
    );
  }
  // suppress the wall of red text from the throw
  jest.spyOn(console, "error").mockImplementation();
  expect(function () {
    render(<App />);
  }).toThrow("used useModals outside of ModalProvider");
});

test("push then pop one simple modal", function () {
  function App() {
    const modals = useModals();

    return (
      <button
        onClick={function () {
          modals.push(
            <div>
              <h2>Modal</h2>
              <button onClick={modals.pop}>Close modal</button>
            </div>
          );
        }}
      >
        Show modal
      </button>
    );
  }
  render(
    <ModalProvider>
      <App />
    </ModalProvider>
  );
  expect(screen.queryByText(/^Modal$/)).not.toBeInTheDocument();
  const showModalButton = screen.getByText(/^Show modal$/);
  expect(showModalButton).toBeInTheDocument();
  showModalButton.click();
  expect(screen.getByText(/^Modal$/)).toBeInTheDocument();
  const closeModalButton = screen.getByText(/^Close modal$/);
  expect(closeModalButton).toBeInTheDocument();
  closeModalButton.click();
  expect(screen.queryByText(/^Modal$/)).not.toBeInTheDocument();
});

test("push then pop 2 modals", function () {
  function App() {
    const modals = useModals();

    return (
      <button
        onClick={function () {
          modals.push(
            <div>
              <h2>Modal 1</h2>
              <button
                onClick={function () {
                  modals.push(
                    <div>
                      <h2>Modal 2</h2>
                      <button onClick={modals.pop}>Close modal 2</button>
                    </div>
                  );
                }}
              >
                Show modal 2
              </button>
              <button onClick={modals.pop}>Close modal 1</button>
            </div>
          );
        }}
      >
        Show modal 1
      </button>
    );
  }
  render(
    <ModalProvider>
      <App />
    </ModalProvider>
  );
  expect(screen.queryByText(/^Modal 1$/)).not.toBeInTheDocument();
  expect(screen.queryByText(/^Modal 2$/)).not.toBeInTheDocument();
  const showModal1Button = screen.getByText(/^Show modal 1$/);
  expect(showModal1Button).toBeInTheDocument();
  showModal1Button.click();
  expect(screen.getByText(/^Modal 1$/)).toBeInTheDocument();
  expect(screen.queryByText(/^Modal 2$/)).not.toBeInTheDocument();
  const showModal2Button = screen.getByText(/^Show modal 2$/);
  expect(showModal2Button).toBeInTheDocument();
  showModal2Button.click();
  expect(screen.getByText(/^Modal 1$/)).toBeInTheDocument();
  expect(screen.getByText(/^Modal 2$/)).toBeInTheDocument();
  const closeModal2Button = screen.getByText(/^Close modal 2$/);
  expect(closeModal2Button).toBeInTheDocument();
  closeModal2Button.click();
  expect(screen.getByText(/^Modal 1$/)).toBeInTheDocument();
  expect(screen.queryByText(/^Modal 2$/)).not.toBeInTheDocument();
  const closeModal1Button = screen.getByText(/^Close modal 1$/);
  expect(closeModal1Button).toBeInTheDocument();
  closeModal1Button.click();
  expect(screen.queryByText(/^Modal 1$/)).not.toBeInTheDocument();
  expect(screen.queryByText(/^Modal 2$/)).not.toBeInTheDocument();
});

test("if `closeOnClickOutside`, modals close when clicking outside but not on them", function () {
  function App() {
    const modals = useModals();

    return (
      <button
        onClick={function () {
          modals.push(
            <div data-testid="modal-background">
              <h2>Modal</h2>
              <button onClick={modals.pop}>Close modal</button>
            </div>,
            { closeOnClickOutside: true }
          );
        }}
      >
        Show modal
      </button>
    );
  }
  render(
    <ModalProvider>
      <App />
    </ModalProvider>
  );
  expect(screen.queryByText(/^Modal$/)).not.toBeInTheDocument();
  const showModalButton = screen.getByText(/^Show modal$/);
  expect(showModalButton).toBeInTheDocument();
  showModalButton.click();
  const modalTitle = screen.getByText(/^Modal$/);
  expect(modalTitle).toBeInTheDocument();
  modalTitle.click();
  expect(modalTitle).toBeInTheDocument();
  // this currently fails because jsdom doesn't support event.currentTarget
  // modalTitle.parentElement?.click();
  // expect(screen.queryByText(/^Modal$/)).not.toBeInTheDocument();
});
