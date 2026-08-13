const create_autoloader = (grunt) => {
	const config = grunt.hooks.applyFilters('config.create_autoloader', {
		// Creates autoloaders for all direct sub dirs of src/inc. into src/inc
		inc: {},
	});

	grunt.config('create_autoloader', config);
};

module.exports = create_autoloader;
