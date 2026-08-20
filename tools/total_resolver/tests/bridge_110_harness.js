'use strict';

const fsNode = require('fs');
const vm = require('vm');

const bridgePath = process.argv[2];
if (!bridgePath) throw new Error('usage: node bridge_110_harness.js <bridge.js>');

const RDRAM_SIZE = 0x00400000;
const ALLOCATED_RDRAM_SIZE = 0x00800000;
let serverInstance = null;
let nextCallbackId = 1;
let memoryBlockReads = 0;
let frontierFixture = null;
let nativePrevious = null;
const callbacks = {
    state: new Map(),
    exec: new Map(),
    execFrontier: new Map(),
    read: new Map(),
    write: new Map(),
    dma: new Map(),
    snapshot: new Map(),
};
const native = {
    instructions: new Set(), edges: new Set(), dma: new Map(),
    instructionOrdinals: new Map(), edgeOrdinals: new Map(), dmaOrdinals: new Map(),
    instructionHits: new Set(), edgeHits: new Set(), dmaHits: new Set(),
    instructionMaxOrdinal: 0, edgeMaxOrdinal: 0, dmaMaxOrdinal: 0,
    contextRecords: [], contextNextOrder: 1, pendingContext: null,
};

function activityBitmap(ordinals, maximum) {
    const bytes = Buffer.alloc(Math.floor((maximum + 7) / 8));
    for (const ordinal of ordinals) {
        bytes[Math.floor((ordinal - 1) / 8)] |= 1 << ((ordinal - 1) & 7);
    }
    return bytes;
}

class FakeServer {
    constructor() { this.handlers = {}; serverInstance = this; }
    on(name, callback) { this.handlers[name] = callback; }
    listen() { if (this.handlers.listening) this.handlers.listening(); }
}

function register(map, value) {
    const id = nextCallbackId++;
    map.set(id, value);
    return id;
}

function instructionKey(physical, opcode) {
    return (physical >>> 0).toString(16) + ':' + (opcode >>> 0).toString(16);
}
function edgeKey(source, destination) {
    return instructionKey(source.physical, source.opcode) + '>' +
        instructionKey(destination.physical, destination.opcode);
}
function dmaKey(source, destination, bytes) {
    return source.toString(16) + ':' + destination.toString(16) + ':' +
        Buffer.from(bytes).toString('hex');
}

