module.exports = [
"[project]/src/pages/doctor/dashboard.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// pages/doctor/dashboard.tsx
__turbopack_context__.s([
    "default",
    ()=>DoctorDashboard
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$react__$5b$external$5d$__$28$next$2d$auth$2f$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/next-auth/react [external] (next-auth/react, cjs)");
"use client";
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
        lineNumber: 45,
        columnNumber: 36
    }, this);
    if (!session || session.user.role !== "DOCTOR") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        children: "Accès refusé"
    }, void 0, false, {
        fileName: "[project]/src/pages/doctor/dashboard.tsx",
        lineNumber: 46,
        columnNumber: 58
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: styles.container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                style: styles.title,
                children: [
                    "Bienvenue, Dr. ",
                    session.user.name
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: styles.tabsContainer,
                children: [
                    "agenda",
                    "dossiers",
                    "ordonnances",
                    "nouvelle"
                ].map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab(tab),
                        style: {
                            ...styles.tabButton,
                            ...activeTab === tab ? styles.tabActive : {}
                        },
                        children: [
                            tab === "agenda" && "🗓️ Agenda",
                            tab === "dossiers" && "📁 Dossiers",
                            tab === "ordonnances" && "💊 Ordonnances",
                            tab === "nouvelle" && "➕ Nouvelle Consultation"
                        ]
                    }, tab, true, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 55,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: styles.content,
                children: [
                    activeTab === "agenda" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(AgendaTab, {
                        appointments: appointments,
                        onAppointmentUpdate: (u)=>setAppointments((prev)=>prev.map((a)=>a.id === u.id ? u : a))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 70,
                        columnNumber: 36
                    }, this),
                    activeTab === "dossiers" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(DossiersTab, {
                        patients: patients,
                        consultations: consultations
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 71,
                        columnNumber: 38
                    }, this),
                    activeTab === "ordonnances" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(OrdonnancesTab, {
                        prescriptions: prescriptions,
                        consultations: consultations,
                        onPrescriptionCreated: (n)=>setPrescriptions((prev)=>[
                                    ...prev,
                                    n
                                ])
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 72,
                        columnNumber: 41
                    }, this),
                    activeTab === "nouvelle" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(NouvelleConsultationTab, {
                        patients: patients,
                        onConsultationCreated: (n)=>setConsultations((prev)=>[
                                    ...prev,
                                    n
                                ])
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 73,
                        columnNumber: 38
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/doctor/dashboard.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
// ======== STYLES ========
const styles = {
    container: {
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f6f8",
        padding: "30px"
    },
    title: {
        fontSize: "28px",
        fontWeight: "bold",
        marginBottom: "25px",
        color: "#333"
    },
    tabsContainer: {
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        marginBottom: "25px"
    },
    tabButton: {
        padding: "10px 20px",
        backgroundColor: "#e0e0e0",
        color: "#333",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        transition: "0.3s"
    },
    tabActive: {
        backgroundColor: "#1e88e5",
        color: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
    },
    content: {
        backgroundColor: "#fff",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
    },
    card: {
        backgroundColor: "#f9f9f9",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        marginBottom: "12px"
    },
    button: {
        padding: "6px 12px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        color: "#fff"
    }
};
// ======== AGENDA ========
const AgendaTab = ({ appointments, onAppointmentUpdate })=>{
    const sortedAppts = [
        ...appointments
    ].sort((a, b)=>new Date(a.date).getTime() - new Date(b.date).getTime());
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        children: sortedAppts.length > 0 ? sortedAppts.map((appt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    ...styles.card,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                children: [
                                    appt.patient.firstName,
                                    " ",
                                    appt.patient.lastName
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 145,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 145,
                                columnNumber: 78
                            }, ("TURBOPACK compile-time value", void 0)),
                            new Date(appt.date).toLocaleString("fr-FR"),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 146,
                                columnNumber: 58
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                style: {
                                    color: appt.status === "DONE" ? "#4caf50" : appt.status === "CANCELLED" ? "#f44336" : "#ff9800"
                                },
                                children: appt.status
                            }, void 0, false, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 147,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 144,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    appt.status === "SCHEDULED" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            gap: "6px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                style: {
                                    ...styles.button,
                                    backgroundColor: "#4caf50"
                                },
                                onClick: ()=>onAppointmentUpdate({
                                        ...appt,
                                        status: "DONE"
                                    }),
                                children: "✅"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 151,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                style: {
                                    ...styles.button,
                                    backgroundColor: "#f44336"
                                },
                                onClick: ()=>onAppointmentUpdate({
                                        ...appt,
                                        status: "CANCELLED"
                                    }),
                                children: "❌"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 152,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 150,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, appt.id, true, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 143,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
            children: "Aucun rendez-vous"
        }, void 0, false, {
            fileName: "[project]/src/pages/doctor/dashboard.tsx",
            lineNumber: 156,
            columnNumber: 12
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/pages/doctor/dashboard.tsx",
        lineNumber: 141,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
// ======== DOSSIERS ========
const DossiersTab = ({ patients, consultations })=>{
    const [selectedPatient, setSelectedPatient] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const patientConsults = selectedPatient ? consultations.filter((c)=>c.patient.id === selectedPatient.id) : [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                children: "Dossiers Médicaux"
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 168,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                onChange: (e)=>setSelectedPatient(patients.find((p)=>p.id === e.target.value) || null),
                style: {
                    padding: "8px",
                    borderRadius: "6px",
                    marginBottom: "15px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                        value: "",
                        children: "-- Sélectionner un patient --"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 170,
                        columnNumber: 9
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
                            lineNumber: 171,
                            columnNumber: 28
                        }, ("TURBOPACK compile-time value", void 0)))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 169,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            selectedPatient && patientConsults.length > 0 ? patientConsults.map((consult)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    style: styles.card,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                            children: new Date(consult.datetime).toLocaleString()
                        }, void 0, false, {
                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                            lineNumber: 177,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                            lineNumber: 177,
                            columnNumber: 75
                        }, ("TURBOPACK compile-time value", void 0)),
                        "Diagnostic: ",
                        consult.diagnosis,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                            lineNumber: 178,
                            columnNumber: 44
                        }, ("TURBOPACK compile-time value", void 0)),
                        consult.prescription && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            children: [
                                "Ordonnance: ",
                                consult.prescription.notes
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                            lineNumber: 179,
                            columnNumber: 38
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, consult.id, true, {
                    fileName: "[project]/src/pages/doctor/dashboard.tsx",
                    lineNumber: 176,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))) : selectedPatient ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                children: "Aucune consultation"
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 182,
                columnNumber: 29
            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                children: "Sélectionnez un patient pour voir ses dossiers"
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 182,
                columnNumber: 58
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/doctor/dashboard.tsx",
        lineNumber: 167,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
