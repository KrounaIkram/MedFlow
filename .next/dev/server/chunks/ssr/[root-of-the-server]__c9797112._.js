module.exports = [
"[externals]/next-auth/next [external] (next-auth/next, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next-auth/next", () => require("next-auth/next"));

module.exports = mod;
}),
"[project]/src/pages/admin/dashboard.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/server/rbac.ts
__turbopack_context__.s([
    "requireRole",
    ()=>requireRole
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$next__$5b$external$5d$__$28$next$2d$auth$2f$next$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/next-auth/next [external] (next-auth/next, cjs)");
(()=>{
    const e = new Error("Cannot find module '../lib/auth'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
async function requireRole(req, res, roles = []) {
    const session = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$next__$5b$external$5d$__$28$next$2d$auth$2f$next$2c$__cjs$29$__["getServerSession"])(req, res, authOptions);
    if (!session) {
        res.status(401).json({
            error: "Not authenticated"
        });
        return null;
    }
    if (roles.length && !roles.includes(session.user.role)) {
        res.status(403).json({
            error: "Access denied"
        });
        return null;
    }
    return session;
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c9797112._.js.map