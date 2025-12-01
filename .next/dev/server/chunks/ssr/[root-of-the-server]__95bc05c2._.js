module.exports = [
"[externals]/styled-jsx/style.js [external] (styled-jsx/style.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("styled-jsx/style.js", () => require("styled-jsx/style.js"));

module.exports = mod;
}),
"[externals]/sonner [external] (sonner, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("sonner");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/pages/register.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>RegisterPage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-jsx/style.js [external] (styled-jsx/style.js, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/sonner [external] (sonner, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
"use client";
;
;
;
;
;
function RegisterPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const onSubmit = async (e)=>{
        e.preventDefault();
        setIsLoading(true);
        const fd = new FormData(e.currentTarget);
        const payload = {
            name: fd.get("name"),
            email: fd.get("email"),
            password: fd.get("password"),
            role: fd.get("role") || "PATIENT"
        };
        try {
            const res = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            if (res.ok) {
                __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__["toast"].success("Compte créé avec succès !");
                setTimeout(()=>router.push("/login"), 1500);
            } else {
                __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__["toast"].error(result.error ?? "Erreur lors de l'inscription");
            }
        } catch  {
            __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__["toast"].error("Erreur de connexion au serveur");
        } finally{
            setIsLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "jsx-e6172da15952c10e" + " " + "container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "jsx-e6172da15952c10e" + " " + "leftSection",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                    src: "/doctors.png",
                    alt: "Doctors",
                    className: "jsx-e6172da15952c10e" + " " + "doctorsImage"
                }, void 0, false, {
                    fileName: "[project]/src/pages/register.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/pages/register.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "jsx-e6172da15952c10e" + " " + "rightSection",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                    onSubmit: onSubmit,
                    className: "jsx-e6172da15952c10e" + " " + "loginBox",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                            className: "jsx-e6172da15952c10e",
                            children: "Créer un compte DiagnoTech"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/register.tsx",
                            lineNumber: 55,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "jsx-e6172da15952c10e" + " " + "inputGroup",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                    className: "jsx-e6172da15952c10e",
                                    children: "Nom & Prénom"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/register.tsx",
                                    lineNumber: 58,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    name: "name",
                                    placeholder: "Votre nom",
                                    required: true,
                                    className: "jsx-e6172da15952c10e"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/register.tsx",
                                    lineNumber: 59,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/register.tsx",
                            lineNumber: 57,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "jsx-e6172da15952c10e" + " " + "inputGroup",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                    className: "jsx-e6172da15952c10e",
                                    children: "Email"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/register.tsx",
                                    lineNumber: 63,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    type: "email",
                                    name: "email",
                                    placeholder: "Email",
                                    required: true,
                                    className: "jsx-e6172da15952c10e"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/register.tsx",
                                    lineNumber: 64,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/register.tsx",
                            lineNumber: 62,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "jsx-e6172da15952c10e" + " " + "inputGroup",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                    className: "jsx-e6172da15952c10e",
                                    children: "Mot de passe"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/register.tsx",
                                    lineNumber: 68,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    type: "password",
                                    name: "password",
                                    placeholder: "Mot de passe",
                                    required: true,
                                    minLength: 6,
                                    className: "jsx-e6172da15952c10e"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/register.tsx",
                                    lineNumber: 69,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/register.tsx",
                            lineNumber: 67,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "jsx-e6172da15952c10e" + " " + "inputGroup",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                    className: "jsx-e6172da15952c10e",
                                    children: "Rôle"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/register.tsx",
                                    lineNumber: 73,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                    name: "role",
                                    defaultValue: "PATIENT",
                                    className: "jsx-e6172da15952c10e",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: "DOCTOR",
                                            className: "jsx-e6172da15952c10e",
                                            children: "DOCTOR"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/register.tsx",
                                            lineNumber: 75,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: "RECEPTIONIST",
                                            className: "jsx-e6172da15952c10e",
                                            children: "RECEPTIONIST"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/register.tsx",
                                            lineNumber: 76,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: "PATIENT",
                                            className: "jsx-e6172da15952c10e",
                                            children: "PATIENT"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/register.tsx",
                                            lineNumber: 77,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/register.tsx",
                                    lineNumber: 74,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/register.tsx",
                            lineNumber: 72,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            type: "submit",
                            disabled: isLoading,
                            className: "jsx-e6172da15952c10e" + " " + "loginBtn",
                            children: isLoading ? "Création..." : "S'inscrire"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/register.tsx",
                            lineNumber: 81,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            className: "jsx-e6172da15952c10e" + " " + "registerText",
                            children: [
                                "Déjà un compte ? ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                    href: "/login",
                                    className: "jsx-e6172da15952c10e",
                                    children: "Se connecter"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/register.tsx",
                                    lineNumber: 86,
                                    columnNumber: 30
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/register.tsx",
                            lineNumber: 85,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/register.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/pages/register.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"], {
                id: "e6172da15952c10e",
                children: ".container.jsx-e6172da15952c10e{width:100%;height:100vh;display:flex}.leftSection.jsx-e6172da15952c10e{background-color:#4bb2fc;justify-content:center;align-items:center;width:50%;display:flex}.doctorsImage.jsx-e6172da15952c10e{width:70%;max-height:60%}.rightSection.jsx-e6172da15952c10e{background-color:#f7fcff;justify-content:center;align-items:center;width:50%;display:flex}.loginBox.jsx-e6172da15952c10e{text-align:center;background:#fff;border-radius:30px;width:70%;max-width:500px;padding:60px;box-shadow:0 4px 10px #0000001a}h2.jsx-e6172da15952c10e{color:#086df2;margin-bottom:20px}.inputGroup.jsx-e6172da15952c10e{text-align:left;margin-bottom:20px}.inputGroup.jsx-e6172da15952c10e label.jsx-e6172da15952c10e{color:#4bb2fc;margin-bottom:5px;font-size:18px;font-weight:700;display:block}.inputGroup.jsx-e6172da15952c10e input.jsx-e6172da15952c10e,.inputGroup.jsx-e6172da15952c10e select.jsx-e6172da15952c10e{border:none;border-bottom:1px solid #ccc;outline:none;width:100%;padding:10px;font-size:16px}.loginBtn.jsx-e6172da15952c10e{color:#fff;cursor:pointer;background-color:#4bb2fc;border:none;border-radius:20px;width:50%;padding:12px;font-size:18px;transition:all .3s}.loginBtn.jsx-e6172da15952c10e:hover{background-color:#054bb5}.loginBtn.jsx-e6172da15952c10e:disabled{cursor:not-allowed;background-color:#7aa7e0}.registerText.jsx-e6172da15952c10e{margin-top:15px;font-size:16px}.registerText.jsx-e6172da15952c10e a.jsx-e6172da15952c10e{color:#292b84;text-decoration:none}.registerText.jsx-e6172da15952c10e a.jsx-e6172da15952c10e:hover{text-decoration:underline}@media (width<=992px){.container.jsx-e6172da15952c10e{flex-direction:column;height:auto}.leftSection.jsx-e6172da15952c10e,.rightSection.jsx-e6172da15952c10e{width:100%;padding:40px}.loginBox.jsx-e6172da15952c10e{width:80%}.doctorsImage.jsx-e6172da15952c10e{width:60%}}@media (width<=768px){.loginBox.jsx-e6172da15952c10e{width:90%}}@media (width<=480px){h2.jsx-e6172da15952c10e{font-size:24px}.doctorsImage.jsx-e6172da15952c10e{width:80%}.loginBox.jsx-e6172da15952c10e{width:95%}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/register.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__95bc05c2._.js.map