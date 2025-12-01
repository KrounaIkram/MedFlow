module.exports = [
"[project]/src/pages/admin/dashboard.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// pages/api/admin/clinic.ts
__turbopack_context__.s([
    "default",
    ()=>handler
]);
(()=>{
    const e = new Error("Cannot find module '../../../lib/prisma'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '../../../server/rbac'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
async function handler(req, res) {
    const session = await requireRole(req, res, [
        "ADMIN"
    ]);
    if (!session) return;
    if (req.method === "GET") {
        const clinic = await prisma.clinic.findFirst({
            where: {
                ownerId: session.user.id
            }
        });
        return res.status(200).json(clinic);
    }
    if (req.method === "PUT") {
        const { name, address, phone, email, logo } = req.body;
        const clinic = await prisma.clinic.findFirst({
            where: {
                ownerId: session.user.id
            }
        });
        if (!clinic) {
            return res.status(404).json({
                error: "Clinique non trouvée"
            });
        }
        const updated = await prisma.clinic.update({
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

//# sourceMappingURL=%5Broot-of-the-server%5D__c064d593._.js.map