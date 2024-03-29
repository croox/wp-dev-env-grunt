const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const path = require('path');
const glob = require('glob');

const webpackConfig = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	const babelOptions = {
		plugins: [
			[
				path.resolve( 'node_modules/@emotion/babel-plugin' ), {}
			],
			[
				path.resolve( 'node_modules/babel-plugin-inline-json-import' ), {}
			],
		],
		presets: [
			path.resolve( 'node_modules/@babel/preset-env' ),
			path.resolve( 'node_modules/@wordpress/babel-preset-default' ),
		],
	};

	const config = grunt.hooks.applyFilters( 'config.webpack', {
		options: {
			stats: {
				errorDetails: true,
			},
		},
		all: {
			mode: grunt.option( 'compress' ) ? 'production' : 'development',
			entry: glob.sync(
				path.resolve() + '/src/js/*.js?(x)'
			).reduce( ( acc, filename ) => ( {
				...acc,
				[path.basename( filename, path.extname( filename ) )]: path.resolve( filename ),
			} ), {} ),
			output: {
				path: path.resolve( grunt.option( 'destination' ) + '/js' ),
				filename: '[name].min.js',
			},
			externals: {
				...( pkg['shim'] ? pkg['shim'] : {} ),
			},
			plugins: [
				new webpack.DefinePlugin( {
					'process.env.NODE_ENV': JSON.stringify( grunt.option( 'compress' ) ? 'production' : 'development' ),
				} ),
				new ESLintPlugin( {
					overrideConfig: {
						parser: '@babel/eslint-parser',
						parserOptions: {
							ecmaVersion: 'latest',
							sourceType: 'module',
							requireConfigFile: false,
							ecmaFeatures: {
								jsx: true,
								experimentalObjectRestSpread: true,
							},
							babelOptions,
						},
					},
					extensions: ['js','jsx'],
					useEslintrc: false,
				} ),
			],
			module: {
				rules: [
					{
						test: /\.m?jsx?$/,
						exclude: /node_modules/,
						use: {
							loader: path.resolve( 'node_modules/babel-loader' ),
							options: {
								...babelOptions,
								plugins: [
									...babelOptions.plugins,
									[
										path.resolve( 'node_modules/@wordpress/babel-plugin-makepot' ), {
											output: path.resolve( 'src/languages/' + pkg.funcPrefix + '-LOCALE-handle.pot' )
										}
									],
								],
							},
						},
					},
					{
						test: /\.css$/i,
						use: ['style-loader', 'css-loader'],
					},
				],
			},
		},
	} );

	grunt.config( 'webpack', config );
};

module.exports = webpackConfig;
