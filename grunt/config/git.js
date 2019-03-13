

const path = require('path');



const {
	get,
} = require('lodash');

const git = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	const configGitadd = grunt.hooks.applyFilters( 'config.gitadd', {
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
	} );
	grunt.config( 'gitadd', configGitadd );

	const configGitcommit = grunt.hooks.applyFilters( 'config.gitcommit', {
		ondist: {
			options: {
				message: grunt.option( 'commitmsg' ),
			},
		},
	} );
	grunt.config( 'gitcommit', configGitcommit ) ;

	const configGittag = grunt.hooks.applyFilters( 'config.gittag', {
		ondist: {
			options: {
				tag: pkg.version,
				message: grunt.option( 'commitmsg' ),
			}
		},
	} );
	grunt.config( 'gittag', configGittag ) ;

	const configGitpush = grunt.hooks.applyFilters( 'config.gitpush', {
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
	} );
	grunt.config( 'gitpush', configGitpush ) ;

};

module.exports = git;
