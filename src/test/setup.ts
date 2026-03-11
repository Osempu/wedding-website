import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Mock Supabase environment variables for testing
vi.stubEnv('VITE_PUBLIC_SUPABASE_URL', 'https://test.supabase.co');
vi.stubEnv('VITE_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key');

afterEach(() => {
    cleanup();
})