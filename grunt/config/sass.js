
const sass = grunt => {

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

	grunt.config( 'sass', {
		options: options,

		// plugin only
		all: {
			files: [{
				expand: true,
				cwd: 'src/sass',
				src: [
					'*.scss',
				],
				dest: grunt.option( 'destination' ) + '/css',
				ext: '.min.css'
			}],
		},

		// theme only
		other: {
			files: [{
				expand: true,
				cwd: 'src/sass',
				src: [
					'*.scss',
					'!style.scss',
				],
				dest: grunt.option( 'destination' ) + '/css',
				ext: '.min.css'
			}],
		},

		// theme only
		main: {
			files: {
				[grunt.option( 'destination' ) + '/style.css']: 'src/sass/style.scss',
			},
		},

	} );

};

module.exports = sass;

