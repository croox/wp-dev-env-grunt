const purgecssWordpress = require( 'purgecss-with-wordpress' );

const purgecss = grunt => {

    const filesGlob = grunt.hooks.applyFilters( 'config.purgecss.filesGlob', {
        expand: true,
        cwd: grunt.option( 'destination' ) + '/css',
        src: [
            '**/*.css',     // Include all css files.
			'!**/*editor*', // Skip all files containing *editor*.
			'!**/*admin*',  // Skip all files containing *admin*.
        ],
        dest: grunt.option( 'destination' ) + '/css',
    } );

	const config = grunt.hooks.applyFilters( 'config.purgecss', {
		destination: {

            options: {
                content: [
                    // php
                    './src/templates/**/*.php',
                    './src/template_parts/**/*.php',
                    './src/woocommerce/**/*.php',
                    './src/inc/fun/**/*.php',
                    './src/inc/template_functions/**/*.php',
                    './src/inc/template_tags/**/*.php',

                    './vendor/croox/**/*.php',
                    './vendor/jhotadhari/**/*.php',
                    './vendor/daggerhart/wp-custom-menu-items/**/*.php',

                    // js jsx
                    './src/js/**/*.js',
                    './src/js/**/*.jsx',

                    // website html snapshots
                    './src/html_snapshots/**/*.html',
                ],

				safelist: [
					...purgecssWordpress.safelist,
				],

            },

			files: [
                filesGlob
            ],

		},
	} );

	grunt.config( 'purgecss', config );

};

module.exports = purgecss;
