"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => AutoBulletPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian3 = require("obsidian");

// src/settings.ts
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  autoBulletEnabled: true,
  checkboxShortcut: "t"
};
var CONFLICTING_CHARS = /* @__PURE__ */ new Set(["/", "#", ">", "`", " ", "	"]);
function validateCheckboxShortcut(value) {
  const char = value.slice(0, 1);
  if (char === "")
    return "";
  if (CONFLICTING_CHARS.has(char))
    return "";
  if (!/^[a-zA-Z0-9]$/.test(char))
    return "";
  return char;
}
var AutoBulletSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName("Auto bullet mode").setHeading();
    new import_obsidian.Setting(containerEl).setName("Enable auto bullet mode").setDesc("Automatically insert bullet prefixes on new lines").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.autoBulletEnabled).onChange(async (value) => {
        this.plugin.settings.autoBulletEnabled = value;
        await this.plugin.saveSettings();
        this.plugin.toggleExtensions(value);
      })
    );
    new import_obsidian.Setting(containerEl).setName("Checkbox shortcut character").setDesc(
      'Type this character after "- " then press space to create a checkbox. Leave empty to disable. Only single alphanumeric characters are allowed.'
    ).addText(
      (text) => text.setPlaceholder("t").setValue(this.plugin.settings.checkboxShortcut).onChange(async (value) => {
        const validated = validateCheckboxShortcut(value);
        this.plugin.settings.checkboxShortcut = validated;
        text.setValue(validated);
        await this.plugin.saveSettings();
        this.plugin.rebuildExtensions();
      })
    );
  }
};

// src/extensions/auto-bullet.ts
var import_view = require("@codemirror/view");

