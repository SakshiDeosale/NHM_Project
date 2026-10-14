
export const ROLE_PERMISSIONS = {
    "Superintending Engineer": {
        excluded: [],
    },

    "Executive Engineer": {
        excluded: ["/settings", "/setting"],
    },

    "Deputy Engineer": {
        excluded: ["/settings", "/setting"],
    },

    "Junior Engineer": {
        excluded: ["/settings", "/setting"],
    },

    Amdar: {
        excluded: ["/settings", "/setting", "/report", "/users"],
    },

    Khasdar: {
        excluded: ["/settings", "/setting", "/report", "/users"],
    },

    Contractor: {
        excluded: ["/settings", "/setting", "/report", "/users"],
    },
};

export function canAccessPath(designation, pathname) {
    const permissions = ROLE_PERMISSIONS[designation];

    if (!permissions) return false;

    return !permissions.excluded.some(
        (path) =>
            pathname === path || pathname.startsWith(`${path}/`)
    );
}
