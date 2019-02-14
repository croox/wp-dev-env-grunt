
const path = require('path');

const updateConfigs = grunt => {

	const cwd = path.resolve( 'node_modules/wp-dev-env-grunt/grunt/config' );

	const configs = grunt.file.expand( cwd + '/**/*.js' );

    [...configs].map( filePath => {
		require( filePath )( grunt );
    } );
};

module.exports = updateConfigs;