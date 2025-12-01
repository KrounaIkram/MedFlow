(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/src/pages/doctor/dashboard.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// pages/doctor/dashboard.tsx
__turbopack_context__.s([
    "default",
    ()=>DoctorDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
;
;
function DoctorDashboard() {
    _s();
    const { data: session, status } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useSession"])();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("agenda");
    const [appointments, setAppointments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [patients, setPatients] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [consultations, setConsultations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [prescriptions, setPrescriptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DoctorDashboard.useEffect": ()=>{
            if (!session) return;
            const loadData = {
                "DoctorDashboard.useEffect.loadData": async ()=>{
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
                }
            }["DoctorDashboard.useEffect.loadData"];
            loadData();
        }
    }["DoctorDashboard.useEffect"], [
        session
    ]);
    if (status === "loading") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: "Chargement..."
    }, void 0, false, {
        fileName: "[project]/src/pages/doctor/dashboard.tsx",
        lineNumber: 50,
        columnNumber: 36
    }, this);
    if (!session || session.user.role !== "DOCTOR") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: "Accès refusé"
    }, void 0, false, {
        fileName: "[project]/src/pages/doctor/dashboard.tsx",
        lineNumber: 51,
        columnNumber: 58
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: "20px",
            fontFamily: "Arial, sans-serif"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                children: [
                    "Bienvenue, Dr. ",
                    session.user.name
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: "20px",
                    display: "flex",
                    gap: "10px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab("agenda"),
                        style: tabStyle(activeTab === "agenda"),
                        children: "🗓️ Agenda"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab("dossiers"),
                        style: tabStyle(activeTab === "dossiers"),
                        children: "📁 Dossiers Médicaux"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab("ordonnances"),
                        style: tabStyle(activeTab === "ordonnances"),
                        children: "💊 Ordonnances"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab("nouvelle"),
                        style: tabStyle(activeTab === "nouvelle"),
                        children: "➕ Nouvelle Consultation"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this),
            activeTab === "agenda" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AgendaTab, {
                appointments: appointments,
                onAppointmentUpdate: (updatedAppt)=>{
                    setAppointments((prev)=>prev.map((appt)=>appt.id === updatedAppt.id ? updatedAppt : appt));
                }
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 73,
                columnNumber: 9
            }, this),
            activeTab === "dossiers" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DossiersTab, {
                patients: patients,
                consultations: consultations
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 82,
                columnNumber: 36
            }, this),
            activeTab === "ordonnances" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OrdonnancesTab, {
                prescriptions: prescriptions,
                consultations: consultations,
                onPrescriptionCreated: (newPresc)=>setPrescriptions((prev)=>[
                            ...prev,
                            newPresc
                        ])
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 84,
                columnNumber: 9
            }, this),
            activeTab === "nouvelle" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NouvelleConsultationTab, {
                patients: patients,
                onConsultationCreated: (newConsult)=>setConsultations((prev)=>[
                            ...prev,
                            newConsult
                        ])
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 91,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/doctor/dashboard.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
_s(DoctorDashboard, "lTYC/ACOoVHY6wepOrGVYWdpSIE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useSession"]
    ];
});
_c = DoctorDashboard;
// 🗓️ Agenda complet
const AgendaTab = ({ appointments, onAppointmentUpdate })=>{
    const getStatusLabel = (status)=>{
        switch(status){
            case "DONE":
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
            case "DONE":
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
                let errorMessage = "Erreur inconnue";
                try {
                    const errData = await res.json();
                    errorMessage = errData.error || "Impossible de mettre à jour";
                } catch (e) {
                    errorMessage = `Erreur ${res.status}: ${res.statusText}`;
                }
                alert("Erreur: " + errorMessage);
            }
        } catch (err) {
            console.error(err);
            alert("Erreur réseau");
        }
    };
    const sortedAppts = [
        ...appointments
    ].sort((a, b)=>new Date(a.date).getTime() - new Date(b.date).getTime());
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: "🗓️ Tous vos rendez-vous"
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 158,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            sortedAppts.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                },
                children: sortedAppts.map((appt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            border: "1px solid #ddd",
                            padding: "14px",
                            borderRadius: "8px",
                            backgroundColor: appt.status === "CANCELLED" ? "#ffebee" : "white"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: [
                                                appt.patient.firstName,
                                                " ",
                                                appt.patient.lastName
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                            lineNumber: 173,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                            lineNumber: 173,
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                            lineNumber: 181,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: getStatusColor(appt.status)
                                            },
                                            children: getStatusLabel(appt.status)
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                            lineNumber: 182,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                    lineNumber: 172,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: appt.status === "SCHEDULED" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleUpdateStatus(appt.id, "DONE"),
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
                                                lineNumber: 189,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleUpdateStatus(appt.id, "CANCELLED"),
                                                style: {
                                                    padding: "6px 100px",
                                                    backgroundColor: "#f44336",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    cursor: "pointer"
                                                },
                                                children: "❌ Annuler"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                                lineNumber: 203,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true)
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                    lineNumber: 186,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                            lineNumber: 171,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, appt.id, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 162,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 160,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Aucun rendez-vous trouvé."
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 224,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/doctor/dashboard.tsx",
        lineNumber: 157,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c1 = AgendaTab;
// 📁 Dossiers Médicaux
const DossiersTab = ({ patients, consultations })=>{
    _s1();
    const [selectedPatient, setSelectedPatient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const patientConsults = selectedPatient ? consultations.filter((c)=>c.patient.id === selectedPatient.id) : [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: "📁 Dossiers Médicaux"
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 240,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: "10px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: "Sélectionner un patient :"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 242,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        onChange: (e)=>{
                            const id = e.target.value;
                            setSelectedPatient(patients.find((p)=>p.id === id) || null);
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "-- Tous --"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 247,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            patients.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: p.id,
                                    children: [
                                        p.firstName,
                                        " ",
                                        p.lastName
                                    ]
                                }, p.id, true, {
                                    fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                    lineNumber: 249,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 243,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 241,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            selectedPatient && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        children: [
                            "Dossier de ",
                            selectedPatient.firstName,
                            " ",
                            selectedPatient.lastName
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 256,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    patientConsults.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        children: patientConsults.map((consult)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: new Date(consult.datetime).toLocaleString()
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                        lineNumber: 261,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                        lineNumber: 262,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "Diagnostic: ",
                                    consult.diagnosis,
                                    consult.prescription && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Ordonnance: ",
                                            consult.prescription.notes
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                        lineNumber: 263,
                                        columnNumber: 44
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, consult.id, true, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 260,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 258,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Aucune consultation."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 268,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 255,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/doctor/dashboard.tsx",
        lineNumber: 239,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(DossiersTab, "9STk+ZHt9ZMg/Eo0cVefKm7VM7A=");
_c2 = DossiersTab;
// 💊 Ordonnances avec formulaire (lié à une consultation)
const OrdonnancesTab = ({ prescriptions, consultations, onPrescriptionCreated })=>{
    _s2();
    const [selectedConsultationId, setSelectedConsultationId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [medications, setMedications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [notes, setNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const addMedication = ()=>{
        setMedications((prev)=>[
                ...prev,
                {
                    name: "",
                    dosage: "",
                    frequency: "",
                    duration: "",
                    notes: ""
                }
            ]);
    };
    const removeMedication = (index)=>{
        setMedications((prev)=>prev.filter((_, i)=>i !== index));
    };
    const updateMedication = (index, field, value)=>{
        setMedications((prev)=>prev.map((med, i)=>i === index ? {
                    ...med,
                    [field]: value
                } : med));
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!selectedConsultationId || medications.length === 0) {
            setMessage("Veuillez sélectionner une consultation et ajouter au moins un médicament.");
            return;
        }
        const selectedConsult = consultations.find((c)=>c.id.toString() === selectedConsultationId);
        if (!selectedConsult) {
            setMessage("Consultation invalide.");
            return;
        }
        try {
            const res = await fetch("/api/prescriptions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    consultationId: selectedConsultationId,
                    patientId: selectedConsult.patient.id,
                    medications,
                    notes
                })
            });
            if (res.ok) {
                const newPresc = await res.json();
                onPrescriptionCreated(newPresc);
                setMessage("Ordonnance créée avec succès !");
                setSelectedConsultationId("");
                setMedications([]);
                setNotes("");
            } else {
                let errorMessage = "Erreur inconnue";
                try {
                    const errData = await res.json();
                    errorMessage = errData.error || "Impossible de créer l'ordonnance";
                } catch (e) {
                    errorMessage = `Erreur ${res.status}: ${res.statusText}`;
                }
                setMessage("Erreur: " + errorMessage);
            }
        } catch (err) {
            console.error(err);
            setMessage("Erreur réseau");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: "💊 Mes Ordonnances"
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 352,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    border: "1px solid #ddd",
                    padding: "20px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    backgroundColor: "#f9f9f9"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        children: "➕ Créer une nouvelle ordonnance"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 356,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: [
                                    "Consultation :",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: selectedConsultationId,
                                        onChange: (e)=>setSelectedConsultationId(e.target.value),
                                        required: true,
                                        style: {
                                            width: "100%",
                                            padding: "8px",
                                            marginTop: "4px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "-- Sélectionner une consultation --"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                                lineNumber: 367,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            consultations.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: c.id.toString(),
                                                    children: [
                                                        new Date(c.datetime).toLocaleDateString("fr-FR"),
                                                        " - ",
                                                        c.patient.firstName,
                                                        " ",
                                                        c.patient.lastName
                                                    ]
                                                }, c.id, true, {
                                                    fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                                    lineNumber: 369,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                        lineNumber: 361,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 359,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        children: "Médicaments"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                        lineNumber: 377,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    medications.map((med, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "grid",
                                                gridTemplateColumns: "1fr 1fr 1fr 1fr auto auto",
                                                gap: "6px",
                                                marginBottom: "6px",
                                                alignItems: "center"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    placeholder: "Médicament",
                                                    value: med.name,
                                                    onChange: (e)=>updateMedication(index, "name", e.target.value),
                                                    required: true,
                                                    style: {
                                                        padding: "6px",
                                                        fontSize: "14px"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                                    lineNumber: 380,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    placeholder: "Dosage",
                                                    value: med.dosage,
                                                    onChange: (e)=>updateMedication(index, "dosage", e.target.value),
                                                    style: {
                                                        padding: "6px",
                                                        fontSize: "14px"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                                    lineNumber: 381,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    placeholder: "Fréquence",
                                                    value: med.frequency,
                                                    onChange: (e)=>updateMedication(index, "frequency", e.target.value),
                                                    style: {
                                                        padding: "6px",
                                                        fontSize: "14px"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                                    lineNumber: 382,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    placeholder: "Durée",
                                                    value: med.duration,
                                                    onChange: (e)=>updateMedication(index, "duration", e.target.value),
                                                    style: {
                                                        padding: "6px",
                                                        fontSize: "14px"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                                    lineNumber: 383,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    placeholder: "Notes",
                                                    value: med.notes,
                                                    onChange: (e)=>updateMedication(index, "notes", e.target.value),
                                                    style: {
                                                        padding: "6px",
                                                        fontSize: "14px"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                                    lineNumber: 384,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>removeMedication(index),
                                                    style: {
                                                        padding: "4px 8px",
                                                        backgroundColor: "#f44336",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "4px",
                                                        cursor: "pointer"
                                                    },
                                                    children: "❌"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                                    lineNumber: 385,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, index, true, {
                                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                            lineNumber: 379,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: addMedication,
                                        style: {
                                            marginTop: "8px",
                                            padding: "6px 12px",
                                            backgroundColor: "#2196f3",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer"
                                        },
                                        children: "➕ Ajouter un médicament"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                        lineNumber: 388,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 376,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: [
                                    "Notes générales :",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        value: notes,
                                        onChange: (e)=>setNotes(e.target.value),
                                        placeholder: "Instructions supplémentaires...",
                                        rows: 2,
                                        style: {
                                            width: "100%",
                                            padding: "8px",
                                            marginTop: "4px",
                                            fontSize: "14px"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                        lineNumber: 393,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 391,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                style: {
                                    padding: "10px 16px",
                                    backgroundColor: "#0070f3",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontWeight: "bold"
                                },
                                children: "📄 Générer l'ordonnance"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 402,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 357,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            color: message.includes("Erreur") ? "red" : "green",
                            margin: "10px 0",
                            fontWeight: "bold"
                        },
                        children: message
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 406,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 355,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                children: "📋 Liste des ordonnances"
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 410,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            prescriptions.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                },
                children: prescriptions.map((presc)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            border: "1px solid #eee",
                            padding: "12px",
                            borderRadius: "6px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "Patient:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                        lineNumber: 415,
                                        columnNumber: 18
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    " ",
                                    presc.patient.firstName,
                                    " ",
                                    presc.patient.lastName
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 415,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "Consultation:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                        lineNumber: 416,
                                        columnNumber: 18
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    " ",
                                    new Date(presc.consultation.datetime).toLocaleDateString("fr-FR")
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 416,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Médicaments:"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                    lineNumber: 417,
                                    columnNumber: 18
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 417,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                style: {
                                    backgroundColor: "#f5f5f5",
                                    padding: "8px",
                                    borderRadius: "4px",
                                    whiteSpace: "pre-wrap",
                                    fontSize: "14px"
                                },
                                children: JSON.stringify(presc.medications, null, 2)
                            }, void 0, false, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 418,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>window.open(`/api/prescriptions/${presc.id}/pdf`, "_blank"),
                                style: {
                                    marginTop: "8px",
                                    padding: "6px 12px",
                                    backgroundColor: "#4caf50",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                },
                                children: "📄 Télécharger PDF"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 421,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, presc.id, true, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 414,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 412,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Aucune ordonnance trouvée."
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 431,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/doctor/dashboard.tsx",
        lineNumber: 351,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s2(OrdonnancesTab, "BJRiIzYfUchNO7BbguKEiriDMwo=");
_c3 = OrdonnancesTab;
const NouvelleConsultationTab = ({ patients, onConsultationCreated })=>{
    _s3();
    const [selectedPatientId, setSelectedPatientId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [datetime, setDatetime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [diagnosis, setDiagnosis] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [notes, setNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
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
                let errorMessage = "Erreur inconnue";
                try {
                    const errData = await res.json();
                    errorMessage = errData.error || "Impossible de créer la consultation";
                } catch (e) {
                    errorMessage = `Erreur ${res.status}: ${res.statusText}`;
                }
                setMessage("Erreur: " + errorMessage);
                console.error("Erreur API:", res.status, res.statusText);
            }
        } catch (err) {
            console.error("Erreur réseau:", err);
            setMessage("Erreur de connexion.");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: "➕ Nouvelle Consultation"
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 497,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    maxWidth: "400px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            "Patient :",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: selectedPatientId,
                                onChange: (e)=>setSelectedPatientId(e.target.value),
                                required: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "-- Sélectionner --"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                        lineNumber: 502,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    patients.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: p.id,
                                            children: [
                                                p.firstName,
                                                " ",
                                                p.lastName
                                            ]
                                        }, p.id, true, {
                                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                            lineNumber: 504,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 501,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 499,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            "Date et heure :",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "datetime-local",
                                value: datetime,
                                onChange: (e)=>setDatetime(e.target.value),
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 511,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 509,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            "Diagnostic :",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                value: diagnosis,
                                onChange: (e)=>setDiagnosis(e.target.value),
                                required: true,
                                rows: 3,
                                style: {
                                    width: "100%",
                                    padding: "6px",
                                    marginTop: "4px"
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 516,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 514,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            "Notes (facultatif) :",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                value: notes,
                                onChange: (e)=>setNotes(e.target.value),
                                rows: 2,
                                style: {
                                    width: "100%",
                                    padding: "6px",
                                    marginTop: "4px"
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 527,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 525,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                        lineNumber: 535,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            color: message.includes("Erreur") ? "red" : "green",
                            margin: 0,
                            fontWeight: "bold"
                        },
                        children: message
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 549,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 498,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/doctor/dashboard.tsx",
        lineNumber: 496,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s3(NouvelleConsultationTab, "7V3zBvbsvIrbodFB0IzkY97i4S8=");
_c4 = NouvelleConsultationTab;
const tabStyle = (isActive)=>({
        padding: "8px 16px",
        backgroundColor: isActive ? "#0070f3" : "#e0e0e0",
        color: isActive ? "white" : "black",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer"
    });
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "DoctorDashboard");
__turbopack_context__.k.register(_c1, "AgendaTab");
__turbopack_context__.k.register(_c2, "DossiersTab");
__turbopack_context__.k.register(_c3, "OrdonnancesTab");
__turbopack_context__.k.register(_c4, "NouvelleConsultationTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/doctor/dashboard.tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/doctor/dashboard";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/doctor/dashboard.tsx [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/doctor/dashboard.tsx\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/doctor/dashboard.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__623fcc7e._.js.map