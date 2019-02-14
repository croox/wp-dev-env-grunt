const {
	mapValues,
	isString,
	startCase,
} = require('lodash');

const path = require('path');

const replacements = {

	get: grunt => {
		const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );
		repls = [
		{
			pattern: new RegExp( 'wde_replace_Project_Class', 'g'),
			replacement: startCase( pkg.funcPrefix ) + '_' + startCase( pkg.name ).replace( / /g, '_' ),
		}
		];
		mapValues( {...pkg}, ( val, key ) => isString( val ) ? repls.push( {
			pattern: new RegExp( 'wde_replace_' + key, 'g'),
			replacement: val.toString(),
		} ) : null );



		return repls;
	},

};


module.exports = replacements;