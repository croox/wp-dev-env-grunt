const chalk = require('chalk');
const { spawnSync } = require('child_process');
const { prompt } = require('enquirer');

const getToken = (grunt) =>
	new Promise((resolve) => {
		const envToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
		if (envToken) {
			resolve(envToken);
			return;
		}

		// Try the gh CLI
		const gh = spawnSync('gh', ['auth', 'token'], { encoding: 'utf8' });
		if (!gh.error && gh.status === 0 && gh.stdout) {
			resolve(gh.stdout.trim());
			return;
		}

		// Fallback: type in token
		grunt.log.writeln("Couldn't load token from GITHUB_TOKEN env or gh CLI.");
		prompt([
			{
				type: 'password',
				name: 'tokenAlt',
				message: chalk.yellow('Token'),
			},
		])
			.then(({ tokenAlt }) => {
				resolve(tokenAlt);
			})
			.catch(() => {
				resolve(false); // Dont'reject
			});
	});

module.exports = getToken;
