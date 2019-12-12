const path = require('path');
const nodesass = require('node-sass');
const globImporter = require('node-sass-glob-importer');

const sass = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	const options = {
		includePaths: [],
		implementation: nodesass,
		importer: globImporter(),

		outputStyle: 'expanded',
		sourceMap: true,
		sourceComments: true,

		...( grunt.option( 'compress' ) && {
			// outputStyle: 'compressed',
			// Can't use 'compressed' here.
			// Because exits with `Fatal error: argument `$color` of `darken($color, $amount)` must be a color`
			// for things like this `color-yiq( darken( color( #{ $_color } ), 5% ) );`.
			// But it work's with 'expanded' outputStyle.
			// It will be purged anyway if the `compress` flag is set.

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

