const { prompt } = require('enquirer');
const chalk = require('chalk');
const path = require('path');
const getRepoInfo = require('../getRepoInfo');
const getToken = require('../getToken');
const axios = require('axios');
const ghReleaseAssets = require('gh-release-assets');
const {
	get,
	isString,
} = require('lodash');



const getRepoHost = require('../getRepoHost');
const consts = require('../consts');

const create_release = grunt => {

	grunt.registerTask( 'create_release', 'sub task: used by askpush', function() {

		const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );
		const repoInfo = getRepoInfo( grunt );
		const repoHostName = get( getRepoHost( grunt ), ['name'] );

		const done = this.async();

		const skipTask = () => {
			grunt.log.writeln( '' );
			grunt.log.writeln( chalk.red( 'Skipped create_release' ) );
			done.apply();
		};

		const setTokenFirst = message => {
			grunt.log.writeln( '' );
			new Promise( ( resolve, reject ) => prompt( [
				{
					type: 'select',
					name: 'shouldSetToken',
					message: message,
					choices: [
						{
							name: 'setToken',
							message: 'set token',
						},
						{
							name: 'skipTask',
							message: 'skip task',
						},
					],

			} ] ).then( answers => {

				switch( answers.shouldSetToken ) {
					case 'setToken':
						grunt.task.run( [
							'set_token',
							'create_release',
						] );
						done.apply();
						break;
					case 'skipTask':
						skipTask();
						break;
				}
			} ).catch( e => {
				grunt.log.writeln( 'create_release ... shouldSetToken ....  what happend? Did you kill the process?' );
				grunt.log.writeln( e );
				reject( done.apply() );
			} ) );
		};

		const createRelease = token => {

			axios( {
				url: [
					'https://api.github.com',
					'repos',
					repoInfo.owner,
					repoInfo.name,
					'releases'
				].join( '/' ),
				headers: {
					'User-Agent': pkg.name,
					Authorization: ('token ' + token),
				},
				method: 'post',
				data: {
					...grunt.option( 'release' ),
					tag_name: pkg.version,
				},
			} )
			.then( parsedBody => {
				[
					 chalk.green( 'Successfully created release ' ) + chalk.cyan( parsedBody.data.id ) + ' ' + chalk.yellow( parsedBody.data.name ),
					 parsedBody.data.html_url,
				].map( string => grunt.log.writeln( string ) );

				const fileName = repoInfo.name + '-' + pkg.version + '.zip';

				ghReleaseAssets( {
					url: parsedBody.data.upload_url,
					token: [token],
					assets: [
						{
							name: fileName,
							path: path.resolve( 'releases/' + fileName ),
						},
					]
				}, ( err, assets ) => {
					if ( err ) {
						grunt.log.writeln( 'uploadReleaseAsset ....  what happend? Did you kill the process?' );
						grunt.log.writeln( err );
						done.apply();
					}

					[...assets].map( asset => grunt.log.writeln( chalk.green( 'Successfully uploaded release asset ' ) + chalk.cyan( asset ) ) );

					done.apply();
				} )

			} )
			.catch( e => {
				if ( 401 === e.response.status ) {
					setTokenFirst(
						chalk.red( '401 Bad credentials ' ) +
						'Token for ' + chalk.yellow( repoHostName ) + ' is wrong!'
					);
				} else {
					grunt.log.writeln( 'create_release ....  what happend? Did you kill the process?' );
					grunt.log.writeln( e );
					done.apply();
				}
			} );
		};


		if ( consts.supportedHosts.includes( repoHostName ) ) {

			getToken( grunt ).then( token => {
				if ( token && isString( token ) ) {

					axios(  {
						url: [
							'https://api.github.com',
							'repos',
							repoInfo.owner,
							repoInfo.name,
							'releases',
							'tags',
							pkg.version,
						].join( '/' ),
						headers: {
							'User-Agent': pkg.name,
							Authorization: ('token ' + token),
						},
						method: 'get',
					} ).then( res => {
						grunt.log.writeln( '' );
						grunt.log.writeln( chalk.yellow( 'Release is already existing' ) );
						grunt.log.writeln( res.html_url );
						skipTask();
					} ).catch( e => {
						if ( 404 == e.response.status ) {
							createRelease( token );
						} else {
							grunt.log.writeln( 'Something went wrong. Not able to create release.' );
							grunt.log.writeln( 'Status code:', e.response.status );
							grunt.log.writeln( 'Error:', e.response.data );
							skipTask();
						}
					} );

				} else {
					setTokenFirst( 'No token is set for ' + chalk.yellow( repoHostName ) );
				}
			} );

		} else {
			grunt.log.writeln( '' );
			grunt.log.writeln( chalk.yellow( 'Currently automatic creation of releases are only supported, if repository is hosted on: ' + consts.supportedHosts.join( '||' ) ) );
			skipTask();
		}

	} );
};

module.exports = create_release;
