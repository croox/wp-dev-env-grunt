const {
	mapValues,
	isString,
	startCase,
	get,
} = require('lodash');

const path = require('path');

const replacements = {

	get: grunt => {
		const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );
		const composer = grunt.file.readJSON( path.resolve( 'composer.json' ) );
		const repls = [];
		mapValues( {...pkg}, ( val, key ) => isString( val ) ? repls.push( {
			pattern: new RegExp( 'wde_replace_' + key, 'g'),
			replacement: val.toString(),
		} ) : null );

		// add wde versions
		repls.push( {
			pattern: new RegExp( 'wde_replace_' + 'generator-wp-dev-env', 'g'),
			replacement: get( pkg, ['generator','version'], '' ),
		} );
		repls.push( {
			pattern: new RegExp( 'wde_replace_' + 'wp-dev-env-grunt', 'g'),
			replacement: get( get( pkg, ['devDependencies','wp-dev-env-grunt'], '' ).match( /(\d+\.)?(\d+\.)?(\*|\d+)/g ), [0], '' ),
		} );
		repls.push( {
			pattern: new RegExp( 'wde_replace_' + 'wp-dev-env-frame', 'g'),
			replacement: get( get( composer, ['require-dev','croox/wp-dev-env-frame'], '' ).match( /(\d+\.)?(\d+\.)?(\*|\d+)/g ), [0], '' ),
		} );

		return grunt.hooks.applyFilters( 'replacements.replacements', repls );
	},

};


module.exports = replacements;