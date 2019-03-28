
const path = require('path');

const prettier = grunt => {

	const optionsJS = {
		parser: 'babel',
		trailingComma: 'es5',
		singleQuote: true,	// JSX quotes ignore this option
		bracketSpacing: true,
		arrowParens: 'avoid',
	};

	const config = grunt.hooks.applyFilters( 'config.prettier', {

		// see docs options ->  https://prettier.io/docs/en/options.html
		options: {
			printWidth: 80,
			verbose: true,
			useTabs: true,
			endOfLine: 'lf',
		},

		js: {
			options: {
				...optionsJS,
			},
			src: [
				'src/js/**/*.js',
				...grunt.option( 'pattern' ).exclude,
			]
		},

		jsx: {
			options: {
				...optionsJS,
				jsxSingleQuote: true,
				jsxBracketSameLine: false,

			},
			src: [
				'src/js/**/*.jsx',
				...grunt.option( 'pattern' ).exclude,
			]
		},

		scss: {
			options: {
				parser: 'scss',
			},
			src: [
				'src/scss/**/*.scss',
				...grunt.option( 'pattern' ).exclude,
			]
		},

		md: {
			options: {
				parser: 'markdown',
			},
			src: [
				'README.md',
				'src/**/*.md',
				...grunt.option( 'pattern' ).exclude,
			]
		},

	} );

	grunt.config( 'prettier', config );

};

module.exports = prettier;