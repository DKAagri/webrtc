var gulp = require('gulp');
var concat = require('gulp-concat'); 
var cat = require('gulp-cat');  
var addsrc = require('gulp-add-src');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css'); 
var base64 = require('gulp-base64');
var gulpSequence = require('gulp-sequence');
var exec  =require('child_process').exec;
var remoteSrc = require('gulp-remote-src');

var fs = require('fs');
var property = require('./propertyWriter.js')(fs);
/*property.writeEnv();*/
var properties= JSON.parse(property.readEnv());

var folderPath="";
if(properties.enviornment=="production"){
  folderPath="client/prod/";
}else if(properties.enviornment=="test"){
  folderPath="client/tests/";
}else{
  folderPath="client/build/";
}

gulp.task('vendorjs',function() {
    vendorJsList=[ 
      "https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js",
      "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.6/socket.io.min.js"
    ]; 
    remoteSrc(vendorJsList, {base: '' })
        .pipe(concat('webrtcdevelopment_header.js'))  
        .pipe(gulp.dest(folderPath+'minScripts/')); 
});

/*gulp.task('screensharejs',function() {
    console.log(" gulping screensharing  ");
    list=[ 
        "client/build/scripts/screensharing.js",
    ]; 
    console.log(list);
    gulp.src(list)
        .pipe(uglify())
        .pipe(concat('screenshare.js'))  
        .pipe(gulp.dest(folderPath+'minScripts/')); 
});*/

/*gulp.task('adminjs',function() {
    console.log(" gulping admin script  ");
    list=[ 
        "client/build/scripts/admin.js",
    ]; 
    console.log(list);
    gulp.src(list)
        .pipe(uglify())
        .pipe(concat('webrtcdevelopmentAdmin.js'))  
        .pipe(gulp.dest(folderPath+'minScripts/')); 
});*/

gulp.task('serverjs',function() {
    console.log(" gulping admin script  ");
    list=[ 
        "realtimecomm.js",
    ]; 
    console.log(list);
    gulp.src(list)
        .pipe(uglify())
        .pipe(concat('webrtcdevelopmentServer.js'))  
        .pipe(gulp.dest(folderPath+'minScripts/')); 
});

gulp.task('drawjs',function() {
    console.log(" gulping drawjs  ");
    list=[ 
        "client/build/drawboard/common.js",
        "client/build/drawboard/decorator.js",
        "client/build/drawboard/draw-helper.js",
        "client/build/drawboard/drag-helper.js",
        "client/build/drawboard/pencil-handler.js",
        "client/build/drawboard/eraser-handler.js",
        "client/build/drawboard/line-handler.js",
        "client/build/drawboard/rect-handler.js",
        "client/build/drawboard/events-handler.js"
    ]; 
    console.log(list);
    gulp.src(list)
        .pipe(uglify())
        .pipe(concat('drawBoardScript.js'))  
        .pipe(gulp.dest(folderPath+'minScripts/')); 
});

gulp.task('drawcss',function() {
    console.log(" gulping main drawcss  ");
    list=[ "client/build/css/Style.css",
        "client/build/drawboard/drawing.css"
    ]; 
    console.log(list);
    gulp.src(list)
        .pipe(concat('drawBoardCss.css'))  
        .pipe(gulp.dest(folderPath+'minScripts/')); 
});

gulp.task('webrtcdevelopmentjs',function() {
    console.log(" gulping main webrtc development scripts ");
    appJsList=[ 
        "client/build/scripts/init.js",
        "client/build/scripts/firebase.js",
        "client/build/scripts/FileBufferReader.js",
        "client/build/scripts/RTCMultiConnection.js",
        "client/build/scripts/canvas-designer-widget.js",
        "client/build/scripts/RecordRTC.js",
        "client/build/scripts/screenshot.js",
        "client/build/scripts/getScreenId.js",
        "client/build/scripts/geolocation.js",
        "client/build/scripts/start.js",
        "client/build/scripts/admin.js"
    ]; 
    console.log(appJsList);
    gulp.src(appJsList)
        .pipe(uglify())
        .pipe(concat('webrtcdevelopment.js'))  
        .pipe(gulp.dest(folderPath+'minScripts/')); 
});


gulp.task('mainstyle',function() {
    console.log(" gulping main stylesheets css  ");
    cssList=[
      "client/build/css/bootstrap.min.css",
      "client/build/css/bootstrap.min.css.map",
      "client/build/css/bootstrap-theme.min.css",
      "client/build/css/bootstrap-theme.min.css.map",
      "client/build/css/equal-height-columns.css",
      "client/build/css/font-awesome.min.css",
      "client/build/css/normalize.css"
    ];
    console.log(cssList);
    gulp.src(cssList)
      .pipe(concat('webrtcdevelopment_header.css'))
      .pipe(gulp.dest(folderPath+'minScripts/'));
});

gulp.task('webrtcdevelopmentcss',function() {
    console.log(" gulping custom stylesheets css  ");
    cssList=[
      "client/build/css/Style.css",
      "client/build/css/styles.css"
    ];
    console.log(cssList);
    gulp.src(cssList)
      .pipe(concat('webrtcdevelopment.css'))
      .pipe(gulp.dest(folderPath+'minScripts/'));
});

/*.pipe(minifyCss())*/

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout,stderr); });
};

gulp.task('git_pull',function(cb){
  execute('git pull',function(resp) {
      cb();
  });
});

gulp.task('default', gulpSequence(
    'vendorjs',
    'drawjs' , 
    'drawcss',
    'webrtcdevelopmentjs',
    'mainstyle',
    'webrtcdevelopmentcss',
    'serverjs'
)); 
