
const path = require('path');

const copy = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	grunt.config( 'copy', {

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

};

module.exports = copy;