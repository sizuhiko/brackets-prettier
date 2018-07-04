define(function(require, exports, module) {
  'use strict';

  const OPTIONS_FILE_NAME = '.prettierrc';
  const OPTIONS_FILE_EXTENSIONS = ['', '.json'];

  const FileSystem = brackets.getModule('filesystem/FileSystem');
  const ProjectManager = brackets.getModule('project/ProjectManager');
  const FileUtils = brackets.getModule('file/FileUtils');

  let options;

  function readOptionsJSON(optionsFilepath) {
    return new Promise(function(resolve, reject) {
      const optionsFile = FileSystem.getFileForPath(optionsFilepath);
      optionsFile.read(function(err, content) {
        if (err || !content) {
          reject(err);
        } else {
          try {
            resolve(JSON.parse(content));
          } catch (err) {
            reject(err);
          }
        }
      });
    });
  }

  function loadOptionsFile(optionsFilepath) {
    const fileName = FileUtils.getBaseName(optionsFilepath);
    if (fileName === OPTIONS_FILE_NAME || fileName.endsWith('.json')) {
      return readOptionsJSON(optionsFilepath);
    }

    return Promise.reject(new Error('Unknown options file type (' + fileName + ')'));
  }

  function checkOptionsFile(root, extension) {
    return new Promise(function(resolve, reject) {
      const filePath = root.fullPath + OPTIONS_FILE_NAME + extension;
      FileSystem.resolve(filePath, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(filePath);
        }
      });
    });
  }

  function findOptionsFilepath(root, extensions) {
    if (!extensions.length) {
      return Promise.reject(new Error(`No options file found`));
    }
    const extension = extensions.shift();
    return checkOptionsFile(root, extension).catch(function(err) {
      return findOptionsFilepath(root, extensions);
    });
  }

  function findAndLoadOptions(optionsFile) {
    if (optionsFile) {
      return loadOptionsFile(optionsFile);
    }

    const extensions = OPTIONS_FILE_EXTENSIONS.slice(0);
    const root = ProjectManager.getProjectRoot();

    return findOptionsFilepath(root, extensions).then(function(optionsFilepath) {
      return loadOptionsFile(optionsFilepath);
    });
  }

  /**
   * Load prettier options file
   * @public
   * @param {string} optionsFile Filename.default is `.prettierrc` file from project root directory
   */
  function load(optionsFile) {
    return findAndLoadOptions(optionsFile)
      .then(function(optionsObject) {
        options = optionsObject;
      })
      .catch(function(error) {
        console.error(
          'Brackets Prettier - Error parsing options: (' + error.message + '), using default.',
          error
        );
        options = {};
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

  function init() {
    _bindLoadOptions();
    load();
  }

  module.exports = {
    init: init,
    load: load,
    onChange: onChange,
    getOptions: getOptions,
  };
});
