
const path = require('path');

const build = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	grunt.registerTask( 'build', 'build the ' + pkg.projectType + ' into ./test_build', function() {

		const tasks = grunt.hooks.applyFilters( 'tasks.build.tasks', [] );

		grunt.task.run( tasks );
	});
};

module.exports = build;
