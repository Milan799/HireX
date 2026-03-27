import type { InternalAxiosRequestConfig } from "axios";

const controllers = new Map<string, AbortController>();

type ConfigWithAbort = InternalAxiosRequestConfig & { __abortKey?: string };

export const generateKey = (config: ConfigWithAbort) => {
  const { method, url, params, data } = config;
  return `${method}-${url}-${JSON.stringify(params ?? {})}-${JSON.stringify(data ?? {})}`;
};

export const attachAbortController = (config: ConfigWithAbort) => {
  const key = generateKey(config);

  if (controllers.has(key)) {
    controllers.get(key)?.abort();
  }

  const controller = new AbortController();
  controllers.set(key, controller);

  config.signal = controller.signal;
  config.__abortKey = key;

  return config;
};

export const clearAbortController = (config: ConfigWithAbort) => {
  const key = config.__abortKey;
  if (key) controllers.delete(key);
};
