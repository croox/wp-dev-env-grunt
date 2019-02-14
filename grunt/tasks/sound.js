const player = require('play-sound')();

const sound = grunt => {
	grunt.registerMultiTask( 'sound', 'sound task', function(){

		if ( grunt.option( 'sound' ) === false || grunt.option( 'silent' ) === true ) {
			grunt.option( 'silent', false );
			return;
		}

		player.play( this.data.filepath );

	} );

};

module.exports = sound;
