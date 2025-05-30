import { describe, it, expect } from 'vitest';
import { message } from '@/lib/messages';

describe('message constants', () => {
    describe('Preferences', () => {
        it('should contain correct labels and titles', () => {
            expect(message.Preferences.TITLE).toBe('Preferences');
            expect(message.Preferences.OPT_IN_LABEL).toMatch(/add themselves/i);
            expect(message.Preferences.OPT_OUT_LABEL).toMatch(/remove themselves/i);
            expect(message.Preferences.MODAL_CLOSE).toBe('OK');
        });
    });

    describe('Tooltip', () => {
        it('should return correct sync description', () => {
            const description = 'LDAP';
            const result = message.Tooltip.SYNC_DEST(description);
            expect(result).toBe(`This option syncs destinations to ${description}`);
        });

        it('should contain opt-in and opt-out tooltips', () => {
            expect(message.Tooltip.OPT_IN).toMatch(/opt-in self-service/i);
            expect(message.Tooltip.OPT_OUT).toMatch(/opt-out self-service/i);
        });
    });

    describe('SyncDestinations', () => {
        it('should return correct modal body for enable', () => {
            const result = message.SyncDestinations.MODAL_BODY(false, 'LDAP');
            expect(result).toBe('Are you sure you want to enable the synchronization destination: LDAP?');
        });

        it('should return correct modal body for disable', () => {
            const result = message.SyncDestinations.MODAL_BODY(true, 'Google');
            expect(result).toBe('Are you sure you want to disable the synchronization destination: Google?');
        });

        it('should contain static modal strings', () => {
            expect(message.SyncDestinations.MODAL_TITLE).toBe('Synchronization Destination Confirmation');
            expect(message.SyncDestinations.MODAL_WARNING).toMatch(/operationally very expensive/i);
        });
    });

    describe('Actions', () => {
        it('should return correct body text for Include list', () => {
            const result = message.Actions.MODAL_BODY(true, false, 'Test Group');
            expect(result).toMatch(/Include list.*Test Group grouping/);
        });

        it('should return correct body text for Exclude list', () => {
            const result = message.Actions.MODAL_BODY(false, true, 'Test Group');
            expect(result).toMatch(/Exclude list.*Test Group grouping/);
        });

        it('should return correct body text for both lists', () => {
            const result = message.Actions.MODAL_BODY(true, true, 'Test Group');
            expect(result).toMatch(/Exclude and Include lists.*Test Group grouping/);
        });

        it('should contain correct action titles and labels', () => {
            expect(message.Actions.TITLE).toBe('Grouping Actions');
            expect(message.Actions.MODAL_SUCCESS_TITLE).toBe('Grouping Reset Completion');
            expect(message.Actions.MODAL_CONFIRM).toBe('Yes');
        });
    });
});
