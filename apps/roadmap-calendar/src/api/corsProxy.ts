/**
 * CORS Proxy for production builds.
 *
 * The Microsoft Roadmap API does not return CORS headers, so direct
 * browser requests from Power Platform (or any cross-origin host) fail
 * with "Failed to fetch".
 *
 * In dev mode Vite's server proxy handles this. In production we route
 * through a CORS proxy.
 *
 * To use your own proxy (recommended for production), set the
 * VITE_CORS_PROXY_URL environment variable to your Azure Function / proxy
 * endpoint, e.g.  https://my-cors-proxy.azurewebsites.net/api/proxy?url=
 *
 * The proxy URL is prepended to the target URL. The proxy must forward the
 * request and return the response with appropriate CORS headers.
 */

const DEFAULT_CORS_PROXY = 'https://corsproxy.io/?';

export function proxyUrl(url: string): string {
  if (import.meta.env.DEV) {
    // Vite dev server proxy handles CORS — no wrapping needed.
    return url;
  }

  const proxy = import.meta.env.VITE_CORS_PROXY_URL ?? DEFAULT_CORS_PROXY;
  return `${proxy}${encodeURIComponent(url)}`;
}
