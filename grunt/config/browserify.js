
const path = require('path');

const browserify = grunt => {

	const options = {
		transform: [
			[ path.resolve( 'node_modules/babelify' ), {
				global: true,
				plugins: [],
				presets: [
					path.resolve( 'node_modules/@babel/preset-env' ),
					path.resolve( 'node_modules/@babel/preset-react' ),
				],
			}],
			[ path.resolve( 'node_modules/browserify-shim' ), { global: true } ],
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