'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import DynamicModal from '@/components/modal/dynamic-modal';
import { logout } from 'next-cas-client';

// Context type for children components
type BlockNavContextValue = {
    setIsApiPending: (value: boolean) => void;
    logoutWithBlock: () => void;
};

const BlockNavContext = createContext<BlockNavContextValue | null>(null);

export const BlockNavigationProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();

    const [isApiPending, setIsApiPending] = useState(false);
    const isApiPendingRef = useRef(false);

    const [showModal, setShowModal] = useState(false);
    const [pendingAction, setPendingAction] = useState<'LOGOUT' | string | null>(null);

    // Keep ref in sync
    useEffect(() => {
        isApiPendingRef.current = isApiPending;
    }, [isApiPending]);

    /* ---------------------------------------------------------
     * 1. Block browser refresh/close normally (unchanged)
     * --------------------------------------------------------- */
    useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (isApiPendingRef.current) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, []);

    /* ---------------------------------------------------------
     * 2. Intercept INTERNAL navigation
     *    ❗ FIXED: DO NOT throw — just block and show modal
     * --------------------------------------------------------- */
    useEffect(() => {
        const handleRouteAttempt = (event: Event) => {
            const url = (event as CustomEvent<string>).detail;

            if (!isApiPendingRef.current) return; // allow normal navigation

            // BLOCK navigation, show modal
            setShowModal(true);
            setPendingAction(url);

            // ❗ STOP navigation WITHOUT throwing
            event.preventDefault();
        };

        window.addEventListener(
            'next-route-attempt',
            handleRouteAttempt as EventListener
        );

        return () => {
            window.removeEventListener(
                'next-route-attempt',
                handleRouteAttempt as EventListener
            );
        };
    }, []);

    /* ---------------------------------------------------------
     * 3. Override router.push to emit safe "route attempt" event
     *    ❗ FIXED: remove old "route-change-start" that caused crash
     * --------------------------------------------------------- */
    useEffect(() => {
        const originalPush = router.push;

        router.push = ((url: string, options?: { scroll?: boolean }) => {
            const event = new CustomEvent('next-route-attempt', { detail: url });
            window.dispatchEvent(event);

            if (!isApiPendingRef.current) {
                return originalPush(url, options);
            }

            // API is pending → block navigation
            return;
        }) as typeof router.push;

        return () => {
            router.push = originalPush;
        };
    }, [router]);

    /* ---------------------------------------------------------
     * 4. Logout button blocking
     * --------------------------------------------------------- */
    const logoutWithBlock = useCallback(() => {
        if (isApiPendingRef.current) {
            setPendingAction('LOGOUT');
            setShowModal(true);
        } else {
            logout();
        }
    }, []);

    /* ---------------------------------------------------------
     * 5. User clicked "Yes"
     * --------------------------------------------------------- */
    const confirmLeave = useCallback(() => {
        const action = pendingAction;

        setShowModal(false);
        setPendingAction(null);
        setIsApiPending(false);

        if (!action) return;

        if (action === 'LOGOUT') {
            logout();
        } else {
            router.push(action);
        }
    }, [pendingAction, router]);

    /* ---------------------------------------------------------
     * 6. User clicked "Cancel"
     * --------------------------------------------------------- */
    const cancelLeave = useCallback(() => {
        setShowModal(false);
        setPendingAction(null);
    }, []);

    const value: BlockNavContextValue = {
        setIsApiPending,
        logoutWithBlock,
    };

    return (
        <BlockNavContext.Provider value={value}>
            {children}

            <DynamicModal
                open={showModal}
                title="Leave Page?"
                body="An update is in progress. Are you sure you want to leave this page?"
                warning="Your changes may not be saved."
                buttons={[<span key="yes" onClick={confirmLeave}>Yes</span>]}
                closeText="Cancel"
                onClose={cancelLeave}
            />
        </BlockNavContext.Provider>
    );
};

const useBlockNavigation = () => {
    const ctx = useContext(BlockNavContext);
    if (!ctx) throw new Error('useBlockNavigation.tsx must be used inside BlockNavigationProvider');
    return ctx;
};

export default useBlockNavigation;
