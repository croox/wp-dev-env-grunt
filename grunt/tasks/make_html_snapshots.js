const path = require('path');
const axios = require('axios');
const https = require('https');

const getWpInstalls = require('../getWpInstalls');

const make_html_snapshots = grunt => {

	grunt.registerTask( 'make_html_snapshots', '???', function( wp_installs ){

		// Extract urls from wp_installs.
        let wp_installs_urls = [];
        if ( ! wp_installs || ! wp_installs.length || wp_installs.length === 0 ) {
            return grunt.log.writeln( 'No wp_install specified. Task make_html_snapshots skipped' ).yellow;
        } else {
            wp_installs_urls = getWpInstalls( grunt, wp_installs );
        }
        if ( ! wp_installs_urls.length ) {
            return grunt.log.writeln( 'Not able to find wp_installs. Task make_html_snapshots skipped' ).yellow;
        }
        const missingUrl = [...wp_installs_urls].find( entry => ! entry.url );
        if ( undefined !== missingUrl ) {
            return grunt.log.writeln( 'Missing url for wp_install "' + missingUrl.name + '". Task make_html_snapshots skipped' ).yellow;
        }
        if ( wp_installs_urls.length > 1 ) {
            return grunt.log.writeln( 'This task can\'t process multiple wp_installs. Task make_html_snapshots skipped' ).yellow;
        }
        wp_installs_urls = [...wp_installs_urls].map( entry => {
            return entry.url.replace( /\/$/ , '' );   // Remove trailing slash.
        } );

        // Get paths from config
        const paths = [...grunt.config( 'make_html_snapshots' ).paths].filter( p => {
            if ( p.startsWith( 'http://' ) || p.startsWith( 'https://' ) ) {
                grunt.log.writeln( 'Path should be a path, not an url: ' + p ).yellow;
                return false;
            }
            return true;
        } ).map( p => {
            p = p.startsWith( '/' ) ? p : '/' + p;          // Make sure leading slash.
            p = p.endsWith( '/' ) ? p : p + '/';            // Make sure trailing slash.
            return p;
        } );

		const done = this.async();
		const promises = [...paths].map( p => {
            const url = wp_installs_urls[0] + p;
			return new Promise( ( resolve, reject ) => {
                axios( {
                    url,
                    httpsAgent: new https.Agent( { rejectUnauthorized: false } ),
                } )
                .then( parsedBody => {
            		const fileName = path.join(
                        'src',
                        'html_snapshots',
                        p.replace( /\//g, '__' ) + '.html'
                    );
                    grunt.file.write( fileName, parsedBody.data );

                    grunt.log.writeln( url );
                    grunt.log.writeln( '-> ' + fileName );
                    grunt.log.writeln();

                    resolve();
                } ).catch( res => {
                    grunt.log.writeln( 'Not able to fetch from ' + url );
                    if ( res.cause ) {
                        grunt.log.error( res.cause );
                    }
                    resolve( false );
                } )
			} );
		} );
		Promise.all( promises ).then( result => done.apply() );

	} );
};

module.exports = make_html_snapshots;
