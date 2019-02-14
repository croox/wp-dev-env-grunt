
const path = require('path');
const { get } = require( 'lodash' );


const watch = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	afterTasks = [
		'sync',
		'sound:blob',
	];

	grunt.config( 'watch', {

		options: {
			spawn: false,
		},

		images: {
			files: [
				'src/images/**/*',
				...grunt.option( 'pattern' ).exclude,
			],
			tasks: [
				'copy:images',
				...afterTasks,
			]
		},

		fonts: {
			files: [
				'src/fonts/**/*',
				...grunt.option( 'pattern' ).exclude,
			],
			tasks: [
				'copy:fonts',
				...afterTasks,
			]
		},

		root_files: {
			files: [
				'src/root_files/**/*',
				'!src/root_files/readme.txt',
				...( 'theme' === pkg.projectType ? ['!functions.php'] : [] ),
				...( 'plugin' === pkg.projectType ? ['!' + pkg.name + '.php'] : [] ),
				...grunt.option( 'pattern' ).exclude,
			],
			tasks: [
				'copy:root_files',
				...afterTasks,
			]
		},

		inc: {
			files: [
				'src/inc/**/*',
				...grunt.option( 'pattern' ).exclude,
			],
			tasks: [
				'string-replace:inc_to_dest',
				...afterTasks,
			]
		},

		js: {
			files: [
				'src/js/**/*.js',
				'src/js/**/*.jsx',
				...grunt.option( 'pattern' ).exclude,
			],
			tasks: [
				'eslint:src',
				'browserify:all',
				...afterTasks,
			],
		},

		potomo_pos: {
			files: [
				'src/languages/**/*.po',
				...grunt.option( 'pattern' ).exclude,
			],
			tasks: [
				'potomo',
				'po2json',
				...afterTasks,
			],
		},

		readme: {
			files: [
				'src/root_files/readme.txt',
				...grunt.option( 'pattern' ).exclude,
			],
			tasks: [
				'concat:readme',
				'concat:readmeMd',
				'wp_readme_to_markdown',
				...afterTasks,
			]
		},

		sass: {
			files: [
				'src/scss/**/*.scss',
				...( 'theme' === pkg.projectType ? ['!src/scss/style.scss'] : [] ),
				...grunt.option( 'pattern' ).exclude,
			],
			tasks: [
				'sass:all',
				...( grunt.option( 'compress' ) ? ['css_purge:destination'] : [] ),
				...afterTasks,
			],
		},

		template_parts: {
			files: [
				'src/template_parts/**/*.php',
				...grunt.option( 'pattern' ).exclude,
			],
			tasks: [
				'string-replace:template_parts',
				...afterTasks,
			]
		},

		...( 'plugin' === pkg.projectType && {
			plugin_main_file: {
				files: [
					'src/root_files/' + pkg.name + '.php',
					...grunt.option( 'pattern' ).exclude,
				],
				tasks: [
					'string-replace:plugin_main_file',
					'concat:plugin_main_file',
					...afterTasks,
				],
			},
		} ),

		...( 'theme' === pkg.projectType && {

			functionsPhp: {
				files: [
					'src/root_files/functions.php',
					...grunt.option( 'pattern' ).exclude,
				],
				tasks: [
					'string-replace:functionsPhp',
					...afterTasks,
				]
			},

			templates: {
				files: [
					'src/templates/**/*.php',
					...grunt.option( 'pattern' ).exclude,
				],
				tasks: [
					'string-replace:templates',
					...afterTasks,
				]
			},

		} ),


	} );

};

module.exports = watch;