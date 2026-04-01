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

        it('should return correct trash icon removal text', () => {
            const result = message.Tooltip.TRASH_ICON_REMOVAL('admins');
            expect(result).toBe('Remove member from the Admins list');
        });
    });

    describe('SyncDestinations', () => {
        it('should return correct modal body for enable', () => {
            const result = message.SyncDestinations.MODAL_BODY(false, 'LDAP');
            expect(result).toBe(
                'Are you sure you want to enable the synchronization destination: LDAP?'
            );
        });

        it('should return correct modal body for disable', () => {
            const result = message.SyncDestinations.MODAL_BODY(true, 'Google');
            expect(result).toBe(
                'Are you sure you want to disable the synchronization destination: Google?'
            );
        });

        it('should contain static modal strings', () => {
            expect(message.SyncDestinations.MODAL_TITLE).toBe(
                'Synchronization Destination Confirmation'
            );
            expect(message.SyncDestinations.MODAL_WARNING).toMatch(
                /operationally very expensive/i
            );
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
            expect(result).toMatch(
                /Exclude and Include lists.*Test Group grouping/
            );
        });

        it('should contain correct action titles and labels', () => {
            expect(message.Actions.TITLE).toBe('Grouping Actions');
            expect(message.Actions.MODAL_SUCCESS_TITLE).toBe(
                'Grouping Reset Completion'
            );
            expect(message.Actions.MODAL_CONFIRM).toBe('Yes');
        });
    });

    describe('ApiError', () => {
        it('should return modal body JSX element', () => {
            const element = message.ApiError.MODAL_BODY();
            expect(element.props.className).toContain('flex');
        });

        it('should contain correct error constants', () => {
            expect(message.ApiError.TITLE).toBe('Error');
            expect(message.ApiError.FEEDBACK_LINK).toBe('/feedback');
            expect(message.ApiError.FEEDBACK_TEXT2).toBe('Feedback');
            expect(message.ApiError.CLOSE_TEXT).toBe('OK');
        });
    });

    describe('RemoveMemberModals', () => {
        it('should contain correct alert and tooltip text', () => {
            expect(message.RemoveMemberModals.ALERT_DESCRIPTION).toMatch(
                /Membership changes made/i
            );

            expect(
                message.RemoveMemberModals.TOOLTIP.NO_UID_SINGLE
            ).toMatch(/UH username/i);

            expect(
                message.RemoveMemberModals.TOOLTIP.NO_UID_MULTIPLE
            ).toMatch(/UH username/i);
        });
    });

    describe('ListManagement', () => {
        it('should contain correct error messages', () => {
            expect(message.ListManagement.ERROR.EMPTY_INPUT).toMatch(
                /enter a UH member/i
            );

            expect(
                message.ListManagement.ERROR.INVALID_TEXT_INPUTS
            ).toMatch(/alphanumeric/i);

            expect(
                message.ListManagement.ERROR.CONTAINS_MEMBERS_NOT_IN_LIST
            ).toMatch(/Member/);

            expect(
                message.ListManagement.ERROR.DUPLICATE_MEMBERS_INPUT
            ).toMatch(/Duplicate/);

            expect(
                message.ListManagement.ERROR.NO_VALID_MEMBERS_TO_REMOVE
            ).toMatch(/do not exist/i);
        });
    });

    describe('AdminTable', () => {
        it('should return correct success messages', () => {
            const add = message.AdminTable.SUCCESS.ADD_BODY('Alice');
            const remove = message.AdminTable.SUCCESS.REMOVE_BODY('Bob');

            expect(add).toMatch(/Alice/);
            expect(remove).toMatch(/Bob/);
            expect(message.AdminTable.SUCCESS.ADD_TITLE).toBe(
                'Add Member'
            );
            expect(message.AdminTable.SUCCESS.REMOVE_TITLE).toBe(
                'Remove Member'
            );
        });
    });
});