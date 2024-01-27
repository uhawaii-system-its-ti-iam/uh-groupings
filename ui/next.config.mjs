/** @type {import('next').NextConfig} */

import dotenv from 'dotenv';
import os from 'os';

// Define path to overrides file 
// TODO: Rename uh-groupings-ui-3-0-overrides to uh-groupings-ui-overrides once 3.0 is complete
dotenv.config({path: `${os.homedir()}/.${os.userInfo().username}-conf/uh-groupings-ui-3-0-overrides.properties`})

const nextConfig = {
    basePath: '/uhgroupings',
    experimental: {
        serverComponentsExternalPackages: ['camaro']
    }
};

export default nextConfig;
