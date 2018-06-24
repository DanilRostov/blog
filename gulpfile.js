'use strict';

// Paths to the folders
const dirs = {
	source: 'assets/css/src',  
	dist: 'assets/css/dist'
};

// Gulp plugins
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-cleancss');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const objectFitImages = require('postcss-object-fit-images');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const del = require('del');
const gulpSequence = require('gulp-sequence');
const wait = require('gulp-wait');
const browserSync = require('browser-sync').create();

// PostCSS plugins
const postCssPlugins = [
	autoprefixer({                                          
		browsers: ['last 2 version']
	}),
	mqpacker({                                               
		sort: true
	}),
	objectFitImages()
];

// Processing and compiling CSS
gulp.task( 'css', () => {
	return gulp.src( `${dirs.source}/style.scss` )
		.pipe( plumber({
			errorHandler: function( err ) {
				notify.onError({
					title: 'Styles compilation error',
					message: err.message
				})( err );
				this.emit( 'end' );
			}
		}))
		.pipe( wait( 100 ) )
		.pipe( sourcemaps.init() )
		.pipe( sass() )
		.pipe( postcss( postCssPlugins ) )
		.pipe( sourcemaps.write('/') ) 
		.pipe( gulp.dest( `${dirs.dist}/` ) )
		.pipe( browserSync.stream( { match: '**/*.css' } ) )
		.pipe( rename( 'style.min.css' ) )
		.pipe( cleanCSS() )
		.pipe( gulp.dest( `${dirs.dist}/` ) )
});

// Clean 'dist' folder before processing
gulp.task( 'clean', () => {
	return del([
		`${dirs.dist}/**/*`
	]);
} );

// Build task
gulp.task( 'build', ( callback ) => {
	gulpSequence (
		'clean',
		'css',
		callback
	);
});

// Default task
gulp.task( 'default', [ 'server' ] );

// Server task
gulp.task( 'server', [ 'build' ], () => {
	browserSync.init({
		proxy: 'http://localhost:2368'
	});

	// Watch CSS
	gulp.watch( [ `${dirs.source}/**/*.scss` ], [ 'css' ] );

	// Watch HBS
	gulp.watch( [ './**/*.hbs' ], [ 'watch:hbs' ] );

	// Watch JS
	gulp.watch( [ 'assets/js/**/*.js' ], [ 'watch:js' ] );
});

// Browsersync
gulp.task('watch:hbs', reload);
gulp.task('watch:js', reload);

// Reload browser
function reload (done) {
	browserSync.reload();
	done();
};

// Errors
const onError = function (err) {
	notify.onError({
		title: 'Error in ' + err.plugin,
	})( err );
	this.emit('end');
};