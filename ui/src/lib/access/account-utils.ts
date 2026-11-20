/** Checks whether an account is departmental using its username and UH UUID. */
export const isDepartmental = (uid: string, uhUuid: string): boolean => {
    return uid === uhUuid || !uhUuid;
};
