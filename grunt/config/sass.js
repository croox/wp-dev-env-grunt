const path = require('path');

const sass = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	const options = {
		// // require: [
		// // 	// 'susy',
		// // 	// 'breakpoint'
		// // ],
		// loadPath: [
		// 	// require('node-bourbon').includePaths,
		// 	// 'node_modules/bootstrap-sass/assets/stylesheets',
		// 	// 'node_modules/backgrid/src'
		// 	// 'node_modules/hamburgers/_sass',
		// ]

		sourcemap: 'auto',
		style: 'expanded',
		lineNumbers: true,

		...( grunt.option( 'compress' ) && {
			sourcemap: 'none',
			style: 'compressed',
			lineNumbers: false,
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

