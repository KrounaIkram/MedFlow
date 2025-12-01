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
"[project]/MedFlow3/src/pages/receptionist/dashboard.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>ReceptionistDashboard
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-jsx/style.js [external] (styled-jsx/style.js, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
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
function ReceptionistDashboard() {
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("appointments");
    const [appointments, setAppointments] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [patients, setPatients] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [doctors, setDoctors] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [consultations, setConsultations] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [invoices, setInvoices] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [newPatient, setNewPatient] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        firstName: "",
        lastName: "",
        email: "",
        phone: ""
    });
    const [newInvoice, setNewInvoice] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        patientId: "",
        consultationId: "",
        amount: ""
    });
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const loadData = async ()=>{
            const [apptRes, patRes, docRes, consultRes, invRes] = await Promise.all([
                fetch("/api/appointments"),
                fetch("/api/patients"),
                fetch("/api/users/doctors"),
                fetch("/api/consultations"),
                fetch("/api/invoices")
            ]);
            if (apptRes.ok) setAppointments(await apptRes.json());
            if (patRes.ok) setPatients(await patRes.json());
            if (docRes.ok) setDoctors(await docRes.json());
            if (consultRes.ok) setConsultations(await consultRes.json());
            if (invRes.ok) setInvoices(await invRes.json());
        };
        loadData();
    }, []);
    const handleCreatePatient = async (e)=>{
        e.preventDefault();
        try {
            const res = await fetch("/api/patients", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newPatient)
            });
            if (res.ok) {
                const newPat = await res.json();
                setPatients((prev)=>[
                        ...prev,
                        newPat
                    ]);
                setNewPatient({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: ""
                });
                __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__["toast"].success("Patient créé avec succès !");
            } else {
                const err = await res.json().catch(()=>({}));
                __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__["toast"].error(err.error || "Erreur lors de la création du patient");
            }
        } catch  {
            __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__["toast"].error("Erreur réseau");
        }
    };
    const handleCreateInvoice = async (e)=>{
        e.preventDefault();
        const amountNum = parseFloat(newInvoice.amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__["toast"].error("Veuillez entrer un montant valide");
            return;
        }
        try {
            const res = await fetch("/api/invoices", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    patientId: newInvoice.patientId,
                    consultationId: newInvoice.consultationId || undefined,
                    amount: Math.round(amountNum * 100),
                    currency: "tnd"
                })
            });
            if (res.ok) {
                const newInv = await res.json();
                setInvoices((prev)=>[
                        newInv,
                        ...prev
                    ]);
                setNewInvoice({
                    patientId: "",
                    consultationId: "",
                    amount: ""
                });
                __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__["toast"].success("Facture créée !");
            } else {
                const err = await res.json().catch(()=>({}));
                __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__["toast"].error(err.error || "Erreur lors de la création de la facture");
            }
        } catch  {
            __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__["toast"].error("Erreur réseau");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "jsx-8afcf41604b5c163" + " " + "dashboardWrapper",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "jsx-8afcf41604b5c163" + " " + "dashboardContainer",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                        className: "jsx-8afcf41604b5c163",
                        children: "Dashboard Réceptionniste"
                    }, void 0, false, {
                        fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "jsx-8afcf41604b5c163" + " " + "tabs",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab("appointments"),
                                className: "jsx-8afcf41604b5c163" + " " + ((activeTab === "appointments" ? "active" : "") || ""),
                                children: "🗓️ Rendez-vous"
                            }, void 0, false, {
                                fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                lineNumber: 104,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab("patients"),
                                className: "jsx-8afcf41604b5c163" + " " + ((activeTab === "patients" ? "active" : "") || ""),
                                children: "👤 Patients"
                            }, void 0, false, {
                                fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                lineNumber: 105,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab("invoices"),
                                className: "jsx-8afcf41604b5c163" + " " + ((activeTab === "invoices" ? "active" : "") || ""),
                                children: "💰 Facturation"
                            }, void 0, false, {
                                fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                lineNumber: 106,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this),
                    activeTab === "appointments" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "jsx-8afcf41604b5c163" + " " + "section",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                className: "jsx-8afcf41604b5c163",
                                children: "Liste des Rendez-vous"
                            }, void 0, false, {
                                fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                lineNumber: 111,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-8afcf41604b5c163" + " " + "tableWrapper",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                                    className: "jsx-8afcf41604b5c163",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                            className: "jsx-8afcf41604b5c163",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                className: "jsx-8afcf41604b5c163",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                        className: "jsx-8afcf41604b5c163",
                                                        children: "Patient"
                                                    }, void 0, false, {
                                                        fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                        lineNumber: 116,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                        className: "jsx-8afcf41604b5c163",
                                                        children: "Docteur"
                                                    }, void 0, false, {
                                                        fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                        lineNumber: 117,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                        className: "jsx-8afcf41604b5c163",
                                                        children: "Date"
                                                    }, void 0, false, {
                                                        fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                        lineNumber: 118,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                        className: "jsx-8afcf41604b5c163",
                                                        children: "Type"
                                                    }, void 0, false, {
                                                        fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                        lineNumber: 119,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                        className: "jsx-8afcf41604b5c163",
                                                        children: "Statut"
                                                    }, void 0, false, {
                                                        fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                        lineNumber: 120,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                lineNumber: 115,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                            lineNumber: 114,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                            className: "jsx-8afcf41604b5c163",
                                            children: appointments.map((appt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                    className: "jsx-8afcf41604b5c163",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            className: "jsx-8afcf41604b5c163",
                                                            children: [
                                                                appt.patient.firstName,
                                                                " ",
                                                                appt.patient.lastName
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                            lineNumber: 126,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            className: "jsx-8afcf41604b5c163",
                                                            children: appt.doctor.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                            lineNumber: 127,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            className: "jsx-8afcf41604b5c163",
                                                            children: new Date(appt.date).toLocaleString()
                                                        }, void 0, false, {
                                                            fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                            lineNumber: 128,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            className: "jsx-8afcf41604b5c163",
                                                            children: appt.type
                                                        }, void 0, false, {
                                                            fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                            lineNumber: 129,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            className: "jsx-8afcf41604b5c163",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "jsx-8afcf41604b5c163" + " " + `status ${appt.status.toLowerCase()}`,
                                                                children: appt.status
                                                            }, void 0, false, {
                                                                fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                                lineNumber: 131,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                            lineNumber: 130,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, appt.id, true, {
                                                    fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                    lineNumber: 125,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                            lineNumber: 123,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                    lineNumber: 113,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                lineNumber: 112,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                        lineNumber: 110,
                        columnNumber: 11
                    }, this),
                    activeTab === "patients" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "jsx-8afcf41604b5c163" + " " + "section",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                className: "jsx-8afcf41604b5c163",
                                children: "Enregistrement Patient"
                            }, void 0, false, {
                                fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                lineNumber: 143,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                                onSubmit: handleCreatePatient,
                                className: "jsx-8afcf41604b5c163" + " " + "formBox",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        placeholder: "Prénom",
                                        value: newPatient.firstName,
                                        onChange: (e)=>setNewPatient({
                                                ...newPatient,
                                                firstName: e.target.value
                                            }),
                                        required: true,
                                        className: "jsx-8afcf41604b5c163"
                                    }, void 0, false, {
                                        fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                        lineNumber: 145,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        placeholder: "Nom",
                                        value: newPatient.lastName,
                                        onChange: (e)=>setNewPatient({
                                                ...newPatient,
                                                lastName: e.target.value
                                            }),
                                        required: true,
                                        className: "jsx-8afcf41604b5c163"
                                    }, void 0, false, {
                                        fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                        lineNumber: 146,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "email",
                                        placeholder: "Email",
                                        value: newPatient.email,
                                        onChange: (e)=>setNewPatient({
                                                ...newPatient,
                                                email: e.target.value
                                            }),
                                        className: "jsx-8afcf41604b5c163"
                                    }, void 0, false, {
                                        fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                        lineNumber: 147,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "tel",
                                        placeholder: "Téléphone",
                                        value: newPatient.phone,
                                        onChange: (e)=>setNewPatient({
                                                ...newPatient,
                                                phone: e.target.value
                                            }),
                                        className: "jsx-8afcf41604b5c163"
                                    }, void 0, false, {
                                        fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                        lineNumber: 148,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        className: "jsx-8afcf41604b5c163",
                                        children: "➕ Ajouter Patient"
                                    }, void 0, false, {
                                        fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                        lineNumber: 149,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                lineNumber: 144,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                className: "jsx-8afcf41604b5c163",
                                children: "Liste des Patients"
                            }, void 0, false, {
                                fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                lineNumber: 152,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-8afcf41604b5c163" + " " + "tableWrapper",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                                    className: "jsx-8afcf41604b5c163",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                            className: "jsx-8afcf41604b5c163",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                className: "jsx-8afcf41604b5c163",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                        className: "jsx-8afcf41604b5c163",
                                                        children: "Nom"
                                                    }, void 0, false, {
                                                        fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                        lineNumber: 157,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                        className: "jsx-8afcf41604b5c163",
                                                        children: "Email"
                                                    }, void 0, false, {
                                                        fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                        lineNumber: 158,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                        className: "jsx-8afcf41604b5c163",
                                                        children: "Téléphone"
                                                    }, void 0, false, {
                                                        fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                        lineNumber: 159,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                lineNumber: 156,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                            lineNumber: 155,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                            className: "jsx-8afcf41604b5c163",
                                            children: patients.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                    className: "jsx-8afcf41604b5c163",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            className: "jsx-8afcf41604b5c163",
                                                            children: [
                                                                p.firstName,
                                                                " ",
                                                                p.lastName
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                            lineNumber: 165,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            className: "jsx-8afcf41604b5c163",
                                                            children: p.email || "–"
                                                        }, void 0, false, {
                                                            fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                            lineNumber: 166,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            className: "jsx-8afcf41604b5c163",
                                                            children: p.phone || "–"
                                                        }, void 0, false, {
                                                            fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                            lineNumber: 167,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, p.id, true, {
                                                    fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                    lineNumber: 164,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                            lineNumber: 162,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                    lineNumber: 154,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                lineNumber: 153,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                        lineNumber: 142,
                        columnNumber: 11
                    }, this),
                    activeTab === "invoices" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "jsx-8afcf41604b5c163" + " " + "section",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                className: "jsx-8afcf41604b5c163",
                                children: "Créer une Facture"
                            }, void 0, false, {
                                fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                lineNumber: 178,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                                onSubmit: handleCreateInvoice,
                                className: "jsx-8afcf41604b5c163" + " " + "formBox",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                        value: newInvoice.patientId,
                                        onChange: (e)=>setNewInvoice({
                                                ...newInvoice,
                                                patientId: e.target.value
                                            }),
                                        required: true,
                                        className: "jsx-8afcf41604b5c163",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                value: "",
                                                className: "jsx-8afcf41604b5c163",
                                                children: "Sélectionner un patient"
                                            }, void 0, false, {
                                                fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                lineNumber: 181,
                                                columnNumber: 17
                                            }, this),
                                            patients.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                    value: p.id,
                                                    className: "jsx-8afcf41604b5c163",
                                                    children: [
                                                        p.firstName,
                                                        " ",
                                                        p.lastName
                                                    ]
                                                }, p.id, true, {
                                                    fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                    lineNumber: 182,
                                                    columnNumber: 34
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                        lineNumber: 180,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                        value: newInvoice.consultationId,
                                        onChange: (e)=>setNewInvoice({
                                                ...newInvoice,
                                                consultationId: e.target.value
                                            }),
                                        className: "jsx-8afcf41604b5c163",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                value: "",
                                                className: "jsx-8afcf41604b5c163",
                                                children: "Aucune consultation"
                                            }, void 0, false, {
                                                fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                lineNumber: 185,
                                                columnNumber: 17
                                            }, this),
                                            consultations.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                    value: c.id,
                                                    className: "jsx-8afcf41604b5c163",
                                                    children: [
                                                        new Date(c.datetime).toLocaleString(),
                                                        " - ",
                                                        c.patient.firstName
                                                    ]
                                                }, c.id, true, {
                                                    fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                    lineNumber: 186,
                                                    columnNumber: 39
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                        lineNumber: 184,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        step: "0.01",
                                        placeholder: "Montant (TND)",
                                        value: newInvoice.amount,
                                        onChange: (e)=>setNewInvoice({
                                                ...newInvoice,
                                                amount: e.target.value
                                            }),
                                        required: true,
                                        className: "jsx-8afcf41604b5c163"
                                    }, void 0, false, {
                                        fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                        lineNumber: 188,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        className: "jsx-8afcf41604b5c163",
                                        children: "💳 Créer Facture (TND)"
                                    }, void 0, false, {
                                        fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                        lineNumber: 189,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                lineNumber: 179,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                className: "jsx-8afcf41604b5c163",
                                children: "Liste des Factures"
                            }, void 0, false, {
                                fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                lineNumber: 192,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-8afcf41604b5c163" + " " + "tableWrapper",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                                    className: "jsx-8afcf41604b5c163",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                            className: "jsx-8afcf41604b5c163",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                className: "jsx-8afcf41604b5c163",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                        className: "jsx-8afcf41604b5c163",
                                                        children: "Patient"
                                                    }, void 0, false, {
                                                        fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                        lineNumber: 197,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                        className: "jsx-8afcf41604b5c163",
                                                        children: "Montant"
                                                    }, void 0, false, {
                                                        fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                        lineNumber: 198,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                        className: "jsx-8afcf41604b5c163",
                                                        children: "Statut"
                                                    }, void 0, false, {
                                                        fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                        lineNumber: 199,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                        className: "jsx-8afcf41604b5c163",
                                                        children: "Date"
                                                    }, void 0, false, {
                                                        fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                        lineNumber: 200,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                lineNumber: 196,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                            lineNumber: 195,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                            className: "jsx-8afcf41604b5c163",
                                            children: invoices.map((inv)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                    className: "jsx-8afcf41604b5c163",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            className: "jsx-8afcf41604b5c163",
                                                            children: inv.patient ? `${inv.patient.firstName} ${inv.patient.lastName}` : "Patient supprimé"
                                                        }, void 0, false, {
                                                            fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                            lineNumber: 206,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            className: "jsx-8afcf41604b5c163",
                                                            children: [
                                                                (inv.amount / 100).toFixed(2),
                                                                " TND"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                            lineNumber: 207,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            className: "jsx-8afcf41604b5c163",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "jsx-8afcf41604b5c163" + " " + `status ${inv.status.toLowerCase()}`,
                                                                children: inv.status
                                                            }, void 0, false, {
                                                                fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                                lineNumber: 208,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                            lineNumber: 208,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            className: "jsx-8afcf41604b5c163",
                                                            children: new Date(inv.createdAt).toLocaleDateString()
                                                        }, void 0, false, {
                                                            fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                            lineNumber: 209,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, inv.id, true, {
                                                    fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                                    lineNumber: 205,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                            lineNumber: 203,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                    lineNumber: 194,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                                lineNumber: 193,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                        lineNumber: 177,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"], {
                id: "8afcf41604b5c163",
                children: ".dashboardWrapper.jsx-8afcf41604b5c163{background:url(https://i.pinimg.com/1200x/ae/f6/17/aef6170679bdead47b720fd69615d286.jpg) 50%/cover no-repeat fixed;justify-content:center;width:100%;min-height:100vh;padding:30px 0;animation:1.5s fadeIn;display:flex}.dashboardContainer.jsx-8afcf41604b5c163{width:100%;max-width:1400px;padding:30px}h1.jsx-8afcf41604b5c163{color:#fff;text-align:center;text-shadow:2px 2px 8px #00000080;margin-bottom:30px;font-size:36px;animation:1s fadeInDown}.tabs.jsx-8afcf41604b5c163{text-align:center;margin-bottom:40px}.tabs.jsx-8afcf41604b5c163 button.jsx-8afcf41604b5c163{cursor:pointer;color:#fff;-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);background:#ffffff4d;border:none;border-radius:30px;margin:0 7px;padding:12px 25px;font-size:16px;font-weight:700;transition:all .4s;transform:scale(1)}.tabs.jsx-8afcf41604b5c163 button.jsx-8afcf41604b5c163:hover{background:#ffffff80;transform:scale(1.1)}.tabs.jsx-8afcf41604b5c163 button.active.jsx-8afcf41604b5c163{color:#0d47a1;background:#fffc;box-shadow:0 5px 15px #0000004d}.section.jsx-8afcf41604b5c163{-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);background:#ffffffd9;border-radius:20px;margin-bottom:50px;padding:25px;transition:all .3s;box-shadow:0 8px 20px #00000040}.section.jsx-8afcf41604b5c163:hover{transform:translateY(-3px);box-shadow:0 12px 25px #0000004d}.section.jsx-8afcf41604b5c163 h2.jsx-8afcf41604b5c163{color:#0d47a1;margin-bottom:20px}.formBox.jsx-8afcf41604b5c163{background:#ffffffe6;border-radius:15px;flex-wrap:wrap;gap:15px;margin-bottom:20px;padding:20px;transition:all .3s;display:flex;box-shadow:0 4px 15px #00000026}.formBox.jsx-8afcf41604b5c163 input.jsx-8afcf41604b5c163,.formBox.jsx-8afcf41604b5c163 select.jsx-8afcf41604b5c163{border:1px solid #90caf9;border-radius:12px;flex:1;min-width:180px;padding:12px;transition:all .3s}.formBox.jsx-8afcf41604b5c163 input.jsx-8afcf41604b5c163:focus,.formBox.jsx-8afcf41604b5c163 select.jsx-8afcf41604b5c163:focus{border-color:#0d47a1;outline:none;box-shadow:0 0 8px #0d47a1}.formBox.jsx-8afcf41604b5c163 button.jsx-8afcf41604b5c163{color:#fff;cursor:pointer;background:#0d47a1;border:none;border-radius:25px;padding:12px 25px;font-weight:700;transition:all .3s}.formBox.jsx-8afcf41604b5c163 button.jsx-8afcf41604b5c163:hover{background:#1565c0;transform:translateY(-2px)}.tableWrapper.jsx-8afcf41604b5c163{border-radius:15px;overflow-x:auto;box-shadow:0 4px 20px #0000001a}table.jsx-8afcf41604b5c163{border-collapse:collapse;background:#fff;width:100%;transition:all .3s}th.jsx-8afcf41604b5c163,td.jsx-8afcf41604b5c163{text-align:left;border-bottom:1px solid #ccc;padding:12px}th.jsx-8afcf41604b5c163{color:#0d47a1;background:#90caf9;font-weight:700}tbody.jsx-8afcf41604b5c163 tr.jsx-8afcf41604b5c163:hover{background:#007bff1a;transition:all .2s;transform:scale(1.01)}.status.jsx-8afcf41604b5c163{text-align:center;border-radius:15px;padding:5px 12px;font-size:13px;font-weight:700}.status.done.jsx-8afcf41604b5c163{color:#065f46;background:#d1fae5}.status.cancelled.jsx-8afcf41604b5c163{color:#991b1b;background:#fee2e2}.status.pending.jsx-8afcf41604b5c163{color:#856404;background:#fff3cd}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}@keyframes fadeInDown{0%{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}@media (width<=1024px){.dashboardContainer.jsx-8afcf41604b5c163{padding:20px}.tabs.jsx-8afcf41604b5c163 button.jsx-8afcf41604b5c163{padding:10px 15px;font-size:14px}.formBox.jsx-8afcf41604b5c163 input.jsx-8afcf41604b5c163,.formBox.jsx-8afcf41604b5c163 select.jsx-8afcf41604b5c163{min-width:140px}}@media (width<=768px){.section.jsx-8afcf41604b5c163{padding:15px}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/MedFlow3/src/pages/receptionist/dashboard.tsx",
        lineNumber: 99,
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

//# sourceMappingURL=%5Broot-of-the-server%5D__cd969a3e._.js.map