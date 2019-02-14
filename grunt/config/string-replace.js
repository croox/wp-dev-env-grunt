const path = require('path');

const replacements = require("../replacements");


const stringReplace = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	grunt.config( 'string-replace', {
		options: {
			replacements: replacements.get( grunt ),
		},

		inc_to_dest: {
			files: [{
				expand: true,
				cwd: 'src/inc/',
				src: ['**/*.php',...grunt.option( 'pattern' ).exclude],
				dest: grunt.option( 'destination' ) + '/inc/'
			}],
		},

		template_parts: {
			files: [{
				expand: true,
				cwd: 'src/template_parts/',
				src: ['**/*.php',...grunt.option( 'pattern' ).exclude],
				dest: grunt.option( 'destination' ) + '/template_parts/',
			}],
		},

		...( 'plugin' === pkg.projectType && {
			plugin_main_file: {
				files: { [grunt.option( 'destination' ) + '/' + pkg.name + '.php']:'src/root_files/' + pkg.name + '.php'}
			},
		} ),

		...( 'theme' === pkg.projectType && {
			functionsPhp: {
				files: { [grunt.option( 'destination' ) + '/functions.php']:'src/root_files/functions.php' }
			},
			templates: {
				files: [{
					expand: true,
					cwd: 'src/templates/',
					src: ['**/*.php',...grunt.option( 'pattern' ).exclude],
					dest: grunt.option( 'destination' ) + '/',
				}],
			},
		} ),

		// // will replace string and update file in source. should only run on dist
		// // usefull for phpDoc "@since wde_replace_version"
		// inc_update_src: {
		// 	options: {
		// 		replacements: [{
		// 			pattern: /wde_replace_version/g,
		// 			replacement:  '<%= global["pkg"].version %>'
		// 		}]
		// 	},
		// 	files: [{
		// 		expand: true,
		// 		cwd: 'src/inc/',
		// 		src: ['**/*.php','<%= pattern.global_exclude %>'],
		// 		dest: 'src/inc/'
		// 	}],
		// },

	} );

};
module.exports = stringReplace;