const zeroProxy = new Proxy({}, { get: () => 0, set: () => true });
const context = {
    Date, Math, JSON, Number, String, Object, Array, Buffer, Uint8Array,
    isFinite, isNaN, parseInt,
    OS_READ: 0,
    EMU_STARTED: 1,
    EMU_STOPPED: 2,
    EMU_RESETTING: 3,
    EMU_RESET: 4,
    EMU_PAUSED: 5,
    EMU_RESUMED: 6,
    EMU_LOADED_ROM: 7,
    EMU_LOADED_STATE: 8,
    EMU_DEBUG_PAUSED: 9,
    EMU_DEBUG_RESUMED: 10,
    PIF_RAM_START: 0xBFC007C0,
    script: { keepalive() {}, timeout() {} },
    console: { log() {} },
    Server: FakeServer,
    debug: { paused: false, breakhere() {}, resume() {} },
    pj64: {
        frameCount: 41,
        cpuCore: 'interpreter',
        romInfo: {
            name: 'fixture', goodName: 'fixture', fileName: 'fixture.z64',
            filePath: 'C:/fixture.z64', crc1: 0x12345678, crc2: 0x9ABCDEF0,
        },
    },
    cpu: { pc: 0x80001000, gpr: zeroProxy, cop0: zeroProxy },
    mem: {
        ramSize: ALLOCATED_RDRAM_SIZE,
        u8: zeroProxy, u16: zeroProxy, u32: zeroProxy,
        s8: zeroProxy, s16: zeroProxy, s32: zeroProxy,
        getblock(_address, length) {
            memoryBlockReads += 1;
            return new Uint8Array(length);
        },
    },
    events: {
        onstatechange(callback) { return register(callbacks.state, callback); },
        onpifread() { return nextCallbackId++; },
        onexec(_target, callback) { return register(callbacks.exec, callback); },
        onexecunique(_target, callback) { return register(callbacks.execFrontier, { callback }); },
        onexecfrontier(target, callback) {
            return register(callbacks.execFrontier, { target, callback });
        },
        onread(_target, callback) { return register(callbacks.read, callback); },
        onwrite(_target, callback) { return register(callbacks.write, callback); },
        onpidmacompletefrontier(callback) { return register(callbacks.dma, callback); },
        onrdramsnapshot(callback) { return register(callbacks.snapshot, callback); },
        loadcoveragefrontier(_path, identity, rom) {
            if (!frontierFixture || frontierFixture.identity !== identity || rom !== 'A'.repeat(64)) {
                throw new Error('native fixture identity mismatch');
            }
            native.instructions = new Set(frontierFixture.instructions);
            native.edges = new Set(frontierFixture.edges);
            native.dma = new Map(frontierFixture.dma);
            native.instructionOrdinals = new Map(
                frontierFixture.instructions.map((key, index) => [key, index + 1]));
            native.edgeOrdinals = new Map(
                frontierFixture.edges.map((key, index) => [key, index + 1]));
            native.dmaOrdinals = new Map(
                frontierFixture.dma.map((item, index) => [item[0], index + 1]));
            native.instructionMaxOrdinal = frontierFixture.instructions.length;
            native.edgeMaxOrdinal = frontierFixture.edges.length;
            native.dmaMaxOrdinal = frontierFixture.dma.length;
            native.instructionHits.clear();
            native.edgeHits.clear();
            native.dmaHits.clear();
            return {
                loaded: true, formatVersion: 4, rdramSize: RDRAM_SIZE,
                identity, romSha256: rom,
                physicalPageCount: frontierFixture.pages,
                instructionCount: native.instructions.size,
                edgeCount: native.edges.size,
                dmaCount: native.dma.size,
                instructionMaxOrdinal: native.instructionMaxOrdinal,
                edgeMaxOrdinal: native.edgeMaxOrdinal,
                dmaMaxOrdinal: native.dmaMaxOrdinal,
            };
        },
        coveragefrontierstatus() { return { loaded: frontierFixture !== null }; },
        resetcoverageactivity() {
            native.instructionHits.clear();
            native.edgeHits.clear();
            native.dmaHits.clear();
            native.contextRecords = [];
            native.contextNextOrder = 1;
            native.pendingContext = null;
            return true;
        },
        armcoveragecontext(markerId, beforeCount, afterCount) {
            if (native.pendingContext) throw new Error('context already pending');
            native.pendingContext = {
                markerId, beforeCount: Math.min(beforeCount, native.contextRecords.length),
                afterCount, afterRemaining: afterCount,
                records: native.contextRecords.slice(-beforeCount).map((record) =>
                    Object.assign({}, record, { side: 'before' })),
            };
            return { markerId, beforeRequested: beforeCount, afterRequested: afterCount, armed: true };
        },
        draincoverageactivity() {
            const result = {
                formatVersion: 4,
                identity: frontierFixture.identity,
                instructionMaxOrdinal: native.instructionMaxOrdinal,
                instructionHitCount: native.instructionHits.size,
                instructionHitBitmap: activityBitmap(
                    native.instructionHits, native.instructionMaxOrdinal),
                edgeMaxOrdinal: native.edgeMaxOrdinal,
                edgeHitCount: native.edgeHits.size,
                edgeHitBitmap: activityBitmap(native.edgeHits, native.edgeMaxOrdinal),
                dmaMaxOrdinal: native.dmaMaxOrdinal,
                dmaHitCount: native.dmaHits.size,
                dmaHitBitmap: activityBitmap(native.dmaHits, native.dmaMaxOrdinal),
            };
            native.instructionHits.clear();
            native.edgeHits.clear();
            native.dmaHits.clear();
            return result;
        },
        remove(id) {
            for (const map of Object.values(callbacks)) map.delete(id);
        },
    },
};
vm.createContext(context);
vm.runInContext(fsNode.readFileSync(bridgePath, 'utf8'), context, { filename: bridgePath });
if (!serverInstance || !serverInstance.handlers.connection) throw new Error('bridge server missing');

