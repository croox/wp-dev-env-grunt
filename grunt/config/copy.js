
const path = require('path');

const copy = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	const config = grunt.hooks.applyFilters( 'config.copy', {

		images: {
			expand: true,
			cwd: 'src/images/',
			src: ['**/*', ...grunt.option( 'pattern' ).exclude ],
			dest: grunt.option( 'destination' ) + '/images/',
		},

		fonts: {
			expand: true,
			cwd: 'src/fonts/',
			src: ['**/*', ...grunt.option( 'pattern' ).exclude ],
			dest: grunt.option( 'destination' ) + '/fonts/',
		},

		root: {
			expand: true,
			cwd: 'src/',
			src: [
				'**/*',
				'!readme.txt',
				'!readme.txt',
				'!*.php',
				'!**/*.php',
				...grunt.option( 'pattern' ).excludeFromRoot,
				...grunt.option( 'pattern' ).exclude,
			],
			dest: grunt.option( 'destination' ) + '/',
		},

		vendor_croox_wde_frame: {
			expand: true,
			cwd: 'vendor/croox/wp-dev-env-frame',
			src: [
				'**/*',
				'!.git/**/*',
			],
			dest: grunt.option( 'destination' ) + '/vendor/croox/wp-dev-env-frame',
		},

		trunkToTags: {
			expand: true,
			cwd: 'dist/trunk/',
			src: [
				'**/*',
				...grunt.option( 'pattern' ).exclude,
			],
			dest: 'dist/tags/' + pkg.version + '/',
		},

	} );

	grunt.config( 'copy', config );

};

module.exports = copy;