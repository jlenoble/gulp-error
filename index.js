'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var files = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

  var ErrorType = Error;
  var message = 'Intentional error when processing file';

  if (files && files.files) {
    if (files.ErrorType) {
      ErrorType = files.ErrorType;
    }

    if (files.message) {
      message = files.message;
    }

    files = files.files; // Must be last!
  }

  if (files === undefined) {
    files = [];
  } else if (typeof files === 'string') {
    files = [files];
  }

  if (!Array.isArray(files)) {
    throw new _gulpUtil.PluginError(PLUGIN_NAME, 'Unexpected options: ' + files);
  }

  var promise = files.length ? new Promise(function (resolve, reject) {
    (0, _globAll2.default)(files, function (err, _files) {
      if (err) {
        reject(err);
      }

      resolve(_files);
    });
  }) : Promise.resolve(files);

  return _through2.default.obj(function (file, encoding, callback) {
    var _this = this;

    var relative = _path2.default.relative(process.cwd(), file.path);

    promise.then(function (_files) {
      if (_files.length === 0 || _files.includes(relative)) {

        _this.emit('error', new _gulpUtil.PluginError(PLUGIN_NAME, new ErrorType(message + ' ' + relative)));
      } else {

        callback(null, file);
      }
    }).catch(function (err) {
      _this.emit('error', new _gulpUtil.PluginError(PLUGIN_NAME, err));
    });
  });
};

var _gulpUtil = require('gulp-util');

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _globAll = require('glob-all');

var _globAll2 = _interopRequireDefault(_globAll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PLUGIN_NAME = 'gulp-error';

module.exports = exports['default'];