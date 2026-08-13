const chalk = require('chalk');
const { spawnSync } = require('child_process');
const getRepoHost = require('./getRepoHost');

const setToken = (grunt) =>
	new Promise((resolve) => {
		const repoHost = getRepoHost(grunt);

		if (!repoHost) {
			grunt.log.writeln(
				'Repository not hosted on ' + ['GitHub', 'Bitbucket', 'GitLab', 'Gitea'].join('||')
			);
			resolve(false);
			return;
		}

		grunt.log.writeln('');

		const gh = spawnSync('gh', ['auth', 'token'], { encoding: 'utf8' });
		if (!gh.error && gh.status === 0 && gh.stdout) {
			grunt.log.writeln('Token is available via the ' + chalk.underline('gh') + ' CLI.');
			resolve(true);
			return;
		}

		grunt.log.writeln(
			'The GitHub token is managed by the ' + chalk.underline('gh') + ' CLI now.'
		);
		grunt.log.writeln('	run ' + chalk.yellow('gh auth login') + ' to authenticate.');
		grunt.log.writeln('	or export ' + chalk.yellow('GITHUB_TOKEN') + ' to use an env token.');
		resolve(false);
	});

module.exports = setToken;
