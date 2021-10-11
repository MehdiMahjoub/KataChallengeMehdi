"use strict";

const path = require('path');
const nconf = require('nconf');

const env = process.env.NODE_ENV || 'development';

let initiated = {};

module.exports = function (configPath) {
    if (!initiated[configPath]) {

        // get the module names to save all the confs for each opened module 
        // go back 2 levels to get the module name (before src/config)
        let module_name = path.basename(path.dirname(path.dirname(configPath)));

        /**
         * Configuration values are loaded in the following order :
         *  - commons.json
         *  - overriden by <NODE_ENV>.json (defaulted to 'development')
         *  - overriden by <env.env>.json (env = environment variable named 'env')
         *  - overriden by lowercased environment variables
         *  (- overriden by <argv.env>.json) was an error => commented out
         *  - overriden by <argv>
         * 
         * Beware: do not use 'env' as a root property in the project !
         * 
         * This shoud allow for having NODE_ENV set only to standard 'development' or 'production' values
         * but us using 'stage', 'uat' or 'test' config files, and being able to override the value using 
         * command line arguments.
         */
        nconf.argv();

        nconf.env({ separator: '__', lowerCase: true });


        if (nconf.get('env')) {
            nconf.file(module_name + 'env_env', { file: path.join(configPath, nconf.get('env') + '.json') });
        }

        nconf.file(module_name + 'node_env', { file: path.join(configPath, env + '.json') });


        initiated[configPath] = true;
    }
    return nconf;
}
