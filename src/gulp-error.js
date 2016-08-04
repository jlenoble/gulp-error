import {PluginError} from 'gulp-util';
import through from 'through2';
import path from 'path';

const PLUGIN_NAME = 'gulp-error';

export default function(files = []) {
  if (!Array.isArray(files)) {
    files = [files];
  }

  return through.obj(function(file, encoding, callback) {
    const relative =  path.relative(process.cwd(), file.path);

    if (files.length === 0 || files.includes(relative)) {

      this.emit('error', new PluginError(PLUGIN_NAME,
        `Intentional error when processing file ${relative}`));

    } else {

      callback(null, file);

    }
  });
}
