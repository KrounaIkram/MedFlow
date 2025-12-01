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
        lineNumber: 44,
        columnNumber: 36
    }, this);
    if (!session || session.user.role !== "DOCTOR") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        children: "Accès refusé"
    }, void 0, false, {
        fileName: "[project]/src/pages/doctor/dashboard.tsx",
        lineNumber: 45,
        columnNumber: 58
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            padding: "20px",
            fontFamily: "Arial, sans-serif"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                children: [
                    "Bienvenue, Dr. ",
                    session.user.name
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: "20px",
                    display: "flex",
                    gap: "10px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab("agenda"),
                        style: tabStyle(activeTab === "agenda"),
                        children: "🗓️ Agenda"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab("dossiers"),
                        style: tabStyle(activeTab === "dossiers"),
                        children: "📁 Dossiers Médicaux"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab("ordonnances"),
                        style: tabStyle(activeTab === "ordonnances"),
                        children: "💊 Ordonnances"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab("nouvelle"),
                        style: tabStyle(activeTab === "nouvelle"),
                        children: "➕ Nouvelle Consultation"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            activeTab === "agenda" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(AgendaTab, {
                appointments: appointments,
                onAppointmentUpdate: (updatedAppt)=>{
                    setAppointments((prev)=>prev.map((appt)=>appt.id === updatedAppt.id ? updatedAppt : appt));
                }
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 67,
                columnNumber: 9
            }, this),
            activeTab === "dossiers" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(DossiersTab, {
                patients: patients,
                consultations: consultations
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 76,
                columnNumber: 36
            }, this),
            activeTab === "ordonnances" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(OrdonnancesTab, {
                prescriptions: prescriptions
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 77,
                columnNumber: 39
            }, this),
            activeTab === "nouvelle" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(NouvelleConsultationTab, {
                patients: patients,
                onConsultationCreated: (newConsult)=>setConsultations((prev)=>[
                            ...prev,
                            newConsult
                        ])
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 79,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/doctor/dashboard.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, this);
}
// 🗓️ Agenda complet — tous les rendez-vous du médecin
const AgendaTab = ({ appointments, onAppointmentUpdate })=>{
    const getStatusLabel = (status)=>{
        switch(status){
            case "CONFIRMED":
                return "✅ Confirmé";
            case "CANCELLED":
                return "❌ Annulé";
            case "SCHEDULED":
                return "⏳ En attente";
            default:
                return status;
        }
    };
    const getStatusColor = (status)=>{
        switch(status){
            case "CONFIRMED":
                return "#4caf50";
            case "CANCELLED":
                return "#f44336";
            case "SCHEDULED":
                return "#ff9800";
            default:
                return "black";
        }
    };
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
                const updatedAppt = await res.json();
                onAppointmentUpdate(updatedAppt);
            } else {
                const err = await res.json();
                alert("Erreur: " + (err.error || "Impossible de mettre à jour"));
            }
        } catch (err) {
            console.error(err);
            alert("Erreur réseau");
        }
    };
    const sortedAppts = [
        ...appointments
    ].sort((a, b)=>new Date(a.date).getTime() - new Date(b.date).getTime());
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                children: "🗓️ Tous vos rendez-vous"
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 140,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            sortedAppts.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                },
                children: sortedAppts.map((appt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            border: "1px solid #ddd",
                            padding: "14px",
                            borderRadius: "8px",
                            backgroundColor: appt.status === "CANCELLED" ? "#ffebee" : "white"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start"
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
                                            lineNumber: 155,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                            lineNumber: 155,
                                            columnNumber: 84
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        "📅 ",
                                        new Date(appt.date).toLocaleString("fr-FR", {
                                            weekday: 'short',
                                            day: '2-digit',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                            lineNumber: 163,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: getStatusColor(appt.status)
                                            },
                                            children: getStatusLabel(appt.status)
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                            lineNumber: 164,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                    lineNumber: 154,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: appt.status === "SCHEDULED" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleUpdateStatus(appt.id, "CONFIRMED"),
                                                style: {
                                                    marginRight: "6px",
                                                    padding: "6px 10px",
                                                    backgroundColor: "#4caf50",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    cursor: "pointer"
                                                },
                                                children: "✅ Confirmer"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                                lineNumber: 171,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleUpdateStatus(appt.id, "CANCELLED"),
                                                style: {
                                                    padding: "6px 10px",
                                                    backgroundColor: "#f44336",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    cursor: "pointer"
                                                },
                                                children: "❌ Annuler"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                                lineNumber: 185,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true)
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                    lineNumber: 168,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                            lineNumber: 153,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, appt.id, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 144,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 142,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                children: "Aucun rendez-vous trouvé."
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 206,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/doctor/dashboard.tsx",
        lineNumber: 139,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
// 📁 Dossiers Médicaux
const DossiersTab = ({ patients, consultations })=>{
    const [selectedPatient, setSelectedPatient] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const patientConsults = selectedPatient ? consultations.filter((c)=>c.patient.id === selectedPatient.id) : [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                children: "📁 Dossiers Médicaux"
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 222,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: "10px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        children: "Sélectionner un patient :"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 224,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                        onChange: (e)=>{
                            const id = e.target.value;
                            setSelectedPatient(patients.find((p)=>p.id === id) || null);
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "-- Tous --"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 229,
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
                                    lineNumber: 231,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 225,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 223,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            selectedPatient && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        children: [
                            "Dossier de ",
                            selectedPatient.firstName,
                            " ",
                            selectedPatient.lastName
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 238,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    patientConsults.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                        children: patientConsults.map((consult)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                        children: new Date(consult.datetime).toLocaleString()
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                        lineNumber: 243,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                        lineNumber: 244,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "Diagnostic: ",
                                    consult.diagnosis,
                                    consult.prescription && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Ordonnance: ",
                                            consult.prescription.notes
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                        lineNumber: 245,
                                        columnNumber: 44
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, consult.id, true, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 242,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 240,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        children: "Aucune consultation."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 250,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 237,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/doctor/dashboard.tsx",
        lineNumber: 221,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
// 💊 Ordonnances
const OrdonnancesTab = ({ prescriptions })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                children: "💊 Mes Ordonnances"
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 262,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            prescriptions.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                children: prescriptions.map((presc)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                children: [
                                    presc.patient.firstName,
                                    " ",
                                    presc.patient.lastName
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 267,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 268,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            new Date(presc.createdAt).toLocaleDateString(),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 269,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            "Instructions: ",
                            presc.notes
                        ]
                    }, presc.id, true, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 266,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 264,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                children: "Aucune ordonnance trouvée."
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 274,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/doctor/dashboard.tsx",
        lineNumber: 261,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const NouvelleConsultationTab = ({ patients, onConsultationCreated })=>{
    const [selectedPatientId, setSelectedPatientId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [datetime, setDatetime] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [diagnosis, setDiagnosis] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [notes, setNotes] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!selectedPatientId || !datetime || !diagnosis) {
            setMessage("Veuillez remplir tous les champs obligatoires.");
            return;
        }
        try {
            const res = await fetch("/api/consultations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    patientId: selectedPatientId,
                    datetime,
                    diagnosis,
                    notes: notes || undefined
                })
            });
            if (res.ok) {
                const newConsult = await res.json();
                onConsultationCreated(newConsult);
                setMessage("Consultation créée avec succès !");
                setSelectedPatientId("");
                setDatetime("");
                setDiagnosis("");
                setNotes("");
            } else {
                const err = await res.json();
                setMessage("Erreur: " + (err.error || "Impossible de créer la consultation"));
                console.error("Erreur API détaillée:", err.details || err);
            }
        } catch (err) {
            console.error("Erreur réseau:", err);
            setMessage("Erreur de connexion.");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                children: "➕ Nouvelle Consultation"
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 334,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    maxWidth: "400px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        children: [
                            "Patient :",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                value: selectedPatientId,
                                onChange: (e)=>setSelectedPatientId(e.target.value),
                                required: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "-- Sélectionner --"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                        lineNumber: 339,
                                        columnNumber: 13
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
                                            lineNumber: 341,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 338,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 336,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        children: [
                            "Date et heure :",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "datetime-local",
                                value: datetime,
                                onChange: (e)=>setDatetime(e.target.value),
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 348,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 346,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        children: [
                            "Diagnostic :",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                value: diagnosis,
                                onChange: (e)=>setDiagnosis(e.target.value),
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 353,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 351,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        children: [
                            "Notes (facultatif) :",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                value: notes,
                                onChange: (e)=>setNotes(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 358,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 356,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "submit",
                        style: {
                            padding: "8px 16px",
                            backgroundColor: "#0070f3",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        },
                        children: "Créer"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 361,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        style: {
                            color: message.includes("Erreur") ? "red" : "green",
                            margin: 0
                        },
                        children: message
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 375,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 335,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/doctor/dashboard.tsx",
        lineNumber: 333,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const tabStyle = (isActive)=>({
        padding: "8px 16px",
        backgroundColor: isActive ? "#0070f3" : "#e0e0e0",
        color: isActive ? "white" : "black",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer"
    });
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__14cf03b1._.js.map