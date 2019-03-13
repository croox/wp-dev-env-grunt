
const path = require('path');

const updateConfigs = grunt => {

	grunt.hooks.doAction( 'updateConfigs.before' );

	const cwd = path.resolve( 'node_modules/wp-dev-env-grunt/grunt/config' );

	const configs = grunt.file.expand( cwd + '/**/*.js' );

    [...configs].map( filePath => {
		require( filePath )( grunt );
    } );

    grunt.hooks.doAction( 'updateConfigs.after' );
};

module.exports = updateConfigs;