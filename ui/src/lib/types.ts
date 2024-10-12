export type Announcement = {
    message: string;
    start: string;
    end: string;
    state: string;
};

export type Announcements = {
    resultCode: string;
    announcements: Announcement[];
};

export type GroupingResult = {
    resultCode: string;
    groupPath: string;
};

export type MemberResult = {
    uid: string;
    uhUuid: string;
    name: string;
    firstName: string;
    lastName: string;
};

export type GroupingPath = {
    path: string;
    name: string;
    description: string;
};

export type GroupingPaths = {
    resultCode: string;
    groupingPaths: GroupingPath[];
};

export type Membership = {
    inBasis: boolean;
    inInclude: boolean;
    inExclude: boolean;
    inOwner: boolean;
    inBasisAndInclude: boolean;
    optOutEnabled: boolean;
    optInEnabled: boolean;
    selfOpted: boolean;
} & GroupingPath;

export type MembershipResults = {
    resultCode: string;
    results: Membership[];
};

export type GroupingMember = {
    whereListed: string;
} & MemberResult;

export type GroupingMembers = {
    members: GroupingMember[];
};

export type GroupingGroupMember = {
    resultCode: string;
} & MemberResult;

export type GroupingGroupMembers = {
    members: GroupingGroupMember[];
} & GroupingResult;

export type GroupingGroupsMembers = {
    groupsMembersList: GroupingGroupMembers[];
    isBasis: boolean;
    isInclude: boolean;
    isExclude: boolean;
    isOwners: boolean;
    paginationComplete: boolean;
    allMembers: GroupingMembers;
    pageNumber: number;
} & GroupingResult;

export type GroupingDescription = {
    description: string;
} & GroupingResult;

export type GroupingSyncDestination = {
    name: string;
    description: string;
    tooltip: string;
    synced: boolean;
    hidden: boolean;
};

export type GroupingSyncDestinations = {
    resultCode: string;
    syncDestinations: GroupingSyncDestination[];
};

export type GroupingOptAttributes = {
    optInOn: boolean;
    optOutOn: boolean;
} & GroupingResult;

export type GroupingUpdateDescriptionResult = {
    currentDescription: string;
    updatedDescription: string;
} & GroupingResult;

export type GroupingAddResult = GroupingResult | MemberResult;

export type GroupingAddResults = {
    results: GroupingAddResult[];
} & GroupingResult;

export type GroupingRemoveResult = GroupingResult | MemberResult;

export type GroupingRemoveResults = {
    results: GroupingRemoveResult[];
} & GroupingResult;

export type GroupingMoveMemberResult = {
    addResult: GroupingAddResult;
    removeResult: GroupingRemoveResult;
} & GroupingResult;

export type GroupingMoveMembersResult = {
    addResults: GroupingAddResults;
    removeResults: GroupingRemoveResults;
} & GroupingResult;

export type MemberAttributeResults = {
    resultCode: string;
    invalid: string[];
    results: MemberResult[];
};

export type ApiSubError = {
    message: string;
};

export type ApiValidationError = {
    object: string;
    field: string;
    rejectedValue: unknown;
} & ApiSubError;

export type ApiError = {
    status: string;
    timestamp: string;
    message: string;
    debugMessage: string;
    subErrors: ApiValidationError[];
};

export type Feedback = {
    name?: string;
    email: string;
    type: string;
    message: string;
    exceptionMessage?: string;
};

export type EmailResult = {
    resultCode: string;
    recipient: string;
    from: string;
    subject: string;
    text: string;
};
