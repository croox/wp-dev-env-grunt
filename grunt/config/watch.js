
const path = require('path');
const { get } = require( 'lodash' );


const watch = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	const afterTasks = [
		'sync',
		'sound:blob',
	];

	const config = grunt.hooks.applyFilters( 'config.watch', {

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

		root: {
			files: [ {
				expand: true,
				cwd: 'src/',
				src: [
					'**/*',
					'!readme.txt',
					'!*.php',
					'!**/*.php',
					...grunt.option( 'pattern' ).excludeFromRoot,
					...grunt.option( 'pattern' ).exclude,
				],
			} ],
			tasks: [
				'copy:root',
				...afterTasks,
			]
		},

		root: {
			options: {
				cwd: {
					files: 'src',
				}
			},
			files: [
					'**/*',
					'!readme.txt',
					'!*.php',
					'!**/*.php',
					...grunt.option( 'pattern' ).excludeFromRoot,
					...grunt.option( 'pattern' ).exclude,
			],
			tasks: [
				'copy:root',
				...afterTasks,
			],
		},

		root_php: {
			options: {
				cwd: {
					files: 'src',
				}
			},
			files: [
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
			tasks: [
				'string-replace:root',
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
				'create_autoloader:inc',
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
				'src/readme.txt',
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

		...( 'plugin' === pkg.projectType && {
			plugin_main_file: {
				files: [
					'src/' + pkg.name + '.php',
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
					'src/functions.php',
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

	grunt.config( 'watch', config );

};

module.exports = watch;