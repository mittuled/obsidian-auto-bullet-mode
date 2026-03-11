# Auto Bullet Mode

An Obsidian plugin that automatically inserts bullet prefixes (`- `) when you start typing on empty lines, creating an always-on outliner experience in Live Preview mode.

## Features

- **Auto bullet insertion** - Start typing on any empty line and a `- ` prefix is automatically added
- **Smart Enter key** - Press Enter on a bullet line to continue the list; press Enter on an empty bullet to exit the list
- **Indent inheritance** - New bullets automatically match the indentation level of the previous bullet
- **Checkbox shortcut** - Type `t` then space after a bullet prefix to create a checkbox (`- [ ] `)
- **Code block awareness** - Auto bullets are suppressed inside fenced code blocks and frontmatter
- **Slash command support** - Typing `/` on an empty line opens the slash command menu without interference
- **Toggle on/off** - Use the command palette or click the status bar indicator to toggle the plugin

## Installation

### From Obsidian Community Plugins

1. Open **Settings** > **Community plugins**
2. Click **Browse** and search for "Auto Bullet Mode"
3. Click **Install**, then **Enable**

### Manual Installation

1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/mittuled/obsidian-auto-bullet-mode/releases)
2. Create a folder `auto-bullet-mode` in your vault's `.obsidian/plugins/` directory
3. Copy the downloaded files into that folder
4. Enable the plugin in **Settings** > **Community plugins**

## Usage

Once enabled, simply start typing on any empty line in Live Preview mode. The plugin will automatically insert `- ` before your text.

### Keyboard behavior

| Action | Result |
|--------|--------|
| Type on empty line | Auto-inserts `- ` prefix |
| Enter on bullet line | Creates new bullet at same indent |
| Enter on empty bullet | Removes bullet, exits list |
| Type `t` + space after `- ` | Converts to checkbox `- [ ] ` |
| Type `/` on empty line | Opens slash command menu (no bullet) |

### Toggling

- **Command palette**: Search for "Toggle Auto Bullet Mode"
- **Status bar** (desktop): Click the "Auto-Bullet: ON/OFF" indicator
- **Settings**: Toggle in plugin settings

## Compatibility

- Works in **Live Preview** mode only (not Source mode or Reading view)
- Supports both desktop and mobile Obsidian
- Requires Obsidian v1.5.0 or later
