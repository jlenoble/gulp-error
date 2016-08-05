# gulp-error

A [Gulp](https://github.com/gulpjs/gulp) plugin that helps testing streams by throwing controlled errors on target files

## Usage

This [Gulp](https://github.com/gulpjs/gulp) plugin main goal is to test callback functions when 'error' events are emitted by a stream. Rather than editing files, deleting them, renaming them, you may just use this plugin to throw a controlled error when the targeted vinyl is passed through.

```js
import gulp from 'gulp';
import error from 'gulp-error';

gulp.task('test1', () => {
  // Throws 'Intentional error when processing file src/app.js' if file
  // is in the stream.
  return gulp.src('**/*.js')
    .pipe(error('src/app.js'))
    .pipe(gulp.dest('build'));

gulp.task('test2', () => {
  // Throws same error for first js file (if any) found under test directory.
  return gulp.src('**/*.js')
    .pipe(error('test/**/*.js'))
    .pipe(gulp.dest('build'));

gulp.task('test3', () => {
  // Throws same error for file a.js (if found and if alphabetically ordered
  // stream).
  return gulp.src('**/*.js')
    .pipe(error(['b.js', 'a.js', 'c.js']))
    .pipe(gulp.dest('build'));
});

gulp.task('test4', () => {
  // Throws a reference error with message 'variable x is undefined' on file
  // a.js (if found).
  return gulp.src('**/*.js')
    .pipe(error({
      files: 'a.js',
      ErrorType: ReferenceError,
      message: 'variable x is undefined'
    }))
    .pipe(gulp.dest('build'));
});
```

## Arguments

**Files arguments**, whether directly or as an option field `files`, can be one of the following:

* file name string: `'a.js'`,
* list of file name strings: `['a.js', 'b.js']`,
* glob: `'src/*.js'`,
* list of globs: `['src/*.js', 'test/*.js']`,
* list of files and globs: `['a.js', 'src/*.js']`.

Unless you recover from the error, **an error is thrown only for the first match**.

When **no file argument** is provided, the plugin throws on the first vinyl passed through.

Rather than a direct files argument, you can pass an **option object** with the following fields (all are optional):

* `files`: see above,
* `ErrorType`: a constructor for an error type such as `TypeError` or `ReferenceError`,
* `message`: the error message to be thrown.

## License

gulp-error is [MIT licensed](./LICENSE).
