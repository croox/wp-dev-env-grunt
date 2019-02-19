
const create_autoloader = grunt => {

	grunt.config( 'create_autoloader', {

		// creates autoloaders for all direct sub dirs of src/inc. into src/inc
		inc: {},

	} );

};
module.exports = create_autoloader;