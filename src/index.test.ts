import { cacheCandidate } from '@jointly/cache-candidate';
import { myPlugin } from './index';

it('should throw if invalidateFunction is not passed', async () => {
  let counter = 0;
  const mockFn = (step: number) =>
    new Promise((resolve) => {
      counter += step;
      resolve(counter);
    });

  const wrappedMockFn = cacheCandidate(mockFn, {
    requestsThreshold: 1,
    ttl: 800,
    plugins: [myPlugin]
  });

  await expect(wrappedMockFn(1)).rejects.toThrow();
});

it('should throw if invalidateFunction is not a function', async () => {
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
        ...myPlugin,
        additionalParameters: {
          invalidateFunction: 42
        }
      }]
  });

  await expect(wrappedMockFn(1)).rejects.toThrow();
});

it('should throw if invalidateFunction returns a non-boolean value', async () => {
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
        ...myPlugin,
        additionalParameters: {
          invalidateFunction: () => 42
        }
      }]
  });

  await expect(wrappedMockFn(1)).rejects.toThrow();
});

it('should invalidate if invalidateFunction returns true', async () => {
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
        ...myPlugin,
        additionalParameters: {
          invalidateFunction: () => true
        }
      }]
  });

  await wrappedMockFn(1);
  expect(counter).toBe(1);
  await wrappedMockFn(1);
  expect(counter).toBe(2);
});

it('should not invalidate if invalidateFunction returns false', async () => {
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
        ...myPlugin,
        additionalParameters: {
          invalidateFunction: () => false
        }
      }]
  });

  await wrappedMockFn(1);
  expect(counter).toBe(1);
  await wrappedMockFn(1);
  expect(counter).toBe(1);
});