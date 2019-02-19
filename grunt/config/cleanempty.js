
const cleanempty = grunt => {

	grunt.config( 'cleanempty', {
		options: {
			files: false,
			folders: true,
		},
		destination: {
			src: [
				grunt.option( 'destination' ) + '/**/',
			],
		},

	} );

};

module.exports = cleanempty;
