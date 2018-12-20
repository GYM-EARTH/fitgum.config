const gulp = require('gulp');
const rename = require('gulp-rename');
const rsync = require('gulp-rsync');
const del = require('del');

// Clean
gulp.task('clean', function() {
    return del(['../production'], {force: true});
});


// SSR
gulp.task('frontend:dist', function() {
    return gulp.src([
        '../frontend/dist/FITGUM/**/*',
    ])
    .pipe(gulp.dest('../production/public'));
    
});


// SSR index
gulp.task('frontend:index', function() {
    
   return gulp.src('../frontend/dist/FITGUM/index.html')
        .pipe(rename('resources/views/welcome.blade.php'))
        .pipe(gulp.dest('../production/app'));
});

// Frontend
// gulp.task('frontend:public', function() {
//     return gulp.src([
//         '../frontend/dist/server.js',
//     ])
//     .pipe(gulp.dest('production/public'));
// });

// Backend
gulp.task('backend:public', function() {
    return gulp.src([
        '../backend/public/css/**/*',
        '../backend/public/svg/**/*',
        '../backend/public/vendor/**/*',
        '../backend/public/.htaccess',
        '../backend/public/favicon.ico',
        '../backend/public/robots.txt',
        '../backend/public/web.config'
    ], {base:"../backend/public"})
    .pipe(gulp.dest('../production/public'));
});

gulp.task('backend:app', function() {
    return gulp.src([
        '../backend/app/**/*',
        '../backend/bootstrap/**/*',
        '../backend/config/**/*',
        '../backend/database/**/*',
        '../backend/nova/**/*',
        '../backend/resources/**/*',
        '../backend/routes/**/*',
        '../backend/storage/**/*',
        '../backend/tests/**/*',
        '../backend/vendor/**/*',
        '../backend/artisan',
        '../backend/composer.json',
        '../backend/composer.lock',
        '../backend/package.json',
        '../backend/phpunit.xml',
        '../backend/server.php',
        '../backend/webpack.mix.js'
    ], {base:"../backend"})
    .pipe(gulp.dest('../production/app'));
});

// Config
gulp.task('config:index', function() {
   return gulp.src('index.php')
         .pipe(gulp.dest('../production/public'));
    
});

// Config
gulp.task('config:env', function() {
  return gulp.src('.env')
         .pipe(gulp.dest('../production/app'));
});


// Deploy
gulp.task('deploy:frontend', function() {
     return gulp.src([
         '../production/public/**',
         '../production/public/.htaccess'
     ])
       .pipe(rsync({
         root: '../production/public/',
         hostname: 'root@134.0.112.4',
         destination: '/var/www/www-root/data/www/fitgum.ru/'
     }));
 });

// VENDOR :TODO: CAN DELETE
// gulp.task('deploy:vendor', function() {
//      return gulp.src([
//          '../production/app/vendor/**/*',
//      ])
//        .pipe(rsync({
//          root: '../production/app/',
//          hostname: 'root@134.0.112.4',
//          destination: '/var/www/www-root/data/app/',
//      }));
//  });

gulp.task('deploy:config', function() {
     return gulp.src([
         '../production/app/vendor/',
         '../production/app/.env'
     ])
       .pipe(rsync({
         root: '../production/app/',
         hostname: 'root@134.0.112.4',
         destination: '/var/www/www-root/data/app/',
     }));
 });

gulp.task('deploy:backend', function() {
     return gulp.src([
        '../production/app/app/**/*',
        '../production/app/bootstrap/**/*',
        '../production/app/config/**/*',
        '../production/app/database/**/*',
        '../production/app/nova/**/*',
        '../production/app/resources/**/*',
        '../production/app/routes/**/*',
        '../production/app/storage/**/*',
        '../production/app/tests/**/*',
        '../production/app/artisan',
        '../production/app/composer.json',
        '../production/app/composer.lock',
        '../production/app/package.json',
        '../production/app/phpunit.xml',
        '../production/app/server.php',
        '../production/app/webpack.mix.js'
     ])
       .pipe(rsync({
         root: '../production/app/',
         hostname: 'root@134.0.112.4',
         destination: '/var/www/www-root/data/app/',
     }));
});


// Deploy

gulp.task('default', gulp.series('clean', 'backend:public'
     , 'backend:app',
     //'frontend:public',
     'frontend:index',
     'frontend:dist',
     'config:index',
     'config:env'
    ));
gulp.task('deploy', gulp.series('deploy:frontend', 'deploy:config', 'deploy:backend'));
