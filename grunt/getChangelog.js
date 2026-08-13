const path = require('path');
const chalk = require('chalk');
const { get } = require('lodash');

const { parser, Changelog } = require('keep-a-changelog');

// Return parsed changelog
// maybe init CHANGELOG.md
const getChangelog = (grunt, pkg) => {
	pkg = pkg ? pkg : grunt.file.readJSON(path.resolve('package.json'));

	const fileName = 'CHANGELOG.md';

	let changelog;
	try {
		changelog = parser(grunt.file.read(fileName, 'UTF-8'));
	} catch (err) {
		if (get(err, ['origError', 'code']) === 'ENOENT') {
			// File not existing. initialize it
			changelog = new Changelog(pkg.displayName);
			grunt.file.write(fileName, changelog.toString());
		} else {
			// Other error, may be parsing. show error and exit
			grunt.log.writeln('');
			grunt.log.error(chalk.red.bold("Can't read/parse " + fileName));
			grunt.log.writeln('');
			grunt.log.writeln('Error message:');
			grunt.log.writeln('');
			grunt.log.writeln(err);
			grunt.log.writeln('');
			grunt.fail.fatal(' ');
		}
	}

	return changelog;
};

module.exports = getChangelog;
