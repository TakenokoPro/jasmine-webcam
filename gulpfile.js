'use strivt'

// ディレクトリ
var path = {
  'htmlPath': 'src',
  'sassPath': 'src/sass',
  'jsPath': 'src/js',
  'libPath': 'src/lib',

  'htmlBuildPath': 'docs', // 例）'htdocs/images'
  'cssBuildPath': 'docs/css', // 例）'htdocs/stylesheets'
  'jsBuildPath': 'docs/js', // 例）'htdocs/stylesheets'
  'libBuildPath': 'docs/lib', // 例）'htdocs/stylesheets'
}

// 使用パッケージ
var gulp = require('gulp');
var browserify = require('browserify');
var babelify   = require('babelify');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass'); // Sassコンパイル
var postcss = require('gulp-postcss');
var cssnext = require('postcss-cssnext');//ベンダープレフィックス
var plumber = require('gulp-plumber'); // コンパイルエラーが出てもwatchを止めない
var webserver = require('gulp-webserver'); // ローカルサーバ起動

//ローカルサーバー(モック非連動)
gulp.task('webserver', function(){
  gulp.src('docs')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true,
      port: 8000,
    }));
});

// htmlをコンパイル
gulp.task('html', function(){
  gulp.src(path.htmlPath + '/**/*.html')
  .pipe(gulp.dest(path.htmlBuildPath + '/'));
});

// jsをコンパイル
gulp.task('js', function(){
  browserify({
    entries: [path.jsPath + '/index.js']
  })
  .transform(babelify, {presets: ['es2015']})
  .bundle()
  .pipe(source('index.js'))
  .pipe(gulp.dest(path.jsBuildPath + '/'));
});

gulp.task( 'copyLib', function() {
  gulp.src( 'src/lib/css/*.css' ).pipe( gulp.dest( 'docs/lib/css'  ) );
  gulp.src( 'src/lib/js/*.js' ).pipe( gulp.dest( 'docs/lib/js'  ) );
  gulp.src( 'src/lib/index.css' ).pipe( gulp.dest( 'docs/lib'  ) );
  gulp.src( 'src/lib/index.js' ).pipe( gulp.dest( 'docs/lib'  ) );
} );

// Sassをコンパイルし、ベンダープレフィックスを付与
gulp.task('scss', function() {
  var processors = [
      cssnext()
  ];
  return gulp.src(path.sassPath + '/*.scss')
    .pipe(sass())
    .pipe(postcss(processors))
    .pipe(gulp.dest(path.cssBuildPath + '/'))
});

// ファイル変更監視
gulp.task('watch', function() {
  gulp.watch(path.htmlPath + '/**/*.html', ['html']);
  gulp.watch(path.sassPath + '/**/*.scss', ['scss']);
  gulp.watch(path.jsPath + '/**/*.js',['js']);
  gulp.watch(path.libPath + '/**/*',['copyLib']);
});

// タスク実行
gulp.task('default', ['webserver','html','js','scss','copyLib','watch']); // デフォルト実行
