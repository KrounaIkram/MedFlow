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
"[project]/src/pages/patient.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>PatientDashboard
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
function PatientDashboard() {
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("appointments");
    const [appointments, setAppointments] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [doctors, setDoctors] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [invoices, setInvoices] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [prescriptions, setPrescriptions] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [selectedDoctor, setSelectedDoctor] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [selectedDate, setSelectedDate] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [selectedType, setSelectedType] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("CONSULTATION");
    const [notes, setNotes] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [creating, setCreating] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [editingId, setEditingId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const fetchData = async ()=>{
        setLoading(true);
        try {
            const [apptRes, docRes, invRes, prescRes] = await Promise.all([
                fetch("/api/appointments"),
                fetch("/api/users/doctors"),
                fetch("/api/patients/me/invoices"),
                fetch("/api/prescriptions")
            ]);
            if (apptRes.ok) setAppointments(await apptRes.json());
            if (docRes.ok) setDoctors(await docRes.json());
            if (invRes.ok) setInvoices(await invRes.json());
            if (prescRes.ok) setPrescriptions(await prescRes.json());
        } catch (err) {
            console.error(err);
            __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__["toast"].error(err.message || "Erreur lors du chargement des données");
        } finally{
            setLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        fetchData();
    }, []);
    const handleSubmitAppointment = async (e)=>{
        e.preventDefault();
        setCreating(true);
        try {
            if (!selectedDate) throw new Error("Veuillez sélectionner une date");
            const dateObj = new Date(selectedDate);
            const isoDate = dateObj.toISOString();
            if (editingId) {
                const res = await fetch("/api/appointments", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        appointmentId: editingId,
                        date: isoDate,
                        type: selectedType,
                        notes: notes || undefined
                    })
                });
                if (!res.ok) throw new Error("Erreur lors de la modification");
                __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__["toast"].success("Rendez-vous modifié avec succès !");
            } else {
                if (!selectedDoctor) throw new Error("Veuillez sélectionner un docteur");
                const res = await fetch("/api/appointments", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        doctorName: selectedDoctor,
                        date: isoDate,
                        type: selectedType,
                        notes: notes || undefined
                    })
                });
                if (!res.ok) throw new Error("Erreur lors de la création");
                __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__["toast"].success("Rendez-vous créé avec succès !");
            }
            await fetchData();
            setSelectedDoctor("");
            setSelectedDate("");
            setSelectedType("CONSULTATION");
            setNotes("");
            setEditingId(null);
        } catch (err) {
            console.error(err);
            __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__["toast"].error(err.message || "Erreur serveur");
        } finally{
            setCreating(false);
        }
    };
    const handleEdit = (appointment)=>{
        setEditingId(appointment.id.toString());
        setSelectedDoctor(appointment.doctor.name);
        setSelectedDate(new Date(appointment.date).toISOString().slice(0, 16));
        setSelectedType(appointment.type);
        setNotes(appointment.notes || "");
    };
    const handlePayInvoice = async (invoiceId)=>{
        try {
            const res = await fetch("/api/payments/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    invoiceId
                }),
                credentials: "include"
            });
            if (!res.ok) throw new Error("Impossible de lancer le paiement");
            const { url } = await res.json();
            if (url) window.location.href = url;
        } catch (err) {
            __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__["toast"].error(err.message || "Erreur lors du lancement du paiement");
        }
    };
    // Calcul KPI
    const pendingInvoices = invoices.filter((i)=>i.status === "PENDING").length;
    const upcomingAppointments = appointments.filter((a)=>new Date(a.date) > new Date()).length;
    const totalPrescriptions = prescriptions.length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "jsx-55dcf86c4a09de53" + " " + "dashboardWrapper",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "jsx-55dcf86c4a09de53" + " " + "dashboardContainer",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                        className: "jsx-55dcf86c4a09de53",
                        children: "Tableau Patient"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/patient.tsx",
                        lineNumber: 138,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "jsx-55dcf86c4a09de53" + " " + "kpiCards",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-55dcf86c4a09de53" + " " + "kpiCard",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                        className: "jsx-55dcf86c4a09de53",
                                        children: "Rendez-vous à venir"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/patient.tsx",
                                        lineNumber: 143,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "jsx-55dcf86c4a09de53",
                                        children: upcomingAppointments
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/patient.tsx",
                                        lineNumber: 144,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/patient.tsx",
                                lineNumber: 142,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-55dcf86c4a09de53" + " " + "kpiCard",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                        className: "jsx-55dcf86c4a09de53",
                                        children: "Factures en attente"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/patient.tsx",
                                        lineNumber: 147,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "jsx-55dcf86c4a09de53",
                                        children: pendingInvoices
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/patient.tsx",
                                        lineNumber: 148,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/patient.tsx",
                                lineNumber: 146,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-55dcf86c4a09de53" + " " + "kpiCard",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                        className: "jsx-55dcf86c4a09de53",
                                        children: "Ordonnances"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/patient.tsx",
                                        lineNumber: 151,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "jsx-55dcf86c4a09de53",
                                        children: totalPrescriptions
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/patient.tsx",
                                        lineNumber: 152,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/patient.tsx",
                                lineNumber: 150,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/patient.tsx",
                        lineNumber: 141,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "jsx-55dcf86c4a09de53" + " " + "tabs",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab("appointments"),
                                className: "jsx-55dcf86c4a09de53" + " " + ((activeTab === "appointments" ? "active" : "") || ""),
                                children: "🗓️ Rendez-vous"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/patient.tsx",
                                lineNumber: 157,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab("invoices"),
                                className: "jsx-55dcf86c4a09de53" + " " + ((activeTab === "invoices" ? "active" : "") || ""),
                                children: "💰 Factures"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/patient.tsx",
                                lineNumber: 158,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab("prescriptions"),
                                className: "jsx-55dcf86c4a09de53" + " " + ((activeTab === "prescriptions" ? "active" : "") || ""),
                                children: "📄 Ordonnances"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/patient.tsx",
                                lineNumber: 159,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/patient.tsx",
                        lineNumber: 156,
                        columnNumber: 9
                    }, this),
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "jsx-55dcf86c4a09de53",
                        children: "Chargement..."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/patient.tsx",
                        lineNumber: 162,
                        columnNumber: 20
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                        children: [
                            activeTab === "appointments" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-55dcf86c4a09de53" + " " + "section",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                        className: "jsx-55dcf86c4a09de53",
                                        children: "Mes Rendez-vous"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/patient.tsx",
                                        lineNumber: 166,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-55dcf86c4a09de53" + " " + "cardsWrapper",
                                        children: appointments.map((a)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-55dcf86c4a09de53" + " " + `card ${a.status.toLowerCase()}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                        className: "jsx-55dcf86c4a09de53",
                                                        children: new Date(a.date).toLocaleString()
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/patient.tsx",
                                                        lineNumber: 170,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "jsx-55dcf86c4a09de53",
                                                        children: [
                                                            "Type: ",
                                                            a.type
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/patient.tsx",
                                                        lineNumber: 171,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "jsx-55dcf86c4a09de53",
                                                        children: [
                                                            "Docteur: ",
                                                            a.doctor.name
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/patient.tsx",
                                                        lineNumber: 172,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "jsx-55dcf86c4a09de53",
                                                        children: [
                                                            "Status: ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "jsx-55dcf86c4a09de53" + " " + `status ${a.status.toLowerCase()}`,
                                                                children: a.status
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/patient.tsx",
                                                                lineNumber: 173,
                                                                columnNumber: 34
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/patient.tsx",
                                                        lineNumber: 173,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleEdit(a),
                                                        className: "jsx-55dcf86c4a09de53" + " " + "btnYellow",
                                                        children: "Modifier"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/patient.tsx",
                                                        lineNumber: 174,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, a.id, true, {
                                                fileName: "[project]/src/pages/patient.tsx",
                                                lineNumber: 169,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/patient.tsx",
                                        lineNumber: 167,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                        className: "jsx-55dcf86c4a09de53",
                                        children: editingId ? "Modifier Rendez-vous" : "Créer Rendez-vous"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/patient.tsx",
                                        lineNumber: 179,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                                        onSubmit: handleSubmitAppointment,
                                        className: "jsx-55dcf86c4a09de53" + " " + "formBox",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                value: selectedDoctor,
                                                onChange: (e)=>setSelectedDoctor(e.target.value),
                                                required: true,
                                                disabled: !!editingId,
                                                className: "jsx-55dcf86c4a09de53",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        className: "jsx-55dcf86c4a09de53",
                                                        children: "Sélectionner un docteur"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/patient.tsx",
                                                        lineNumber: 182,
                                                        columnNumber: 21
                                                    }, this),
                                                    doctors.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: d.name,
                                                            className: "jsx-55dcf86c4a09de53",
                                                            children: d.name
                                                        }, d.id, false, {
                                                            fileName: "[project]/src/pages/patient.tsx",
                                                            lineNumber: 183,
                                                            columnNumber: 39
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/patient.tsx",
                                                lineNumber: 181,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "datetime-local",
                                                value: selectedDate,
                                                onChange: (e)=>setSelectedDate(e.target.value),
                                                required: true,
                                                className: "jsx-55dcf86c4a09de53"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/patient.tsx",
                                                lineNumber: 185,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                value: selectedType,
                                                onChange: (e)=>setSelectedType(e.target.value),
                                                className: "jsx-55dcf86c4a09de53",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: "CONSULTATION",
                                                        className: "jsx-55dcf86c4a09de53",
                                                        children: "Consultation"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/patient.tsx",
                                                        lineNumber: 187,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: "URGENCY",
                                                        className: "jsx-55dcf86c4a09de53",
                                                        children: "Urgence"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/patient.tsx",
                                                        lineNumber: 188,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: "FOLLOW_UP",
                                                        className: "jsx-55dcf86c4a09de53",
                                                        children: "Suivi"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/patient.tsx",
                                                        lineNumber: 189,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: "CONTROL",
                                                        className: "jsx-55dcf86c4a09de53",
                                                        children: "Contrôle"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/patient.tsx",
                                                        lineNumber: 190,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/patient.tsx",
                                                lineNumber: 186,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                                placeholder: "Notes (facultatif)",
                                                value: notes,
                                                onChange: (e)=>setNotes(e.target.value),
                                                className: "jsx-55dcf86c4a09de53"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/patient.tsx",
                                                lineNumber: 192,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                type: "submit",
                                                disabled: creating,
                                                className: "jsx-55dcf86c4a09de53",
                                                children: creating ? "En cours..." : editingId ? "Modifier" : "Créer"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/patient.tsx",
                                                lineNumber: 193,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/patient.tsx",
                                        lineNumber: 180,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/patient.tsx",
                                lineNumber: 165,
                                columnNumber: 15
                            }, this),
                            activeTab === "invoices" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-55dcf86c4a09de53" + " " + "section",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                        className: "jsx-55dcf86c4a09de53",
                                        children: "Mes Factures"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/patient.tsx",
                                        lineNumber: 200,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-55dcf86c4a09de53" + " " + "cardsWrapper",
                                        children: invoices.map((inv)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-55dcf86c4a09de53" + " " + `card ${inv.status.toLowerCase()}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                        className: "jsx-55dcf86c4a09de53",
                                                        children: [
                                                            (inv.amount / 100).toFixed(2),
                                                            " ",
                                                            inv.currency.toUpperCase()
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/patient.tsx",
                                                        lineNumber: 204,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "jsx-55dcf86c4a09de53",
                                                        children: [
                                                            "Status: ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "jsx-55dcf86c4a09de53" + " " + `status ${inv.status.toLowerCase()}`,
                                                                children: inv.status
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/patient.tsx",
                                                                lineNumber: 205,
                                                                columnNumber: 34
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/patient.tsx",
                                                        lineNumber: 205,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "jsx-55dcf86c4a09de53",
                                                        children: [
                                                            "Date: ",
                                                            new Date(inv.createdAt).toLocaleDateString()
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/patient.tsx",
                                                        lineNumber: 206,
                                                        columnNumber: 23
                                                    }, this),
                                                    inv.status === "PENDING" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handlePayInvoice(inv.id),
                                                        className: "jsx-55dcf86c4a09de53" + " " + "btnGreen",
                                                        children: "Payer"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/patient.tsx",
                                                        lineNumber: 207,
                                                        columnNumber: 52
                                                    }, this)
                                                ]
                                            }, inv.id, true, {
                                                fileName: "[project]/src/pages/patient.tsx",
                                                lineNumber: 203,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/patient.tsx",
                                        lineNumber: 201,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/patient.tsx",
                                lineNumber: 199,
                                columnNumber: 15
                            }, this),
                            activeTab === "prescriptions" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-55dcf86c4a09de53" + " " + "section",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                        className: "jsx-55dcf86c4a09de53",
                                        children: "Mes Ordonnances"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/patient.tsx",
                                        lineNumber: 216,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-55dcf86c4a09de53" + " " + "cardsWrapper",
                                        children: prescriptions.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-55dcf86c4a09de53" + " " + "card",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                        className: "jsx-55dcf86c4a09de53",
                                                        children: [
                                                            "Dr ",
                                                            p.doctor.name
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/patient.tsx",
                                                        lineNumber: 220,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "jsx-55dcf86c4a09de53",
                                                        children: [
                                                            "Date: ",
                                                            p.consultation ? new Date(p.consultation.datetime).toLocaleDateString() : new Date(p.createdAt).toLocaleDateString()
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/patient.tsx",
                                                        lineNumber: 221,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>window.open(`/api/prescriptions/${p.id}/pdf`, "_blank"),
                                                        className: "jsx-55dcf86c4a09de53" + " " + "btnBlue",
                                                        children: "PDF"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/patient.tsx",
                                                        lineNumber: 224,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, p.id, true, {
                                                fileName: "[project]/src/pages/patient.tsx",
                                                lineNumber: 219,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/patient.tsx",
                                        lineNumber: 217,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/patient.tsx",
                                lineNumber: 215,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/patient.tsx",
                lineNumber: 137,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"], {
                id: "55dcf86c4a09de53",
                children: ".dashboardWrapper.jsx-55dcf86c4a09de53{background:url(https://i.pinimg.com/1200x/ae/f6/17/aef6170679bdead47b720fd69615d286.jpg) 50%/cover no-repeat fixed;justify-content:center;width:100%;min-height:100vh;padding:30px 0;display:flex}.dashboardContainer.jsx-55dcf86c4a09de53{width:100%;max-width:1200px;padding:30px}h1.jsx-55dcf86c4a09de53{text-align:center;color:#fff;text-shadow:2px 2px 8px #00000080;margin-bottom:20px}.kpiCards.jsx-55dcf86c4a09de53{flex-wrap:wrap;justify-content:space-around;gap:15px;margin-bottom:30px;display:flex}.kpiCard.jsx-55dcf86c4a09de53{text-align:center;background:#ffffffe6;border-radius:20px;flex:1;min-width:180px;padding:20px;transition:all .3s;box-shadow:0 8px 20px #0003}.kpiCard.jsx-55dcf86c4a09de53:hover{transform:translateY(-5px);box-shadow:0 12px 25px #0000004d}.kpiCard.jsx-55dcf86c4a09de53 h3.jsx-55dcf86c4a09de53{color:#0d47a1;margin-bottom:10px}.kpiCard.jsx-55dcf86c4a09de53 p.jsx-55dcf86c4a09de53{font-size:24px;font-weight:700}.tabs.jsx-55dcf86c4a09de53{text-align:center;margin-bottom:20px}.tabs.jsx-55dcf86c4a09de53 button.jsx-55dcf86c4a09de53{cursor:pointer;color:#fff;-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);background:#ffffff4d;border:none;border-radius:30px;margin:0 7px;padding:12px 25px;font-size:16px;font-weight:700;transition:all .4s;transform:scale(1)}.tabs.jsx-55dcf86c4a09de53 button.jsx-55dcf86c4a09de53:hover{background:#ffffff80;transform:scale(1.1)}.tabs.jsx-55dcf86c4a09de53 button.active.jsx-55dcf86c4a09de53{color:#0d47a1;background:#fffc;box-shadow:0 5px 15px #0000004d}.section.jsx-55dcf86c4a09de53{-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);background:#ffffffd9;border-radius:20px;margin-bottom:50px;padding:25px;box-shadow:0 8px 20px #00000040}.section.jsx-55dcf86c4a09de53 h2.jsx-55dcf86c4a09de53{color:#0d47a1;margin-bottom:20px}.formBox.jsx-55dcf86c4a09de53{background:#ffffffe6;border-radius:15px;flex-wrap:wrap;gap:15px;margin-bottom:20px;padding:20px;display:flex;box-shadow:0 4px 15px #00000026}.formBox.jsx-55dcf86c4a09de53 input.jsx-55dcf86c4a09de53,.formBox.jsx-55dcf86c4a09de53 select.jsx-55dcf86c4a09de53,.formBox.jsx-55dcf86c4a09de53 textarea.jsx-55dcf86c4a09de53{border:1px solid #90caf9;border-radius:12px;flex:1;min-width:180px;padding:12px;transition:all .3s}.formBox.jsx-55dcf86c4a09de53 input.jsx-55dcf86c4a09de53:focus,.formBox.jsx-55dcf86c4a09de53 select.jsx-55dcf86c4a09de53:focus,.formBox.jsx-55dcf86c4a09de53 textarea.jsx-55dcf86c4a09de53:focus{border-color:#0d47a1;outline:none;box-shadow:0 0 8px #0d47a1}.formBox.jsx-55dcf86c4a09de53 button.jsx-55dcf86c4a09de53{color:#fff;cursor:pointer;background:#0d47a1;border:none;border-radius:25px;flex:1;padding:12px 25px;font-weight:700;transition:all .3s}.formBox.jsx-55dcf86c4a09de53 button.jsx-55dcf86c4a09de53:hover{background:#1565c0;transform:translateY(-2px)}.cardsWrapper.jsx-55dcf86c4a09de53{grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:15px;display:grid}.card.jsx-55dcf86c4a09de53{background:#ffffffe6;border-radius:15px;padding:20px;transition:all .3s;box-shadow:0 6px 20px #0003}.card.jsx-55dcf86c4a09de53:hover{transform:translateY(-5px);box-shadow:0 12px 25px #0000004d}.card.jsx-55dcf86c4a09de53 h4.jsx-55dcf86c4a09de53{color:#0d47a1;margin-bottom:8px}.status.jsx-55dcf86c4a09de53{text-align:center;border-radius:15px;padding:5px 12px;font-size:13px;font-weight:700}.status.pending.jsx-55dcf86c4a09de53{color:#856404;background:#fff3cd}.status.paid.jsx-55dcf86c4a09de53{color:#065f46;background:#d1fae5}.status.canceled.jsx-55dcf86c4a09de53{color:#991b1b;background:#fee2e2}.btnGreen.jsx-55dcf86c4a09de53{color:#fff;cursor:pointer;background:#22c55e;border:none;border-radius:12px;margin-top:5px;padding:8px 14px}.btnGreen.jsx-55dcf86c4a09de53:hover{background:#16a34a}.btnYellow.jsx-55dcf86c4a09de53{color:#fff;cursor:pointer;background:#facc15;border:none;border-radius:12px;margin-top:5px;padding:8px 14px}.btnYellow.jsx-55dcf86c4a09de53:hover{background:#eab308}.btnBlue.jsx-55dcf86c4a09de53{color:#fff;cursor:pointer;background:#3b82f6;border:none;border-radius:12px;margin-top:5px;padding:8px 14px}.btnBlue.jsx-55dcf86c4a09de53:hover{background:#2563eb}@media (width<=768px){.kpiCards.jsx-55dcf86c4a09de53{flex-direction:column}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/patient.tsx",
        lineNumber: 136,
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

//# sourceMappingURL=%5Broot-of-the-server%5D__00092391._.js.map