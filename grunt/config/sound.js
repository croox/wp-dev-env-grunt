
const sound = grunt => {

	grunt.config( 'sound', {

		blob: {
			filepath: './grunt/sounds/Mouth_Special_00.mp3',
		},

		bling: {
			filepath: './grunt/sounds/sfx_sounds_fanfare3.mp3',
		},

		fanfare: {
			filepath: './grunt/sounds/round_end.mp3',
		},

		error: {
			filepath: './grunt/sounds/sfx_sounds_falling2.mp3',
		},

	} );

};

module.exports = sound;