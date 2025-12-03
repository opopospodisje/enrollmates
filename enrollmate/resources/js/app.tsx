import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    try {
      const link = document.querySelector('link[rel="manifest"]') as HTMLLinkElement | null;
      const manifestHref = link?.getAttribute('href') ?? 'manifest.webmanifest';
      const manifestUrl = new URL(manifestHref, window.location.origin);
      const basePath = manifestUrl.pathname.replace(/manifest\.webmanifest$/, '');
      const swUrl = basePath + 'service-worker.js';

      navigator.serviceWorker.register(swUrl, { scope: basePath }).then(() => {
        navigator.serviceWorker.getRegistrations().then((regs) => {
          regs.forEach((reg) => {
            try {
              const regPath = new URL(reg.scope).pathname;
              if (regPath !== basePath) {
                reg.unregister();
              }
            } catch {}
          });
        });
      }).catch((err) => {
        console.error('SW registration failed:', err);
      });
    } catch (err) {
      console.error('SW registration error:', err);
    }
  });
}

if (!import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => {
        try { reg.unregister(); } catch {}
      });
    });
  });
}

window.addEventListener('beforeinstallprompt', (e: Event) => {
  console.log('PWA: beforeinstallprompt fired');
});

window.addEventListener('appinstalled', () => {
  console.log('PWA: appinstalled');
});
