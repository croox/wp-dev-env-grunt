const path = require('path');

const replacements = require("../replacements");


const stringReplace = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );


	// console.log( 'debug replacements' );		// ??? debug
	// console.log( 'debug ', replacements.get() );		// ??? debug

	grunt.config( 'string-replace', {
		options: {
			replacements: replacements.get( grunt ),
		},

		// will replace string and copy plugin_main_file to destination
		plugin_main_file: {
			files: { [grunt.option( 'destination' ) + '/' + pkg.name + '.php']:'src/root_files/' + pkg.name + '.php'}
		},

		// // will replace string and copy functionsPhp to destination
		// functionsPhp: {
		// 	files: { [grunt.option( 'destination' ) + '/functions.php']:'src/root_files/functions.php' }
		// },


		// will replace and copy inc to destination
		inc_to_dest: {
			files: [{
				expand: true,
				cwd: 'src/inc/',
				src: ['**/*.php',grunt.option( 'pattern' ).exclude],
				dest: grunt.option( 'destination' ) + '/inc/'
			}],
		},

		// // will replace string and update file in source. should only run on dist
		// // usefull for phpDoc "@since gwde_replace_version"
		// inc_update_src: {
		// 	options: {
		// 		replacements: [{
		// 			pattern: /gwde_replace_version/g,
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

		// // theme
		// templates: {
		// 	files: [{
		// 		expand: true,
		// 		cwd: 'src/templates/',
		// 		src: ['**/*.php',grunt.option( 'pattern' ).exclude],
		// 		dest: grunt.option( 'destination' ) + '/',
		// 	}],
		// },

	} );

};
module.exports = stringReplace;