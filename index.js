'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var files = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

  if (!Array.isArray(files)) {
    files = [files];
  }

  return _through2.default.obj(function (file, encoding, callback) {
    var relative = _path2.default.relative(process.cwd(), file.path);

    if (files.length === 0 || files.includes(relative)) {

      this.emit('error', new _gulpUtil.PluginError(PLUGIN_NAME, 'Intentional error when processing file ' + relative));
    } else {

      callback(null, file);
    }
  });
};

var _gulpUtil = require('gulp-util');

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PLUGIN_NAME = 'gulp-error';