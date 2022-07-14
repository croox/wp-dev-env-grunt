
const make_html_snapshots = grunt => {

	const config = grunt.hooks.applyFilters( 'config.make_html_snapshots', {
        paths: [
            '/',
        ]
	} );

	grunt.config( 'make_html_snapshots', config );

};
module.exports = make_html_snapshots;