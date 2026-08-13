const path = require('path');
const toHex = require('colornames');

const css_properties = (grunt) => {
	const pkg = grunt.file.readJSON(path.resolve('package.json'));

	grunt.registerTask('css_properties', 'sub task: used by build', () => {
		const cwd = grunt.option('destination') + '/css';

		const files = grunt.file.expand(
			{
				expand: true,
				cwd,
			},
			['*.css', ...grunt.option('pattern').exclude]
		);

		const properties = {};

		[...files].forEach((file) => {
			const propertiesCss = grunt.file
				.read(path.resolve(cwd, file))
				.match(/:root\s*{([\s\S]*?)}/g);
			if (!propertiesCss || propertiesCss.length !== 1) return;

			const basename = path.basename(file, '.min.css');
			properties[basename] = {};

			propertiesCss[0]
				.replace(/([^;])}$/g, '$1;}') // Add last missing semicolon, for compressed css.
				.match(/--([a-z0-1-]*?):\s*?([\s\S]+?)(?=;)/g) // Match all properties
				.map((a) => a.replace(/^--/g, '').split(/:\s*?/))
				.forEach((a) => {
					properties[basename][a[0].trim()] = a[1].trim();
				});
		});

		if (Object.keys(properties).length === 0) return;

		const fileName = path.join(
			grunt.option('destination'),
			'inc',
			pkg.funcPrefix + '_include_css_properties.php'
		);

		const fileContent = [
			'<?php',
			'',
			'// If this file is called directly, abort.',
			"if ( ! defined( 'WPINC' ) ) {",
			'	die;',
			'}',
			'',
			'use croox\\wde\\utils\\Arr;',
			'',
			'function ' + pkg.funcPrefix + '_get_css_property( $key = null, $filename = null ) {',
			'	if ( null === $key )',
			'		return;',
			"	$filename = null === $filename ? '" + pkg.funcPrefix + "_frontend' : $filename;",
			'	return Arr::get( array(',
			...[...Object.keys(properties)].map((file) => {
				const inner = [...Object.keys(properties[file])]
					.map((key) => {
						let hex = toHex(properties[file][key]);
						hex = hex === undefined || hex === null ? properties[file][key] : hex;
						return "			'" + key + "' => '" + hex + "',";
					})
					.join('\n');
				return "		'" + file + "' => array( \n" + inner + ' \n		),';
			}),
			'	), array( $filename, $key ) );',
			'}',
			'',
		].join('\n');

		grunt.file.write(fileName, fileContent);
	});
};

module.exports = css_properties;
