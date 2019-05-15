
const path = require('path');
const getRepoHost = require('../getRepoHost');
const {
	capitalize,
	get,
} = require('lodash');

const concat = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	const repoHostName = get( getRepoHost( grunt ), ['name'] );
	const githubUploaderTag = repoHostName ? repoHostName + ' ' + capitalize( pkg.projectType ) + ' URI' : '';

	const commonConfig = {

		readme: {
			options: {
				banner: [
					'=== ' + pkg.displayName + ' ===',
					'Tags: ' + pkg.tags,
					'Donate link: ' + pkg.donateLink,
					'Contributors: ' + pkg.contributors,
					'Tested up to: ' + pkg.wpVersionTested,
					'Requires at least: ' + pkg.wpRequiresAtLeast,
					'Requires PHP: ' + pkg.phpRequiresAtLeast,
					'Stable tag: trunk',
					'License: ' + pkg.license,
					'License URI: ' + pkg.licenseUri,
					'',
					pkg.description,
					'',
					'',
					'',
				].join( '\n' ),
				footer: [
					'',
					'',
					grunt.option( 'changelog' ).toString(),
				].join( '\n' ),
			},
			src: [
				'src/readme.txt',
			],
		},

		...( 'plugin' === pkg.projectType && {
			plugin_main_file: {
				options: {
					banner: [
						'<?php',
						'/*',
						'	Plugin Name: ' + pkg.displayName,
						'	Plugin URI: ' + pkg.uri,
						'	Description: ' + pkg.description,
						'	Version: ' + pkg.version,
						'	Author: ' + pkg.author,
						'	Author URI: ' + pkg.authorUri,
						'	License: ' + pkg.license,
						'	License URI: ' + pkg.licenseUri,
						'	Text Domain: ' + pkg.textDomain,
						'	Domain Path: ' + pkg.domainPath,
						'	Tags: ' + pkg.tags,
						...(  githubUploaderTag.length > 0 ? [
							'	' + githubUploaderTag + ': ' + pkg.repositoryUri,
							'	Release Asset: true',
						] : [] ),
						'*/',
						'?>',
					].join( '\n' ),
				},
			},
		} ),

		...( 'theme' === pkg.projectType && {
			style: {
				options: {
					banner: [
						'/*	',
						'	Theme Name: ' + pkg.displayName,
						'	Theme URI: ' + pkg.uri,
						...( pkg.template ? ['	Template: ' + pkg.template] : [] ),
						'	Description: ' + pkg.description,
						'	Version: ' + pkg.version,
						'	Author: ' + pkg.author,
						'	Author URI: ' + pkg.authorUri,
						'	License: ' + pkg.license,
						'	License URI: ' + pkg.licenseUri,
						'	Text Domain: ' + pkg.textDomain,
						'	Domain Path: /languages',
						'	Tags: ' + pkg.tags,
						...(  githubUploaderTag.length > 0 ? [
							'	' + githubUploaderTag + ': ' + pkg.repositoryUri,
							'	Release Asset: true',
						] : [] ),
						'',
						'*/',
						'',
						'/*',
						'This file is just used to identify the theme in WordPress.',
						'The compiled CSS output can be found in /css/' + pkg.funcPrefix + '_frontend.min.css',
						'*/',
						'',
					].join( '\n' ),
				},
			},
		} ),

	};


	const config = grunt.hooks.applyFilters( 'config.concat', {

		readme: {
			...commonConfig.readme,
			dest: grunt.option( 'destination' ) + '/readme.txt',
		},

		readmeMd: {
			...commonConfig.readme,
			dest: grunt.option( 'destination' ) + '/README.md',
		},

		...( 'plugin' === pkg.projectType && {
			plugin_main_file: {
				...commonConfig.plugin_main_file,
				src: grunt.option( 'destination' ) + '/' + pkg.name + '.php',
				dest: grunt.option( 'destination' ) + '/' + pkg.name + '.php',
			},
			dummy_plugin_file: {
				...commonConfig.plugin_main_file,
				src: pkg.name + '.php',
				dest: pkg.name + '.php',
			},
		} ),

		...( 'theme' === pkg.projectType && {
			style: {
				...commonConfig.style,
				src: grunt.option( 'destination' ) + '/style.css',
				dest: grunt.option( 'destination' ) + '/style.css'
			},
			dummy_theme_style: {
				...commonConfig.style,
				src: 'style.css',
				dest: 'style.css'
			},
		} ),

	}, commonConfig );

	grunt.config( 'concat', config );

}

module.exports = concat;