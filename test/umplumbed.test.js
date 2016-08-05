import gulp from 'gulp';
import error from '../src/gulp-error';

import Muter from 'muter';

import chai, {expect} from 'chai';

const glob = ['gulpfile.babel.js', 'src/*.js', 'test/*.js'];

describe('Test suite for Gulp plugin gulp-error:', () => {

  beforeEach(function() {
    if (gulp.src.originalSrc) {
      this.plumbedSrc = gulp.src;
      this.plumbedSrc.unplumb();
    }
  });

  const testArgCallback = function(options) {
    return function() {
      return new Promise((resolve, reject) => {
        gulp.src(glob).pipe(error(options.arg))
          .on('error', err => {
            expect(err.toString()).to.match(options.match);

            resolve();
          })
          .on('finish', () => {
            reject(new Error(
              'No error was thrown, but that should have happened'));
          });
      });
    };
  };

  it('gulp-error with no arg throws on first file passed', testArgCallback({
    match: /.*Error.*Intentional error when processing.*gulpfile\.babel\.js.*/
  }));

  it('gulp-error with file arg throws on that file', testArgCallback({
    arg: 'test/plumbed.test.js',
    match: /.*Error.*Intentional error when processing.*test\/plumbed\.test\.js.*/
  }));

  it('gulp-error with filelist arg throws on first file matched',
  testArgCallback({
    arg: ['test/plumbed.test.js', 'src/gulp-error.js'],
    match: /.*Error.*Intentional error when processing.*src\/gulp-error\.js.*/
  }));

  it('gulp-error with glob arg throws on first file matched', testArgCallback({
    arg: 'src/*.js',
    match: /.*Error.*Intentional error when processing.*src\/gulp-error\.js.*/
  }));

  it('gulp-error with globlist arg throws on first file matched',
  testArgCallback({
    arg: ['test/**/*.js', 'src/**/*.js'],
    match: /.*Error.*Intentional error when processing.*src\/gulp-error\.js.*/
  }));

  afterEach(function() {
    if (this.plumbedSrc) {
      this.plumbedSrc.plumb();
    }
  });

});
