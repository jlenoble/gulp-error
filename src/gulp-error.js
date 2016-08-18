import {PluginError} from 'gulp-util';
import through from 'through2';
import path from 'path';
import globAll from 'glob-all';

const PLUGIN_NAME = 'gulp-error';

export default function(files = []) {
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
    throw new PluginError(PLUGIN_NAME, `Unexpected options: ${files}`);
  }

  var promise = files.length ? new Promise((resolve, reject) => {
    globAll(files, function(err, _files) {
      if (err) {
        reject(err);
      }

      if (!_files.length) {
        reject(new Error(`${files} is no valid glob`));
      }

      resolve(_files);
    });
  }) : Promise.resolve(files);

  return through.obj(function(file, encoding, callback) {
    const relative =  path.relative(process.cwd(), file.path);

    promise.then(_files => {
      if (_files.length === 0 || _files.includes(relative)) {

        this.emit('error', new PluginError(PLUGIN_NAME,
          new ErrorType(`${message} ${relative}`)));

      } else {

        callback(null, file);

      }

    });

    promise.catch(err => {
      this.emit('error', new PluginError(PLUGIN_NAME, err));
    });

  });

}
