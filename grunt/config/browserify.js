
const path = require('path');

const browserify = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	const options = {
		transform: [
			[ path.resolve( 'node_modules/loose-envify' ), {
				global: true,
				NODE_ENV: grunt.option( 'compress' ) ? 'production' : 'development',
			} ],
			[ path.resolve( 'node_modules/babelify' ), {
				global: true,
				plugins: [
					[
						path.resolve( 'node_modules/@wordpress/babel-plugin-makepot' ),{
							output: path.resolve( 'src/languages/' + pkg.funcPrefix + '-LOCALE-handle.pot' )
						}
					]
				],
				presets: [
					path.resolve( 'node_modules/@babel/preset-env' ),
					path.resolve( 'node_modules/@babel/preset-react' ),
				],
			} ],
			[ path.resolve( 'node_modules/browserify-shim' ), {
				global: true,
			} ],
		],
		browserifyOptions: {
			debug: ! grunt.option( 'compress' ),
		},
	};

	const config = grunt.hooks.applyFilters( 'config.browserify', {
		options: options,

		all: {
			files: [{
				expand: true,
				cwd: 'src/js',
				src: [
					'*.js',
					'*.jsx',
				],
				dest: grunt.option( 'destination' ) + '/js',
				rename: ( dst, src ) => dst + '/' + src.replace( '.js', '.min.js' ),
			}],
		},

	} );

	grunt.config( 'browserify', config );

};

module.exports = browserify;