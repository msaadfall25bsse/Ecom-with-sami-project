import React, { useEffect, useState } from 'react';

interface ActivePixel {
  id: number;
  platform_name: string;
  pixel_id: string | null;
  custom_code: string | null;
  placement: string;
}

export function DynamicPixels() {
  const [pixels, setPixels] = useState<ActivePixel[]>([]);

  useEffect(() => {
    // Only execute on browser client
    if (typeof window === 'undefined') return;

    fetch('/api/pixels/active')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.pixels)) {
          setPixels(data.pixels);
          injectAllPixels(data.pixels);
        }
      })
      .catch(err => {
        console.warn('[DynamicPixels] Could not load tracking pixels:', err);
      });
  }, []);

  const injectAllPixels = (activePixels: ActivePixel[]) => {
    activePixels.forEach(pixel => {
      const scriptTagId = `dynamic-pixel-${pixel.id}`;
      // Skip if already injected
      if (document.getElementById(scriptTagId)) return;

      const targetElement = pixel.placement === 'body' ? document.body : document.head;
      if (!targetElement) return;

      // 1. Standard Platform Initializations
      if (pixel.platform_name === 'Meta Pixel' && pixel.pixel_id) {
        injectMetaPixel(pixel.pixel_id, scriptTagId, targetElement);
      } else if (pixel.platform_name === 'TikTok Pixel' && pixel.pixel_id) {
        injectTikTokPixel(pixel.pixel_id, scriptTagId, targetElement);
      } else if (pixel.platform_name === 'Google Analytics 4' && pixel.pixel_id) {
        injectGA4(pixel.pixel_id, scriptTagId, targetElement);
      } else if (pixel.platform_name === 'Snapchat Pixel' && pixel.pixel_id) {
        injectSnapchatPixel(pixel.pixel_id, scriptTagId, targetElement);
      } else if (pixel.platform_name === 'Google Tag Manager' && pixel.pixel_id) {
        injectGTM(pixel.pixel_id, scriptTagId, targetElement);
      }

      // 2. Custom Code Snippet Injection
      if (pixel.custom_code) {
        injectCustomCode(pixel.custom_code, `${scriptTagId}-custom`, targetElement);
      }
    });
  };

  const injectMetaPixel = (pixelId: string, id: string, target: HTMLElement) => {
    const script = document.createElement('script');
    script.id = id;
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    `;
    target.appendChild(script);
  };

  const injectTikTokPixel = (pixelId: string, id: string, target: HTMLElement) => {
    const script = document.createElement('script');
    script.id = id;
    script.innerHTML = `
      !function (w, d, t) {
        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
        var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
        ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
        ttq.load('${pixelId}');
        ttq.page();
      }(window, document, 'ttq');
    `;
    target.appendChild(script);
  };

  const injectGA4 = (pixelId: string, id: string, target: HTMLElement) => {
    const extScript = document.createElement('script');
    extScript.id = `${id}-src`;
    extScript.async = true;
    extScript.src = `https://www.googletagmanager.com/gtag/js?id=${pixelId}`;
    target.appendChild(extScript);

    const inlineScript = document.createElement('script');
    inlineScript.id = id;
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${pixelId}');
    `;
    target.appendChild(inlineScript);
  };

  const injectSnapchatPixel = (pixelId: string, id: string, target: HTMLElement) => {
    const script = document.createElement('script');
    script.id = id;
    script.innerHTML = `
      (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
      {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
      a.queue=[];var s='script';var r=t.createElement(s);r.async=!0;
      r.src=n;var u=t.getElementsByTagName(s)[0];
      u.parentNode.insertBefore(r,u);})(window,document,
      'https://sc-static.net/scevent.min.js');
      snaptr('init', '${pixelId}');
      snaptr('track', 'PAGE_VIEW');
    `;
    target.appendChild(script);
  };

  const injectGTM = (pixelId: string, id: string, target: HTMLElement) => {
    const script = document.createElement('script');
    script.id = id;
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${pixelId}');
    `;
    target.appendChild(script);
  };

  const injectCustomCode = (code: string, id: string, target: HTMLElement) => {
    // If raw html/script snippet, container inject
    const container = document.createElement('div');
    container.id = id;
    container.style.display = 'none';
    container.innerHTML = code;
    target.appendChild(container);

    // Re-evaluate script tags inside custom code so browsers execute them
    const scripts = container.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
      const oldScript = scripts[i];
      const newScript = document.createElement('script');
      if (oldScript.src) {
        newScript.src = oldScript.src;
        newScript.async = true;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      target.appendChild(newScript);
    }
  };

  return null; // Silent injector component
}
