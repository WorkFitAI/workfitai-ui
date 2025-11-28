// Node 25 exposes a `localStorage` stub on the server that lacks `getItem`/`setItem`,
// which causes Next's dev overlay to throw during SSR. Remove the stub so the server
// behaves like older Node versions (localStorage is undefined).
if (typeof globalThis.localStorage !== "undefined" && typeof globalThis.localStorage.getItem !== "function") {
  try {
    delete globalThis.localStorage;
  } catch {
    // If deletion fails, fall back to an inert polyfill to avoid runtime errors.
    globalThis.localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0,
    };
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['localhost'],
  },
  webpack: (config, { isServer, dev }) => {
    config.resolve.fallback = { fs: false, path: false };
    
    // Disable source maps in development
    if (dev) {
      config.devtool = false;
    }
    
    return config;
  },
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  // Disable CSS source maps
  sassOptions: {
    sourceMap: false,
  },
}

module.exports = nextConfig
