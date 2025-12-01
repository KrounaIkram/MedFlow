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
"[project]/MedFlow3/src/pages/doctor/dashboard.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DoctorDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/MedFlow3/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/MedFlow3/node_modules/styled-jsx/style.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/MedFlow3/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/MedFlow3/node_modules/next-auth/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
"use client";
;
;
;
function DoctorDashboard() {
    _s();
    const { data: session, status } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useSession"])();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("agenda");
    const [appointments, setAppointments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [patients, setPatients] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [consultations, setConsultations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [prescriptions, setPrescriptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DoctorDashboard.useEffect": ()=>{
            if (!session) return;
            const loadData = {
                "DoctorDashboard.useEffect.loadData": async ()=>{
                    try {
                        const [apptRes, patRes, consultRes, prescRes] = await Promise.all([
                            fetch("/api/appointments"),
                            fetch("/api/patients"),
                            fetch("/api/consultations"),
                            fetch("/api/prescriptions")
                        ]);
                        if (apptRes.ok) setAppointments(await apptRes.json());
                        if (patRes.ok) setPatients(await patRes.json());
                        if (consultRes.ok) setConsultations(await consultRes.json());
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
    if (status === "loading") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: "Chargement..."
    }, void 0, false, {
        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
        lineNumber: 51,
        columnNumber: 36
    }, this);
    if (!session || session.user.role !== "DOCTOR") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: "Accès refusé"
    }, void 0, false, {
        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
        lineNumber: 52,
        columnNumber: 58
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-def32ad77967d4f9" + " " + "dashboard-wrapper",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "jsx-def32ad77967d4f9",
                children: [
                    "Bienvenue, Dr. ",
                    session.user.name
                ]
            }, void 0, true, {
                fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-def32ad77967d4f9" + " " + "tabs",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab("agenda"),
                        className: "jsx-def32ad77967d4f9" + " " + ((activeTab === "agenda" ? "active" : "") || ""),
                        children: "🗓️ Agenda"
                    }, void 0, false, {
                        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab("dossiers"),
                        className: "jsx-def32ad77967d4f9" + " " + ((activeTab === "dossiers" ? "active" : "") || ""),
                        children: "📁 Dossiers Médicaux"
                    }, void 0, false, {
                        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab("ordonnances"),
                        className: "jsx-def32ad77967d4f9" + " " + ((activeTab === "ordonnances" ? "active" : "") || ""),
                        children: "💊 Ordonnances"
                    }, void 0, false, {
                        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab("nouvelle"),
                        className: "jsx-def32ad77967d4f9" + " " + ((activeTab === "nouvelle" ? "active" : "") || ""),
                        children: "➕ Nouvelle Consultation"
                    }, void 0, false, {
                        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-def32ad77967d4f9" + " " + "tab-content",
                children: [
                    activeTab === "agenda" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AgendaTab, {
                        appointments: appointments,
                        onAppointmentUpdate: (updatedAppt)=>{
                            setAppointments((prev)=>prev.map((appt)=>appt.id === updatedAppt.id ? updatedAppt : appt));
                        }
                    }, void 0, false, {
                        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                        lineNumber: 69,
                        columnNumber: 11
                    }, this),
                    activeTab === "dossiers" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DossiersTab, {
                        patients: patients,
                        consultations: consultations
                    }, void 0, false, {
                        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                        lineNumber: 78,
                        columnNumber: 38
                    }, this),
                    activeTab === "ordonnances" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OrdonnancesTab, {
                        prescriptions: prescriptions,
                        consultations: consultations,
                        onPrescriptionCreated: (newPresc)=>setPrescriptions((prev)=>[
                                    ...prev,
                                    newPresc
                                ])
                    }, void 0, false, {
                        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                        lineNumber: 80,
                        columnNumber: 11
                    }, this),
                    activeTab === "nouvelle" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NouvelleConsultationTab, {
                        patients: patients,
                        onConsultationCreated: (newConsult)=>setConsultations((prev)=>[
                                    ...prev,
                                    newConsult
                                ])
                    }, void 0, false, {
                        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                        lineNumber: 87,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                id: "def32ad77967d4f9",
                children: ".dashboard-wrapper.jsx-def32ad77967d4f9{color:#333;background:url(https://i.pinimg.com/1200x/ae/f6/17/aef6170679bdead47b720fd69615d286.jpg) 50%/cover no-repeat fixed;min-height:100vh;padding:20px;font-family:Arial,sans-serif;animation:1.5s fadeIn}h1.jsx-def32ad77967d4f9{text-align:center;color:#fff;text-shadow:2px 2px 8px #0009;margin-bottom:30px;font-size:32px;animation:1s fadeInDown}.tabs.jsx-def32ad77967d4f9{justify-content:center;gap:10px;margin-bottom:20px;display:flex}.tabs.jsx-def32ad77967d4f9 button.jsx-def32ad77967d4f9{cursor:pointer;color:#000;background-color:#e0e0e0;border:none;border-radius:25px;padding:10px 20px;font-weight:700;transition:all .3s}.tabs.jsx-def32ad77967d4f9 button.active.jsx-def32ad77967d4f9{color:#0d47a1;background-color:#fff;box-shadow:0 5px 15px #0000004d}.tabs.jsx-def32ad77967d4f9 button.jsx-def32ad77967d4f9:hover{transform:scale(1.1)}.tab-content.jsx-def32ad77967d4f9 h2.jsx-def32ad77967d4f9{color:#0d47a1;margin-bottom:15px}.tab-content.jsx-def32ad77967d4f9 h3.jsx-def32ad77967d4f9{color:#0d47a1;margin-top:15px;margin-bottom:10px}.card.jsx-def32ad77967d4f9{background:#ffffffe6;border-radius:15px;margin-bottom:12px;padding:20px;transition:all .3s;box-shadow:0 4px 15px #0000001a}.card.jsx-def32ad77967d4f9:hover{transform:translateY(-3px);box-shadow:0 10px 25px #0003}button.btn.jsx-def32ad77967d4f9{cursor:pointer;border:none;border-radius:6px;padding:6px 12px;font-weight:700;transition:all .3s}button.btn-primary.jsx-def32ad77967d4f9{color:#fff;background-color:#0d47a1}button.btn-primary.jsx-def32ad77967d4f9:hover{background-color:#1565c0}button.btn-success.jsx-def32ad77967d4f9{color:#fff;background-color:#4caf50}button.btn-success.jsx-def32ad77967d4f9:hover{background-color:#66bb6a}button.btn-danger.jsx-def32ad77967d4f9{color:#fff;background-color:#f44336}button.btn-danger.jsx-def32ad77967d4f9:hover{background-color:#e57373}input.jsx-def32ad77967d4f9,select.jsx-def32ad77967d4f9,textarea.jsx-def32ad77967d4f9{box-sizing:border-box;border:1px solid #90caf9;border-radius:8px;width:100%;margin-top:4px;margin-bottom:6px;padding:10px;transition:all .3s}input.jsx-def32ad77967d4f9:focus,select.jsx-def32ad77967d4f9:focus,textarea.jsx-def32ad77967d4f9:focus{border-color:#0d47a1;outline:none;box-shadow:0 0 8px #0d47a1}p.message.jsx-def32ad77967d4f9{margin:6px 0;font-weight:700}p.success.jsx-def32ad77967d4f9{color:green}p.error.jsx-def32ad77967d4f9{color:red}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}@keyframes fadeInDown{0%{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
_s(DoctorDashboard, "lTYC/ACOoVHY6wepOrGVYWdpSIE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useSession"]
    ];
});
_c = DoctorDashboard;
// -----------------
// Agenda Tab
// -----------------
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
                alert("Erreur lors de la mise à jour");
            }
        } catch (err) {
            console.error(err);
            alert("Erreur réseau");
        }
    };
    const sortedAppts = [
        ...appointments
    ].sort((a, b)=>new Date(a.date).getTime() - new Date(b.date).getTime());
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: "🗓️ Tous vos rendez-vous"
            }, void 0, false, {
                fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                lineNumber: 266,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            sortedAppts.length > 0 ? sortedAppts.map((appt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "card",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: [
                                            appt.patient.firstName,
                                            " ",
                                            appt.patient.lastName
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                        lineNumber: 272,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                        lineNumber: 272,
                                        columnNumber: 82
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "📅 ",
                                    new Date(appt.date).toLocaleString("fr-FR", {
                                        weekday: 'short',
                                        day: '2-digit',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                        lineNumber: 273,
                                        columnNumber: 148
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: getStatusColor(appt.status)
                                        },
                                        children: getStatusLabel(appt.status)
                                    }, void 0, false, {
                                        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                        lineNumber: 274,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                lineNumber: 271,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: appt.status === "SCHEDULED" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "btn btn-success",
                                            onClick: ()=>handleUpdateStatus(appt.id, "DONE"),
                                            children: "✅ Confirmer"
                                        }, void 0, false, {
                                            fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                            lineNumber: 279,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "btn btn-danger",
                                            onClick: ()=>handleUpdateStatus(appt.id, "CANCELLED"),
                                            children: "❌ Annuler"
                                        }, void 0, false, {
                                            fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                            lineNumber: 280,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                lineNumber: 276,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                        lineNumber: 270,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, appt.id, false, {
                    fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                    lineNumber: 269,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Aucun rendez-vous trouvé."
            }, void 0, false, {
                fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                lineNumber: 287,
                columnNumber: 12
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
        lineNumber: 265,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c1 = AgendaTab;
// -----------------
// Dossiers Tab
// -----------------
const DossiersTab = ({ patients, consultations })=>{
    _s1();
    const [selectedPatient, setSelectedPatient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const patientConsults = selectedPatient ? consultations.filter((c)=>c.patient.id === selectedPatient.id) : [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: "📁 Dossiers Médicaux"
            }, void 0, false, {
                fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                lineNumber: 301,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                onChange: (e)=>setSelectedPatient(patients.find((p)=>p.id === e.target.value) || null),
                value: selectedPatient?.id || "",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "",
                        children: "-- Tous --"
                    }, void 0, false, {
                        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                        lineNumber: 303,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    patients.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: p.id,
                            children: [
                                p.firstName,
                                " ",
                                p.lastName
                            ]
                        }, p.id, true, {
                            fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                            lineNumber: 304,
                            columnNumber: 28
                        }, ("TURBOPACK compile-time value", void 0)))
                ]
            }, void 0, true, {
                fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                lineNumber: 302,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            selectedPatient && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        children: [
                            "Dossier de ",
                            selectedPatient.firstName,
                            " ",
                            selectedPatient.lastName
                        ]
                    }, void 0, true, {
                        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                        lineNumber: 309,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    patientConsults.length > 0 ? patientConsults.map((consult)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "card",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: new Date(consult.datetime).toLocaleString()
                                }, void 0, false, {
                                    fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                    lineNumber: 313,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                    lineNumber: 313,
                                    columnNumber: 79
                                }, ("TURBOPACK compile-time value", void 0)),
                                "Diagnostic: ",
                                consult.diagnosis,
                                consult.prescription && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        "Ordonnance: ",
                                        consult.prescription.notes
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                    lineNumber: 315,
                                    columnNumber: 42
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, consult.datetime, true, {
                            fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                            lineNumber: 312,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Aucune consultation."
                    }, void 0, false, {
                        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                        lineNumber: 318,
                        columnNumber: 15
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                lineNumber: 308,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
        lineNumber: 300,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(DossiersTab, "9STk+ZHt9ZMg/Eo0cVefKm7VM7A=");
_c2 = DossiersTab;
// -----------------
// Ordonnances Tab
// -----------------
const OrdonnancesTab = ({ prescriptions, consultations, onPrescriptionCreated })=>{
    _s2();
    const [selectedConsultationId, setSelectedConsultationId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [medications, setMedications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [notes, setNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const addMedication = ()=>setMedications((prev)=>[
                ...prev,
                {
                    name: "",
                    dosage: "",
                    frequency: "",
                    duration: "",
                    notes: ""
                }
            ]);
    const removeMedication = (i)=>setMedications((prev)=>prev.filter((_, idx)=>idx !== i));
    const updateMedication = (i, field, val)=>setMedications((prev)=>prev.map((m, idx)=>idx === i ? {
                    ...m,
                    [field]: val
                } : m));
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!selectedConsultationId || medications.length === 0) {
            setMessage("Sélectionner une consultation et ajouter au moins un médicament.");
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
                setMessage("Ordonnance créée !");
                setSelectedConsultationId("");
                setMedications([]);
                setNotes("");
            } else {
                setMessage("Erreur lors de la création");
            }
        } catch (err) {
            console.error(err);
            setMessage("Erreur réseau");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: "💊 Mes Ordonnances"
            }, void 0, false, {
                fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                lineNumber: 356,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        children: "➕ Créer une nouvelle ordonnance"
                    }, void 0, false, {
                        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                        lineNumber: 359,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: selectedConsultationId,
                                onChange: (e)=>setSelectedConsultationId(e.target.value),
                                required: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "-- Sélectionner une consultation --"
                                    }, void 0, false, {
                                        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                        lineNumber: 362,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    consultations.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: c.id,
                                            children: [
                                                new Date(c.datetime).toLocaleDateString("fr-FR"),
                                                " - ",
                                                c.patient.firstName,
                                                " ",
                                                c.patient.lastName
                                            ]
                                        }, c.id, true, {
                                            fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                            lineNumber: 363,
                                            columnNumber: 35
                                        }, ("TURBOPACK compile-time value", void 0)))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                lineNumber: 361,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            medications.map((med, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
                                        gap: "6px"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            placeholder: "Médicament",
                                            value: med.name,
                                            onChange: (e)=>updateMedication(i, "name", e.target.value),
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                            lineNumber: 368,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            placeholder: "Dosage",
                                            value: med.dosage,
                                            onChange: (e)=>updateMedication(i, "dosage", e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                            lineNumber: 369,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            placeholder: "Fréquence",
                                            value: med.frequency,
                                            onChange: (e)=>updateMedication(i, "frequency", e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                            lineNumber: 370,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            placeholder: "Durée",
                                            value: med.duration,
                                            onChange: (e)=>updateMedication(i, "duration", e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                            lineNumber: 371,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "btn btn-danger",
                                            onClick: ()=>removeMedication(i),
                                            children: "❌"
                                        }, void 0, false, {
                                            fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                            lineNumber: 372,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, i, true, {
                                    fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                    lineNumber: 367,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "btn btn-primary",
                                onClick: addMedication,
                                children: "➕ Ajouter un médicament"
                            }, void 0, false, {
                                fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                lineNumber: 375,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                placeholder: "Notes...",
                                value: notes,
                                onChange: (e)=>setNotes(e.target.value),
                                rows: 2
                            }, void 0, false, {
                                fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                lineNumber: 377,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: "btn btn-primary",
                                children: "📄 Générer l'ordonnance"
                            }, void 0, false, {
                                fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                lineNumber: 379,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                        lineNumber: 360,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: `message ${message.includes("Erreur") ? "error" : "success"}`,
                        children: message
                    }, void 0, false, {
                        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                        lineNumber: 381,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                lineNumber: 358,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                children: "📋 Liste des ordonnances"
            }, void 0, false, {
                fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                lineNumber: 384,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            prescriptions.length > 0 ? prescriptions.map((presc)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "card",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Patient:"
                                }, void 0, false, {
                                    fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                    lineNumber: 387,
                                    columnNumber: 14
                                }, ("TURBOPACK compile-time value", void 0)),
                                " ",
                                presc.patient.firstName,
                                " ",
                                presc.patient.lastName
                            ]
                        }, void 0, true, {
                            fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                            lineNumber: 387,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Consultation:"
                                }, void 0, false, {
                                    fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                    lineNumber: 388,
                                    columnNumber: 14
                                }, ("TURBOPACK compile-time value", void 0)),
                                " ",
                                new Date(presc.consultation.datetime).toLocaleDateString("fr-FR")
                            ]
                        }, void 0, true, {
                            fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                            lineNumber: 388,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "Médicaments:"
                            }, void 0, false, {
                                fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                lineNumber: 389,
                                columnNumber: 14
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                            lineNumber: 389,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                            style: {
                                background: "#f5f5f5",
                                padding: "8px",
                                borderRadius: "4px",
                                whiteSpace: "pre-wrap"
                            },
                            children: JSON.stringify(presc.medications, null, 2)
                        }, void 0, false, {
                            fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                            lineNumber: 390,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn btn-success",
                            onClick: ()=>window.open(`/api/prescriptions/${presc.id}/pdf`, "_blank"),
                            children: "📄 Télécharger PDF"
                        }, void 0, false, {
                            fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                            lineNumber: 391,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, presc.id, true, {
                    fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                    lineNumber: 386,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Aucune ordonnance trouvée."
            }, void 0, false, {
                fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                lineNumber: 393,
                columnNumber: 12
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
        lineNumber: 355,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s2(OrdonnancesTab, "BJRiIzYfUchNO7BbguKEiriDMwo=");
_c3 = OrdonnancesTab;
const NouvelleConsultationTab = ({ patients, onConsultationCreated })=>{
    _s3();
    const [selectedPatientId, setSelectedPatientId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [datetime, setDatetime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [diagnosis, setDiagnosis] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [notes, setNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!selectedPatientId || !datetime || !diagnosis) {
            setMessage("Tous les champs obligatoires");
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
                    notes
                })
            });
            if (res.ok) {
                const newConsult = await res.json();
                onConsultationCreated(newConsult);
                setMessage("Consultation créée !");
                setSelectedPatientId("");
                setDatetime("");
                setDiagnosis("");
                setNotes("");
            } else setMessage("Erreur lors de la création");
        } catch (err) {
            console.error(err);
            setMessage("Erreur réseau");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: "➕ Nouvelle Consultation"
            }, void 0, false, {
                fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                lineNumber: 425,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: selectedPatientId,
                                onChange: (e)=>setSelectedPatientId(e.target.value),
                                required: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "-- Sélectionner un patient --"
                                    }, void 0, false, {
                                        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                        lineNumber: 429,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    patients.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: p.id,
                                            children: [
                                                p.firstName,
                                                " ",
                                                p.lastName
                                            ]
                                        }, p.id, true, {
                                            fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                            lineNumber: 430,
                                            columnNumber: 30
                                        }, ("TURBOPACK compile-time value", void 0)))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                lineNumber: 428,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "datetime-local",
                                value: datetime,
                                onChange: (e)=>setDatetime(e.target.value),
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                lineNumber: 432,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                placeholder: "Diagnostic",
                                value: diagnosis,
                                onChange: (e)=>setDiagnosis(e.target.value),
                                rows: 2,
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                lineNumber: 433,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                placeholder: "Notes complémentaires",
                                value: notes,
                                onChange: (e)=>setNotes(e.target.value),
                                rows: 2
                            }, void 0, false, {
                                fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                lineNumber: 434,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: "btn btn-primary",
                                children: "Créer la consultation"
                            }, void 0, false, {
                                fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                                lineNumber: 435,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                        lineNumber: 427,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$MedFlow3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: `message ${message.includes("Erreur") ? "error" : "success"}`,
                        children: message
                    }, void 0, false, {
                        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                        lineNumber: 437,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
                lineNumber: 426,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/MedFlow3/src/pages/doctor/dashboard.tsx",
        lineNumber: 424,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s3(NouvelleConsultationTab, "MjHwq/EohxwnUqpQrj4fYOTousA=");
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
"[next]/entry/page-loader.ts { PAGE => \"[project]/MedFlow3/src/pages/doctor/dashboard.tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/doctor/dashboard";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/MedFlow3/src/pages/doctor/dashboard.tsx [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/MedFlow3/src/pages/doctor/dashboard.tsx\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/MedFlow3/src/pages/doctor/dashboard.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__397b3736._.js.map