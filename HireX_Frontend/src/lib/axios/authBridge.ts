// authBridge.ts

type AuthBridge = {
  getToken: () => string | null;
  onLogout: () => void;
};

let bridge: AuthBridge | null = null;

/**
 * Call this ONCE on client
 * Call this PER REQUEST on server
 */
export const initAuthBridge = (config: AuthBridge) => {
  bridge = config;
};

export const getAuthToken = () => {
  return bridge?.getToken() ?? null;
};

export const handleAutoLogout = () => {
  bridge?.onLogout();
};
