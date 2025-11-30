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
"[externals]/pdfkit [external] (pdfkit, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("pdfkit", () => require("pdfkit"));

module.exports = mod;
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
"[project]/src/pages/api/prescriptions/[id]/pdf.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// pages/api/prescriptions/[id]/pdf.ts
__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$pdfkit__$5b$external$5d$__$28$pdfkit$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/pdfkit [external] (pdfkit, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$rbac$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/rbac.ts [api] (ecmascript)");
;
;
;
async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).end();
    }
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$rbac$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["requireRole"])(req, res, [
        "PATIENT",
        "DOCTOR",
        "ADMIN"
    ]);
    if (!session) return;
    const { id } = req.query;
    if (typeof id !== "string") {
        return res.status(400).json({
            error: "ID invalide"
        });
    }
    const prescription = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"].prescription.findUnique({
        where: {
            id
        },
        include: {
            doctor: true,
            patient: {
                include: {
                    owner: true
                }
            },
            consultation: true
        }
    });
    if (!prescription) {
        return res.status(404).json({
            error: "Ordonnance introuvable"
        });
    }
    // 🔒 Vérification d'accès
    let hasAccess = false;
    if (session.user.role === "PATIENT") {
        hasAccess = prescription.patient.ownerId === session.user.id;
    } else if (session.user.role === "DOCTOR") {
        hasAccess = prescription.doctorId === session.user.id;
    } else {
        hasAccess = true; // ADMIN
    }
    if (!hasAccess) {
        return res.status(403).json({
            error: "Accès refusé"
        });
    }
    // ✅ Génération du PDF
    try {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename=ordonnance-${prescription.id}.pdf`);
        const doc = new __TURBOPACK__imported__module__$5b$externals$5d2f$pdfkit__$5b$external$5d$__$28$pdfkit$2c$__cjs$29$__["default"]({
            size: "A4",
            margin: 50
        });
        doc.pipe(res);
        // Titre
        doc.fontSize(20).text("ORDONNANCE MÉDICALE", {
            align: "center"
        });
        doc.moveDown();
        // Médecin
        doc.fontSize(12).text(`Dr. ${prescription.doctor?.name || "Non spécifié"}`);
        if (prescription.doctor?.email) {
            doc.text(`Email: ${prescription.doctor.email}`);
        }
        doc.moveDown();
        // Patient
        doc.text(`Patient: ${prescription.patient.firstName} ${prescription.patient.lastName}`);
        if (prescription.patient.email) doc.text(`Email: ${prescription.patient.email}`);
        if (prescription.patient.phone) doc.text(`Téléphone: ${prescription.patient.phone}`);
        doc.moveDown();
        // Consultation (si liée)
        if (prescription.consultation) {
            doc.text(`Consultation du: ${new Date(prescription.consultation.datetime).toLocaleDateString("fr-FR")}`);
            if (prescription.consultation.diagnosis) {
                doc.moveDown();
                doc.text("Diagnostic:", {
                    underline: true
                });
                doc.text(prescription.consultation.diagnosis);
            }
            doc.moveDown();
        }
        // Médicaments
        doc.text("Médicaments prescrits:", {
            underline: true
        });
        const meds = prescription.medications || [];
        if (meds.length === 0) {
            doc.text("Aucun médicament prescrit.");
        } else {
            meds.forEach((m, idx)=>{
                doc.moveDown(0.2);
                const lines = [
                    `• ${m.name || "Médicament"}`
                ];
                if (m.dosage) lines.push(`Dosage: ${m.dosage}`);
                if (m.frequency) lines.push(`Fréquence: ${m.frequency}`);
                if (m.duration) lines.push(`Durée: ${m.duration} jours`);
                if (m.notes) lines.push(`Notes: ${m.notes}`);
                doc.fontSize(11).text(lines.join(" | "));
            });
        }
        doc.moveDown(2);
        doc.fontSize(10).text("Ce document a été généré électroniquement.", {
            align: "center"
        });
        doc.text("Signature non requise selon l'article R. 4127-6 du Code de la santé publique.", {
            align: "center"
        });
        doc.end();
    } catch (err) {
        console.error("Erreur génération PDF:", err);
        if (!res.headersSent) {
            res.status(500).json({
                error: "Erreur lors de la génération du PDF"
            });
        }
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f85b54fe._.js.map