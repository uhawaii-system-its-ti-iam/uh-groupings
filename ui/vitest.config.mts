import { coverageConfigDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        env: {
            JWT_SECRET_KEY: 'dGhpcytqd3Qrc2VjcmV0K3VzZWQrZm9yK3Rlc3Rpbmc=', //jwt secret used for tests.
        },
        server: {
            deps: {
                inline: ['nuqs', 'nuqs/server']
            }
        },
        environment: 'jsdom',
        globals: true,
        setupFiles: './tests/vitest.setup.tsx',
        coverage: {
            provider: 'istanbul',
            enabled: true,
            include: ['**/src/**/*.ts*'],
            exclude: [
                ...coverageConfigDefaults.exclude,
                '**/src/components/ui' // Ignore shadcn/ui components
            ],
            reporter: ['text', 'json-summary', 'html'],
            reportsDirectory: './coverage'
        }
    }
});
