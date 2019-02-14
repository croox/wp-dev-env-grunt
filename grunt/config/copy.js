

const path = require('path');

const copy = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	grunt.config( 'copy', {

		// ???
		// vendor: {
		// 	expand: true,
		// 	cwd: 'vendor/',
		// 	src: ['**/*', '<%= pattern.global_exclude %>'],
		// 	dest: '<%= dest_path %>/vendor/'
		// },

		images: {
			expand: true,
			cwd: 'src/images/',
			src: ['**/*', grunt.option( 'pattern' ).exclude ],
			dest: grunt.option( 'destination' ) + '/images/',
		},

		fonts: {
			expand: true,
			cwd: 'src/fonts/',
			src: ['**/*', grunt.option( 'pattern' ).exclude ],
			dest: grunt.option( 'destination' ) + '/fonts/',
		},

		root_files: {
			expand: true,
			cwd: 'src/root_files/',
			src: [
				'**/*',
				...( 'theme' === pkg.projectType ? ['!functions.php'] : [] ),
				...( 'plugin' === pkg.projectType ? ['!' + pkg.name + '.php'] : [] ),
				grunt.option( 'pattern' ).exclude,
			],
			dest: grunt.option( 'destination' ) + '/',
		},

		trunkToTags: {
			expand: true,
			cwd: 'dist/trunk/',
			src: [
				'**/*',
				grunt.option( 'pattern' ).exclude,
			],
			dest: 'dist/tags/' + pkg.version + '/',
		},

	} );

};

module.exports = copy;