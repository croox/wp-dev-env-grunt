const {
	mapValues,
	isString,
} = require('lodash');

const path = require('path');

const replacements = {

	get: grunt => {
		const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );
		repls = [];
		mapValues( {...pkg}, ( val, key ) => isString( val ) ? repls.push( {
			pattern: new RegExp( 'gwde_replace_' + key, 'g'),
			replacement: val.toString(),
		} ) : null );
		return repls;
	},

};


module.exports = replacements;