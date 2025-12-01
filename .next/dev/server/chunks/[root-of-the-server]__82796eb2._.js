module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/MedFlow3/src/lib/prisma.ts [api] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/MedFlow3/src/server/rbac.ts [api] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/MedFlow3/src/pages/api/invoices/index.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/MedFlow3/src/lib/prisma.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$src$2f$server$2f$rbac$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/MedFlow3/src/server/rbac.ts [api] (ecmascript)");
;
;
async function handler(req, res) {
    try {
        // GET - Liste des factures
        if (req.method === "GET") {
            const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$src$2f$server$2f$rbac$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["requireRole"])(req, res, [
                "ADMIN",
                "RECEPTIONIST"
            ]);
            if (!session) return;
            const invoices = await __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"].invoice.findMany({
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    patient: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phone: true
                        }
                    },
                    consultation: true
                }
            });
            return res.status(200).json(invoices);
        }
        // POST - Créer une facture
        if (req.method === "POST") {
            const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$src$2f$server$2f$rbac$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["requireRole"])(req, res, [
                "ADMIN",
                "RECEPTIONIST"
            ]);
            if (!session) return;
            const { patientId, consultationId, amount, currency } = req.body;
            const invoice = await __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"].invoice.create({
                data: {
                    patientId,
                    consultationId: consultationId ?? null,
                    amount,
                    currency: currency ?? "eur",
                    status: "PENDING"
                },
                include: {
                    patient: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phone: true
                        }
                    },
                    consultation: true
                }
            });
            return res.status(201).json(invoice); // ✅ Correction : 201 au lieu de 21
        }
        res.setHeader("Allow", [
            "GET",
            "POST"
        ]);
        return res.status(405).end();
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Server error"
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__82796eb2._.js.map