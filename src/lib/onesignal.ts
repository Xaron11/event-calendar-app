'use client';

import { useEffect } from 'react';

export function useOneSignal(userId?: string) {
  useEffect(() => {
    if (!userId || typeof window === 'undefined') return;

    let isMounted = true;
    const appId =
      process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID ||
      'a3e62844-430e-49c9-90fa-a6d7a30a9167';

    import('react-onesignal')
      .then((module) => {
        if (!isMounted) return;
        const OneSignal = module.default;

        OneSignal.init({
          appId,
          safari_web_id: 'web.onesignal.auto.040fbea3-5bf4-4f81-a6ad-042d48246d00',
          notifyButton: {
            enable: true,
          } as any,
          allowLocalhostAsSecureOrigin: true,
        })
          .then(() => {
            if (!isMounted) return;
            const os = OneSignal as any;
            if (typeof os.login === 'function') {
              os.login(userId);
            } else if (typeof os.setExternalUserId === 'function') {
              os.setExternalUserId(userId);
            }
          })
          .catch(() => {});
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [userId]);
}
