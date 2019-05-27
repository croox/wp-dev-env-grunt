const path = require('path');

const nodesass = require('node-sass');

const sass = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	const options = {
		includePaths: [],
		implementation: nodesass,
		importer: undefined,

		outputStyle: 'expanded',
		sourceMap: true,
		sourceComments: true,

		...( grunt.option( 'compress' ) && {
			outputStyle: 'compressed',
			sourceMap: false,
			sourceComments: false,
		} ),
	};

	const config = grunt.hooks.applyFilters( 'config.sass', {
		options: options,

		all: {
			files: [{
				expand: true,
				cwd: 'src/scss',
				src: [
					'*.scss',
					...( 'theme' === pkg.projectType ? ['!style.scss'] : [] ),
				],
				dest: grunt.option( 'destination' ) + '/css',
				ext: '.min.css',
			}],
		},

	} );

	grunt.config( 'sass', config );

};

module.exports = sass;

