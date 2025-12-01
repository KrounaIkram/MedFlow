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
"[project]/src/pages/login.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>LoginPage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-jsx/style.js [external] (styled-jsx/style.js, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$react__$5b$external$5d$__$28$next$2d$auth$2f$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/next-auth/react [external] (next-auth/react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/sonner [external] (sonner, esm_import)");
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
function LoginPage() {
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const onSubmit = async (e)=>{
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");
        try {
            const res = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$react__$5b$external$5d$__$28$next$2d$auth$2f$react$2c$__cjs$29$__["signIn"])("credentials", {
                redirect: false,
                email,
                password
            });
            if (res?.error) {
                __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__["toast"].error("Email ou mot de passe incorrect");
            } else {
                __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__["toast"].success("Connexion réussie !");
                const sessionRes = await fetch("/api/auth/session");
                const sessionData = await sessionRes.json();
                const role = sessionData?.user?.role;
                if (role === "PATIENT") window.location.href = "/patient";
                else if (role === "DOCTOR") window.location.href = "/doctor/dashboard";
                else if (role === "RECEPTIONIST") window.location.href = "/receptionist/dashboard";
                else if (role === "ADMIN") window.location.href = "/admin/dashboard";
                else window.location.href = "/";
            }
        } catch  {
            __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__["toast"].error("Erreur serveur ou réseau");
        } finally{
            setIsLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "jsx-ae0169099621f73e" + " " + "container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "jsx-ae0169099621f73e" + " " + "leftSection",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                    src: "/doctors.png",
                    alt: "Doctors",
                    className: "jsx-ae0169099621f73e" + " " + "doctorsImage"
                }, void 0, false, {
                    fileName: "[project]/src/pages/login.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/pages/login.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "jsx-ae0169099621f73e" + " " + "rightSection",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                    onSubmit: onSubmit,
                    className: "jsx-ae0169099621f73e" + " " + "loginBox",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                            className: "jsx-ae0169099621f73e",
                            children: "Bienvenue sur DiagnoTech"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/login.tsx",
                            lineNumber: 54,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "jsx-ae0169099621f73e" + " " + "inputGroup",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                    className: "jsx-ae0169099621f73e",
                                    children: "Email"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/login.tsx",
                                    lineNumber: 57,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    type: "email",
                                    name: "email",
                                    placeholder: "Email",
                                    required: true,
                                    className: "jsx-ae0169099621f73e"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/login.tsx",
                                    lineNumber: 58,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/login.tsx",
                            lineNumber: 56,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "jsx-ae0169099621f73e" + " " + "inputGroup",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                    className: "jsx-ae0169099621f73e",
                                    children: "Mot de passe"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/login.tsx",
                                    lineNumber: 62,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    type: "password",
                                    name: "password",
                                    placeholder: "Mot de passe",
                                    required: true,
                                    minLength: 6,
                                    className: "jsx-ae0169099621f73e"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/login.tsx",
                                    lineNumber: 63,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/login.tsx",
                            lineNumber: 61,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            type: "submit",
                            disabled: isLoading,
                            className: "jsx-ae0169099621f73e" + " " + "loginBtn",
                            children: isLoading ? "Connexion..." : "Se connecter"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/login.tsx",
                            lineNumber: 66,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            className: "jsx-ae0169099621f73e" + " " + "registerText",
                            children: [
                                "Pas de compte ? ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                    href: "/register",
                                    className: "jsx-ae0169099621f73e",
                                    children: "Créer un compte"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/login.tsx",
                                    lineNumber: 71,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/login.tsx",
                            lineNumber: 70,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/login.tsx",
                    lineNumber: 53,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/pages/login.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"], {
                id: "ae0169099621f73e",
                children: ".jsx-ae0169099621f73e{box-sizing:border-box;margin:0;padding:0;font-family:Arial,sans-serif}body.jsx-ae0169099621f73e{background-color:#eaf7ff}.container.jsx-ae0169099621f73e{width:100%;height:100vh;display:flex}.leftSection.jsx-ae0169099621f73e{background-color:#4bb2fc;justify-content:center;align-items:center;width:50%;display:flex}.doctorsImage.jsx-ae0169099621f73e{width:70%;max-height:60%;display:block}.rightSection.jsx-ae0169099621f73e{background-color:#f7fcff;justify-content:center;align-items:center;width:50%;display:flex}.loginBox.jsx-ae0169099621f73e{text-align:center;background:#fff;border-radius:30px;width:70%;max-width:500px;padding:60px;box-shadow:0 4px 10px #0000001a}h2.jsx-ae0169099621f73e{color:#086df2;margin-bottom:20px}.inputGroup.jsx-ae0169099621f73e{text-align:left;margin-bottom:20px}.inputGroup.jsx-ae0169099621f73e label.jsx-ae0169099621f73e{color:#4bb2fc;margin-bottom:5px;font-size:18px;font-weight:700;display:block}.inputGroup.jsx-ae0169099621f73e input.jsx-ae0169099621f73e{border:none;border-bottom:1px solid #ccc;outline:none;width:100%;padding:10px;font-size:16px}.loginBtn.jsx-ae0169099621f73e{color:#fff;cursor:pointer;background-color:#4bb2fc;border:none;border-radius:20px;width:50%;padding:12px;font-size:18px;transition:all .3s}.loginBtn.jsx-ae0169099621f73e:hover{background-color:#054bb5}.loginBtn.jsx-ae0169099621f73e:disabled{cursor:not-allowed;background-color:#7aa7e0}.registerText.jsx-ae0169099621f73e{margin-top:15px;font-size:16px}.registerText.jsx-ae0169099621f73e a.jsx-ae0169099621f73e{color:#292b84;text-decoration:none}.registerText.jsx-ae0169099621f73e a.jsx-ae0169099621f73e:hover{text-decoration:underline}@media (width<=992px){.container.jsx-ae0169099621f73e{flex-direction:column;height:auto}.leftSection.jsx-ae0169099621f73e,.rightSection.jsx-ae0169099621f73e{width:100%;padding:40px}.loginBox.jsx-ae0169099621f73e{width:80%}.doctorsImage.jsx-ae0169099621f73e{width:60%}}@media (width<=768px){.loginBox.jsx-ae0169099621f73e{width:90%}}@media (width<=480px){h2.jsx-ae0169099621f73e{font-size:24px}.doctorsImage.jsx-ae0169099621f73e{width:80%}.loginBox.jsx-ae0169099621f73e{width:95%}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/login.tsx",
        lineNumber: 47,
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

//# sourceMappingURL=%5Broot-of-the-server%5D__2768a63b._.js.map