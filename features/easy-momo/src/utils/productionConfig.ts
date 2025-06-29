// Simple production configuration utility for easy-momo
interface Config {
  features: {
    debugMode: boolean;
    analyticsEnabled: boolean;
    errorReporting: boolean;
  };
  errorReporting: {
    maxErrorsPerSession: number;
    includeUserAgent: boolean;
    includeUrl: boolean;
  };
  analytics: {
    enabled: boolean;
    sessionTimeout: number;
  };
}

const defaultConfig: Config = {
  features: {
    debugMode: import.meta.env.DEV || false,
    analyticsEnabled: true,
    errorReporting: true,
  },
  errorReporting: {
    maxErrorsPerSession: 10,
    includeUserAgent: true,
    includeUrl: true,
  },
  analytics: {
    enabled: true,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
  },
};

export const getConfig = (): Config => {
  return defaultConfig;
};

export default defaultConfig;
