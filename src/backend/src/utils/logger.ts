const getTimestamp = (): string => {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
};

export const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(`${getTimestamp()} [info]:`, message, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(`${getTimestamp()} [error]:`, message, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`${getTimestamp()} [warn]:`, message, ...args);
  },
  debug: (message: string, ...args: any[]) => {
    console.debug(`${getTimestamp()} [debug]:`, message, ...args);
  }
};
