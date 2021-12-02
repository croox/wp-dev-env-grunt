// const { prompt } = require('enquirer');
// const chalk = require('chalk');
const getToken = require('../getToken');

const test_token = grunt => {
	grunt.registerTask( 'test_token', '', function() {
		const done = this.async();
        getToken( grunt ).then( token => {
			grunt.log.writeln( 'yeaaa klappt. Hier ist dein token: ' + token );
            done.apply()
        } ).catch( e => {
            grunt.log.writeln( 'test_token ....  what happend?' );
            grunt.log.writeln( e );
            done.apply()
        } );
	} );
};

module.exports = test_token;
