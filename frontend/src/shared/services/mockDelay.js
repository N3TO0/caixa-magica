export function mockDelay(value, delay = 250) {
  return new Promise(resolve => {
    window.setTimeout(() => resolve(value), delay);
  });
}
