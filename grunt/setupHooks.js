
const path = require('path');
const player = require('play-sound')();
const { debounce } = require( 'lodash' );

const setupHooks = grunt => {

	let changed = [];

	const updateConfig = ( changedFiles, ext, configKey ) => {
		const config = grunt.config( configKey )[0];

		// update eslint config, if js files changed
		if ( 'js' === ext.split('.').reverse()[0] ) {
			grunt.config( 'eslint.src.src', changedFiles.map( file => 'src/js/' + file ) );
		}
		// find entry files (~files in cwd root), and write them to our config object
		config.src = [];
		[...changedFiles].map( filepath => {
			let files = -1 !== filepath.indexOf('/')
				? [filepath.substring( 0, filepath.indexOf('/') ) + '.' + ext]
				: [path.basename( filepath, path.extname( filepath ) ) + '.' + ext];

			files = grunt.hooks.applyFilters( 'onWatchChange.files', files, {
				filepath,
				ext,
				configKey,
			} );

			[...files].map( file => {
				config.src.push( file );
				grunt.file.exists( config.cwd + '/' + file )
					? grunt.option( 'silent', false )
					: grunt.option( 'silent', true );
			} );
		} );

		// update config
		grunt.config( configKey, [config] );
	};

	const onWatchChange = debounce( () => {

		// js
		const changedJs = [...changed]
			.filter( changedFile => ['.js','.jsx'].includes(  path.extname( changedFile ) ) )
			.map( changedFile => changedFile.replace( 'src/js/', ''  ) );
		updateConfig( changedJs, 'js', 'browserify.all.files' );
		updateConfig( changedJs, 'min.js', 'uglify.destination.files' );

		// scss
		const changedScss = [...changed]
			.filter( changedFile => ['.scss'].includes(  path.extname( changedFile ) ) )
			.map( changedFile => changedFile.replace( 'src/scss/', ''  ) );
		updateConfig( changedScss, 'scss', 'sass.all.files' );
		updateConfig( changedScss, 'min.css', 'css_purge.destination.files' );

		changed = [];	// reset

	}, 200 );

	grunt.event.on( 'watch', ( action, filepath, target ) => {
		changed = [
			...changed,
			filepath,
		];
		onWatchChange();
	});

	const sound = () => grunt.option( 'sound' ) !== false || grunt.option( 'silent' ) !== true
		? player.play( grunt.config( 'sound.error.filepath' ) )
		: null;

	grunt.util.hooker.hook(grunt, 'warn', sound );
	grunt.util.hooker.hook(grunt.fail, 'warn', sound );
	grunt.util.hooker.hook(grunt.fail, 'error', sound );
	grunt.util.hooker.hook(grunt.log, 'fail', sound );
	grunt.util.hooker.hook(grunt.log, 'error', sound );
	grunt.util.hooker.hook(grunt.fail, 'fatal', sound );
};

module.exports = setupHooks;
