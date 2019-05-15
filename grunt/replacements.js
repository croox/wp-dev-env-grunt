const {
	mapValues,
	isString,
	startCase,
} = require('lodash');

const path = require('path');

const replacements = {

	get: grunt => {
		const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );
		const repls = [];
		mapValues( {...pkg}, ( val, key ) => isString( val ) ? repls.push( {
			pattern: new RegExp( 'wde_replace_' + key, 'g'),
			replacement: val.toString(),
		} ) : null );

		return grunt.hooks.applyFilters( 'replacements.replacements', repls );
	},

};


module.exports = replacements;