import { mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
    viteConfig, // Inherit Vite config (path aliases, plugins, etc.)
    {
        test: {
            // 1. ENVIRONMENT SETUP
            environment: 'jsdom', // Simulates browser (window, document, etc.)

            // 2. GLOBAL TEST UTILITIES
            globals: true, // No need to import describe, it, expect

            // 3. SETUP FILE
            setupFiles: ['./src/test/setup.ts'], // Runs before each test file

            // 4. COVERAGE CONFIGURATION
            coverage: {
                provider: 'v8', // Fast built-in coverage (alternative: istanbul)
                reporter: ['text', 'json', 'html'], // Multiple report formats
                exclude: [ // Don't measure coverage for these files
                    'node_modules/',
                    'src/test/',
                    '**/*.config.{ts,js}',
                    '**/dist/**',
                    '**/*.d.ts',
                ],
            },

            // 5. PERFORMANCE
            threads: {
                singleThread: false, // Run tests in parallel
            },
        },
    }
)