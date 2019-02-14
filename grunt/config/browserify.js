
const path = require('path');

const browserify = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	const options = {
		transform: [
			[ path.resolve( 'node_modules/wp-dev-env-grunt/node_modules/browserify-shim' ), { global: true } ],
			[ path.resolve( 'node_modules/wp-dev-env-grunt/node_modules/babelify' ), {
				plugins: [],
				presets: [
					path.resolve( 'node_modules/wp-dev-env-grunt/node_modules/@babel/preset-env' ),
					path.resolve( 'node_modules/wp-dev-env-grunt/node_modules/@babel/preset-react' ),
				],
			}],
		],
		browserifyOptions: {
			debug: grunt.option( 'compress' ),
		},
	};

	grunt.config( 'browserify', {
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

};

module.exports = browserify;