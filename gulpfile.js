//Gulp core files
var gulp = require('gulp'),
gutil = require('gulp-util'),
sass = require('gulp-sass'),
nano = require('gulp-cssnano'),
rename = require('gulp-rename'),
sh = require('shelljs'),
ngAnnotate = require('gulp-ng-annotate'),
angularFilesort = require('gulp-angular-filesort'),
inject = require('gulp-inject'),
watch = require('gulp-watch'),
filter = require('gulp-filter'),
through = require('through2'),
del = require('del'),
shell = require('gulp-shell'),
plumber = require('gulp-plumber');
    
//Application paths
var paths = {
    sass: ['app/**/*.scss'],
    js: ['app/**/*.js'],
    assets: ['app/assets/**/*'],
    templates: ['app/**/*.html', '!./app/index.html'],
    settings: ['settings'],
    build: 'build'
};

/*
*
*   EXPRESS
*
*/

//Express related variables
var livereload = require('connect-livereload')
express = require('express'),
lr = require('tiny-lr'),
lrserver = lr(),
mongoose = require('mongoose'),
bodyParser = require('body-parser'),
auth = require('./server/routes/auth.js'),
saved_data = require('./server/routes/saved_data.js'),
great_schools = require('./server/routes/great_schools.js'),
contact_message = require('./server/routes/contact.js')
livereloadport = 35729;


//Instantiating express server
var server = express();
server.use(livereload({
  port: livereloadport
}));
server.set('port', (process.env.PORT || 3000));
server.use(express.static('./build'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended:false}));

//Initializing passport
require('./server/routes/config/passport')(server);
//Initializing auth routes
server.use('/auth', auth);
//Intializing saved houses routes
server.use('/saved', saved_data);
//Initialzing great_schools routes
server.use('/schools', great_schools);
//Initializing contact_message routes
server.use('/contact', contact_message);

//Serving express server
gulp.task('serve', ['build', 'watch'], function() {
    server.listen(server.get('port'), function(){
        console.log('App running on port', server.get('port'));
    });
    lrserver.listen(livereloadport);
    mongoose.connect('mongodb://lv-user:testing@ds143737.mlab.com:43737/heroku_9fvbqpbv', function(err){
        if(err) console.log(err);
        else console.log('Successfully conected to DB');
    })
});

gulp.task("heroku:production", ['env-production', 'serve'], function(){
    console.log('Compiling app'); // the task does not need to do anything.
});

gulp.task('default', ['sass', 'js']);

//Sass compiler
gulp.task('sass', function (done) {
    gulp.src('./app/app.scss')
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(gulp.dest('./build/css/'))
        .pipe(nano())
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest(paths.build + '/css/'))
        .on('end', done);
});

//Index injector of dependency files
gulp.task('index', function () {
    gulp.src('./app/index.html')
        .pipe(
            inject(
                gulp.src(paths.js)
                    .pipe(plumber())
                    .pipe(angularFilesort()), {relative: true}
            )
        )
        .pipe(gulp.dest(paths.build));
});

function createCopyTasks(taskName, source, dest, customTaskCallback){
    function baseCopyTask(extendBaseTaskCallback){
        var myFilter = filter(function (file) {
            return file.event === 'unlink';
        });

        var baseTask = gulp.src(source);

        if(extendBaseTaskCallback){
            baseTask = extendBaseTaskCallback(baseTask);
        }

        if(customTaskCallback){
            baseTask = customTaskCallback(baseTask);
        }

        baseTask.pipe(gulp.dest(dest))
            .pipe(myFilter)
            .pipe(through.obj(function (chunk, enc, cb) {
                del(chunk.path);
                cb(null, chunk);
            }));
    }

    gulp.task(taskName, function(){
        baseCopyTask();
    });

    gulp.task(taskName + "-watch", function(){
        baseCopyTask(function(task){
            return task.pipe(watch(source));
        });
    });
}

createCopyTasks('js', paths.js, paths.build, function(task){
    return task
        .pipe(plumber())
        .pipe(ngAnnotate());
});
//Compiling assets
createCopyTasks('assets', paths.assets, paths.build + "/assets");
//Templates
createCopyTasks('templates', paths.templates, paths.build);
//Build task
gulp.task('build', ['sass', 'js', 'assets', 'templates', 'index']);
//Watch for changes in scripts, sass files and templates
gulp.task('watch', ['js-watch', 'assets-watch', 'templates-watch'], function () {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.js.concat(['./app/index.html']), ['index']);
});
//Dependency installer
gulp.task('install', shell.task(['bower install']));
//Clean build directory
gulp.task('clean', function () {
    del.sync([paths.build + '/**', '!' + paths.build, '!' + paths.build + '/lib/**']);
});
//Setting environment to development
gulp.task('env-dev', function () {
    gulp.src(paths.settings + '/settings.dev.js')
        .pipe(rename('settings.js'))
        .pipe(gulp.dest(paths.build));
});
//Setting environment to staging
gulp.task('env-staging', function () {
    gulp.src(paths.settings + '/settings.staging.js')
        .pipe(rename('settings.js'))
        .pipe(gulp.dest(paths.build));
});
//Setting environment to production
gulp.task('env-production', function () {
    gulp.src(paths.settings + '/settings.production.js')
        .pipe(rename('settings.js'))
        .pipe(gulp.dest(paths.build));
});
