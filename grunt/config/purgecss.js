const purgecssWordpress = require( 'purgecss-with-wordpress' );


const purgecss = grunt => {

	const config = grunt.hooks.applyFilters( 'config.purgecss', {
		destination: {

            options: {
                content: [
                    // php
                    './src/templates/**/*',
                    './src/template_parts/**/*',
                    './src/woocommerce/**/*',
                    // js jsx
                    './src/js/**/*',
                ],

				safelist: [
					...purgecssWordpress.safelist,
					// 'red',
					// 'blue',
				],
				safelistPatterns: [
					...purgecssWordpress.safelistPatterns,
					// /^red/,
					// /blue$/,
				],

				// ??? TODO !!!


            },

			files: [ {
				expand: true,
				cwd: grunt.option( 'destination' ) + '/css',
				src: [
					'**/*.css',
				],
				dest: grunt.option( 'destination' ) + '/css',
			} ],

		},
	} );

	grunt.config( 'purgecss', config );

};

module.exports = purgecss;
