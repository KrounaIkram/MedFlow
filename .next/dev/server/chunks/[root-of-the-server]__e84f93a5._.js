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
"[externals]/zod [external] (zod, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("zod");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/MedFlow3/src/server/validators/consultation.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// server/validators/consultation.ts
__turbopack_context__.s([
    "consultationCreateSchema",
    ()=>consultationCreateSchema,
    "consultationUpdateSchema",
    ()=>consultationUpdateSchema
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/zod [external] (zod, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const consultationCreateSchema = __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].object({
    patientId: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].string().min(1, "Patient ID is required"),
    datetime: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].coerce.date(),
    duration: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].number().int().positive().optional(),
    diagnosis: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].string().min(1, "Diagnosis is required").optional(),
    notes: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].string().optional()
});
const consultationUpdateSchema = __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].object({
    datetime: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].string().datetime().optional(),
    duration: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].number().int().positive().optional(),
    diagnosis: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].string().optional(),
    notes: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].string().optional()
});
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
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
"[project]/MedFlow3/src/pages/api/consultations/index.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// pages/api/consultations/index.ts
__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/MedFlow3/src/lib/prisma.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$src$2f$server$2f$validators$2f$consultation$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/MedFlow3/src/server/validators/consultation.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$src$2f$server$2f$rbac$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/MedFlow3/src/server/rbac.ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$src$2f$server$2f$validators$2f$consultation$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$src$2f$server$2f$validators$2f$consultation$2e$ts__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
async function handler(req, res) {
    try {
        if (req.method === "GET") {
            const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$src$2f$server$2f$rbac$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["requireRole"])(req, res, [
                "ADMIN",
                "DOCTOR",
                "RECEPTIONIST",
                "PATIENT"
            ]);
            if (!session) return;
            const { doctorId, patientId, from, to } = req.query;
            const where = {};
            if (session.user.role === "PATIENT") {
                const patientRecord = await __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"].patient.findFirst({
                    where: {
                        ownerId: session.user.id
                    }
                });
                if (!patientRecord) {
                    return res.status(404).json({
                        error: "Patient record not found"
                    });
                }
                where.patientId = patientRecord.id;
            } else {
                if (doctorId) where.doctorId = String(doctorId);
                if (patientId) where.patientId = String(patientId);
            }
            if (from || to) where.datetime = {};
            if (from) where.datetime.gte = new Date(String(from));
            if (to) where.datetime.lte = new Date(String(to));
            const consultations = await __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"].consultation.findMany({
                where,
                orderBy: {
                    datetime: "desc"
                },
                include: {
                    doctor: true,
                    patient: {
                        include: {
                            owner: true
                        }
                    },
                    prescription: true
                }
            });
            return res.status(200).json(consultations);
        }
        if (req.method === "POST") {
            const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$src$2f$server$2f$rbac$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["requireRole"])(req, res, [
                "ADMIN",
                "DOCTOR",
                "RECEPTIONIST"
            ]);
            if (!session) return;
            const parse = __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$src$2f$server$2f$validators$2f$consultation$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["consultationCreateSchema"].safeParse(req.body);
            if (!parse.success) {
                return res.status(400).json({
                    error: "Invalid input",
                    details: parse.error.flatten()
                });
            }
            const { patientId, datetime, duration, diagnosis, notes } = parse.data;
            const doctorId = session.user.id;
            const doctor = await __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
                where: {
                    id: doctorId,
                    role: "DOCTOR"
                }
            });
            if (!doctor) {
                return res.status(403).json({
                    error: "You must be a doctor to create a consultation"
                });
            }
            const patient = await __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"].patient.findUnique({
                where: {
                    id: patientId
                }
            });
            if (!patient) {
                return res.status(404).json({
                    error: "Patient not found"
                });
            }
            const created = await __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"].consultation.create({
                data: {
                    doctorId,
                    patientId,
                    datetime: new Date(datetime),
                    diagnosis,
                    notes,
                    duration
                },
                include: {
                    doctor: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    patient: {
                        include: {
                            owner: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            });
            return res.status(201).json(created);
        }
        res.setHeader("Allow", [
            "GET",
            "POST"
        ]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    } catch (err) {
        console.error("API consultation error:", err);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e84f93a5._.js.map