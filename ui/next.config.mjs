/** @type {import('next').NextConfig} */

import dotenv from 'dotenv';
import fs from 'fs';
import os from 'os';

const dockerOverridePath = '/overrides/uh-groupings-ui-3-0-overrides.properties';
const localOverridePath = `${os.homedir()}/.${os.userInfo().username}-conf/uh-groupings-ui-3-0-overrides.properties`;
const overridePath = fs.existsSync(dockerOverridePath) ? dockerOverridePath : localOverridePath;
dotenv.config({ path: overridePath });

const nextConfig = {
    basePath: '/uhgroupings',
    experimental: {
        serverComponentsExternalPackages: ['camaro']
    },

    rewrites: async () => {
        return [
            {
                source: '/groupings/:groupingPath',
                destination: '/groupings/:groupingPath/all-members'
            },
            {
                source: '/memberships',
                destination: '/memberships/current'
            },
            {
                source: '/admin',
                destination: '/admin/manage-groupings'
            }
        ];
    }
};

export default nextConfig;