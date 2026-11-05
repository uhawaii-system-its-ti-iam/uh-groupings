// Admin context applies whenever any originating section value is admin.
export const isAdminContext = (value: string | string[] | null | undefined): boolean => {
    return Array.isArray(value) ? value.includes('admin') : value === 'admin';
};
