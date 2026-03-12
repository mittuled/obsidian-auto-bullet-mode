import { App, PluginSettingTab, Setting } from "obsidian";
import type AutoBulletPlugin from "./main";

export interface AutoBulletSettings {
  autoBulletEnabled: boolean;
  checkboxShortcut: string;
}

export const DEFAULT_SETTINGS: AutoBulletSettings = {
  autoBulletEnabled: true,
  checkboxShortcut: "t",
};

const CONFLICTING_CHARS = new Set(["/", "#", ">", "`", " ", "\t"]);

export function validateCheckboxShortcut(value: string): string {
  const char = value.slice(0, 1);
  if (char === "") return "";
  if (CONFLICTING_CHARS.has(char)) return "";
  if (!/^[a-zA-Z0-9]$/.test(char)) return "";
  return char;
}

export class AutoBulletSettingTab extends PluginSettingTab {
  plugin: AutoBulletPlugin;

  constructor(app: App, plugin: AutoBulletPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    new Setting(containerEl)
      .setName("Auto bullet mode")
      .setHeading();

    new Setting(containerEl)
      .setName("Enable auto bullet mode")
      .setDesc("Automatically insert bullet prefixes on new lines")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.autoBulletEnabled)
          .onChange(async (value) => {
            this.plugin.settings.autoBulletEnabled = value;
            await this.plugin.saveSettings();
            this.plugin.toggleExtensions(value);
          }),
      );

    new Setting(containerEl)
      .setName("Checkbox shortcut character")
      .setDesc(
        'Type this character after "- " then press space to create a checkbox. ' +
        "Leave empty to disable. Only single alphanumeric characters are allowed.",
      )
      .addText((text) =>
        text
          .setPlaceholder("t")
          .setValue(this.plugin.settings.checkboxShortcut)
          .onChange(async (value) => {
            const validated = validateCheckboxShortcut(value);
            this.plugin.settings.checkboxShortcut = validated;
            text.setValue(validated);
            await this.plugin.saveSettings();
            this.plugin.rebuildExtensions();
          }),
      );
  }
}
