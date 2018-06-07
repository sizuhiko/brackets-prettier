define(function(require, exports, module) {
  'use strict';

  const OPTIONS_FILE_NAME = '.prettierrc';

  const FileSystem = brackets.getModule('filesystem/FileSystem');
  const ProjectManager = brackets.getModule('project/ProjectManager');

  let options;

  /**
   * Load prettier options file
   * @public
   * @param {string} optionsFile Filename.default is `.prettierrc` file from project root directory
   */
  function load(optionsFile) {
    if (!optionsFile) {
      const root = ProjectManager.getProjectRoot();
      if (!root) {
        return _bindLoadOptions();
      }
      optionsFile = FileSystem.getFileForPath(root.fullPath + OPTIONS_FILE_NAME);
    }
    optionsFile.read(function(err, content) {
      if (!err && content) {
        try {
          options = JSON.parse(content);
        } catch (error) {
          console.error(
            'Brackets Prettier - Error parsing options (' + optionsFile.fullPath + '). Using default.'
          );
        }
      }
    });
  }

  /**
   * Callback document change event.
   * If change `.prettierrc` then reload option file.
   * @public
   * @param {Error}  error    null if not error
   * @param {object} document Brackets document
   */
  function onChange(error, document) {
    if (document.file.fullPath === ProjectManager.getProjectRoot().fullPath + OPTIONS_FILE_NAME) {
      load(document.file);
    }
  }

  /**
   * Get loaded options
   * function `loadOptions` is async load from file.
   * should use this function for getting values of options
   * @public
   * @returns {object} prettier options
   */
  function getOptions() {
    return options;
  }

  function _bindLoadOptions() {
    ProjectManager.on('projectOpen.prettierOptions', function() {
      load();
    });
  }

  module.exports = {
    load: load,
    onChange: onChange,
    getOptions: getOptions,
  };
});
