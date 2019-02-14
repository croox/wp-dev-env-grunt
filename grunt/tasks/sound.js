const player = require('play-sound')();


const path = require('path');

const sound = grunt => {

	grunt.registerTask( 'sound', 'sub task to notify tralala', function( key ){

		if ( grunt.option( 'sound' ) === false || grunt.option( 'silent' ) === true ) {
			grunt.option( 'silent', false );
			return;
		}

		let file;
		switch( key ) {

			case 'blob':
				file = 'Mouth_Special_00.mp3';
				break;

			case 'bling':
				file = 'sfx_sounds_fanfare3.mp3';
				break;

			case 'fanfare':
				file = 'round_end.mp3';
				break;

			case 'error':
				file = 'sfx_sounds_falling2.mp3';
				break;

		}

		const soundsPath = path.resolve( 'node_modules/wp-dev-env-grunt/grunt/sounds' );
		player.play( path.join( soundsPath, file ) );

	} );

};

module.exports = sound;
