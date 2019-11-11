
const css_purge = grunt => {

	const config = grunt.hooks.applyFilters( 'config.css_purge', {
		destination: {
			files: [{
				expand: true,
				cwd: grunt.option( 'destination' ) + '/css',
				src: [
					'**/*.css',
				],
				dest: grunt.option( 'destination' ) + '/css',
			}],
			// css-purge - Config Options - http://rbtech.github.io/css-purge/#getStarted -> Config Options #headerConfig
			options: {
				// A “master switch” to turn on all the shorten options.
				// - Only when its off can you turn on or off the other shorten options.
				"shorten": false,
				"shorten_zero": true,
				"shorten_hexcolor": true,
				"shorten_hexcolor_extended_names": true,
				"shorten_hexcolor_UPPERCASE": true,
				"shorten_font": true,
				"shorten_background": true,
				"shorten_background_min": 2,
				"shorten_margin": true,
				"shorten_padding": true,
				"shorten_list_style": true,
				"shorten_outline": true,
				"shorten_border": false,		// Groups as many border properties into the shortened version.
				"shorten_border_top": false,	// Groups as many border-top properties into the shortened version.
				"shorten_border_right": false,	// Groups as many border-right properties into the shortened version.
				"shorten_border_bottom": false,	// Groups as many border-bottom properties into the shortened version.
				"shorten_border_left": false,	// Groups as many border-left properties into the shortened version.
				"shorten_border_radius": false,	// Groups as many border-radius properties into the shortened version.
			},
		},
	} );

	grunt.config( 'css_purge', config );

};

module.exports = css_purge;
