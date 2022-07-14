const purgecssWordpress = require( 'purgecss-with-wordpress' );

/**
 * Fix purgecssWordpress
 * strings and regex patterns should be separated, and not all inside safeList.
 */
const purgecssWordpressFixed = [...purgecssWordpress.safelist].reduce( ( acc, entry ) => {
    switch( typeof entry ) {
        case 'string':
            return {
                ...acc,
                safelist: [
                    ...acc.safelist,
                    entry,
                ],
            };
            break;
        case 'object':
            return {
                ...acc,
                safelistPatterns: [
                    ...acc.safelistPatterns,
                    entry,
                ],
            };
            break;
        default:
            return acc;
    }
}, {
    safelist: [],
    safelistPatterns: [],
} );

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
					...purgecssWordpressFixed.safelist,
					// 'red',
					// 'blue',
				],
				safelistPatterns: [
					...purgecssWordpressFixed.safelistPatterns,
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
