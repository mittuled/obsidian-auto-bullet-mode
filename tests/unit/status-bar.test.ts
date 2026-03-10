import { StatusBarManager } from "../../src/status-bar";

describe("StatusBarManager", () => {
  let mockStatusBarEl: {
    setText: jest.Mock;
    addEventListener: jest.Mock;
  };
  let onToggle: jest.Mock;

  beforeEach(() => {
    mockStatusBarEl = {
      setText: jest.fn(),
      addEventListener: jest.fn(),
    };
    onToggle = jest.fn();
  });

  it("updates text to show enabled state", () => {
    const manager = new StatusBarManager(mockStatusBarEl as any, onToggle);
    manager.update(true);
    expect(mockStatusBarEl.setText).toHaveBeenCalledWith("Auto-Bullet: ON");
  });

  it("updates text to show disabled state", () => {
    const manager = new StatusBarManager(mockStatusBarEl as any, onToggle);
    manager.update(false);
    expect(mockStatusBarEl.setText).toHaveBeenCalledWith("Auto-Bullet: OFF");
  });

  it("registers click handler that calls onToggle", () => {
    new StatusBarManager(mockStatusBarEl as any, onToggle);
    expect(mockStatusBarEl.addEventListener).toHaveBeenCalledWith(
      "click",
      expect.any(Function),
    );

    // Simulate click
    const clickHandler = mockStatusBarEl.addEventListener.mock.calls[0][1];
    clickHandler();
    expect(onToggle).toHaveBeenCalled();
  });
});
