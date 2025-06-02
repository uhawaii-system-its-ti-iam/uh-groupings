export const message = {
    Preferences: {
        INFO: `Changes made may not take effect immediately. Usually, 3–5 minutes should be anticipated. In extreme cases, a request may take several hours to be fully processed, depending on the number of members and the synchronization destination.`,
        TITLE: 'Preferences',
        SECTION_TITLE: 'User Options',
        OPT_IN_LABEL: 'Allow people to add themselves to this group',
        OPT_OUT_LABEL: 'Allow people to remove themselves from this group',
        MODAL_TITLE: 'Preferences Information',
        MODAL_CLOSE: 'OK',
        MODAL_CANCEL: 'Cancel',
    },

    Tooltip: {
        OPT_IN: 'Enable the opt-in self-service so that new members can discover and join this grouping.',
        OPT_OUT: 'Enable the opt-out self-service so that members can leave at any time.',
        SYNC_DEST: (description: string) => `This option syncs destinations to ${description}`,
        SELECT_ALL_LIST: 'See tools tab to remove entire list',
        TRASH_ICON_REMOVAL: (group: string) =>
            `Remove member from the ${group.charAt(0).toUpperCase() + group.slice(1)} list`
    },

    SyncDestinations: {
        TITLE: 'Synchronization Destinations',
        SECTION_TITLE: 'Sync Destinations',
        MODAL_TITLE: 'Synchronization Destination Confirmation',
        MODAL_INFO_TITLE: 'Sync Destinations Information',
        MODAL_WARNING:
            'Please be thoughtful about any changes here as some changes are operationally very expensive. Avoid rapidly enabling and disabling a synchronization destination.',
        MODAL_BODY: (synced: boolean, description: string) =>
            `Are you sure you want to ${synced ? 'disable' : 'enable'} the synchronization destination: ${description}?`,
        MODAL_CONFIRM: 'Yes'
    },

    Actions: {
        TITLE: 'Grouping Actions',
        SECTION_TITLE: 'Reset Grouping',
        INCLUDE_LABEL: 'Reset Include',
        EXCLUDE_LABEL: 'Reset Exclude',
        RESET_BUTTON: 'Reset Selected',
        TOOLTIP: 'Reset the grouping by removing all of the members in the include or exclude or both.',
        MODAL_TITLE: 'Reset Grouping',
        MODAL_BODY: (isInclude: boolean, isExclude: boolean, groupName: string) => {
            const target =
                isInclude && isExclude
                    ? 'Exclude and Include lists'
                    : isInclude
                        ? 'Include list'
                        : 'Exclude list';
            return `Are you sure you want to remove all members from the ${target} in the ${groupName} grouping?`;
        },
        MODAL_CONFIRM: 'Yes',
        MODAL_INFO_TITLE: 'Actions Information',
        MODAL_SUCCESS_TITLE: 'Grouping Reset Completion',
    },

    ApiError: {
        TITLE: 'Error',
        MODAL_BODY: () => (
            <div className="flex flex-col gap-4">
                <p>There was an unexpected communications problem. Please refresh the page and try again.</p>
                <p>If the error persists please refer to our feedback page.</p>
            </div>
        ),
        FEEDBACK_LINK: '/feedback',
        FEEDBACK_TEXT2: 'Feedback',
        CLOSE_TEXT: 'OK',
        MODAL_SUCCESS_TITLE: 'Grouping Reset Completion'
    },

    RemoveMemberModals: {
        ALERT_DESCRIPTION:
            'Membership changes made may not take effect immediately. Usually, 3-5 minutes should be anticipated. In extreme cases changes may take several hours to be fully processed, depending on the number of members and the synchronization destination.',
        TOOLTIP: {
            NO_UID_SINGLE: '??screen.message.common.tool tip.username.notApplicable_e n_US??',
            NO_UID_MULTIPLE: 'This person does not have a UH username.'
        }
    },

    ListManagement: {
        ERROR: {
            EMPTY_INPUT: 'You must enter UH member to add or remove.',
            INVALID_TEXT_INPUTS: 'Input must contain only alphanumeric characters, separated by commas or spaces.',
            CONTAINS_MEMBERS_NOT_IN_LIST: `Member(s) not in the list: `,
            DUPLICATE_MEMBERS_INPUT: `Duplicate member(s) in the input: `,
            NO_VALID_MEMBERS_TO_REMOVE: `The members you've attempted to remove do not exist.`
        }
    }
};
