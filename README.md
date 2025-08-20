# gh-emoji-cli

A simple **command-line tool** to browse, search, and pick GitHub emojis right from your terminal.

## Installation

```bash
pnpm install -g gh-emoji-cli
```

## Usage

```bash
gh-emoji
```

### Commands

- **`list`**
  List all available GitHub emojis.

- **`refresh`**
  Refresh the local emoji cache.

- **`pick`**
  Fuzzy-pick an emoji using [skim](https://github.com/lotabout/skim).

### Options

| Option          | Description            |
| --------------- | ---------------------- |
| `-c, --color`   | Print with colors      |
| `-v, --version` | Display version number |
| `-h, --help`    | Display help message   |

### Examples

```bash
# List all emojis
gh-emoji list

# Pick an emoji interactively
gh-emoji pick

# Refresh emoji cache
gh-emoji refresh

# Get help for a specific command
gh-emoji pick --help
```

---

## License

MIT
