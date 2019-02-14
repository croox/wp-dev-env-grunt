const path = require('path');

const compress = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	grunt.config( 'compress', {

		trunk_to_releases: {
			options: {
				archive: 'releases/' + pkg.name + '-' + pkg.version + '.zip',
				mode: 'zip',
				pretty: true,
			},
			files: [
				{
					expand: true,
					cwd: 'dist/trunk',
					src: ['*','**/*'],
					dest: pkg.name,
				},
			],
		},
	} );

};

module.exports = compress;