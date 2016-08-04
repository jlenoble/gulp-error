import gulp from 'gulp';
import error from '../src/gulp-error';

import Muter from 'muter';

import chai, {expect} from 'chai';

const glob = ['gulpfile.babel.js', 'src/*.js', 'test/*.js'];

describe('Test suite for Gulp plugin gulp-error:', () => {

  beforeEach(function() {
    this.error = Muter(console, 'error');
    this.error.mute();
  });

  it('gulp-error with no arg throws on first file passed', function() {
    return new Promise((resolve, reject) => {
      gulp.src(glob).pipe(error())
        .on('error', () => {
          const logs = this.error.getLogs();

          expect(logs).to.match(
            /.*Error.*Intentional error when processing.*gulpfile\.babel\.js.*/);
          expect(console.error.callCount).to.equal(1);

          resolve();
        })
        .on('finish', () => {
          reject(new Error(
            'No error was thrown, but that should have happened'));
        });
    });
  });

  it('gulp-error with file arg throws on that file', function() {
    return new Promise((resolve, reject) => {
      gulp.src(glob).pipe(error('src/gulp-error.js'))
        .on('error', () => {
          const logs = this.error.getLogs();

          expect(logs).to.match(
            /.*Error.*Intentional error when processing.*src\/gulp-error\.js.*/);
          expect(console.error.callCount).to.equal(1);

          resolve();
        })
        .on('finish', () => {
          reject(new Error(
            'No error was thrown, but that should have happened'));
        });
    });
  });

  it('gulp-error with filelist arg throws on first file matched', function() {
    return new Promise((resolve, reject) => {
      gulp.src(glob).pipe(error(['test/gulp-error.test.js',
        'src/gulp-error.js']))
        .on('error', () => {
          const logs = this.error.getLogs();

          expect(logs).to.match(
            /.*Error.*Intentional error when processing.*src\/gulp-error\.js.*/);
          expect(console.error.callCount).to.equal(1);

          resolve();
        })
        .on('finish', () => {
          reject(new Error(
            'No error was thrown, but that should have happened'));
        });
    });
  });

  it('gulp-error with glob arg throws on first file matched', function() {
    return new Promise((resolve, reject) => {
      gulp.src(glob).pipe(error('src/*.js'))
        .on('error', () => {
          const logs = this.error.getLogs();

          expect(logs).to.match(
            /.*Error.*Intentional error when processing.*src\/gulp-error\.js.*/);
          expect(console.error.callCount).to.equal(1);

          resolve();
        })
        .on('finish', () => {
          reject(new Error(
            'No error was thrown, but that should have happened'));
        });
    });
  });

  it('gulp-error with globlist arg throws on first file matched', function() {
    return new Promise((resolve, reject) => {
      gulp.src(glob).pipe(error(['test/**/*.js', 'src/**/*.js']))
        .on('error', () => {
          const logs = this.error.getLogs();

          expect(logs).to.match(
            /.*Error.*Intentional error when processing.*gulp-error\.js.*/);
          expect(console.error.callCount).to.equal(1);

          resolve();
        })
        .on('finish', () => {
          reject(new Error(
            'No error was thrown, but that should have happened'));
        });
    });
  });

  afterEach(function() {
    this.error.unmute();
  });

});
