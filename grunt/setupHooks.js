const path = require('path');
const player = require('play-sound')();
const { debounce } = require('lodash');

const setupHooks = (grunt) => {
	let changed = [];

	const updateConfigJs = (changedFiles, ext) => {
		// Find entry files.
		let newEntry = [...changedFiles].reduce((acc, filepath) => {
			const filename =
				filepath.indexOf('/') === -1
					? path.basename(filepath, path.extname(filepath)) + '.' + ext
					: filepath.substring(0, filepath.indexOf('/')) + '.' + ext;
			if (grunt.file.exists(path.resolve('src/js/' + filename))) {
				return {
					...acc,
					[path.basename(filename, path.extname(filename))]: path.resolve(
						'/src/js/' + filename
					),
				};
			}

			return acc;
		}, {});
		newEntry = grunt.hooks.applyFilters('onWatchChangeJs.files', newEntry, { changedFiles });
		// Update config
		grunt.config('webpack.all.entry', newEntry);
	};

	const updateConfigScss = (changedFiles, ext, configKey) => {
		const config = grunt.config(configKey)[0];
		// Find entry files (~files in cwd root), and write them to our config object
		config.src = [];
		[...changedFiles].forEach((filepath) => {
			let files =
				filepath.indexOf('/') === -1
					? [path.basename(filepath, path.extname(filepath)) + '.' + ext]
					: [filepath.substring(0, filepath.indexOf('/')) + '.' + ext];

			files = grunt.hooks.applyFilters('onWatchChangeScss.files', files, {
				filepath,
				ext,
			});

			[...files].forEach((file) => {
				config.src.push(file);
				if (grunt.file.exists(config.cwd + '/' + file)) grunt.option('silent', false);
				else grunt.option('silent', true);
			});
		});

		// Update config
		grunt.config(configKey, [config]);
	};

	const onWatchChange = debounce(() => {
		// Js
		const changedJs = [...changed]
			.filter((changedFile) => ['.js', '.jsx'].includes(path.extname(changedFile)))
			.map((changedFile) => changedFile.replace('src/js/', ''));
		updateConfigJs(changedJs, 'js');

		// Scss
		const changedScss = [...changed]
			.filter((changedFile) => ['.scss'].includes(path.extname(changedFile)))
			.map((changedFile) => changedFile.replace('src/scss/', ''));
		updateConfigScss(changedScss, 'scss', 'sass.all.files');
		updateConfigScss(changedScss, 'min.css', 'css_purge.destination.files');

		changed = []; // Reset
	}, 200);

	grunt.event.on('watch', (action, filepath, _target) => {
		changed = [...changed, filepath];
		onWatchChange();
	});

	const sound = () =>
		grunt.option('sound') !== false || grunt.option('silent') !== true
			? player.play(grunt.config('sound.error.filepath'))
			: null;

	grunt.util.hooker.hook(grunt, 'warn', sound);
	grunt.util.hooker.hook(grunt.fail, 'warn', sound);
	grunt.util.hooker.hook(grunt.fail, 'error', sound);
	grunt.util.hooker.hook(grunt.log, 'fail', sound);
	grunt.util.hooker.hook(grunt.log, 'error', sound);
	grunt.util.hooker.hook(grunt.fail, 'fatal', sound);
};

module.exports = setupHooks;
