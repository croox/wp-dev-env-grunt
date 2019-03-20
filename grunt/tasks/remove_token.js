const removeToken = require('../removeToken');

const remove_token = ( grunt ) => {
	grunt.registerTask( 'remove_token', '', function() {
		const done = this.async();

		removeToken( grunt )
		.then( res => done.apply( res ) )
		.catch( e => {
			grunt.log.writeln( 'remove_token ....  what happend? Did you kill the process?' );
			grunt.log.writeln( e );
			done.apply( e );
		} );

	} );
};

module.exports = remove_token;