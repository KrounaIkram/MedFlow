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
"use client";
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
        lineNumber: 45,
        columnNumber: 36
    }, this);
    if (!session || session.user.role !== "DOCTOR") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: "Accès refusé"
    }, void 0, false, {
        fileName: "[project]/src/pages/doctor/dashboard.tsx",
        lineNumber: 46,
        columnNumber: 58
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: styles.container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: styles.tabsContainer,
                children: [
                    "agenda",
                    "dossiers",
                    "ordonnances",
                    "nouvelle"
                ].map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: styles.content,
                children: [
                    activeTab === "agenda" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AgendaTab, {
                        appointments: appointments,
                        onAppointmentUpdate: (u)=>setAppointments((prev)=>prev.map((a)=>a.id === u.id ? u : a))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 70,
                        columnNumber: 36
                    }, this),
                    activeTab === "dossiers" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DossiersTab, {
                        patients: patients,
                        consultations: consultations
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 71,
                        columnNumber: 38
                    }, this),
                    activeTab === "ordonnances" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OrdonnancesTab, {
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
                    activeTab === "nouvelle" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NouvelleConsultationTab, {
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
_s(DoctorDashboard, "lTYC/ACOoVHY6wepOrGVYWdpSIE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useSession"]
    ];
});
_c = DoctorDashboard;
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: sortedAppts.length > 0 ? sortedAppts.map((appt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    ...styles.card,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
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
                                lineNumber: 145,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 145,
                                columnNumber: 78
                            }, ("TURBOPACK compile-time value", void 0)),
                            new Date(appt.date).toLocaleString("fr-FR"),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 146,
                                columnNumber: 58
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    appt.status === "SCHEDULED" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            gap: "6px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
            }, ("TURBOPACK compile-time value", void 0))) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
_c1 = AgendaTab;
// ======== DOSSIERS ========
const DossiersTab = ({ patients, consultations })=>{
    _s1();
    const [selectedPatient, setSelectedPatient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const patientConsults = selectedPatient ? consultations.filter((c)=>c.patient.id === selectedPatient.id) : [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: "Dossiers Médicaux"
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 168,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                onChange: (e)=>setSelectedPatient(patients.find((p)=>p.id === e.target.value) || null),
                style: {
                    padding: "8px",
                    borderRadius: "6px",
                    marginBottom: "15px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "",
                        children: "-- Sélectionner un patient --"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 170,
                        columnNumber: 9
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
                            lineNumber: 171,
                            columnNumber: 28
                        }, ("TURBOPACK compile-time value", void 0)))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 169,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            selectedPatient && patientConsults.length > 0 ? patientConsults.map((consult)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: styles.card,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            children: new Date(consult.datetime).toLocaleString()
                        }, void 0, false, {
                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                            lineNumber: 177,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                            lineNumber: 177,
                            columnNumber: 75
                        }, ("TURBOPACK compile-time value", void 0)),
                        "Diagnostic: ",
                        consult.diagnosis,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                            lineNumber: 178,
                            columnNumber: 44
                        }, ("TURBOPACK compile-time value", void 0)),
                        consult.prescription && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                }, ("TURBOPACK compile-time value", void 0))) : selectedPatient ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Aucune consultation"
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 182,
                columnNumber: 29
            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
_s1(DossiersTab, "9STk+ZHt9ZMg/Eo0cVefKm7VM7A=");
_c2 = DossiersTab;
// ======== ORDONNANCES ========
const OrdonnancesTab = ({ prescriptions, consultations, onPrescriptionCreated })=>{
    _s2();
    const [selectedConsultationId, setSelectedConsultationId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [medications, setMedications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: "Ordonnances"
            }, void 0, false, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 221,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                style: {
                    marginBottom: "20px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: selectedConsultationId,
                        onChange: (e)=>setSelectedConsultationId(e.target.value),
                        style: {
                            padding: "8px",
                            borderRadius: "6px",
                            marginBottom: "10px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "-- Sélectionner une consultation --"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                                lineNumber: 224,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            consultations.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
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
                    medications.map((med, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                gap: "6px",
                                marginBottom: "6px"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
            prescriptions.length > 0 ? prescriptions.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: styles.card,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                "Consultation: ",
                                new Date(p.consultation.datetime).toLocaleDateString()
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/doctor/dashboard.tsx",
                            lineNumber: 241,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
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
                }, ("TURBOPACK compile-time value", void 0))) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
_s2(OrdonnancesTab, "vyw/WYe82rEBFjeCRl1U85EdMVQ=");
_c3 = OrdonnancesTab;
// ======== NOUVELLE CONSULTATION ========
const NouvelleConsultationTab = ({ patients, onConsultationCreated })=>{
    _s3();
    const [patientId, setPatientId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [datetime, setDatetime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [diagnosis, setDiagnosis] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit,
        style: {
            display: "flex",
            flexDirection: "column",
            gap: "10px"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                value: patientId,
                onChange: (e)=>setPatientId(e.target.value),
                style: {
                    padding: "8px",
                    borderRadius: "6px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "",
                        children: "-- Sélectionner un patient --"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/doctor/dashboard.tsx",
                        lineNumber: 273,
                        columnNumber: 9
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
                            lineNumber: 274,
                            columnNumber: 28
                        }, ("TURBOPACK compile-time value", void 0)))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/doctor/dashboard.tsx",
                lineNumber: 272,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
_s3(NouvelleConsultationTab, "GGQ2rm5bPIwYLH5C3ho5MHY0FYY=");
_c4 = NouvelleConsultationTab;
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