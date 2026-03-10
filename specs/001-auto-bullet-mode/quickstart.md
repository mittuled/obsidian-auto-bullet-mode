# Quickstart: Auto Bullet Mode Plugin

## Prerequisites

- Node.js 18+
- npm
- Obsidian (desktop) with a dedicated development vault
- Git

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/mittuled/Obsidian-plugin.git
   cd Obsidian-plugin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the plugin:
   ```bash
   npm run build
   ```

4. Link to your development vault:
   ```bash
   # Create the plugin directory in your dev vault
   mkdir -p /path/to/dev-vault/.obsidian/plugins/auto-bullet-mode

   # Copy the built files
   cp main.js manifest.json styles.css \
     /path/to/dev-vault/.obsidian/plugins/auto-bullet-mode/
   ```

5. Enable the plugin:
   - Open the dev vault in Obsidian
   - Go to Settings > Community Plugins
   - Enable "Auto Bullet Mode"

## Development

Run continuous compilation:
```bash
npm run dev
```

This watches for file changes and rebuilds `main.js` automatically.
After each rebuild, disable and re-enable the plugin in Obsidian
(or use the Hot-Reload community plugin).

## Verify It Works

1. Open any note in the dev vault (Live Preview mode)
2. Place cursor on an empty line
3. Start typing — text should appear as `- your text`
4. Press Enter — a new `- ` line should appear
5. Press Enter again on the empty bullet — the bullet should
   be removed (exits list mode)
6. Open Command Palette (Cmd/Ctrl+P) and search for
   "Toggle Auto Bullet Mode" — verify the toggle works
7. Check the status bar (desktop) for the mode indicator

## Test Exclusions

Verify auto-bullet does NOT activate in:
- Fenced code blocks (``` ``` ```)
- Frontmatter (`---` YAML blocks)
- When typing headings (`#`)
- When pasting text
- In Source editing mode (switch via View menu)

## Project Structure

```
├── src/
│   ├── main.ts              # Plugin class, lifecycle
│   ├── settings.ts          # Settings interface, defaults, tab
│   ├── extensions/
│   │   ├── auto-bullet.ts   # CM6 extension: empty line auto-insert
│   │   ├── bullet-enter.ts  # CM6 extension: Enter key continuation
│   │   └── context.ts       # Editor context detection helpers
│   └── status-bar.ts        # Status bar indicator
├── manifest.json
├── package.json
├── tsconfig.json
├── esbuild.config.mjs
└── styles.css
```