const replies = [];
let receive = null;
serverInstance.handlers.connection({
    on(name, callback) { if (name === 'data') receive = callback; },
    write(payload) { replies.push(JSON.parse(String(payload).trim())); },
});
function command(line) {
    const before = replies.length;
    receive(Buffer.from(line + '\n', 'utf8'));
    if (replies.length !== before + 1) throw new Error('missing response: ' + line);
    const response = replies.pop();
    if (!response.ok) throw new Error(line + ': ' + response.error);
    return response;
}
function utf16Hex(value) { return Buffer.from(value, 'utf16le').toString('hex').toUpperCase(); }
function loadFrontier(identity, instructions = [], edges = [], dma = []) {
    frontierFixture = {
        identity,
        instructions: instructions.map((item) => instructionKey(item.physical, item.opcode)),
        edges: edges.map((item) => edgeKey(item[0], item[1])),
        dma: dma.map((item) => [dmaKey(item.source, item.destination, item.bytes), true]),
        pages: new Set(instructions.map((item) => item.physical & ~0xFFF)).size,
    };
    return command('frontier load ' + identity + ' ' + 'A'.repeat(64) + ' ' +
        utf16Hex('C:\\fixture.trf')).frontier;
}
function fireSnapshot(pc = 0x80001000) {
    const items = Array.from(callbacks.snapshot.values());
    if (items.length !== 1) throw new Error('snapshot callback missing');
    items[0]({ pc, ramSize: ALLOCATED_RDRAM_SIZE, bytes: new Uint8Array(RDRAM_SIZE) });
}
function emitExec(pc, opcode, page, generation) {
    const current = { pc, opcode, page, generation, physical: page + (pc & 0xFFF) };
    const contextRecord = {
        localOrder: native.contextNextOrder++, frame: 41, pc, opcode,
        physicalAddress: page <= 0x3FF000 ? current.physical : null,
        previousValid: nativePrevious !== null,
        previousPc: nativePrevious ? nativePrevious.pc : 0,
        previousOpcode: nativePrevious ? nativePrevious.opcode : 0,
        previousPhysicalAddress: nativePrevious && nativePrevious.page <= 0x3FF000 ?
            nativePrevious.physical : null,
        side: 'after',
    };
    native.contextRecords.push(contextRecord);
    if (native.contextRecords.length > 32768) native.contextRecords.shift();
    let readyContext = null;
    if (native.pendingContext) {
        native.pendingContext.records.push(contextRecord);
        native.pendingContext.afterRemaining -= 1;
        if (native.pendingContext.afterRemaining === 0) {
            readyContext = {
                markerId: native.pendingContext.markerId,
                beforeCount: native.pendingContext.beforeCount,
                afterCount: native.pendingContext.afterCount,
                requestedAfterCount: native.pendingContext.afterCount,
                records: native.pendingContext.records,
            };
            native.pendingContext = null;
        }
    }
    const currentKey = instructionKey(current.physical, opcode);
    const newInstruction = !native.instructions.has(currentKey);
    if (!newInstruction && native.instructionOrdinals.has(currentKey)) {
        native.instructionHits.add(native.instructionOrdinals.get(currentKey));
    }
    if (newInstruction) native.instructions.add(instructionKey(current.physical, opcode));
    let newEdge = false;
    if (nativePrevious && nativePrevious.physical < RDRAM_SIZE) {
        const key = edgeKey(nativePrevious, current);
        newEdge = !native.edges.has(key);
        if (!newEdge && native.edgeOrdinals.has(key)) {
            native.edgeHits.add(native.edgeOrdinals.get(key));
        }
        if (newEdge) native.edges.add(key);
    }
    if (newInstruction || newEdge || readyContext) {
        for (const item of callbacks.execFrontier.values()) {
            if (!item.target || (pc >= item.target.start && pc <= item.target.end)) {
                item.callback({
                    pc, opcode, pagePhysicalAddress: page, pageGeneration: generation,
                    hasPrevious: nativePrevious !== null,
                    previousPc: nativePrevious ? nativePrevious.pc : 0,
                    previousOpcode: nativePrevious ? nativePrevious.opcode : 0,
                    previousPagePhysicalAddress: nativePrevious ? nativePrevious.page : 0,
                    previousPageGeneration: nativePrevious ? nativePrevious.generation : 0,
                    newInstruction, newEdge,
                    contextMarkerReady: readyContext !== null,
                    executionContext: readyContext,
                });
                break;
            }
        }
    }
    nativePrevious = current;
}
function emitDma(source, destination, bytes) {
    if (destination >= RDRAM_SIZE || destination + bytes.length > RDRAM_SIZE) return false;
    const key = dmaKey(source, destination, bytes);
    if (native.dma.has(key)) {
        if (native.dmaOrdinals.has(key)) native.dmaHits.add(native.dmaOrdinals.get(key));
        return false;
    }
    native.dma.set(key, true);
    const data = Uint8Array.from(bytes);
    for (const callback of callbacks.dma.values()) {
        callback({
            direction: 0, completed: true, dramAddress: 0x80000000 + destination,
            cartAddress: 0xB0000000 + source, length: data.length,
            transferLength: data.length, exactDestinationResolved: true,
            newDmaPlacement: true, destinationBytes: data,
        });
    }
    return true;
}
function canonicalFactCount(events) {
    return events.reduce((n, e) => n + Number(e.newInstruction) + Number(e.newEdge), 0);
}

