

const path = require('path');



const {
	get,
} = require('lodash');

const git = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	grunt.config( 'gitadd', {
		ondist: {
			files: {
				src: [
					'.gwde_nextRelease.json',
					'CHANGELOG.md',
					'package.json',
					'dist/trunk/*',
					'src/languages/*.pot',
					( 'plugin' === pkg.projectType ? [pkg.name + '.php'] : [] ),
					( 'theme' === pkg.projectType ? ['style.css'] : [] ),
				],
			}
		}
	} ) ;

	grunt.config( 'gitcommit', {
		ondist: {
			options: {
				message: grunt.option( 'commitmsg' ),
			},
		},
	} ) ;

	grunt.config( 'gittag', {
		ondist: {
			options: {
				tag: pkg.version,
				message: grunt.option( 'commitmsg' ),
			}
		},
	} ) ;


	grunt.config( 'gitpush', {
		commit: {
			options: {
				message: grunt.option( 'commitmsg' ),
			}
		},
		tags: {
			options: {
				message: grunt.option( 'commitmsg' ),
				tags: true,
			}
		},
	} ) ;



};

module.exports = git;
