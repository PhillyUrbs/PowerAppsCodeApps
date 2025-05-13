import type { Plugin, IndexHtmlTransformContext } from 'vite';

export function propagateQueryPlugin(): Plugin {
  return {
    name: 'vite-plugin-propagate-query',

    transformIndexHtml(html, ctx?: IndexHtmlTransformContext) {
      if (!ctx || !ctx.bundle) return html;

      // Get hashed JS and CSS file names from the output bundle
      let mainScript = '';
      let mainStyle = '';

      for (const fileName in ctx.bundle) {
        if (fileName.endsWith('.js') && ctx.bundle[fileName].type === 'chunk') {
          mainScript = fileName;
        } else if (fileName.endsWith('.css')) {
          mainStyle = fileName;
        }
      }

      const runtimeScript = `
<script>
(function injectAssetsWithQuery() {
  const query = window.location.search;
  if (!query) return;

  const basePath = window.location.pathname.replace(/\\/[^/]*$/, '/');
  const appendQuery = (url) => {
    if (!url || url.includes('?') || url.startsWith('http')) return url;
    const fullUrl = url.startsWith('/') ? basePath + url.slice(1) : basePath + url;
    const parsed = new URL(fullUrl, window.location.origin);
    parsed.search = query;
    return parsed.toString();
  };

  // Inject JS
  const script = document.createElement('script');
  script.type = 'module';
  script.src = appendQuery('./${mainScript}');
  document.head.appendChild(script);

  // Inject CSS
  ${mainStyle ? `
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = appendQuery('./${mainStyle}');
  document.head.appendChild(style);
  ` : ''}

  // Patch image.src
  const originalImageSrc = Object.getOwnPropertyDescriptor(Image.prototype, 'src');
  if (originalImageSrc && originalImageSrc.set) {
    Object.defineProperty(Image.prototype, 'src', {
      set(value) {
        const newVal = appendQuery(value);
        originalImageSrc.set.call(this, newVal);
      },
    });
  }

  // Patch fetch
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    if (typeof input === 'string') {
      input = appendQuery(input);
    } else if (input instanceof Request) {
      input = new Request(appendQuery(input.url), input);
    }
    return originalFetch(input, init);
  };
})();
</script>`;

      // Strip all static JS/CSS references and inject runtime script
      return html
        .replace(/<script[^>]*type="module"[^>]*src="[^"]+"[^>]*><\/script>/g, '')
        .replace(/<link[^>]*rel="stylesheet"[^>]*href="[^"]+"[^>]*>/g, '')
        .replace('</head>', `${runtimeScript}\n</head>`);
    },
  };
}

export function AddSasKey(): Plugin {
  return {
    name: 'vite-plugin-inject-query-propagation',

    transformIndexHtml(html) {
      const runtimeScript = `
      <script>
      (function appendQueryToAssets() {
        const query = window.location.search;
        if (!query) return;
      
        const basePath = window.location.pathname.replace(/\\/[^/]*$/, '/');
      
        const appendQuery = (url) => {
          try {
            if (url.startsWith('http') || url.includes('?')) return url;
            const fullUrl = url.startsWith('/') ? basePath + url.slice(1) : basePath + url;
            const parsed = new URL(fullUrl, window.location.origin);
            parsed.search = query;
            return parsed.toString();
          } catch {
            return url;
          }
        };
      
        // 1. Fix existing HTML assets (script, link, img)
        const tags = document.querySelectorAll('script[src], link[href], img[src]');
        tags.forEach((el) => {
          const tag = el.tagName.toLowerCase();
          const attr = tag === 'link' ? 'href' : 'src';
          const url = el.getAttribute(attr);
          if (!url) return;
      
          const newUrl = appendQuery(url);
      
          if (tag === 'script') {
            const newScript = document.createElement('script');
            Array.from(el.attributes).forEach((attr) => {
              if (attr.name !== 'src') newScript.setAttribute(attr.name, attr.value);
            });
            newScript.setAttribute('src', newUrl);
            el.replaceWith(newScript);
          } else {
            el.setAttribute(attr, newUrl);
          }
        });
      
        // 2. Intercept JS-assigned image.src
        const originalImageSrc = Object.getOwnPropertyDescriptor(Image.prototype, 'src');
        if (originalImageSrc && originalImageSrc.set) {
          Object.defineProperty(Image.prototype, 'src', {
            set(value) {
              const newVal = appendQuery(value);
              originalImageSrc.set.call(this, newVal);
            },
          });
        }
      
        // 3. Intercept fetch calls
        const originalFetch = window.fetch;
        window.fetch = function(input, init) {
          if (typeof input === 'string') {
            input = appendQuery(input);
          } else if (input instanceof Request) {
            input = new Request(appendQuery(input.url), input);
          }
          return originalFetch(input, init);
        };
      })();
      </script>
      `;

      return html.replace('</head>', `${runtimeScript}\n</head>`);
    },
  };
}

export function RelativePath(): Plugin {
  return {
    name: 'vite-plugin-relative-path',
    transformIndexHtml(html) {
      return html.replace(
        /(href|src)=["']\/(.*?)["']/g,
        (_match, attr: string, path: string) => {
          return `${attr}="./${path}"`;
        }
      );
    },
  };
}