const ping = command('ping');
const initial = command('status');
if (ping.version !== '0.13.0' || ping.frontierFormatVersion !== 4 ||
    ping.rdramSize !== ALLOCATED_RDRAM_SIZE || ping.captureRdramSize !== RDRAM_SIZE ||
    initial.capture.enabled ||
    !ping.capabilities.includes('native-persistent-novelty-frontier-v4') ||
    !ping.capabilities.includes('stop-time-known-activity-bitmaps')) {
    throw new Error('protocol identity mismatch');
}

loadFrontier('K2:FIRST');
command('capture on K2:FIRST');
fireSnapshot();
const baseline = command('baseline status').baseline;
if (baseline.state !== 'ready' || baseline.byteLength !== RDRAM_SIZE) {
    throw new Error('atomic baseline missing');
}
if (command('baseline read ' + baseline.snapshotId + ' 0 4').bytesHex !== '00000000') {
    throw new Error('frozen baseline read failed');
}
const a = { pc: 0x80001000, opcode: 0x0C000050, page: 0x1000, generation: 1, physical: 0x1000 };
const b = { pc: 0x80001004, opcode: 0, page: 0x1000, generation: 1, physical: 0x1004 };
const readsBeforeTrace = memoryBlockReads;
nativePrevious = null;
emitExec(a.pc, a.opcode, a.page, a.generation);
emitExec(b.pc, b.opcode, b.page, b.generation);
command('capture off');
const firstDrain = command('drain 32');
const firstCoverage = firstDrain.events.filter((event) => event.kind === 'exec-coverage');
if (firstCoverage.length !== 2 || memoryBlockReads !== readsBeforeTrace ||
    firstDrain.events[0].kind !== 'baseline-snapshot') {
    throw new Error('initial exact capture or baseline ordering regressed');
}

loadFrontier('K2:KNOWN', [a, b], [[a, b], [b, a]]);
command('capture on K2:KNOWN');
fireSnapshot();
nativePrevious = null;
emitExec(a.pc, a.opcode, a.page, 77);
emitExec(b.pc, b.opcode, b.page, 77);
emitExec(a.pc, a.opcode, a.page, 78);
const repeated = command('drain 32');
const repeatedCoverage = repeated.events.filter((event) => event.kind === 'exec-coverage');
if (repeatedCoverage.length !== 0) throw new Error('known execution crossed into JavaScript');

