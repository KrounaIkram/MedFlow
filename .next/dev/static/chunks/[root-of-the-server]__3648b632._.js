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
"[project]/src/pages/patient.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PatientDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function PatientDashboard() {
    _s();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("appointments");
    const [appointments, setAppointments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [doctors, setDoctors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [invoices, setInvoices] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [prescriptions, setPrescriptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [selectedDoctor, setSelectedDoctor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedDate, setSelectedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedType, setSelectedType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("CONSULTATION");
    const [notes, setNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [creating, setCreating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingId, setEditingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
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
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["toast"].error(err.message || "Erreur lors du chargement des données");
        } finally{
            setLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PatientDashboard.useEffect": ()=>{
            fetchData();
        }
    }["PatientDashboard.useEffect"], []);
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
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["toast"].success("Rendez-vous modifié avec succès !");
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
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["toast"].success("Rendez-vous créé avec succès !");
            }
            await fetchData();
            setSelectedDoctor("");
            setSelectedDate("");
            setSelectedType("CONSULTATION");
            setNotes("");
            setEditingId(null);
        } catch (err) {
            console.error(err);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["toast"].error(err.message || "Erreur serveur");
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
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["toast"].error(err.message || "Erreur lors du lancement du paiement");
        }
    };
    // Calcul KPI
    const pendingInvoices = invoices.filter((i)=>i.status === "PENDING").length;
    const upcomingAppointments = appointments.filter((a)=>new Date(a.date) > new Date()).length;
    const totalPrescriptions = prescriptions.length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-55dcf86c4a09de53" + " " + "dashboardWrapper",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-55dcf86c4a09de53" + " " + "dashboardContainer",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "jsx-55dcf86c4a09de53",
                        children: "Tableau Patient"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/patient.tsx",
                        lineNumber: 138,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-55dcf86c4a09de53" + " " + "kpiCards",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-55dcf86c4a09de53" + " " + "kpiCard",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "jsx-55dcf86c4a09de53",
                                        children: "Rendez-vous à venir"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/patient.tsx",
                                        lineNumber: 143,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-55dcf86c4a09de53" + " " + "kpiCard",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "jsx-55dcf86c4a09de53",
                                        children: "Factures en attente"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/patient.tsx",
                                        lineNumber: 147,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-55dcf86c4a09de53" + " " + "kpiCard",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "jsx-55dcf86c4a09de53",
                                        children: "Ordonnances"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/patient.tsx",
                                        lineNumber: 151,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-55dcf86c4a09de53" + " " + "tabs",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab("appointments"),
                                className: "jsx-55dcf86c4a09de53" + " " + ((activeTab === "appointments" ? "active" : "") || ""),
                                children: "🗓️ Rendez-vous"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/patient.tsx",
                                lineNumber: 157,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab("invoices"),
                                className: "jsx-55dcf86c4a09de53" + " " + ((activeTab === "invoices" ? "active" : "") || ""),
                                children: "💰 Factures"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/patient.tsx",
                                lineNumber: 158,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "jsx-55dcf86c4a09de53",
                        children: "Chargement..."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/patient.tsx",
                        lineNumber: 162,
                        columnNumber: 20
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            activeTab === "appointments" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-55dcf86c4a09de53" + " " + "section",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-55dcf86c4a09de53",
                                        children: "Mes Rendez-vous"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/patient.tsx",
                                        lineNumber: 166,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-55dcf86c4a09de53" + " " + "cardsWrapper",
                                        children: appointments.map((a)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-55dcf86c4a09de53" + " " + `card ${a.status.toLowerCase()}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "jsx-55dcf86c4a09de53",
                                                        children: new Date(a.date).toLocaleString()
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/patient.tsx",
                                                        lineNumber: 170,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-55dcf86c4a09de53",
                                                        children: [
                                                            "Status: ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-55dcf86c4a09de53",
                                        children: editingId ? "Modifier Rendez-vous" : "Créer Rendez-vous"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/patient.tsx",
                                        lineNumber: 179,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                        onSubmit: handleSubmitAppointment,
                                        className: "jsx-55dcf86c4a09de53" + " " + "formBox",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: selectedDoctor,
                                                onChange: (e)=>setSelectedDoctor(e.target.value),
                                                required: true,
                                                disabled: !!editingId,
                                                className: "jsx-55dcf86c4a09de53",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        className: "jsx-55dcf86c4a09de53",
                                                        children: "Sélectionner un docteur"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/patient.tsx",
                                                        lineNumber: 182,
                                                        columnNumber: 21
                                                    }, this),
                                                    doctors.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: selectedType,
                                                onChange: (e)=>setSelectedType(e.target.value),
                                                className: "jsx-55dcf86c4a09de53",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "CONSULTATION",
                                                        className: "jsx-55dcf86c4a09de53",
                                                        children: "Consultation"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/patient.tsx",
                                                        lineNumber: 187,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "URGENCY",
                                                        className: "jsx-55dcf86c4a09de53",
                                                        children: "Urgence"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/patient.tsx",
                                                        lineNumber: 188,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "FOLLOW_UP",
                                                        className: "jsx-55dcf86c4a09de53",
                                                        children: "Suivi"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/patient.tsx",
                                                        lineNumber: 189,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                placeholder: "Notes (facultatif)",
                                                value: notes,
                                                onChange: (e)=>setNotes(e.target.value),
                                                className: "jsx-55dcf86c4a09de53"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/patient.tsx",
                                                lineNumber: 192,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                            activeTab === "invoices" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-55dcf86c4a09de53" + " " + "section",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-55dcf86c4a09de53",
                                        children: "Mes Factures"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/patient.tsx",
                                        lineNumber: 200,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-55dcf86c4a09de53" + " " + "cardsWrapper",
                                        children: invoices.map((inv)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-55dcf86c4a09de53" + " " + `card ${inv.status.toLowerCase()}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
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
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-55dcf86c4a09de53",
                                                        children: [
                                                            "Status: ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                                    inv.status === "PENDING" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                            activeTab === "prescriptions" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-55dcf86c4a09de53" + " " + "section",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-55dcf86c4a09de53",
                                        children: "Mes Ordonnances"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/patient.tsx",
                                        lineNumber: 216,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-55dcf86c4a09de53" + " " + "cardsWrapper",
                                        children: prescriptions.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-55dcf86c4a09de53" + " " + "card",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
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
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
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
_s(PatientDashboard, "ONsh5pVRp7DcfZGR0d72sVkHGP0=");
_c = PatientDashboard;
var _c;
__turbopack_context__.k.register(_c, "PatientDashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/patient.tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/patient";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/patient.tsx [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/patient\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/patient.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__3648b632._.js.map