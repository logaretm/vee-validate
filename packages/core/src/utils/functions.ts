export function debounce(fn: (...args: any[]) => any, wait = 0, token = { cancelled: false }) {
  if (!wait) {
    return fn;
  }

  let timeout: ReturnType<typeof setTimeout> | undefined;

  return (...args: any[]) => {
    const later = () => {
      timeout = undefined;

      // check if the fn call was cancelled.
      if (!token.cancelled) fn(...args);
    };

    // because we might want to use Node.js setTimout for SSR.
    clearTimeout(timeout as any);
    timeout = setTimeout(later, wait) as any;
  };
}
