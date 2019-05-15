const path = require('path');

const replacements = require("../replacements");

const stringReplace = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	const config = grunt.hooks.applyFilters( 'config.string-replace', {
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

		classes: {
			files: [{
				expand: true,
				cwd: 'src/classes/',
				src: ['**/*.php',...grunt.option( 'pattern' ).exclude],
				dest: grunt.option( 'destination' ) + '/classes/'
			}],
		},

		root: {
			files: [{
				expand: true,
				cwd: 'src/',
				src: [
					'*.php',
					'**/*.php',
					...( 'plugin' === pkg.projectType ? [
						'!' + pkg.name + '.php',
					] : [] ),
					...( 'theme' === pkg.projectType ? [
						'!functions.php',
					] : [] ),
					...grunt.option( 'pattern' ).excludeFromRoot,
					...grunt.option( 'pattern' ).exclude,
				],

				dest: grunt.option( 'destination' ) + '/'
			}],
		},

		...( 'plugin' === pkg.projectType && {
			plugin_main_file: {
				files: { [grunt.option( 'destination' ) + '/' + pkg.name + '.php']:'src/' + pkg.name + '.php'}
			},
		} ),

		...( 'theme' === pkg.projectType && {
			functionsPhp: {
				files: { [grunt.option( 'destination' ) + '/functions.php']:'src/functions.php' }
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

		// change the path to classes: remove 'src'
		vendor_composer: {
			options: {
				replacements: [{
					pattern: /\'\/src\/classes\//g,
					replacement: '\'\/classes\/',
				}],
			},
			files: [{
				expand: true,
				cwd: 'vendor/',
				src: [
					'autoload.php',
					'composer/**/*',
				],
				dest: grunt.option( 'destination' ) + '/vendor',
			}],
		},

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

	grunt.config( 'string-replace', config );

};
module.exports = stringReplace;