const path = require('path');

const create_autoloader = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	const  globbingPattern = {
		expand: true,
		src: ['*.php',...grunt.option( 'pattern' ).exclude ],
		dest: grunt.option( 'destination' ) + '/inc/',
	};

	grunt.config( 'create_autoloader', {

		fun: {
			files: [{
				...globbingPattern,
				cwd: 'src/inc/fun',
			}],
		},

		post_types_taxs: {
			files: [{
				...globbingPattern,
				cwd: 'src/inc/post_types_taxs',
			}],
		},

		roles_capabilities: {
			files: [{
				...globbingPattern,
				cwd: 'src/inc/roles_capabilities',
			}],
		},



		...( 'plugin' === pkg.projectType && {


		} ),

		...( 'theme' === pkg.projectType && {

			template_functions: {
				files: [{
					...globbingPattern,
					cwd: 'src/inc/template_functions',
				}],
			},

			template_tags: {
				files: [{
					...globbingPattern,
					cwd: 'src/inc/template_tags',
				}],
			},

		} ),


	} );

};
module.exports = create_autoloader;