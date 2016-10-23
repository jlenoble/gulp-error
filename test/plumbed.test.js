import gulp from 'gulp';
import error from '../src/gulp-error';

import Muter from 'muter';

import chai, {expect} from 'chai';

const glob = ['gulpfile.babel.js', 'src/*.js', 'test/*.js'];

describe('Test suite for Gulp plugin gulp-error (gulp is plumbed):', () => {

  beforeEach(function() {
    this.error = Muter(console, 'error');
    this.error.mute();
  });

  const testArgCallback = function(options) {
    return function() {
      return new Promise((resolve, reject) => {
        gulp.src(glob).pipe(error(options.arg))
          .on('error', err => {
            const str = err.toString();

            if (str.match(/AssertionError.*in.*plugin.*gulp-error/)) {
              // Then the test below failed and an assertion error was
              // thrown and caught by plugin; Reject to prevent the test
              // from hanging unnecessarily; The .*'s in the pattern take care
              // of the potential color codes in the formatted error string.
              reject(err);
            }

            try {

              const logs = this.error.getLogs();

              expect(logs).to.match(options.match);
              expect(console.error.callCount).to.equal(1);

            } catch (err) {

              if (str.match(/.*test\/dummy\.js.*is.*no.*valid.*glob.*/)) {
                // Somewhere between Node6.3 and Node6.7, warnings were
                // added when promise rejection are uncaught, making the
                // 'unintentional' error fail because of extra logs by
                // console.error; the following tweak recovers from that.
                console.error.getCalls().forEach(call => {
                  call = call.args[0].toString();
                  if (!call.match(/.*test\/dummy\.js.*is.*no.*valid.*glob.*/)
                     && !call.match(/.*node:\d+.*PromiseRejection.*/)) {
                    reject(err);
                  }
                });
              } else {
                reject(err);
              }

            }

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

  it('gulp-error with bad arg throws unintentionally', testArgCallback({
    arg: 'test/dummy.js',
    match: /.*Error.*test\/dummy\.js.*is.*no.*valid.*glob.*/
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

  it('gulp-error with options arg throws specific errors',
  testArgCallback({
    arg: {
      files: 'src/gulp-error.js',
      ErrorType: TypeError,
      message: 'Controlled type error'
    },
    match: /.*Error.*Controlled type error.*src\/gulp-error\.js.*/
  }));

  afterEach(function() {
    this.error.unmute();
  });

});
