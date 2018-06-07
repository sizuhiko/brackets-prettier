define(function(require) {
  'use strict';

  const AppInit = brackets.getModule('utils/AppInit');
  const DocumentManager = brackets.getModule('document/DocumentManager');

  const format = require('format');
  const menu = require('menu');
  const preferences = require('preferences');
  const options = require('options');

  menu.create(format.format, preferences.toggleAutoSave);
  format.setOptions(options);
  format.setPreferences(preferences);

  AppInit.appReady(function() {
    DocumentManager.on('documentSaved.prettier', format.onSave);
    DocumentManager.on('documentSaved.prettierOptions', options.onChange);
    DocumentManager.on('documentRefreshed.prettierOptions', options.onChange);
    options.init();
  });
});
