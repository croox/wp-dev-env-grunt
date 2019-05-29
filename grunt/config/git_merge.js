
const git_merge = grunt => {

	const config = grunt.hooks.applyFilters( 'config.git_merge', {

		current_release_branch: {
			commit: grunt.option( 'current_release_branch' ),
		}

	} );

	grunt.config( 'git_merge', config );

};
module.exports = git_merge;