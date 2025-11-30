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
"[project]/src/lib/prisma.ts [api] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/server/rbac.ts [api] (ecmascript)", ((__turbopack_context__) => {
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
"[externals]/zod [external] (zod, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("zod");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/src/server/validators/prescription.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "medicationSchema",
    ()=>medicationSchema,
    "prescriptionCreateSchema",
    ()=>prescriptionCreateSchema,
    "prescriptionUpdateSchema",
    ()=>prescriptionUpdateSchema
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/zod [external] (zod, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const medicationSchema = __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].object({
    name: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].string().min(1),
    dosage: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].string().optional(),
    frequency: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].string().optional(),
    duration: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].string().optional(),
    notes: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].string().optional()
});
const prescriptionCreateSchema = __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].object({
    consultationId: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].string().min(1),
    doctorId: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].string().min(1),
    patientId: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].string().min(1),
    medications: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].array(medicationSchema).min(1),
    notes: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].string().optional()
});
const prescriptionUpdateSchema = __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].object({
    medications: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].array(medicationSchema).min(1).optional(),
    notes: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].string().optional()
});
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/pages/api/prescriptions/index.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// pages/api/prescriptions/index.ts
__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$rbac$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/rbac.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$validators$2f$prescription$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/validators/prescription.ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$validators$2f$prescription$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$validators$2f$prescription$2e$ts__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
async function handler(req, res) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$rbac$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["requireRole"])(req, res, [
            "ADMIN",
            "DOCTOR",
            "RECEPTIONIST",
            "PATIENT"
        ]);
        if (!session) return;
        // GET list
        if (req.method === "GET") {
            const { patientId, doctorId, from, to } = req.query;
            const where = {};
            // 🔒 Si c'est un PATIENT, il ne peut voir QUE ses ordonnances
            if (session.user.role === "PATIENT") {
                where.patientId = session.user.id;
            } else {
                // ADMIN / DOCTOR / RECEPTIONIST : peuvent filtrer
                if (patientId) where.patientId = String(patientId);
                if (doctorId) where.doctorId = String(doctorId);
                if (from || to) where.createdAt = {};
                if (from) where.createdAt.gte = new Date(String(from));
                if (to) where.createdAt.lte = new Date(String(to));
            }
            const list = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"].prescription.findMany({
                where,
                include: {
                    doctor: true,
                    patient: true,
                    consultation: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
            return res.status(200).json(list);
        }
        // POST create - réservé aux professionnels
        if (req.method === "POST") {
            if (session.user.role === "PATIENT") {
                return res.status(403).json({
                    error: "Non autorisé"
                });
            }
            const parse = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$validators$2f$prescription$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prescriptionCreateSchema"].safeParse(req.body);
            if (!parse.success) return res.status(400).json({
                error: parse.error.format()
            });
            const data = parse.data;
            const consult = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"].consultation.findUnique({
                where: {
                    id: data.consultationId
                }
            });
            if (!consult) return res.status(404).json({
                error: "Consultation not found"
            });
            const created = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"].prescription.create({
                data: {
                    consultationId: data.consultationId,
                    doctorId: data.doctorId,
                    patientId: data.patientId,
                    medications: data.medications,
                    notes: data.notes ?? undefined
                },
                include: {
                    doctor: true,
                    patient: true,
                    consultation: true
                }
            });
            return res.status(201).json(created);
        }
        res.setHeader("Allow", [
            "GET",
            "POST"
        ]);
        return res.status(405).end();
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8908b143._.js.map