const path = require('path');
const chalk = require('chalk');
const childProcess = require('child_process');

const phpCsCbfWrapper = ( grunt, bin, extensions ) => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	const options = [
		'--standard=WordPress',
		'--extensions=' + extensions,
		'--runtime-set testVersion ' + pkg.phpRequiresAtLeast,
		...( 'phpcbf' === bin ? ['-p', '-v'] : [] ),
	].join( ' ' );

	const command = path.resolve( './vendor/squizlabs/php_codesniffer/bin/' + bin ) + ' ' + path.resolve( './src' ) + ' ' + options;

	return new Promise( ( resolve, reject ) => {

		const child = childProcess.spawn( command, {
			shell: true,
		} );

		child.stdout.on( 'data', data => {
			grunt.log.write( data );
		});

		child.stderr.on( 'data', data => {
			grunt.log.write( chalk.yellow( 'stderr: ' + data ) );
		});

		child.on('close', code => {
			resolve( code );
		});

	} );

};


const phpcs = grunt => {

	grunt.registerTask( 'phpcs', '', function( script, extensions ) {

		let bin = '';
		switch( script ) {
			case 'format':
			case 'phpcbf':
				bin = 'phpcbf';
				break;
			case 'lint':
			case 'phpcs':
				bin = 'phpcs';
				break;
			default:
				bin = 'phpcs';
		}

		extensions = extensions ? extensions : 'php';

		const done = this.async();

		phpCsCbfWrapper( grunt, bin, extensions ).then( code => done( true ) );

	} );
};

module.exports = phpcs;
