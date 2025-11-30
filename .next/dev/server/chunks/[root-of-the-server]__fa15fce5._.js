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
"[project]/src/server/appointments/checkAvailability.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// server/appointments/checkAvailability.ts
__turbopack_context__.s([
    "isDoctorAvailable",
    ()=>isDoctorAvailable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [api] (ecmascript)");
;
async function isDoctorAvailable(doctorId, startDate, durationInMinutes) {
    const start = startDate;
    const end = new Date(startDate.getTime() + durationInMinutes * 60 * 1000);
    const appointments = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"].appointment.findMany({
        where: {
            doctorId,
            status: "SCHEDULED"
        }
    });
    for (const appt of appointments){
        const apptStart = appt.date;
        const apptEnd = new Date(apptStart.getTime() + appt.duration * 60 * 1000);
        // Chevauchement si : nouveau commence pendant existant OU existant commence pendant nouveau
        if (start < apptEnd && end > apptStart) {
            return false;
        }
    }
    return true;
}
}),
"[project]/src/pages/api/appointments/[id].ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// pages/api/appointments/index.ts
__turbopack_context__.s([
    "default",
    ()=>handler,
    "getDurationForType",
    ()=>getDurationForType
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$rbac$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/rbac.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/zod [external] (zod, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$appointments$2f$checkAvailability$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/appointments/checkAvailability.ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
function getDurationForType(type) {
    switch(type){
        case "CONSULTATION":
            return 30;
        case "URGENCY":
            return 15;
        case "FOLLOW_UP":
            return 20;
        case "CONTROL":
            return 10;
        default:
            return 30;
    }
}
// Schema création RDV
const createSchema = __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].object({
    date: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].string().datetime(),
    type: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].enum([
        "CONSULTATION",
        "URGENCY",
        "FOLLOW_UP",
        "CONTROL"
    ]),
    doctorName: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].string(),
    patientName: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].string(),
    notes: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].string().optional()
});
async function handler(req, res) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$rbac$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["requireRole"])(req, res, [
        "ADMIN",
        "DOCTOR",
        "RECEPTIONIST",
        "PATIENT"
    ]);
    if (!session) return;
    // POST - Créer un RDV
    if (req.method === "POST") {
        const parse = createSchema.safeParse(req.body);
        if (!parse.success) return res.status(400).json({
            error: parse.error.format()
        });
        const { date: dateStr, type, doctorName, patientName, notes } = parse.data;
        const date = new Date(dateStr);
        const duration = getDurationForType(type);
        // Vérif disponibilité docteur
        const available = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$appointments$2f$checkAvailability$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["isDoctorAvailable"])(doctorName, date, duration);
        if (!available) return res.status(409).json({
            error: "Docteur non disponible à cette heure"
        });
        // Optionnel : patient ne peut créer que pour lui-même
        if (session.user.role === "PATIENT" && session.user.id !== patientName) {
            return res.status(403).json({
                error: "Vous ne pouvez créer que vos propres RDV"
            });
        }
        // Recherche docteur par nom
        const doctor = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"].user.findFirst({
            where: {
                role: "DOCTOR",
                name: {
                    contains: doctorName,
                    mode: "insensitive"
                }
            }
        });
        if (!doctor) return res.status(400).json({
            error: `Docteur "${doctorName}" non trouvé`
        });
        // Recherche patient par nom complet
        const [firstName, ...lastNameParts] = patientName.trim().split(" ");
        const lastName = lastNameParts.join(" ");
        const patient = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"].patient.findFirst({
            where: {
                firstName: {
                    contains: firstName,
                    mode: "insensitive"
                },
                ...lastName ? {
                    lastName: {
                        contains: lastName,
                        mode: "insensitive"
                    }
                } : {}
            }
        });
        if (!patient) return res.status(400).json({
            error: `Patient "${patientName}" non trouvé`
        });
        // Création du RDV avec les IDs corrects
        const appointment = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"].appointment.create({
            data: {
                date,
                duration,
                type,
                status: "SCHEDULED",
                doctorId: doctor.id,
                patientId: patient.id,
                notes
            },
            include: {
                doctor: true,
                patient: true
            }
        });
        return res.status(201).json({
            message: "Rendez-vous créé avec succès !",
            appointment
        });
    }
    // GET - Liste tous les RDV
    if (req.method === "GET") {
        if (session.user.role === "PATIENT") {
            const appts = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"].appointment.findMany({
                where: {
                    patientId: session.user.id
                },
                include: {
                    doctor: true
                },
                orderBy: {
                    date: "asc"
                }
            });
            return res.status(200).json(appts);
        }
        const appts = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"].appointment.findMany({
            include: {
                doctor: true,
                patient: true
            },
            orderBy: {
                date: "asc"
            }
        });
        return res.status(200).json(appts);
    }
    return res.status(405).end();
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__fa15fce5._.js.map