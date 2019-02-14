
const path = require('path');


const {
	get,
} = require( 'lodash' );



// ????
// ????
// ????
// ???? is noch nur theme


const watch = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	grunt.config( 'watch', {

		options: {
			spawn: false,
		},

		root_files: {
			files: [
				'src/root_files/**/*',
				// '!src/root_files/functions.php',		// theme
				'!src/root_files/' + pkg.name + '.php',
				grunt.option( 'pattern' ).exclude,
			],
			tasks: [
				'copy:root_files',
				'sync',
				'sound:blob',
			]
		},

		plugin_main_file: {
			files: [
				'src/root_files/' + pkg.name + '.php',
				grunt.option( 'pattern' ).exclude,
			],
			tasks: [
				'string-replace:plugin_main_file',	// copies plugin_main_file to destination
				'concat:plugin_main_file',		// add banner plugin_main_file
				'sync',
				'sound:blob',
			],
		},





		// // theme
		// functionsPhp: {
		// 	files: [
		// 		'src/root_files/functions.php',
		// 		grunt.option( 'pattern' ).exclude,
		// 	],
		// 	tasks: [
		// 		'string-replace:functionsPhp',	// copies plugin_main_file to destination
		// 		'concat:styleBanner',			// add banner
		// 		// syncTask,
		// 	]
		// },
		// templates: {
		// 	files: [
		// 		'src/templates/**/*.php',
		// 		grunt.option( 'pattern' ).exclude,
		// 	],
		// 	tasks: [
		// 		'string-replace:templates',
		// 		// syncTask,
		// 	]
		// },
		// template_parts: {
		// 	files: [
		// 		'src/template_parts/**/*.php',
		// 		grunt.option( 'pattern' ).exclude,
		// 	],
		// 	tasks: [
		// 		'string-replace:template_parts',
		// 		// syncTask,
		// 	]
		// },

		// vendor: {
		// 	files: [
		// 		'vendor/**/*',
		// 		grunt.option( 'pattern' ).exclude,
		// 	],
		// 	tasks: [
		// 		'copy:vendor',
		// 		// 'local_sync:<%= local_sync.wp_install %>',
		// 		// '_noticeReady',
		// 	]
		// },

		images: {
			files: [
				'src/images/**/*',
				grunt.option( 'pattern' ).exclude,
			],
			tasks: [
				'copy:images',
				'sync',
				'sound:blob',
			]
		},

		fonts: {
			files: [
				'src/fonts/**/*',
				grunt.option( 'pattern' ).exclude,
			],
			tasks: [
				'copy:fonts',
				'sync',
				'sound:blob',
			]
		},

		// ??? muss noch
		// readme: {
		// 	files: [
		// 		'src/readme/**/*',
		// 		'!**/dont_touch/**/*',
		// 		grunt.option( 'pattern' ).exclude,
		// 	],
		// 	tasks: [
		// 		'concat:readme',
		// 		'concat:readmeMd',
		// 		'wp_readme_to_markdown:readmeMd',
				// 'sync',
				// 'sound:blob',
		// 	]
		// },



		inc: {
			files: [
				'src/inc/**/*',
				grunt.option( 'pattern' ).exclude,
			],
			tasks: [
				'string-replace:inc_to_dest',
				'sync',
				'sound:blob',
			]
		},


		// assets
		js: {
			files: [
				'src/js/**/*.js',
				'src/js/**/*.jst',
				'src/js/**/*.jsx',
				grunt.option( 'pattern' ).exclude,
			],
			tasks: [
				'eslint:js',
				'browserify',
				'sync',
				'sound:blob',
			],
		},

		styles: {
			files: [
				'src/sass/**/*.scss',
				// '!src/sass/style.scss',		// theme
				grunt.option( 'pattern' ).exclude,
			],
			tasks: [
				'sass:other',
				'sync',
				'sound:blob',
			]
		},

		// // theme
		// styleMain: {
		// 	files: [
		// 		'src/sass/style.scss',
		// 	],
		// 	tasks: [
		// 		'sass:main',
		// 		'concat:styleBanner',
		// 		'sync',
		// 		'sound:blob',
		// 	]
		// },



		// potomo_pos: {
		// 	files: [
		// 		'src/languages/**/*.po',
		// 		grunt.option( 'pattern' ).exclude,
		// 	],
		// 	tasks: [
		// 		'potomo',
		// 		'po2json',
		// 		'sync',
		// 		'sound:blob',
		// 	]
		// }























	} );

};

module.exports = watch;