// ======== ORDONNANCES ========
const OrdonnancesTab = ({ prescriptions, consultations, onPrescriptionCreated })=>{
    const [selectedConsultationId, setSelectedConsultationId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [medications, setMedications] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const addMed = ()=>setMedications((prev)=>[
                ...prev,
                {
                    name: "",
                    dosage: ""
                }
            ]);
    const removeMed = (i)=>setMedications((prev)=>prev.filter((_, idx)=>idx !== i));
    const updateMed = (i, field, value)=>setMedications((prev)=>prev.map((m, idx)=>idx === i ? {
                    ...m,
                    [field]: value
                } : m));
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!selectedConsultationId || medications.length === 0) return setMessage("Sélectionner une consultation et ajouter au moins un médicament.");
        const consult = consultations.find((c)=>c.id.toString() === selectedConsultationId);
        if (!consult) return setMessage("Consultation invalide");
        try {
            const res = await fetch("/api/prescriptions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    consultationId: selectedConsultationId,
                    patientId: consult.patient.id,
                    medications
                })
            });
            if (res.ok) {
                const newPresc = await res.json();
                onPrescriptionCreated(newPresc);
                setMessage("Ordonnance créée !");
                setMedications([]);
                setSelectedConsultationId("");
            } else setMessage("Erreur lors de la création");
        } catch  {
            setMessage("Erreur réseau");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                children: "Ordonnances"
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 221,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                style: {
                    marginBottom: "20px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                        value: selectedConsultationId,
                        onChange: (e)=>setSelectedConsultationId(e.target.value),
                        style: {
                            padding: "8px",
                            borderRadius: "6px",
                            marginBottom: "10px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "-- Sélectionner une consultation --"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 224,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            consultations.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                    value: c.id,
                                    children: [
                                        new Date(c.datetime).toLocaleDateString(),
                                        " - ",
                                        c.patient.firstName
                                    ]
                                }, c.id, true, {
                                    fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                    lineNumber: 225,
                                    columnNumber: 35
                                }, ("TURBOPACK compile-time value", void 0)))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 223,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    medications.map((med, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                gap: "6px",
                                marginBottom: "6px"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    placeholder: "Médicament",
                                    value: med.name,
                                    onChange: (e)=>updateMed(i, "name", e.target.value),
                                    style: {
                                        flex: 1,
                                        padding: "6px",
                                        borderRadius: "6px"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                    lineNumber: 229,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    placeholder: "Dosage",
                                    value: med.dosage,
                                    onChange: (e)=>updateMed(i, "dosage", e.target.value),
                                    style: {
                                        flex: 1,
                                        padding: "6px",
                                        borderRadius: "6px"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                    lineNumber: 230,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>removeMed(i),
                                    style: {
                                        ...styles.button,
                                        backgroundColor: "#f44336"
                                    },
                                    children: "❌"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                    lineNumber: 231,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, i, true, {
                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                            lineNumber: 228,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: addMed,
                        style: {
                            ...styles.button,
                            backgroundColor: "#2196f3",
                            marginBottom: "10px"
                        },
                        children: "➕ Ajouter Médicament"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 234,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "submit",
                        style: {
                            ...styles.button,
                            backgroundColor: "#4caf50"
                        },
                        children: "📄 Créer Ordonnance"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 235,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 222,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            prescriptions.length > 0 ? prescriptions.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    style: styles.card,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            children: [
                                "Patient: ",
                                p.patient.firstName,
                                " ",
                                p.patient.lastName
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                            lineNumber: 240,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            children: [
                                "Consultation: ",
                                new Date(p.consultation.datetime).toLocaleDateString()
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                            lineNumber: 241,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("pre", {
                            children: JSON.stringify(p.medications, null, 2)
                        }, void 0, false, {
                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                            lineNumber: 242,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, p.id, true, {
                    fileName: "[project]/src/pages/doctor/dashboard.tsx",
                    lineNumber: 239,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                children: "Aucune ordonnance"
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 244,
                columnNumber: 12
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/doctor/dashboard.tsx",
        lineNumber: 220,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
// ======== NOUVELLE CONSULTATION ========
const NouvelleConsultationTab = ({ patients, onConsultationCreated })=>{
    const [patientId, setPatientId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [datetime, setDatetime] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [diagnosis, setDiagnosis] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!patientId || !datetime || !diagnosis) {
            setMessage("Remplir tous les champs");
            return;
        }
        try {
            const res = await fetch("/api/consultations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    patientId,
                    datetime,
                    diagnosis
                })
            });
            if (res.ok) {
                const newConsult = await res.json();
                onConsultationCreated(newConsult);
                setMessage("Consultation créée !");
                setPatientId("");
                setDatetime("");
                setDiagnosis("");
            } else setMessage("Erreur lors de la création");
        } catch  {
            setMessage("Erreur réseau");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit,
        style: {
            display: "flex",
            flexDirection: "column",
            gap: "10px"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                value: patientId,
                onChange: (e)=>setPatientId(e.target.value),
                style: {
                    padding: "8px",
                    borderRadius: "6px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                        value: "",
                        children: "-- Sélectionner un patient --"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 273,
                        columnNumber: 9
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
                            lineNumber: 274,
                            columnNumber: 28
                        }, ("TURBOPACK compile-time value", void 0)))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 272,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                type: "datetime-local",
                value: datetime,
                onChange: (e)=>setDatetime(e.target.value),
                style: {
                    padding: "8px",
                    borderRadius: "6px"
                }
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 276,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                placeholder: "Diagnostic",
                value: diagnosis,
                onChange: (e)=>setDiagnosis(e.target.value),
                style: {
                    padding: "8px",
                    borderRadius: "6px"
                }
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 277,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                type: "submit",
                style: {
                    ...styles.button,
                    backgroundColor: "#4caf50"
                },
                children: "➕ Créer Consultation"
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 278,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                children: message
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 279,
                columnNumber: 19
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/doctor/dashboard.tsx",
        lineNumber: 271,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__14cf03b1._.js.map