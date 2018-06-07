define(function(require, exports, module) {
  'use strict';

  const KEY_BINDINGS = [
    {
      key: 'Ctrl-Shift-L',
      platform: 'win',
    },
    {
      key: 'Ctrl-Alt-B',
      platform: 'win',
    },
    {
      key: 'Cmd-Shift-L',
      platform: 'mac',
    },
    {
      key: 'Ctrl-Alt-B',
    },
  ];

  const PREFIX = require('prefix');
  const COMMAND_ID = PREFIX + '.prettier';
  const AUTOSAVE_ID = PREFIX + '.autosave';

  const CommandManager = brackets.getModule('command/CommandManager');
  const Menus = brackets.getModule('command/Menus');

  /**
   * Create menu items
   * @public
   * @param {function} format           Callback execute prettier
   * @param {function} onChangeAutoSave Callback toggle setting of autosave
   */
  function create(format, onChangeAutoSave) {
    CommandManager.register('Prettier', COMMAND_ID, format);
    CommandManager.register('Prettier on Save', AUTOSAVE_ID, onChangeAutoSave);

    var editMenu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    editMenu.addMenuDivider();
    editMenu.addMenuItem(COMMAND_ID, KEY_BINDINGS);
    editMenu.addMenuItem(AUTOSAVE_ID);
    Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU).addMenuItem(COMMAND_ID);
  }

  /**
   * Get AutoSave menu
   * @public
   * @returns {Command} AutoSave menu item
   */
  function getAutoSaveMenu() {
    return CommandManager.get(AUTOSAVE_ID);
  }

  module.exports = {
    create: create,
    getAutoSaveMenu: getAutoSaveMenu,
  };
});
