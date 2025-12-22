import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll } from 'vitest';
import { server } from './mocks/server';
import { ReadableStream } from 'node:stream/web';

// Polyfill ReadableStream for MSW in Node environment
if (!global.ReadableStream) {
  global.ReadableStream = ReadableStream;
}

// Start MSW server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
  console.log('✅ Mock API server started');
});

// Reset handlers after each test
afterEach(() => {
  cleanup();
  server.resetHandlers();
  localStorage.clear();
});

// Close server after all tests
afterAll(() => {
  server.close();
  console.log('🛑 Mock API server closed');
});