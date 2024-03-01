/* eslint-disable @typescript-eslint/no-var-requires */
const env = require('@next/env');

env.loadEnvConfig(process.cwd());

const apiBaseUrl = process.env.NEXT_PUBLIC_API_2_1_BASE_URL;
const apiHandshakeEnabled = process.env.API_HANDSHAKE_ENABLED ?? true;

const errorMessage = 
`***************************
APPLICATION FAILED TO START
***************************

Description:

Could not connect to the API server.

Action:

Start the UH Groupings API first
or check the connection configuration and
fix any possible problems.\n`;

if (apiHandshakeEnabled) {
    fetch(`${apiBaseUrl}/`)
        .catch(() => {
            console.log(errorMessage);
            process.exit(1);
        });
}
