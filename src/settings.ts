import { PluginSettingTab, Setting } from "obsidian";
import type AutoBulletPlugin from "./main";

export interface AutoBulletSettings {
  autoBulletEnabled: boolean;
}

export const DEFAULT_SETTINGS: AutoBulletSettings = {
  autoBulletEnabled: true,
};

export class AutoBulletSettingTab extends PluginSettingTab {
  plugin: AutoBulletPlugin;

  constructor(app: any, plugin: AutoBulletPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Auto Bullet Mode" });

    new Setting(containerEl)
      .setName("Enable Auto Bullet Mode")
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
  }
}
