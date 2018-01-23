/* eslint no-console: 0 */

const path = require('path');
const chalk = require('chalk');
const moment = require('moment');
const del = require('del');
const gulp = require('gulp');
const less = require('gulp-less');
const changed = require('gulp-changed');
const rename = require('gulp-rename');
const file = require('gulp-file');
const babel = require('gulp-babel');
const addLessImport = require('./gulp-plugin-add-less-import');
const wxImport = require('./gulp-plugin-wx');
const config = require('./src/common/config');

gulp.task('copy-less-config', copyLessConfig);
gulp.task('transform-less', transformLess);
gulp.task('delete-dist-theme', deleteDistThemeFile);
gulp.task('copy-wx-file', copyWxFile);

gulp.task('clean', clean);
gulp.task('babel', babelJs);
gulp.task('watch', watchTaskFunc);
gulp.task('less', gulp.series('copy-less-config', 'transform-less', 'delete-dist-theme'));
gulp.task('build', gulp.parallel('less', 'copy-wx-file', 'babel'));
gulp.task('dev', gulp.series('build', 'watch'));

// 拷贝 less 配置文件
function copyLessConfig(done) {
  gulp.src('src/theme/config.less', { allowEmpty: true })
    .pipe(file('config.less', `@cdn: ~'${config.cdn}';`))
    .pipe(changed('src/theme'))
    .pipe(gulp.dest('src/theme'))
    .on('finish', done);
}

// 监听任务
function watchTaskFunc(done) {
  // 所有的事件：add, addDir, change, unlink, unlinkDir, ready, raw, error
  gulp.watch('src/**/**').on('all', watch).on('ready', () => {
    console.log(`[${ chalk.gray(moment().format('HH:mm:ss')) }] ${  chalk.green('编译完成，请打开微信开发者工具查看调试...')  }`);
  });
}

function watch(type, filePath) {
  changeLog({ type, filePath });
  const r = /(wxml|json)$/;
  const cssR = /(less)$/;
  const jsR = /(js)$/;
  const { dir, ext, name } = path.parse(filePath);
  const distDir = dir.replace('src', 'dist');

  // 删除
  if (type === 'unlink' || type === 'unlinkDir') {
    // 删除 js, json, wxml 文件
    if (r.test(ext)) {
      del(filePath.replace('src', 'dist'));
      return;
    }

    // 删除 wxss 样式文件
    if (cssR.test(ext)) {
      del(`${dir.replace('src', 'dist')}${name}.wxss`);
      return;
    }

    del(filePath.replace('src', 'dist'));
    return;
  }

  // 复制 json, wxml 文件
  if (r.test(ext)) {
    gulp.src([filePath], { allowEmpty: true })
      .pipe(changed(distDir))
      .pipe(gulp.dest(distDir))
      .on('finish', () => {
        console.log(`[${chalk.gray(moment().format('HH:mm:ss'))}] ${chalk.magenta('复制完成：')}${chalk.green(`${distDir}/${name}${ext}`)}`);
      });
    return;
  }

  // 编译 JS 文件
  if (jsR.test(ext)) {
    gulp.src([filePath, '!src/**/*/*.default.js'], { allowEmpty: true })
      .pipe(wxImport({
        wxPath: path.join(__dirname, './src/utils/wx.js')
      }))
      .pipe(babel())
      .on('error', err => console.error(err.stack || err))
      .pipe(changed(distDir))
      .pipe(gulp.dest(distDir))
      .on('finish', () => {
        console.log(`[${ chalk.gray(moment().format('HH:mm:ss')) }] ${  chalk.magenta('编译完成：')  }${chalk.green(distDir + '/' + name + ext)}`);
      });
    return;
  }

  // 编译 less 样式文件
  if (cssR.test(ext)) {
    gulp.src(filePath)
    .pipe(addLessImport({
      themePath: path.join(__dirname, './src/theme/index.less'),
      commomPath: path.join(__dirname, './src/app.less'),
    }))
    .pipe(less({
      paths: [path.join(__dirname, './src/theme')],
    }))
    .on('error', err => console.error(err.stack || err))
    .pipe(rename((path) => {
      path.extname = '.wxss';
    }))
    .pipe(gulp.dest(distDir))
    .on('finish', () => {
      if (distDir.indexOf('dist/theme') !== -1) {
        del(['dist/theme']);
        console.log(`[${ chalk.gray(moment().format('HH:mm:ss')) }] ${  chalk.magenta('修改theme：')  }${chalk.green(distDir + '/' + name + ext)}`);
        return;
      }
      console.log(`[${ chalk.gray(moment().format('HH:mm:ss')) }] ${  chalk.magenta('编译完成：')  }${chalk.green(distDir + '/' + name + '.wxss')}`);
    });
    return;
  }
  
}

// 拷贝 微信 json, wxml 文件
function copyWxFile(done) {
  gulp.src([
    'src/*.json',
    'src/**/*/*.json',
    'src/**/*/*.wxml',
  ])
    .pipe(changed('./dist'))
    .pipe(gulp.dest('./dist'))
    .on('finish', done);
}

// babel 转移 Js 文件 开启 async/await 等新特性
function babelJs(done) {
  gulp.src([
    'src/*.js',
    'src/**/*/*.js',
    '!src/**/*/*.default.js',
  ])
    .pipe(wxImport({
      wxPath: path.join(__dirname, './src/utils/wx.js')
    }))
    .pipe(babel())
    .on('error', err => console.error(err.stack || err))
    .pipe(changed('./dist'))
    .pipe(gulp.dest('./dist'))
    .on('finish', done);
}

// 编译 less 文件
function transformLess(done) {
  gulp.src(['./src/**/*/*.less', './src/*.less'])
    .pipe(addLessImport({
      themePath: path.join(__dirname, './src/theme/index.less'),
    }))
    .pipe(less({
      paths: [path.join(__dirname, './src/theme')],
    }))
    .on('error', err => console.error(err.stack || err))
    .pipe(rename((path) => {
      path.extname = '.wxss';
    }))
    .pipe(gulp.dest('./dist'))
    .on('finish', done);
}

// 删除 输出目录中主题样式文件
function deleteDistThemeFile(done) {
  del(['dist/theme']).then(() => done());
}

// 删除 输出目录
function clean(done) {
  del([
    'dist/**/*', 
    '!dist/**/*.config.json',
  ]).then(() => done());
}

// 打印监听日志
function changeLog(event) {
  // add, addDir, change, unlink, unlinkDir, ready, raw, error
  const actionName = {
    change: '改变文件',
    add: '添加文件',
    addDir: '添加目录',
    unlink: '删除文件',
    unlinkDir: '删除文件夹',
    error: '发生错误',
    ready: '完成'
  };
  console.log(`[${chalk.gray(moment().format('HH:mm:ss'))}] ${chalk.cyan(`${actionName[event.type] || event.type}：`)}${chalk.green(event.filePath)}`);
}
