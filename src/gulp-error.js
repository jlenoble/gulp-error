import {PluginError} from 'gulp-util';
import through from 'through2';
import path from 'path';
import globAll from 'glob-all';

const PLUGIN_NAME = 'gulp-error';

export default function(files = []) {
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

      resolve(_files);
    });
  }) : Promise.resolve(files);

  return (function(promise) {

    return through.obj(function(file, encoding, callback) {
      const relative =  path.relative(process.cwd(), file.path);

      promise.then(_files => {
        if (_files.length === 0 || _files.includes(relative)) {

          this.emit('error', new PluginError(PLUGIN_NAME,
            `Intentional error when processing file ${relative}`));

        } else {

          callback(null, file);

        }

      }).catch(err => {
        new PluginError(PLUGIN_NAME, err);
      });

    });

  })(promise);

}
