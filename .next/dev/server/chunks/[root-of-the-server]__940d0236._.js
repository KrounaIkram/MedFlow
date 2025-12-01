module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/stripe [external] (stripe, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("stripe");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
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
"[externals]/next-auth [external] (next-auth, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next-auth", () => require("next-auth"));

module.exports = mod;
}),
"[externals]/next-auth/providers/credentials [external] (next-auth/providers/credentials, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next-auth/providers/credentials", () => require("next-auth/providers/credentials"));

module.exports = mod;
}),
"[externals]/bcryptjs [external] (bcryptjs, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("bcryptjs");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/src/pages/api/auth/[...nextauth].ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "authOptions",
    ()=>authOptions,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth__$5b$external$5d$__$28$next$2d$auth$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/next-auth [external] (next-auth, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$providers$2f$credentials__$5b$external$5d$__$28$next$2d$auth$2f$providers$2f$credentials$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/next-auth/providers/credentials [external] (next-auth/providers/credentials, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/bcryptjs [external] (bcryptjs, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
// ✅ Assurer que NEXTAUTH_SECRET existe
const secret = process.env.NEXTAUTH_SECRET;
if (!secret) {
    throw new Error("Environment variable NEXTAUTH_SECRET is not set!");
}
const authOptions = {
    providers: [
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$providers$2f$credentials__$5b$external$5d$__$28$next$2d$auth$2f$providers$2f$credentials$2c$__cjs$29$__["default"])({
            name: "Credentials",
            credentials: {
                email: {},
                password: {}
            },
            async authorize (credentials) {
                if (!credentials?.email || !credentials.password) return null;
                const user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });
                if (!user || !user.password) return null;
                const isValid = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__esm_import$29$__["compare"])(credentials.password, user.password);
                if (!isValid) return null;
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                };
            }
        })
    ],
    secret,
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt ({ token, user }) {
            if (user) token.role = user.role;
            return token;
        },
        async session ({ session, token }) {
            if (session.user) {
                session.user.role = token.role;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login"
    }
};
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth__$5b$external$5d$__$28$next$2d$auth$2c$__cjs$29$__["default"])(authOptions);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/pages/api/payments/checkout.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// pages/api/payments/checkout.ts
__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$stripe__$5b$external$5d$__$28$stripe$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/stripe [external] (stripe, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth__$5b$external$5d$__$28$next$2d$auth$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/next-auth [external] (next-auth, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$auth$2f5b2e2e2e$nextauth$5d2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/api/auth/[...nextauth].ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$stripe__$5b$external$5d$__$28$stripe$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$auth$2f5b2e2e2e$nextauth$5d2e$ts__$5b$api$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$stripe__$5b$external$5d$__$28$stripe$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$auth$2f5b2e2e2e$nextauth$5d2e$ts__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
const stripe = new __TURBOPACK__imported__module__$5b$externals$5d2f$stripe__$5b$external$5d$__$28$stripe$2c$__esm_import$29$__["default"](process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-11-17.clover"
});
const TND_TO_EUR_RATE = 3.4;
async function handler(req, res) {
    console.log("🚀 [PAYMENT] Requête reçue");
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Méthode non autorisée"
        });
    }
    // Récupérer la session
    const session = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth__$5b$external$5d$__$28$next$2d$auth$2c$__cjs$29$__["getServerSession"])(req, res, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$auth$2f5b2e2e2e$nextauth$5d2e$ts__$5b$api$5d$__$28$ecmascript$29$__["authOptions"]);
    console.log("🔐 Session récupérée :", !!session);
    if (!session) {
        return res.status(401).json({
            error: "Non authentifié"
        });
    }
    console.log("👤 Utilisateur connecté :", session.user.id, "Rôle :", session.user.role);
    if (session.user.role !== "PATIENT") {
        return res.status(403).json({
            error: "Seul un patient peut payer"
        });
    }
    const { invoiceId } = req.body;
    if (!invoiceId) {
        return res.status(400).json({
            error: "invoiceId requis"
        });
    }
    const invoice = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"].invoice.findUnique({
        where: {
            id: invoiceId
        },
        include: {
            patient: true
        }
    });
    if (!invoice) {
        return res.status(404).json({
            error: "Facture non trouvée"
        });
    }
    // Vérifier que le patient correspond
    const patient = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["prisma"].patient.findFirst({
        where: {
            ownerId: session.user.id
        }
    });
    if (!patient) {
        return res.status(403).json({
            error: "Vous n'avez pas de dossier patient."
        });
    }
    if (invoice.patientId !== patient.id) {
        return res.status(403).json({
            error: "Cette facture ne vous appartient pas."
        });
    }
    // Conversion TND → EUR
    const amountInTND = invoice.amount / 100;
    const amountInEUR = amountInTND / TND_TO_EUR_RATE;
    const amountInEURCents = Math.round(amountInEUR * 100);
    if (amountInEURCents < 50) {
        return res.status(400).json({
            error: "Montant trop faible."
        });
    }
    try {
        const checkout = await stripe.checkout.sessions.create({
            payment_method_types: [
                "card"
            ],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: `Facture #${invoice.id}`,
                            description: `Paiement - ${invoice.patient?.firstName || "Patient"}`
                        },
                        unit_amount: amountInEURCents
                    },
                    quantity: 1
                }
            ],
            success_url: `${req.headers.origin}/payment-success`,
            cancel_url: `${req.headers.origin}/payment-cancel`,
            metadata: {
                invoiceId: invoice.id
            }
        });
        return res.status(200).json({
            url: checkout.url
        });
    } catch (err) {
        console.error("💥 Erreur Stripe:", err);
        return res.status(500).json({
            error: "Erreur Stripe"
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__940d0236._.js.map