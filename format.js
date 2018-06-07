define(function(require, exports, module) {
  'use strict';

  const LANGUAGES_PARSER_MAP = {
    javascript: 'babylon',
    jsx: 'babylon',
    typescript: 'typescript',
    css: 'postcss',
    less: 'postcss',
    scss: 'postcss',
    json: 'babylon',
    markdown: 'markdown',
    gfm: 'markdown',
    html: 'parse5',
  };

  const prettier = require('thirdparty/standalone');
  const plugins = [
    require('thirdparty/parser-babylon'),
    require('thirdparty/parser-flow'),
    require('thirdparty/parser-graphql'),
    require('thirdparty/parser-markdown'),
    // TypeError: Cannot read property 'options' of undefined @ standalone.js:3880
    // require("thirdparty/parser-parse5"),
    require('thirdparty/parser-postcss'),
    require('thirdparty/parser-typescript'),
    require('thirdparty/parser-vue'),
  ];

  const CommandManager = brackets.getModule('command/CommandManager');
  const Commands = brackets.getModule('command/Commands');
  const DocumentManager = brackets.getModule('document/DocumentManager');
  const EditorManager = brackets.getModule('editor/EditorManager');
  const PreferencesManager = brackets.getModule('preferences/PreferencesManager');

  let _options = {};
  let _preferences;

  /**
   * Format file or selected text on current editor
   * @public
   * @param {boolean} autoSave flag of settings for auto save
   */
  function format(autoSave) {
    const document = DocumentManager.getCurrentDocument();
    if (!LANGUAGES_PARSER_MAP[document.getLanguage().getId()] && !autoSave) {
      return;
    }

    const editor = EditorManager.getCurrentFullEditor();
    let unformattedText;
    let range;
    if (editor.hasSelection()) {
      unformattedText = editor.getSelectedText();
      range = editor.getSelection();
      const indentChars = document.getLine(range.start.line).substr(0, range.start.ch);
      if (indentChars.trim().length === 0) {
        range.start.ch = 0;
        unformattedText = indentChars + unformattedText;
      }
    } else {
      unformattedText = document.getText();
    }

    const options = _options.getOptions();
    options.parser = LANGUAGES_PARSER_MAP[document.getLanguage().getId()];
    options.plugins = plugins;

    const formattedText = prettier.format(unformattedText, options);
    if (formattedText !== unformattedText) {
      _update(formattedText, range);
    }
  }

  /**
   * Set options
   * @param {object} options options module instance
   */
  function setOptions(options) {
    _options = options;
  }

  /**
   * Set preferences
   * @param {object} preferences preferences module instance
   */
  function setPreferences(preferences) {
    _preferences = preferences;
  }

  /**
   * Update document text
   * @private
   * @param {string} formattedText formatted text for updating
   * @param {object} range         current selection on editor
   */
  function _update(formattedText, range) {
    const editor = EditorManager.getCurrentFullEditor();
    const cursorPos = editor.getCursorPos();
    const scrollPos = editor.getScrollPos();
    const document = DocumentManager.getCurrentDocument();
    document.batchOperation(function() {
      if (range) {
        document.replaceRange(formattedText, range.start, range.end);
      } else {
        document.setText(formattedText);
      }
      editor.setCursorPos(cursorPos);
      editor.setScrollPos(scrollPos.x, scrollPos.y);
    });
  }

  /**
   * Format on save event
   * @param {Event}  event Save event
   * @param {object} doc   Brackets document
   */
  function onSave(event, doc) {
    if (doc.__prettierSaving) {
      return;
    }
    const context = PreferencesManager._buildContext(doc.file.fullPath, doc.getLanguage().getId());
    if (_preferences.isAutoSave(context)) {
      doc.addRef();
      doc.__prettierSaving = true;
      format(true);
      setTimeout(function() {
        CommandManager.execute(Commands.FILE_SAVE, {
          doc: doc,
        }).always(function() {
          delete doc.__prettierSaving;
          doc.releaseRef();
        });
      });
    }
  }

  module.exports = {
    format: format,
    setOptions: setOptions,
    setPreferences: setPreferences,
    onSave: onSave,
  };
});