command('context marker SESSION-MARKER 7 2 2');
let duplicateMarkerRejected = false;
try {
    command('context marker SESSION-MARKER 7 2 2');
} catch (error) {
    duplicateMarkerRejected = /already pending/.test(String(error));
}
if (!duplicateMarkerRejected) throw new Error('duplicate pending marker did not fail closed');
emitExec(b.pc, b.opcode, b.page, 77);
emitExec(a.pc, a.opcode, a.page, 77);
const markerContextEvents = command('drain 8').events.filter(
    (event) => event.kind === 'marker-execution-context');
if (markerContextEvents.length !== 1 || markerContextEvents[0].beforeCount !== 2 ||
    markerContextEvents[0].afterCount !== 2 ||
    markerContextEvents[0].markerSessionId !== 'SESSION-MARKER') {
    throw new Error('bounded native marker context did not cross the novelty filter');
}

emitExec(0x80401000, 0x11111111, 0x401000, 1);
emitExec(a.pc, a.opcode, a.page, 79);
const upperMemoryDrain = command('drain 8').events.filter((event) => event.kind === 'exec-coverage');
if (upperMemoryDrain.length !== 0) throw new Error('upper 4 MiB leaked into capture');

const c = { pc: 0x80001008, opcode: 0x24420001, page: 0x1000, generation: 80, physical: 0x1008 };
emitExec(c.pc, c.opcode, c.page, c.generation);
const caller = { pc: 0x80002000, opcode: 0x0C000050, page: 0x2000, generation: 4, physical: 0x2000 };
emitExec(caller.pc, caller.opcode, caller.page, caller.generation);
emitExec(b.pc, b.opcode, b.page, 80);
emitExec(0x80003000, a.opcode, 0x3000, 1);
emitExec(a.pc, 0x0C000051, a.page, 81);
emitExec(a.pc, a.opcode, 0xFFFFFFFF, undefined);
command('capture off');
const noveltyEvents = command('drain 64').events;
const noveltyCoverage = noveltyEvents.filter((event) => event.kind === 'exec-coverage');
const activityEvents = noveltyEvents.filter((event) => event.kind === 'known-activity');
if (noveltyCoverage.length !== 6 ||
    !noveltyCoverage.some((event) => event.noveltyDecision.startsWith('unresolved-')) ||
    activityEvents.length !== 1 || activityEvents[0].instructionHitCount < 2 ||
    activityEvents[0].edgeHitCount < 1) {
    throw new Error('new tail/caller/placement/change fallback regressed: ' +
        noveltyCoverage.length + ' ' + JSON.stringify(noveltyCoverage));
}

const dmaBytes = [0xAA, 0xBB];
loadFrontier('K2:DMA', [], [], [{ source: 0x1000, destination: 0x2000, bytes: dmaBytes }]);
command('dma on 0 0x400000 65536 0');
const knownDmaEmitted = emitDma(0x1000, 0x2000, dmaBytes);
const upperDmaEmitted = emitDma(0x1000, 0x402000, dmaBytes);
const newDmaEmitted = emitDma(0x1000, 0x2000, [0xAA, 0xBC]);
const dmaDrain = command('drain 16');
if (knownDmaEmitted || upperDmaEmitted || !newDmaEmitted || dmaDrain.count !== 1 ||
    dmaDrain.events[0].destinationBytesHex !== 'AABC' || memoryBlockReads !== readsBeforeTrace) {
    throw new Error('native exact DMA filtering or event-time bytes regressed');
}
command('dma off');

