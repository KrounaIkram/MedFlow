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
"[project]/src/pages/api/appointments/index.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// pages/api/appointments/index.ts
__turbopack_context__.s([
    "default",
    ()=>handler
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
// Durée par type
const DurationByType = {
    CONSULTATION: 30,
    URGENCY: 60,
    FOLLOW_UP: 20,
    CONTROL: 45
};
// Schema pour création RDV
const createSchema = __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].object({
    date: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].string().datetime({
        message: "Date invalide (format ISO requis)"
    }),
    type: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].enum([
        "CONSULTATION",
        "URGENCY",
        "FOLLOW_UP",
        "CONTROL"
    ]),
    doctorName: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].string().min(3, "Nom du docteur requis"),
    patientName: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].string().min(3, "Nom du patient requis").optional(),
    notes: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].string().optional()
});
// Schema pour modification RDV
const updateSchema = __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].object({
    appointmentId: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].string(),
    date: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].string().datetime({
        message: "Date invalide (format ISO requis)"
    }),
    type: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$29$__["z"].enum([
        "CONSULTATION",
        "URGENCY",
        "FOLLOW_UP",
        "CONTROL"
    ]),
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
    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
        where: {
            id: session.user.id
        }
    });
    if (!user) return res.status(400).json({
        error: "Utilisateur introuvable"
    });
    // POST - Créer un RDV
    if (req.method === "POST") {
        const parse = createSchema.safeParse(req.body);
        if (!parse.success) return res.status(400).json({
            error: parse.error.format()
        });
        const { date: dateString, type, doctorName, patientName, notes } = parse.data;
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return res.status(400).json({
            error: "Date invalide"
        });
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
        let patient;
        if (user.role === "PATIENT") {
            patient = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"].patient.findFirst({
                where: {
                    ownerId: user.id
                }
            });
            if (!patient) {
                const [firstNamePart, ...lastNameParts] = (user.name || "Inconnu").split(" ");
                const firstName = firstNamePart;
                const lastName = lastNameParts.join(" ");
                patient = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"].patient.create({
                    data: {
                        firstName,
                        lastName: lastName || "",
                        email: user.email,
                        owner: {
                            connect: {
                                id: user.id
                            }
                        }
                    }
                });
            }
        } else {
            if (!patientName) return res.status(400).json({
                error: "Nom du patient requis"
            });
            const [firstName, ...lastNameParts] = patientName.trim().split(" ");
            const lastName = lastNameParts.join(" ");
            patient = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"].patient.findFirst({
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
        }
        const duration = DurationByType[type];
        const available = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$appointments$2f$checkAvailability$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["isDoctorAvailable"])(doctor.id, date, duration);
        if (!available) return res.status(409).json({
            error: "Docteur non disponible à cette heure"
        });
        if (user.role === "PATIENT" && user.id !== patient.ownerId) return res.status(403).json({
            error: "Vous ne pouvez créer que vos propres RDV"
        });
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
                doctor: {
                    select: {
                        name: true
                    }
                },
                patient: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });
        return res.status(201).json({
            message: "Rendez-vous créé avec succès !",
            appointment
        });
    }
    // PUT - Modifier un RDV
    if (req.method === "PUT") {
        const parse = updateSchema.safeParse(req.body);
        if (!parse.success) return res.status(400).json({
            error: parse.error.format()
        });
        const { appointmentId: appointmentIdStr, date: dateString, type, notes } = parse.data;
        const appointmentId = parseInt(appointmentIdStr, 10);
        if (isNaN(appointmentId)) return res.status(400).json({
            error: "ID invalide"
        });
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return res.status(400).json({
            error: "Date invalide"
        });
        const appointment = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"].appointment.findUnique({
            where: {
                id: appointmentId
            },
            include: {
                doctor: true,
                patient: true
            }
        });
        if (!appointment) return res.status(404).json({
            error: "Rendez-vous introuvable"
        });
        const patient = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"].patient.findFirst({
            where: {
                ownerId: session.user.id
            }
        });
        // Vérif que le patient modifie seulement son RDV
        if (session.user.role === "PATIENT" && appointment.patientId !== patient?.id) {
            return res.status(403).json({
                error: "Vous ne pouvez modifier que vos propres RDV"
            });
        }
        const duration = DurationByType[type];
        const available = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$appointments$2f$checkAvailability$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["isDoctorAvailable"])(appointment.doctorId, date, duration);
        if (!available) return res.status(409).json({
            error: "Docteur non disponible à cette heure"
        });
        const updatedAppointment = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"].appointment.update({
            where: {
                id: appointmentId
            },
            data: {
                date,
                type,
                duration,
                notes
            },
            include: {
                doctor: true,
                patient: true
            }
        });
        return res.status(200).json({
            message: "Rendez-vous mis à jour avec succès !",
            appointment: updatedAppointment
        });
    }
    // GET - Liste tous les RDV ou ceux du patient
    if (req.method === "GET") {
        if (user.role === "PATIENT") {
            const patient = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"].patient.findFirst({
                where: {
                    ownerId: user.id
                }
            });
            if (!patient) return res.status(200).json([]);
            const appts = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"].appointment.findMany({
                where: {
                    patientId: patient.id
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

//# sourceMappingURL=%5Broot-of-the-server%5D__f399cb0a._.js.map