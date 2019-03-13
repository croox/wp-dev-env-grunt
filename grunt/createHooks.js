'use strict';

const createWpHooks  = require('@wordpress/hooks').createHooks;

const createHooks = grunt => {
	grunt.hooks = createWpHooks();
};

module.exports = createHooks;

