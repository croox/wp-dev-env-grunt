const chalk = require('chalk');

const removeToken = (grunt) =>
	new Promise((resolve) => {
		grunt.log.writeln('');
		grunt.log.writeln(
			'The GitHub token is managed by the ' + chalk.underline('gh') + ' CLI now.'
		);
		grunt.log.writeln('	run ' + chalk.yellow('gh auth logout') + ' to remove the token.');
		grunt.log.writeln('	or unset ' + chalk.yellow('GITHUB_TOKEN') + ' if an env token is used.');
		resolve(true);
	});

module.exports = removeToken;
