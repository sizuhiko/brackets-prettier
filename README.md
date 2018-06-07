

# Brackets Prettier

[Brackets][brackets] Extension that formats open JavaScript, JSX, Flow, TypeScript, CSS, Less, SCSS, JSON, GraphQL and Markdown files using [prettier][prettier] version [1.13.4][prettier version].

## Installation

### Latest Release

To install the latest _release_ of this extension use the built-in Brackets [Extension Manager][brackets extension manager] which downloads the extension from the [extension registry][brackets extension registry].

## Usage

Brackets Prettier can be run manually on the whole file or on a selection.
Use the Toolbar Button with the wand icon, the menu entry `Edit > Prettier`, the context-menu entry `Prettier`, or one of the keyboard shortcuts `Ctrl-Alt-B` (Windows/Linux), `Ctrl-Shift-L` (Windows), `Cmd-Shift-L` (Mac), or [define your own][prettier user key map].

Alternatively it can be enabled to run automatically on save.
Use the menu entry `Edit > Prettier on Save` or the more [advanced settings][prettier prettier on save] to activate.

## Configuration

### Prettier Options

Brackets Prettier supports the same [options][prettier options] as [prettier][prettier].
The options can be specified in a `.prettierrc` file on project level.
A `.prettierrc` file, only support written in JSON format.

### File Options for Prettier on Save

Brackets Beautify leverages [Brackets preferences][brackets preferences], which means that you can specify per project settings by defining a `.brackets.json` in the root directory of your project. With Brackets preferences you can even define per file settings, which is really handy when dealing with third party libraries or minified resources.

Brackets Prettier also support per language settings, which enables you to enable/disabled `Prettier on Save` for your documents using the Brackets language layer.

The sample `.brackets.json` below generally enables `Prettier on Save` and disables it for any JavaScript file in `thirdparty`, any JavaScript file whose filename contains `min`, and any JSON file.

```json
{
  "sizuhiko.brackets.prettier.onSave": true,
  "path": {
    "thirdparty/**.js": {
      "sizuhiko.brackets.prettier.onSave": false
    },
    "**min**.js": {
      "sizuhiko.brackets.prettier.onSave": false
    }
  },
  "language": {
    "json": {
      "sizuhiko.brackets.prettier.onSave": false
    }
  }
}
```

### User Key Map for Prettier

Open the `keymap.json` with the menu entry `Debug > Open User Key Map` and add an _overrides_ entry.
For example:

```json
{
  "documentation": "https://github.com/adobe/brackets/wiki/User-Key-Bindings",
  "overrides": {
    "Ctrl-Alt-F": "sizuhiko.brackets.prettier"
  }
}
```

## Issues

Brackets Prettier uses [prettier][prettier] to format files and is therefore limited to its capabilities.
For any issues concerning the actual formatting please refer to the [prettier issues][prettier issues].

## License

Brackets Beautify is licensed under the [MIT license][mit]. [prettier][prettier] is also licensed under the MIT license.

[brackets]: http://brackets.io
[brackets extension manager]: https://github.com/adobe/brackets/wiki/Brackets-Extensions
[brackets extension registry]: https://registry.brackets.io
[brackets preferences]: https://github.com/adobe/brackets/wiki/How-to-Use-Brackets#preferences
[brackets npm registry]: https://github.com/zaggino/brackets-npm-registry
[prettier user key map]: https://github.com/sizuhiko/brackets-prettier#user-key-map-for-prettier
[prettier prettier on save]: https://github.com/sizuhiko/brackets-prettier#file-options-for-prettier-on-save
[prettier latest release]: https://github.com/sizuhiko/brackets-prettier/releases/latest
[prettier]: https://github.com/prettier/prettier
[prettier version]: https://github.com/prettier/prettier/blob/master/CHANGELOG.md#1134
[prettier issues]: https://github.com/prettier/prettier/issues
[prettier options]: https://prettier.io/docs/en/configuration.html
[mit]: http://opensource.org/licenses/MIT
