const path = require('path');
const wpPot = require('wp-pot');

const pot = (grunt) => {
	grunt.registerTask('pot', 'generate pot files from php sources', () => {
		const pkg = grunt.file.readJSON(path.resolve('package.json'));
		const destFile =
			'src/languages/' +
			(pkg.projectType === 'plugin' ? pkg.textDomain + '-' : '') +
			'LOCALE.pot';
		const result = wpPot({
			destFile,
			domain: pkg.textDomain,
			package: pkg.name,
			src: ['src/**/*.php', ...grunt.option('pattern').exclude],
		});
		if (result) {
			grunt.log.writeln('File "' + destFile + '" created.');
		}
	});
};

module.exports = pot;
