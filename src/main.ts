import { Platform, Plugin } from "obsidian";
import type { Extension } from "@codemirror/state";
import { AutoBulletSettings, AutoBulletSettingTab, DEFAULT_SETTINGS } from "./settings";
import { createAutoBulletInputHandler } from "./extensions/auto-bullet";
import { createBulletEnterHandler } from "./extensions/bullet-enter";
import { StatusBarManager } from "./status-bar";

export default class AutoBulletPlugin extends Plugin {
  settings: AutoBulletSettings = { ...DEFAULT_SETTINGS };
  private extensions: Extension[] = [];
  private statusBar: StatusBarManager | null = null;

  async onload(): Promise<void> {
    await this.loadSettings();
    this.registerEditorExtension(this.extensions);

    // Status bar (desktop only)
    if (Platform.isDesktop) {
      const statusBarEl = this.addStatusBarItem();
      this.statusBar = new StatusBarManager(statusBarEl, () => {
        this.toggleExtensions(!this.settings.autoBulletEnabled);
        this.settings.autoBulletEnabled = !this.settings.autoBulletEnabled;
        void this.saveSettings();
        this.statusBar?.update(this.settings.autoBulletEnabled);
      });
      this.statusBar.update(this.settings.autoBulletEnabled);
    }

    // Toggle command
    this.addCommand({
      id: "toggle",
      name: "Toggle mode",
      callback: () => {
        this.settings.autoBulletEnabled = !this.settings.autoBulletEnabled;
        this.toggleExtensions(this.settings.autoBulletEnabled);
        void this.saveSettings();
        this.statusBar?.update(this.settings.autoBulletEnabled);
      },
    });

    // Settings tab
    this.addSettingTab(new AutoBulletSettingTab(this.app, this));

    // Enable extensions if setting is on
    if (this.settings.autoBulletEnabled) {
      this.enableExtensions();
    }
  }

  onunload(): void {
    // Extensions are automatically cleaned up by registerEditorExtension
  }

  toggleExtensions(enabled: boolean): void {
    if (enabled) {
      this.enableExtensions();
    } else {
      this.disableExtensions();
    }
  }

  enableExtensions(): void {
    if (this.extensions.length > 0) return; // Already enabled
    this.extensions.push(
      createAutoBulletInputHandler(this.settings.checkboxShortcut),
      createBulletEnterHandler(),
    );
    this.app.workspace.updateOptions();
  }

  disableExtensions(): void {
    this.extensions.length = 0;
    this.app.workspace.updateOptions();
  }

  rebuildExtensions(): void {
    if (this.extensions.length === 0) return;
    this.disableExtensions();
    this.enableExtensions();
  }

  async loadSettings(): Promise<void> {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      await this.loadData(),
    );
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }
}
