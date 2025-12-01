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
"[project]/src/pages/doctor/dashboard.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>DoctorDashboard
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
function DoctorDashboard() {
    const { data: session, status } = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$react__$5b$external$5d$__$28$next$2d$auth$2f$react$2c$__cjs$29$__["useSession"])();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("agenda");
    const [appointments, setAppointments] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [patients, setPatients] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [consultations, setConsultations] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [prescriptions, setPrescriptions] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!session) return;
        const loadData = async ()=>{
            try {
                const apptRes = await fetch("/api/appointments");
                if (apptRes.ok) setAppointments(await apptRes.json());
                const patRes = await fetch("/api/patients");
                if (patRes.ok) setPatients(await patRes.json());
                const consultRes = await fetch("/api/consultations");
                if (consultRes.ok) setConsultations(await consultRes.json());
                const prescRes = await fetch("/api/prescriptions");
                if (prescRes.ok) setPrescriptions(await prescRes.json());
            } catch (err) {
                console.error(err);
                __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__["toast"].error("Erreur de chargement des données");
            }
        };
        loadData();
    }, [
        session
    ]);
    if (status === "loading") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        children: "Chargement..."
    }, void 0, false, {
        fileName: "[project]/src/pages/doctor/dashboard.tsx",
        lineNumber: 47,
        columnNumber: 36
    }, this);
    if (!session || session.user.role !== "DOCTOR") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        children: "Accès refusé"
    }, void 0, false, {
        fileName: "[project]/src/pages/doctor/dashboard.tsx",
        lineNumber: 48,
        columnNumber: 58
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "jsx-29bd0f7d9fc43f01" + " " + "dashboardWrapper",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "jsx-29bd0f7d9fc43f01" + " " + "dashboardContainer",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                        className: "jsx-29bd0f7d9fc43f01",
                        children: [
                            "Bienvenue, Dr. ",
                            session.user.name
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "jsx-29bd0f7d9fc43f01" + " " + "tabs",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab("agenda"),
                                className: "jsx-29bd0f7d9fc43f01" + " " + ((activeTab === "agenda" ? "active" : "") || ""),
                                children: "🗓️ Agenda"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 56,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab("dossiers"),
                                className: "jsx-29bd0f7d9fc43f01" + " " + ((activeTab === "dossiers" ? "active" : "") || ""),
                                children: "📁 Dossiers Médicaux"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 59,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab("ordonnances"),
                                className: "jsx-29bd0f7d9fc43f01" + " " + ((activeTab === "ordonnances" ? "active" : "") || ""),
                                children: "💊 Ordonnances"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 62,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab("nouvelle"),
                                className: "jsx-29bd0f7d9fc43f01" + " " + ((activeTab === "nouvelle" ? "active" : "") || ""),
                                children: "➕ Nouvelle Consultation"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 65,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this),
                    activeTab === "agenda" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(AgendaTab, {
                        appointments: appointments,
                        onAppointmentUpdate: (updated)=>setAppointments((prev)=>prev.map((a)=>a.id === updated.id ? updated : a))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 71,
                        columnNumber: 11
                    }, this),
                    activeTab === "dossiers" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(DossiersTab, {
                        patients: patients,
                        consultations: consultations
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 76,
                        columnNumber: 38
                    }, this),
                    activeTab === "ordonnances" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(OrdonnancesTab, {
                        prescriptions: prescriptions,
                        consultations: consultations,
                        onPrescriptionCreated: (newPresc)=>setPrescriptions((prev)=>[
                                    ...prev,
                                    newPresc
                                ])
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 78,
                        columnNumber: 11
                    }, this),
                    activeTab === "nouvelle" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(NouvelleConsultationTab, {
                        patients: patients,
                        onConsultationCreated: (newC)=>setConsultations((prev)=>[
                                    ...prev,
                                    newC
                                ])
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 85,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"], {
                id: "29bd0f7d9fc43f01",
                children: ".dashboardWrapper.jsx-29bd0f7d9fc43f01{background:url(https://i.pinimg.com/1200x/ae/f6/17/aef6170679bdead47b720fd69615d286.jpg) 50%/cover no-repeat fixed;justify-content:center;width:100%;min-height:100vh;padding:30px 0;display:flex}.dashboardContainer.jsx-29bd0f7d9fc43f01{width:100%;max-width:1400px;padding:30px}h1.jsx-29bd0f7d9fc43f01{color:#fff;text-align:center;text-shadow:2px 2px 8px #00000080;margin-bottom:30px;font-size:36px}.tabs.jsx-29bd0f7d9fc43f01{text-align:center;margin-bottom:40px}.tabs.jsx-29bd0f7d9fc43f01 button.jsx-29bd0f7d9fc43f01{cursor:pointer;color:#fff;-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);background:#ffffff4d;border:none;border-radius:30px;margin:0 7px;padding:12px 25px;font-size:16px;font-weight:700;transition:all .4s;transform:scale(1)}.tabs.jsx-29bd0f7d9fc43f01 button.jsx-29bd0f7d9fc43f01:hover{background:#ffffff80;transform:scale(1.1)}.tabs.jsx-29bd0f7d9fc43f01 button.active.jsx-29bd0f7d9fc43f01{color:#0d47a1;background:#fffc;box-shadow:0 5px 15px #0000004d}.section.jsx-29bd0f7d9fc43f01{-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);background:#ffffffd9;border-radius:20px;margin-bottom:50px;padding:25px;box-shadow:0 8px 20px #00000040}.section.jsx-29bd0f7d9fc43f01 h2.jsx-29bd0f7d9fc43f01{color:#0d47a1;margin-bottom:20px}.formBox.jsx-29bd0f7d9fc43f01,form.jsx-29bd0f7d9fc43f01{background:#ffffffe6;border-radius:15px;flex-wrap:wrap;gap:15px;margin-bottom:20px;padding:20px;display:flex;box-shadow:0 4px 15px #00000026}.formBox.jsx-29bd0f7d9fc43f01 input.jsx-29bd0f7d9fc43f01,.formBox.jsx-29bd0f7d9fc43f01 select.jsx-29bd0f7d9fc43f01,form.jsx-29bd0f7d9fc43f01 input.jsx-29bd0f7d9fc43f01,form.jsx-29bd0f7d9fc43f01 select.jsx-29bd0f7d9fc43f01,form.jsx-29bd0f7d9fc43f01 textarea.jsx-29bd0f7d9fc43f01{border:1px solid #90caf9;border-radius:12px;flex:1;min-width:180px;padding:12px}.formBox.jsx-29bd0f7d9fc43f01 input.jsx-29bd0f7d9fc43f01:focus,.formBox.jsx-29bd0f7d9fc43f01 select.jsx-29bd0f7d9fc43f01:focus,form.jsx-29bd0f7d9fc43f01 input.jsx-29bd0f7d9fc43f01:focus,form.jsx-29bd0f7d9fc43f01 select.jsx-29bd0f7d9fc43f01:focus,form.jsx-29bd0f7d9fc43f01 textarea.jsx-29bd0f7d9fc43f01:focus{border-color:#0d47a1;outline:none;box-shadow:0 0 8px #0d47a1}.formBox.jsx-29bd0f7d9fc43f01 button.jsx-29bd0f7d9fc43f01,form.jsx-29bd0f7d9fc43f01 button.jsx-29bd0f7d9fc43f01{color:#fff;cursor:pointer;background:#0d47a1;border:none;border-radius:25px;padding:12px 25px;font-weight:700}.formBox.jsx-29bd0f7d9fc43f01 button.jsx-29bd0f7d9fc43f01:hover,form.jsx-29bd0f7d9fc43f01 button.jsx-29bd0f7d9fc43f01:hover{background:#1565c0;transform:translateY(-2px)}.tableWrapper.jsx-29bd0f7d9fc43f01{border-radius:15px;overflow-x:auto;box-shadow:0 4px 20px #0000001a}table.jsx-29bd0f7d9fc43f01{border-collapse:collapse;background:#fff;width:100%}th.jsx-29bd0f7d9fc43f01,td.jsx-29bd0f7d9fc43f01{text-align:left;border-bottom:1px solid #ccc;padding:12px}th.jsx-29bd0f7d9fc43f01{color:#0d47a1;background:#90caf9;font-weight:700}tbody.jsx-29bd0f7d9fc43f01 tr.jsx-29bd0f7d9fc43f01:hover{background:#007bff1a;transition:all .2s;transform:scale(1.01)}.status.jsx-29bd0f7d9fc43f01{text-align:center;border-radius:15px;padding:5px 12px;font-size:13px;font-weight:700}.status.done.jsx-29bd0f7d9fc43f01{color:#065f46;background:#d1fae5}.status.cancelled.jsx-29bd0f7d9fc43f01{color:#991b1b;background:#fee2e2}.status.pending.jsx-29bd0f7d9fc43f01{color:#856404;background:#fff3cd}@media (width<=1024px){.dashboardContainer.jsx-29bd0f7d9fc43f01{padding:20px}.tabs.jsx-29bd0f7d9fc43f01 button.jsx-29bd0f7d9fc43f01{padding:10px 15px;font-size:14px}.formBox.jsx-29bd0f7d9fc43f01 input.jsx-29bd0f7d9fc43f01,.formBox.jsx-29bd0f7d9fc43f01 select.jsx-29bd0f7d9fc43f01{min-width:140px}}@media (width<=768px){.section.jsx-29bd0f7d9fc43f01{padding:15px}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/doctor/dashboard.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
/* ---------------- Tabs ---------------- */ const AgendaTab = ({ appointments, onAppointmentUpdate })=>{
    const handleUpdateStatus = async (id, status)=>{
        try {
            const res = await fetch(`/api/appointments/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status
                })
            });
            if (res.ok) {
                const updated = await res.json();
                onAppointmentUpdate(updated);
            }
        } catch (err) {
            console.error(err);
            __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__["toast"].error("Erreur réseau");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "section",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                children: "🗓️ Tous vos rendez-vous"
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 304,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            appointments.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "tableWrapper",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        children: "Patient"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                        lineNumber: 310,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        children: "Date"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                        lineNumber: 311,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        children: "Statut"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                        lineNumber: 312,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        children: "Actions"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                        lineNumber: 313,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 309,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                            lineNumber: 308,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                            children: appointments.map((a)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            children: [
                                                a.patient.firstName,
                                                " ",
                                                a.patient.lastName
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                            lineNumber: 319,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            children: new Date(a.date).toLocaleString("fr-FR")
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                            lineNumber: 322,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: `status ${a.status.toLowerCase()}`,
                                            children: a.status
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                            lineNumber: 323,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            children: a.status === "SCHEDULED" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleUpdateStatus(a.id, "DONE"),
                                                        children: "✅ Confirmer"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                                        lineNumber: 327,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleUpdateStatus(a.id, "CANCELLED"),
                                                        children: "❌ Annuler"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                                        lineNumber: 328,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true)
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                            lineNumber: 324,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, a.id, true, {
                                    fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                    lineNumber: 318,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                            lineNumber: 316,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/doctor/dashboard.tsx",
                    lineNumber: 307,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 306,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                children: "Aucun rendez-vous trouvé."
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 338,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/doctor/dashboard.tsx",
        lineNumber: 303,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const DossiersTab = ({ patients, consultations })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "section",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                children: "📁 Dossiers Médicaux"
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 346,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            patients.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "tableWrapper",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        children: "Patient"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                        lineNumber: 352,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        children: "Consultations"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                        lineNumber: 353,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 351,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                            lineNumber: 350,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                            children: patients.map((p)=>{
                                const patientConsults = consultations.filter((c)=>c.patient.id === p.id);
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            children: [
                                                p.firstName,
                                                " ",
                                                p.lastName
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                            lineNumber: 361,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            children: patientConsults.length
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                            lineNumber: 364,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, p.id, true, {
                                    fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                    lineNumber: 360,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0));
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                            lineNumber: 356,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/doctor/dashboard.tsx",
                    lineNumber: 349,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 348,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                children: "Aucun patient trouvé."
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 372,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/doctor/dashboard.tsx",
        lineNumber: 345,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const OrdonnancesTab = ({ prescriptions, consultations, onPrescriptionCreated })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "section",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                children: "💊 Ordonnances"
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 387,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            prescriptions.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "tableWrapper",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        children: "Patient"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                        lineNumber: 393,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        children: "Date"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                        lineNumber: 394,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        children: "Médicaments"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                        lineNumber: 395,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 392,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                            lineNumber: 391,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                            children: prescriptions.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            children: [
                                                p.patient.firstName,
                                                " ",
                                                p.patient.lastName
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                            lineNumber: 401,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            children: new Date(p.createdAt).toLocaleDateString("fr-FR")
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                            lineNumber: 404,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            children: p.medications.map((m)=>m.name).join(", ")
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                            lineNumber: 405,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, p.id, true, {
                                    fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                    lineNumber: 400,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                            lineNumber: 398,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/doctor/dashboard.tsx",
                    lineNumber: 390,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 389,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                children: "Aucune ordonnance trouvée."
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 412,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/doctor/dashboard.tsx",
        lineNumber: 386,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const NouvelleConsultationTab = ({ patients, onConsultationCreated })=>{
    const [patientId, setPatientId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [diagnosis, setDiagnosis] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!patientId || !diagnosis) return alert("Remplissez tous les champs");
        try {
            const res = await fetch("/api/consultations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    patientId,
                    diagnosis
                })
            });
            if (res.ok) {
                const newC = await res.json();
                onConsultationCreated(newC);
                setPatientId("");
                setDiagnosis("");
                __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__["toast"].success("Consultation créée");
            }
        } catch (err) {
            console.error(err);
            __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__["toast"].error("Erreur réseau");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "section",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                children: "➕ Nouvelle Consultation"
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 452,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                        value: patientId,
                        onChange: (e)=>setPatientId(e.target.value),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "Sélectionner un patient"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 455,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            patients.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                    value: p.id,
                                    children: [
                                        p.firstName,
                                        " ",
                                        p.lastName
                                    ]
                                }, p.id, true, {
                                    fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                    lineNumber: 457,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 454,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                        value: diagnosis,
                        onChange: (e)=>setDiagnosis(e.target.value),
                        placeholder: "Diagnostic"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 462,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "submit",
                        children: "Créer"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 463,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 453,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/doctor/dashboard.tsx",
        lineNumber: 451,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0a164a71._.js.map