// A powered-off arm loads the frontier with no ROM or RDRAM. Project64's
// synchronous EMU_STARTED callback must install every hook before the first
// interpreter instruction, and the first queued event must be the baseline.
context.pj64.romInfo = null;
context.mem.ramSize = 0;
loadFrontier('K2:COLDBOOT');
const armed = command('coldboot arm K2:COLDBOOT 12345678 9ABCDEF0').coldBoot;
if (armed.state !== 'armed' || command('status').rdramSize !== 0) {
    throw new Error('pre-ROM cold-boot arm failed');
}
context.mem.ramSize = ALLOCATED_RDRAM_SIZE;
context.pj64.romInfo = {
    name: 'fixture', goodName: 'fixture', fileName: 'fixture.z64',
    filePath: 'C:/fixture.z64', crc1: 0x12345678, crc2: 0x9ABCDEF0,
};
nativePrevious = null;
for (const callback of callbacks.state.values()) callback({ state: context.EMU_STARTED });
if (command('coldboot status').coldBoot.state !== 'capturing' ||
    !command('status').capture.enabled || !command('status').dma.enabled) {
    throw new Error('cold-boot hooks were not installed synchronously');
}
fireSnapshot(0xA4000040);
const coldBootDrain = command('drain 8');
if (coldBootDrain.count !== 1 || coldBootDrain.events[0].kind !== 'baseline-snapshot' ||
    coldBootDrain.events[0].pc !== '0xA4000040') {
    throw new Error('cold-boot baseline was not first in machine-event order');
}
command('coldboot cancel');

context.pj64.romInfo = null;
context.mem.ramSize = 0;
command('coldboot arm K2:COLDBOOT 12345678 9ABCDEF0');
context.mem.ramSize = ALLOCATED_RDRAM_SIZE;
context.pj64.romInfo = {
    name: 'wrong', goodName: 'wrong', fileName: 'wrong.z64',
    filePath: 'C:/wrong.z64', crc1: 0x11111111, crc2: 0x22222222,
};
for (const callback of callbacks.state.values()) callback({ state: context.EMU_STARTED });
const wrongRomState = command('coldboot status').coldBoot;
if (wrongRomState.state !== 'failed' || command('status').capture.enabled ||
    command('status').dma.enabled) {
    throw new Error('wrong-ROM cold boot did not fail closed');
}
command('coldboot cancel');

const watch = command('watch exec 0x80001000 4 fixture').watch;
for (let index = 0; index < 65540; index += 1) {
    callbacks.exec.get(watch.id)({ callbackId: watch.id, pc: 0x80001000 });
}
const overflow = command('status');
if (!overflow.droppedRanges.length) throw new Error('explicit drop ranges missing');

process.stdout.write(JSON.stringify({
    version: ping.version,
    frontierFormatVersion: ping.frontierFormatVersion,
    queueModel: ping.queueModel,
    firstCanonicalExecutionEdgeFacts: canonicalFactCount(firstCoverage),
    repeatedCanonicalExecutionEdgeFacts: canonicalFactCount(repeatedCoverage),
    firstTraceEvents: firstCoverage.length,
    repeatedTraceEvents: repeatedCoverage.length,
    newTailAndCallerEvents: noveltyCoverage.length,
    tracePageCount: 0,
    traceGenerationCount: 0,
    exactCoverageCount: firstCoverage.length,
    repeatedKnownMetadataCount: repeatedCoverage.length,
    pageReadsDuringExecutionTrace: memoryBlockReads - readsBeforeTrace,
    explicitDroppedRanges: overflow.droppedRanges.length,
    baselineBytes: baseline.byteLength,
    knownDmaEvents: Number(knownDmaEmitted),
    upperMemoryEvents: upperMemoryDrain.length + Number(upperDmaEmitted),
    newDmaEvents: dmaDrain.count,
    coldBootBaselineFirst: true,
    wrongRomRejected: true,
    observationOnlyCapture: true,
    stopTimeActivitySummaries: activityEvents.length,
    knownActivityBitmapBytes: activityEvents.reduce((total, event) => total +
        event.instructionHitBitmapHex.length / 2 +
        event.edgeHitBitmapHex.length / 2 +
        event.dmaHitBitmapHex.length / 2, 0),
    knownActivityFactHits: activityEvents.reduce((total, event) => total +
        event.instructionHitCount + event.edgeHitCount + event.dmaHitCount, 0),
    markerContextWindows: markerContextEvents.length,
}));
