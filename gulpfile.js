const gulp = require('gulp');
const rename = require('gulp-rename');
const rsync = require('gulp-rsync');
const del = require('del');

// Clean
gulp.task('clean', function() {
    return del('production');
});


// SSR
gulp.task('frontend:dist', function() {
    return gulp.src([
        'frontend/dist/**',
	'!frontend/dist/server.js'
    ])
    .pipe(gulp.dest('production/public/dist'));
    
});


// SSR index
gulp.task('frontend:index', function() {
    
   return gulp.src('frontend/dist/browser/index.html')
        .pipe(rename('resources/views/index.blade.php'))
        .pipe(gulp.dest('production/app'));
});

// Frontend
gulp.task('frontend:public', function() {
    return gulp.src([
        'frontend/dist/server.js',
    ])
    .pipe(gulp.dest('production/public'));
});

// Backend
gulp.task('backend:public', function() {
    return gulp.src([
        'backend/public/**',
        'backend/public/.htaccess',
        '!backend/public/index.php',
	'!backend/public/uploads/**'
    ])
    .pipe(gulp.dest('production/public'));
});

gulp.task('backend:app', function() {
    return gulp.src([
        'backend/**',
        '!backend/public/',
        '!backend/public/**',
        '!backend/node_modules/',
        '!backend/node_modules/**'
    ])
    .pipe(gulp.dest('production/app'));
});

// Config
gulp.task('config:index', function() {
   return gulp.src('config/index.php')
         .pipe(gulp.dest('production/public'));
    
});

// Config
gulp.task('config:env', function() {
  return gulp.src('config/.env')
         .pipe(gulp.dest('production/app'));
});


// Deploy
gulp.task('deploy:frontend', function() {
     return gulp.src([
         'production/public/**',
         'production/public/.htaccess'
     ])
       .pipe(rsync({
         root: 'production/public/',
         hostname: 'root@134.0.112.4',
         destination: '/var/www/www-root/data/www/fitgum.ru/'
     }));
 });

// VENDOR :TODO: CAN DELETE
gulp.task('deploy:vendor', function() {
     return gulp.src([
         'production/app/vendor/',
     ])
       .pipe(rsync({
         root: 'production/app/',
         hostname: 'root@134.0.112.4',
         destination: '/var/www/www-root/data/app/',
     }));
 });

gulp.task('deploy:config', function() {
     return gulp.src([
         'production/app/vendor/',
         'production/app/.env'
     ])
       .pipe(rsync({
         root: 'production/app/',
         hostname: 'root@134.0.112.4',
         destination: '/var/www/www-root/data/app/',
     }));
 });

gulp.task('deploy:backend', function() {
     return gulp.src([
         'production/app/**',
         'production/app/.env',
         '!production/app/vendor/',
         '!production/app/vendor/**'
     ])
       .pipe(rsync({
         root: 'production/app/',
         hostname: 'root@134.0.112.4',
         destination: '/var/www/www-root/data/app/',
     }));
});


// Deploy

gulp.task('default', gulp.series('clean', 'backend:public', 'backend:app', 'frontend:public', 'frontend:index', 'frontend:dist', 'config:index', 'config:env'));
gulp.task('deploy', gulp.series('deploy:frontend', 'deploy:config', 'deploy:backend'));
