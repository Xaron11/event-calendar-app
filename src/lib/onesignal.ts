'use client';

import { useEffect } from 'react';

export function useOneSignal(userId?: string) {
  useEffect(() => {
    if (!userId || typeof window === 'undefined') return;

    let isMounted = true;
    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

    // Do not attempt to initialize if OneSignal App ID is not configured
    if (!appId) {
      return;
    }

    import('react-onesignal')
      .then((module) => {
        if (!isMounted) return;
        const OneSignal = module.default;

        const initOptions: Record<string, unknown> = {
          appId,
          notifyButton: {
            enable: true,
          },
          allowLocalhostAsSecureOrigin: process.env.NODE_ENV !== 'production',
        };

        if (process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID) {
          initOptions.safari_web_id = process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID;
        }

        OneSignal.init(initOptions as never)
          .then(() => {
            if (!isMounted) return;
            const os = OneSignal as unknown as {
              login?: (id: string) => void;
              setExternalUserId?: (id: string) => void;
            };
            if (typeof os.login === 'function') {
              os.login(userId);
            } else if (typeof os.setExternalUserId === 'function') {
              os.setExternalUserId(userId);
            }
          })
          .catch((err) => {
            console.error('OneSignal initialization error:', err);
          });
      })
      .catch((err) => {
        console.error('OneSignal module load error:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [userId]);
}
