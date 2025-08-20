# gh-emoji-cli

A simple command-line tool to browse, search, and pick GitHub emojis right from your terminal.

## Installation

```bash
npm install -g gh-emoji-cli
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

- **`get <emoji>`**
  Get the information about a given emoji shortcode.

  ```bash
  gh-emoji get rocket
  # => 🚀
  ```

- **`pick`**
  Fuzzy-pick an emoji interactively using [fzf](https://github.com/junegunn/fzf).

### Options

| Option          | Description            | Default |
| --------------- | ---------------------- | ------- |
| `-c, --color`   | Print with colors      | `true`  |
| `-e, --emoji`   | Print emoji glyphs     | `true`  |
| `-v, --version` | Display version number | —       |
| `-h, --help`    | Display help message   | —       |

### Examples

```bash
# List all emojis
gh-emoji list

# Get a single emoji by shortcode
gh-emoji get :rocket:

# Pick an emoji interactively
gh-emoji pick

# Refresh emoji cache
gh-emoji refresh

# Get help for a specific command
gh-emoji get --help
```

---

## License

MIT
