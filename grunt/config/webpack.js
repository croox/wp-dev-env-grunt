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

	// Entry files.
	const entry = glob.sync(
		path.resolve() + '/src/js/*.js?(x)'
	).reduce( ( acc, filename ) => ( {
		...acc,
		[path.basename( filename, path.extname( filename ) )]: path.resolve( filename ),
	} ), {} );

	// webpack rules
	const rules = {
		js: {
			test: /\.m?jsx?$/,
			exclude: /node_modules/,
			use: {
				loader: path.resolve( 'node_modules/babel-loader' ),
				options: babelOptions,
			},
		},
		css: {
			test: /\.css$/i,
			use: ['style-loader', 'css-loader'],
		}
	}


	const configBase = {
		mode: grunt.option( 'compress' ) ? 'production' : 'development',
		entry,
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
				rules.css,
				rules.js,
			],
		},
	};

	let config = {
		options: {
			stats: {
				errorDetails: true,
			},
		},
		all: configBase,
	};

	// Add config for each js entry file.
	Object.keys( entry ).map( key => {

		config[key] = {
			...configBase,
			entry: {
				[key]: entry[key],
			},
		};

		const rulesJs = {...rules.js};
		rulesJs.use.options.plugins = [
			...rulesJs.use.options.plugins,
			[
				path.resolve( 'node_modules/@wordpress/babel-plugin-makepot' ),
				{
					output: path.resolve( 'src/languages/' + pkg.funcPrefix + '-LOCALE-' + key + '.pot' ),
					test: 'hallo,',
					key
				},
				'babel-plugin-makepot' + '-' + key,
			],
		];

		config[key].module.rules = [
			rules.css,
			rulesJs,
		];

	} );

	config = grunt.hooks.applyFilters( 'config.webpack', config );

	grunt.config( 'webpack', config );

	Object.keys( entry ).map( key => {
		grunt.hooks.addFilter( 'tasks.build.tasks', 'tasks.build.tasks.webpack.addTasksToBuild.' + key, tasks => {
			return [
				...tasks,
				'webpack:' + key,
			];
		}, 40 );
	} );

};

module.exports = webpackConfig;
