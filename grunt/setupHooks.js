
const path = require('path');
const player = require('play-sound')();
const { debounce } = require( 'lodash' );

const setupHooks = grunt => {

	let changed = [];

	const updateConfig = ( changedFiles, ext, configKey ) => {

		if ( 'js' === ext )
			grunt.config('eslint.src.src', changedFiles );

		const config = grunt.config( configKey )[0];

		config.src = [];
		[...changedFiles].map( filepath => {

			if ( -1 !== filepath.indexOf('/') ) {
				const rootFileMayBe = filepath.substring( 0, filepath.indexOf('/') ) + '.' + ext;
				config.src.push( rootFileMayBe );

				grunt.file.exists( 'src/' + ext + '/' + rootFileMayBe )
					? grunt.option( 'silent', false )
					: grunt.option( 'silent', true );

			} else {
				config.src.push( filepath );
				grunt.option( 'silent', false );
			}

		} );

		grunt.config( configKey, [config] );
	};

	const onWatchChange = debounce( () => {

		// js
		const changedJs = [...changed]
			.filter( changedFile => ['.js','.jsx'].includes(  path.extname( changedFile ) ) )
			.map( changedFile => changedFile.replace( 'src/js/', ''  ) );
		updateConfig( changedJs, 'js', 'browserify.all.files' );

		// scss
		const changedScss = [...changed]
			.filter( changedFile => ['.scss'].includes(  path.extname( changedFile ) ) )
			.map( changedFile => changedFile.replace( 'src/scss/', ''  ) );
		updateConfig( changedScss, 'scss', 'sass.all.files' );

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
