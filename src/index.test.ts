import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cacheCandidate } from '@jointly/cache-candidate';
import { PluginInvalidateFunction } from './index';

test('should throw if invalidateFunction is not passed', async (t) => {
  let counter = 0;
  const mockFn = (step: number) =>
    new Promise((resolve) => {
      counter += step;
      resolve(counter);
    });

  const wrappedMockFn = cacheCandidate(mockFn, {
    requestsThreshold: 1,
    ttl: 800,
    plugins: [PluginInvalidateFunction]
  });

  await assert.rejects(async () => {
    await wrappedMockFn(1);
  });
});

test('should throw if invalidateFunction is not a function', async (t) => {
  let counter = 0;
  const mockFn = (step: number) =>
    new Promise((resolve) => {
      counter += step;
      resolve(counter);
    });

  const wrappedMockFn = cacheCandidate(mockFn, {
    requestsThreshold: 1,
    ttl: 800,
    plugins: [
      {
        ...PluginInvalidateFunction,
        additionalParameters: {
          invalidateFunction: 42
        }
      }
    ]
  });

  await assert.rejects(async () => {
    await wrappedMockFn(1);
  });
});

test('should throw if invalidateFunction returns a non-boolean value', async (t) => {
  let counter = 0;
  const mockFn = (step: number) =>
    new Promise((resolve) => {
      counter += step;
      resolve(counter);
    });

  const wrappedMockFn = cacheCandidate(mockFn, {
    requestsThreshold: 1,
    ttl: 800,
    plugins: [
      {
        ...PluginInvalidateFunction,
        additionalParameters: {
          invalidateFunction: () => 42
        }
      }
    ]
  });

  await assert.rejects(async () => {
    await wrappedMockFn(1);
  });
});

test('should invalidate if invalidateFunction returns true', async (t) => {
  let counter = 0;
  const mockFn = (step: number) =>
    new Promise((resolve) => {
      counter += step;
      resolve(counter);
    });

  const wrappedMockFn = cacheCandidate(mockFn, {
    requestsThreshold: 1,
    ttl: 800,
    plugins: [
      {
        ...PluginInvalidateFunction,
        additionalParameters: {
          invalidateFunction: () => true
        }
      }
    ]
  });

  await wrappedMockFn(1);
  assert.equal(counter, 1);
  await wrappedMockFn(1);
  assert.equal(counter, 2);
});

test('should not invalidate if invalidateFunction returns false', async (t) => {
  let counter = 0;
  const mockFn = (step: number) =>
    new Promise((resolve) => {
      counter += step;
      resolve(counter);
    });

  const wrappedMockFn = cacheCandidate(mockFn, {
    requestsThreshold: 1,
    ttl: 800,
    plugins: [
      {
        ...PluginInvalidateFunction,
        additionalParameters: {
          invalidateFunction: () => false
        }
      }
    ]
  });

  await wrappedMockFn(1);
  assert.equal(counter, 1);
  await wrappedMockFn(1);
  assert.equal(counter, 1);
});
