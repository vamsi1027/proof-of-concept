import { useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { UnregisterCallback } from 'history';

const useCurrentPath = (value: string): string | null => {
    const locationRef = useRef<string | null>(null);

    useEffect(() => {
        locationRef.current = value;
    }, [value]);
    return locationRef.current;
};

export const usePrompt = (
    when = false,
    message = '',
    saveDraft
): void => {
    const history = useHistory();
    const { pathname } = useLocation();
    const previousLocation = useCurrentPath(pathname);
    const URLRef = useRef<UnregisterCallback | null>(null);
    const onUnload = (event: BeforeUnloadEvent): string => {
        const listener = event || window.event;
        listener.preventDefault();
        if (listener) {
            listener.returnValue = '';
        }
        return '';
    };

    useEffect(() => {
        if (when) {
            URLRef.current = history.block((location, action) => {
                const isLocationChanged = previousLocation !== location.pathname;
                if (isLocationChanged) {
                    const confirm = window.confirm(message);
                    if (!confirm && action === 'POP') {
                        window.history.replaceState(null, ``, `${previousLocation}`);
                    }
                    if (confirm) {
                        saveDraft(when)
                        return undefined;
                    }
                }
                return false;
            });
            window.addEventListener('beforeunload', onUnload);
        } else {
            URLRef.current = null;
        }

        return () => {
            if (URLRef.current) {
                URLRef.current();
                URLRef.current = null;
                window.removeEventListener('beforeunload', onUnload);
            }
        };
    }, [message, when, history, previousLocation]);
};