// src/extensions/context.ts
var import_language = require("@codemirror/language");
var import_obsidian2 = require("obsidian");
var CODE_BLOCK_NODES = /* @__PURE__ */ new Set(["FencedCode", "CodeBlock"]);
var FRONTMATTER_NODES = /* @__PURE__ */ new Set(["YAMLFrontMatter"]);
function isInCodeBlock(state, pos) {
  let node = (0, import_language.syntaxTree)(state).resolveInner(pos, -1);
  while (node) {
    if (CODE_BLOCK_NODES.has(node.name))
      return true;
    if (!node.parent)
      break;
    node = node.parent;
  }
  const doc = state.doc;
  const line = doc.lineAt(pos);
  let fenceCount = 0;
  for (let i = 1; i < line.number; i++) {
    const lineText = doc.line(i).text;
    if (/^(`{3,}|~{3,})/.test(lineText.trim())) {
      fenceCount++;
    }
  }
  return fenceCount % 2 === 1;
}
function isInFrontmatter(state, pos) {
  let node = (0, import_language.syntaxTree)(state).resolveInner(pos, -1);
  while (node) {
    if (FRONTMATTER_NODES.has(node.name))
      return true;
    if (!node.parent)
      break;
    node = node.parent;
  }
  return false;
}
function isLivePreview(state) {
  try {
    return state.field(import_obsidian2.editorLivePreviewField) === true;
  } catch (e) {
    return false;
  }
}

// src/extensions/auto-bullet.ts
var BULLET_RE = /^(\s*)-\s/;
var BLOCK_SYNTAX_RE = /^(#{1,6}\s|>\s|\d+\.\s)/;
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function buildCheckboxPattern(char) {
  if (!char)
    return null;
  return new RegExp("^(\\s*)-\\s" + escapeRegex(char) + "\\s*$");
}
function createAutoBulletInputHandler(checkboxShortcut = "t") {
  const checkboxPatternRe = buildCheckboxPattern(checkboxShortcut);
  return import_view.EditorView.inputHandler.of(
    (view, from, to, text) => {
      if (text.length !== 1)
        return false;
      const state = view.state;
      if (!isLivePreview(state))
        return false;
      if (isInCodeBlock(state, from) || isInFrontmatter(state, from)) {
        return false;
      }
      const line = state.doc.lineAt(from);
      if (text === " " && checkboxPatternRe && checkboxPatternRe.test(line.text)) {
        const match = line.text.match(/^(\s*)-\s/);
        const indent2 = match ? match[1] : "";
        const newText = indent2 + "- [ ] ";
        view.dispatch({
          changes: {
            from: line.from,
            to: line.to,
            insert: newText
          },
          selection: {
            anchor: line.from + newText.length
          }
        });
        return true;
      }
      if (line.text.trim() !== "")
        return false;
      if (text === "/")
        return false;
      if (BLOCK_SYNTAX_RE.test(text + " "))
        return false;
      if (text === "#" || text === ">" || text === "`")
        return false;
      let indent = "";
      if (line.number > 1) {
        const prevLine = state.doc.line(line.number - 1);
        const match = prevLine.text.match(BULLET_RE);
        if (match) {
          indent = match[1];
        }
      }
      const prefix = indent + "- ";
      view.dispatch({
        changes: {
          from: line.from,
          to: from,
          insert: prefix + text
        },
        selection: {
          anchor: line.from + prefix.length + text.length
        }
      });
      return true;
    }
  );
}

// src/extensions/bullet-enter.ts
var import_state = require("@codemirror/state");
var import_view2 = require("@codemirror/view");
var BULLET_RE2 = /^(\s*)-\s/;
function createBulletEnterHandler() {
  return import_state.Prec.high(
    import_view2.keymap.of([
      {
        key: "Enter",
        run(view) {
          const state = view.state;
          if (!isLivePreview(state))
            return false;
          const head = state.selection.main.head;
          if (isInCodeBlock(state, head))
            return false;
          const line = state.doc.lineAt(head);
          const match = line.text.match(BULLET_RE2);
          if (!match)
            return false;
          const indent = match[1];
          const textAfterBullet = line.text.slice(match[0].length);
          if (textAfterBullet.trim() === "" && head >= line.from + match[0].length - 1) {
            view.dispatch({
              changes: {
                from: line.from,
                to: line.to,
                insert: ""
              },
              selection: {
                anchor: line.from
              }
            });
            return true;
          }
          const textBeforeCursor = line.text.slice(0, head - line.from);
          const textAfterCursor = line.text.slice(head - line.from);
          view.dispatch({
            changes: {
              from: line.from,
              to: line.to,
              insert: textBeforeCursor + "\n" + indent + "- " + textAfterCursor
            },
            selection: {
              anchor: line.from + textBeforeCursor.length + 1 + indent.length + 2
            }
          });
          return true;
        }
      }
    ])
  );
}

// src/status-bar.ts
var StatusBarManager = class {
  constructor(statusBarEl, onToggle) {
    this.el = statusBarEl;
    this.el.addEventListener("click", onToggle);
  }
  update(enabled) {
    this.el.setText(`Auto-Bullet: ${enabled ? "ON" : "OFF"}`);
  }
};

// src/main.ts
var AutoBulletPlugin = class extends import_obsidian3.Plugin {
  constructor() {
    super(...arguments);
    this.settings = { ...DEFAULT_SETTINGS };
    this.extensions = [];
    this.statusBar = null;
  }
  async onload() {
    await this.loadSettings();
    this.registerEditorExtension(this.extensions);
    if (import_obsidian3.Platform.isDesktop) {
      const statusBarEl = this.addStatusBarItem();
      this.statusBar = new StatusBarManager(statusBarEl, () => {
        var _a;
        this.toggleExtensions(!this.settings.autoBulletEnabled);
        this.settings.autoBulletEnabled = !this.settings.autoBulletEnabled;
        void this.saveSettings();
        (_a = this.statusBar) == null ? void 0 : _a.update(this.settings.autoBulletEnabled);
      });
      this.statusBar.update(this.settings.autoBulletEnabled);
    }
    this.addCommand({
      id: "toggle",
      name: "Toggle mode",
      callback: () => {
        var _a;
        this.settings.autoBulletEnabled = !this.settings.autoBulletEnabled;
        this.toggleExtensions(this.settings.autoBulletEnabled);
        void this.saveSettings();
        (_a = this.statusBar) == null ? void 0 : _a.update(this.settings.autoBulletEnabled);
      }
    });
    this.addSettingTab(new AutoBulletSettingTab(this.app, this));
    if (this.settings.autoBulletEnabled) {
      this.enableExtensions();
    }
  }
  onunload() {
  }
  toggleExtensions(enabled) {
    if (enabled) {
      this.enableExtensions();
    } else {
      this.disableExtensions();
    }
  }
  enableExtensions() {
    if (this.extensions.length > 0)
      return;
    this.extensions.push(
      createAutoBulletInputHandler(this.settings.checkboxShortcut),
      createBulletEnterHandler()
    );
    this.app.workspace.updateOptions();
  }
  disableExtensions() {
    this.extensions.length = 0;
    this.app.workspace.updateOptions();
  }
  rebuildExtensions() {
    if (this.extensions.length === 0)
      return;
    this.disableExtensions();
    this.enableExtensions();
  }
  async loadSettings() {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      await this.loadData()
    );
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
