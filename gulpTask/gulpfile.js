const gulp=require('gulp');
const {src , dest, series, parallel, watch}=require('gulp');
const htmlmin = require('gulp-htmlmin');
const cleanCss=require('gulp-clean-css');
const concat=require('gulp-concat');
const terser=require('gulp-terser')
const imageMin=require('gulp-imagemin')
//const rewritePath=require('gulp-rewrite-image-path')
var processhtml = require('gulp-processhtml');
var opts={}

var globs = {
  html:'project/*.html' ,
  css:'project/css/**/*.css',
  js:'project/js/*.js',
  img:'project/pics/*'

}


function htmlMinfiy(){
  //return src('project/*.html')
  return src(globs.html)
   .pipe(processhtml(opts))
  .pipe(htmlmin({collapseWhitespace:true , removeComments:true}))
  .pipe(dest('dist'))
}
exports.html=htmlMinfiy;

function cssMinify(){
  //return src('project/css/**/*.css')
  return src(globs.css)
  .pipe(concat('style.min.css'))
  .pipe(cleanCss())
  .pipe(dest('dist/assets'))
}
exports.css=cssMinify;

function jsAll(){
  //return src('project/js/*.js' ,{sourcemaps:true})
  return src(globs.js , {sourcemaps:true})
  .pipe(concat('all.min.js'))
  .pipe(terser())
  .pipe(dest('dist/js' , {sourcemaps:'.'}))
}
exports.js=jsAll

function imgTask(){
  //return src('project/pics/*')
  return src(globs.img)
  .pipe(imageMin())
  .pipe(dest('dist/assets/img'))

}
exports.img=imgTask

function watchTask(){
  watch(globs.html , htmlMinfiy)
  watch(globs.css , cssMinify)
  watch(globs.js , jsAll)
  watch(globs.img , imgTask)
}
function testTask(cb){
  console.log('this is test');
  cb()
}
//exports.default= series(imgTask , jsAll ,  cssMinify , htmlMinfiy);
exports.default=series(parallel(imgTask , jsAll ,  cssMinify , htmlMinfiy) , testTask, watchTask)
