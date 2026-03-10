// Mock Obsidian module for testing

export class Plugin {
  app: any = { workspace: { updateOptions: jest.fn() } };
  manifest: any = {};

  loadData = jest.fn().mockResolvedValue(null);
  saveData = jest.fn().mockResolvedValue(undefined);

  registerEditorExtension = jest.fn();
  addCommand = jest.fn();
  addStatusBarItem = jest.fn(() => ({
    setText: jest.fn(),
    addClass: jest.fn(),
    removeClass: jest.fn(),
  }));
  addSettingTab = jest.fn();
}

export class PluginSettingTab {
  app: any;
  plugin: any;
  containerEl: any = {
    empty: jest.fn(),
    createEl: jest.fn(() => document.createElement("div")),
  };

  constructor(app: any, plugin: any) {
    this.app = app;
    this.plugin = plugin;
  }

  display(): void {}
  hide(): void {}
}

export class Setting {
  settingEl: any = document.createElement("div");
  nameEl: any = document.createElement("div");
  descEl: any = document.createElement("div");

  constructor(_containerEl: any) {}

  setName(_name: string): this { return this; }
  setDesc(_desc: string): this { return this; }
  addToggle(cb: (toggle: any) => any): this {
    const toggle = {
      setValue: jest.fn().mockReturnThis(),
      onChange: jest.fn().mockReturnThis(),
    };
    cb(toggle);
    return this;
  }
}

// Mock editorLivePreviewField as a StateField-like object
export const editorLivePreviewField = {
  id: Symbol("editorLivePreviewField"),
};

export class Platform {
  static isDesktop = true;
  static isMobile = false;
}
