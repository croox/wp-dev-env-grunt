??? sorry README.md still missing

Grunt environment for WordPress Plugins/Themes/Childthemes generated with generator-wp-dev-env

Can't be used as an ordinary grunt plugin. Only in combintion with generator-wp-dev-env

## customization

[@wordpress/hooks](https://www.npmjs.com/package/@wordpress/hooks) is used to create action and filter hooks.

Hooked function can be added to `./grunt/hooked/`. Each file should export a function named equally to the files basename, containing one or more hooked functions.

Example for `jcchavezs/cmb2-conditionals` support. `./grunt/hooked/addCmb2ConditionalsCopyTask.js`:

    const addCmb2ConditionalsCopyTask = grunt => {
    
        // Add 'copy:vendor_cmb2_conditionals' to config copy
        grunt.hooks.addFilter( 'config.copy', 'myprefix.config.copy', config => {
            const newConfig = {
                ...config,
                vendor_cmb2_conditionals: {
                    expand: true,
                    cwd: 'vendor/jcchavezs/cmb2-conditionals',
                    src: [
                        '**/*',
                        '!example-functions.php',
                    ],
                    dest: grunt.option( 'destination' ) + '/vendor/jcchavezs/cmb2-conditionals',
                },
            };
            return newConfig;
        }, 10 );
    
        // Run 'copy:vendor_cmb2_conditionals' on priority 20
        grunt.hooks.addFilter( 'tasks.build.tasks', 'myprefix.tasks.build.tasks', tasks => {
            const newTasks = [
                ...tasks,
                'copy:vendor_cmb2_conditionals',
            ];
            return newTasks;
        }, 20 );
    
    }
    
    module.exports = addCmb2ConditionalsCopyTask;

See `node_modules/wp-dev-env-grunt/grunt/hooked/addDefaultBuildTasks.js` for hooked default tasks and their priority.

### filter

    startGrunt.option.pattern
    replacements.replacements
    config.browserify
    config.clean
    config.cleanempty
    config.compress
    config.concat                    commonconfig
    config.copy
    config.create_autoloader
    config.css_purge
    config.eslint
    config.gitadd
    config.gitcommit
    config.gittag
    config.gitpush
    config.notify_hooks
    config.po2json
    config.pot.handles
    config.pot.options
    config.pot                        handles        options
    config.potomo
    config.sass
    config.string-replace
    config.uglify
    config.watch
    config.wp_readme_to_markdown
    tasks.build.tasks
    tasks.dist.tasks
    tasks.sound.file
    tasks.sound.soundsPath
    tasks.sound.play

### actions

    startGrunt.loadTasks.before
    startGrunt.loadTasks.after
    startGrunt.initOptions.before
    startGrunt.initOptions.after
    updateConfigs.before
    updateConfigs.after
