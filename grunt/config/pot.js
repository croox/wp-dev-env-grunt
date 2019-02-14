
const path = require('path');

const pot = grunt => {

	const handles = grunt.file.expand( { cwd: 'src/js/' }, ['*.js','*.jsx'] ).map( file => path.basename( file, path.extname( file ) ) );

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	const options = {
		text_domain: 'text_domain',		// Currently it is only used to generate the destination file name: [text-domain].pot	see: https://github.com/stephenharris/grunt-pot#text_domain
		msgmerge: false,				// true will merge it into existing po file, but with fuzzy translations
		dest: 'src/languages/',
		keywords: [
			'__',
			'_e',
			'_x',
			'esc_html',
			'esc_html__',
			'esc_html_e',
			'esc_attr__',
			'esc_attr_e',
			'esc_attr_x',
			'esc_html_x',
			'ngettext',
			'_n',
			'_c',
			'_ex',
			'_nx'
		],
	};

	const config = {
		phpFiles: {
			options: {
				...options,
				language: 'PHP',
				text_domain: pkg.textDomain + '-LOCALE',

			},
			files: [{
				expand: true,
				src: [
					'src/**/*.php',
					...grunt.option( 'pattern' ).exclude,
				],
			} ],
		},
	};

	// add subtask for each js handle to config
	[...handles].map( handle => {

		config[handle] = {
			options: {
				...options,
				language: 'JavaScript',
				text_domain: pkg.textDomain + '-LOCALE-' + handle,
			},
			files: [{
				expand: true,
				src: [
					'src/js/' + handle + '.js',
					'src/js/' + handle + '.jsx',
					'src/js/' + handle + '/**/*.js',
					'src/js/' + handle + '/**/*.jsx',
					...grunt.option( 'pattern' ).exclude,
				],
			}],
		};

	} );

	grunt.config( 'pot', config );

};

module.exports = pot;

