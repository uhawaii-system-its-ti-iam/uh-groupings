import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useEffect } from "react";

import { BlockNavigationProvider } from "@/components/hook/useBlockNavigation";
import useBlockNavigation from "@/components/hook/useBlockNavigation";

// mock logout
const mockLogout = vi.fn();
vi.mock("next-cas-client", () => ({
    logout: () => mockLogout(),
}));

// mock router (must mock stable reference)
const mockPush = vi.fn();
const routerObj = { push: mockPush };
vi.mock("next/navigation", () => ({
    useRouter: () => routerObj,
}));

/* ------------------------------------------------------------------
   Proper DynamicModal mock: preserves DOM structure but allows clicks
------------------------------------------------------------------- */
vi.mock("@/components/modal/dynamic-modal", () => ({
    __esModule: true,
    default: ({ open, title, buttons, closeText, onClose }) => {
        if (!open) return null;

        return (
            <div>
                <div>{title}</div>

                {/* Simulate <Button> wrapper for each modal action */}
                {buttons?.map((btn, i) => (
                    <button key={i} onClick={btn.props.onClick || onClose}>
                        {btn}
                    </button>
                ))}

                {closeText && (
                    <button onClick={onClose}>{closeText}</button>
                )}
            </div>
        );
    },
}));


// Test component
const TestComponent = () => {
    const { setIsApiPending, logoutWithBlock } = useBlockNavigation();

    useEffect(() => {
        setIsApiPending(true); // force pending
    }, []);

    return (
        <>
            <button onClick={logoutWithBlock}>LogoutBtn</button>

            <button
                onClick={() =>
                    window.dispatchEvent(
                        new CustomEvent("next-route-attempt", { detail: "/new-page" })
                    )
                }
            >
                NavBtn
            </button>
        </>
    );
};

describe("BlockNavigationProvider", () => {
    beforeEach(() => {
        mockPush.mockClear();
        mockLogout.mockClear();
    });

    it("opens modal on navigation when API is pending", () => {
        render(
            <BlockNavigationProvider>
                <TestComponent />
            </BlockNavigationProvider>
        );

        fireEvent.click(screen.getByText("NavBtn"));

        expect(screen.getByText("Leave Page?")).toBeInTheDocument();
    });

    it("confirmLeave → router.push('/new-page')", () => {
        render(
            <BlockNavigationProvider>
                <TestComponent />
            </BlockNavigationProvider>
        );

        // trigger modal
        fireEvent.click(screen.getByText("NavBtn"));

        // click the actual Button, not the span inside
        const yesButton = screen.getAllByRole("button").find(btn =>
            btn.textContent?.includes("Yes")
        );
        fireEvent.click(yesButton!);

        expect(mockPush).toHaveBeenCalledWith("/new-page");
    });

    it("confirmLeave → logout() when LOGOUT pending", () => {
        render(
            <BlockNavigationProvider>
                <TestComponent />
            </BlockNavigationProvider>
        );

        fireEvent.click(screen.getByText("LogoutBtn"));

        const yesButton = screen.getAllByRole("button").find(btn =>
            btn.textContent?.includes("Yes")
        );
        fireEvent.click(yesButton!);

        expect(mockLogout).toHaveBeenCalled();
    });

    it("cancelLeave closes the modal and performs no navigation", () => {
        render(
            <BlockNavigationProvider>
                <TestComponent />
            </BlockNavigationProvider>
        );

        fireEvent.click(screen.getByText("NavBtn"));

        fireEvent.click(screen.getByText("Cancel"));

        expect(screen.queryByText("Leave Page?")).not.toBeInTheDocument();
        expect(mockPush).not.toHaveBeenCalled();
    });
});
