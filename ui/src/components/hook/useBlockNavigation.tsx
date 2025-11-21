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
    setIsApiPending: (value: boolean) => void;   // Update API pending state
    logoutWithBlock: () => void;                // Logout with blocking logic
};

const BlockNavContext = createContext<BlockNavContextValue | null>(null);

export const BlockNavigationProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();

    const [isApiPending, setIsApiPending] = useState(false);    // Tracks optimistic API state
    const isApiPendingRef = useRef(false);                      // Ref mirror for event listeners
    const [showModal, setShowModal] = useState(false);          // Controls modal visibility
    const [pendingAction, setPendingAction] = useState<'LOGOUT' | string | null>(null); // What user attempted (URL or logout)

    // Keep ref in sync so event listeners read the latest value
    useEffect(() => {
        isApiPendingRef.current = isApiPending;
    }, [isApiPending]);

    // Block browser refresh/close when API pending
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

    // Intercept internal navigation via custom router.push event
    useEffect(() => {
        const handleRouteChangeStart = (event: Event) => {
            const url = (event as CustomEvent<string>).detail;

            // Allow normal navigation if no API pending
            if (!isApiPendingRef.current) return;

            // If pending API → show modal and block navigation
            setShowModal(true);
            setPendingAction(url);

            throw 'NAV_BLOCKED';
        };

        window.addEventListener(
            'next-route-change-start',
            handleRouteChangeStart as EventListener,
        );

        return () => {
            window.removeEventListener(
                'next-route-change-start',
                handleRouteChangeStart as EventListener,
            );
        };
    }, []);

    // Override router.push so we can detect every navigation event
    useEffect(() => {
        const originalPush = router.push;

        router.push = ((url: string, options?: { scroll?: boolean }) => {
            // Emit custom navigation event for interception
            const event = new CustomEvent('next-route-change-start', { detail: url });
            window.dispatchEvent(event);

            return originalPush(url, options);
        }) as typeof router.push;

        return () => {
            router.push = originalPush;
        };
    }, [router]);

    // Wrap logout so it also gets blocked when needed
    const logoutWithBlock = useCallback(() => {
        if (isApiPendingRef.current) {
            setPendingAction('LOGOUT');
            setShowModal(true);
        } else {
            logout();
        }
    }, []);

    // User confirms navigation during pending API
    const confirmLeave = useCallback(() => {
        const action = pendingAction;

        setShowModal(false);
        setPendingAction(null);
        setIsApiPending(false); // Force resolve optimistic state

        if (!action) return;

        if (action === 'LOGOUT') {
            logout();
        } else {
            router.push(action);
        }
    }, [pendingAction, router]);

    // User cancels leaving
    const cancelLeave = useCallback(() => {
        setShowModal(false);
        setPendingAction(null);
    }, []);

    const value: BlockNavContextValue = {
        setIsApiPending,   // AdminTable will call this during optimistic updates
        logoutWithBlock,   // LoginButton uses this instead of raw logout()
    };

    return (
        <BlockNavContext.Provider value={value}>
            {children}

            {/* Modal shown when user tries to navigate during an API update */}
            <DynamicModal
                open={showModal}
                title="Leave Page?"
                body="An update is in progress. Are you sure you want to leave this page?"
                warning="Your changes may not be saved."
                buttons={[<span key="yes" onClick={confirmLeave}> Yes </span>]}
                closeText="Cancel"
                onClose={cancelLeave}
            />
        </BlockNavContext.Provider>
    );
};

const useBlockNavigation = () => {
    const ctx = useContext(BlockNavContext);
    if (!ctx) {
        throw new Error('useBlockNavigation must be used inside BlockNavigationProvider');
    }
    return ctx;
};

export default useBlockNavigation;
