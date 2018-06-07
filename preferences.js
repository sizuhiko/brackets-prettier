define(function(require, exports, module) {
  'use strict';

  const PREF_SAVE_ID = 'onSave';

  const PREFIX = require('prefix');
  const menu = require('menu');

  const PreferencesManager = brackets.getModule('preferences/PreferencesManager');
  const prefs = PreferencesManager.getExtensionPrefs(PREFIX);

  prefs
    .definePreference(PREF_SAVE_ID, 'boolean', false, {
      name: 'Prettier on Save',
      description: 'Prettier on Save',
    })
    .on('change', _changePref);

  function _changePref() {
    menu.getAutoSaveMenu().setChecked(prefs.get(PREF_SAVE_ID));
  }

  /**
   * Callback toggle setting of autosave
   * @public
   */
  function toggleAutoSave() {
    const autoSaveMenu = menu.getAutoSaveMenu();
    autoSaveMenu.setChecked(!autoSaveMenu.getChecked());
    prefs.set(PREF_SAVE_ID, autoSaveMenu.getChecked());
  }

  /**
   * Is auto save document ?
   * @param   {string}  context Context of document
   * @returns {boolean}
   */
  function isAutoSave(context) {
    return prefs.get(PREF_SAVE_ID, context);
  }

  module.exports = {
    toggleAutoSave: toggleAutoSave,
    isAutoSave: isAutoSave
  };
});
