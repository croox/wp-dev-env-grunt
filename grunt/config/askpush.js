
const askpush = grunt => {

	const config = grunt.hooks.applyFilters( 'config.askpush', {

		push: {},
		withRelease: {},

	} );

	grunt.config( 'askpush', config );

};
module.exports = askpush;