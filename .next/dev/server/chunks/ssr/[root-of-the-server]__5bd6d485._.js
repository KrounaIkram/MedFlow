module.exports = [
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/src/lib/prisma.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const prisma = global.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]();
if ("TURBOPACK compile-time truthy", 1) global.prisma = prisma;
}),
"[externals]/next-auth/jwt [external] (next-auth/jwt, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next-auth/jwt", () => require("next-auth/jwt"));

module.exports = mod;
}),
"[project]/src/server/rbac.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// server/rbac.ts
__turbopack_context__.s([
    "requireRole",
    ()=>requireRole
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$jwt__$5b$external$5d$__$28$next$2d$auth$2f$jwt$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/next-auth/jwt [external] (next-auth/jwt, cjs)"); // si tu utilises next-auth
;
async function requireRole(req, res, allowedRoles) {
    const token = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$jwt__$5b$external$5d$__$28$next$2d$auth$2f$jwt$2c$__cjs$29$__["getToken"])({
        req
    });
    if (!token) {
        res.status(401).json({
            error: "Not authenticated"
        });
        return null;
    }
    // token.sub = ID utilisateur
    const session = {
        user: {
            id: token.sub,
            role: token.role
        }
    };
    if (!allowedRoles.includes(session.user.role)) {
        res.status(403).json({
            error: "Forbidden"
        });
        return null;
    }
    return session;
}
}),
"[project]/src/pages/admin/dashboard.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// pages/api/admin/clinic.ts
__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$rbac$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/rbac.ts [ssr] (ecmascript)");
;
;
async function handler(req, res) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$rbac$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["requireRole"])(req, res, [
        "ADMIN"
    ]);
    if (!session) return;
    if (req.method === "GET") {
        const clinic = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["prisma"].clinic.findFirst({
            where: {
                ownerId: session.user.id
            }
        });
        return res.status(200).json(clinic);
    }
    if (req.method === "PUT") {
        const { name, address, phone, email, logo } = req.body;
        const clinic = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["prisma"].clinic.findFirst({
            where: {
                ownerId: session.user.id
            }
        });
        if (!clinic) {
            return res.status(404).json({
                error: "Clinique non trouvée"
            });
        }
        const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["prisma"].clinic.update({
            where: {
                id: clinic.id
            },
            data: {
                name,
                address,
                phone,
                email,
                logo
            }
        });
        return res.status(200).json(updated);
    }
    res.setHeader("Allow", [
        "GET",
        "PUT"
    ]);
    return res.status(405).json({
        error: "Méthode non autorisée"
    });
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5bd6d485._.js.map