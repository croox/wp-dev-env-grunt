const chalk = require('chalk');
const path = require('path');
const getRepoHost = require('../getRepoHost');
const consts = require('../consts');

const defaultTask = (grunt) => {
	const pkg = grunt.file.readJSON(path.resolve('package.json'));

	grunt.registerTask('default', 'entry point, tasks overview', () => {
		// ??? todo: some ui to choose task

		const repoHost = getRepoHost(grunt);

		[
			'',
			chalk.cyan.bold('Available tasks:'),
			'',
			'',
			chalk.yellow.bold('Development:'),
			'',
			chalk.yellow('grunt build'),
			'	to build this ' + pkg.projectType + ' into  ' + chalk.italic('./test_build') + '.',
			'',
			chalk.yellow('grunt sync[:...destinations][:...version]'),
			'	Syncs the ' + pkg.projectType + ' to a destination specified in wde_wp_installs.json.',
			'	' +
				chalk.gray('...destinations') +
				'		' +
				chalk.gray.italic('Comma separated list of destinations.'),
			'	' +
				chalk.gray('...version') +
				'		' +
				chalk.gray.italic('Sync source, string: "test_build"||"trunk"||"semVersion".'),
			'	' + chalk.red.bold('Deletes') + ' files on destination, if not present in source!',
			'',
			chalk.yellow('grunt watch'),
			'	Build into ./test_build whenever source files change.',
			'',
			chalk.yellow('grunt watch_sync[:...destinations]') +
				' or ' +
				chalk.yellow('ws[:...destinations]'),
			'	Combination of ' + chalk.italic('watch') + ' and ' + chalk.italic('sync') + '.',
			'	Build into ' +
				chalk.italic('./test_build') +
				' whenever source files change and sync to a destination.',
			'	' +
				chalk.gray('...destinations') +
				'		' +
				chalk.gray.italic('Comma separated list of destinations.'),
			'',
			'',
			chalk.yellow.bold('Distribution:'),
			'',
			chalk.yellow('grunt addchange'),
			'	To record a change.',
			'	Changes are used to generate the CHANGELOG.md and commit/tag messages on dist' +
				chalk.gray('ribution') +
				'.',
			'',
			chalk.yellow('grunt dist'),
			'	Bumps the ' +
				pkg.projectType +
				' version and builds into ' +
				chalk.italic('./test_build') +
				'.',
			'	... ??? and lot more stuff',
			'',
			...(consts.supportedHosts.includes(repoHost.name)
				? [
						'',
						chalk.yellow.bold('Manage Tokens:'),
						'Tokens are managed by the ' +
							chalk.underline('gh') +
							' CLI (or the GITHUB_TOKEN env).',
						'See https://cli.github.com',
						'',
						chalk.yellow('grunt set_token'),
						'	Check the GitHub token',
						'',
						chalk.yellow('grunt remove_token'),
						'	Hint how to remove the GitHub token',
						'',
					]
				: []),
		].map((str) => grunt.log.writeln(str));
	});
};

module.exports = defaultTask;
