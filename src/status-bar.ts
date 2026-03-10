/**
 * Manages the status bar indicator for auto-bullet mode (desktop only).
 */
export class StatusBarManager {
  private el: HTMLElement;

  constructor(statusBarEl: HTMLElement, onToggle: () => void) {
    this.el = statusBarEl;
    this.el.addEventListener("click", onToggle);
  }

  update(enabled: boolean): void {
    this.el.setText(`Auto-Bullet: ${enabled ? "ON" : "OFF"}`);
  }
}
