'use strict';

const fsNode = require('fs');
const vm = require('vm');

const bridgePath = process.argv[2];
if (!bridgePath) {
    throw new Error('usage: node bridge_080_harness.js <bridge.js>');
}

let serverInstance = null;
let nextCallbackId = 1;
const callbacks = {
    exec: new Map(),
    execUnique: new Map(),
    read: new Map(),
    write: new Map(),
    dmaStart: null,
    dmaComplete: null,
    state: null,
    pif: null,
};

class FakeServer {
    constructor() {
        this.handlers = {};
        serverInstance = this;
    }

    on(name, callback) {
        this.handlers[name] = callback;
    }

    listen() {
        if (this.handlers.listening) {
            this.handlers.listening();
        }
    }
}

function register(kind, callback) {
    const id = nextCallbackId++;
    callbacks[kind].set(id, callback);
    return id;
}

const zeroProxy = new Proxy({}, { get: () => 0, set: () => true });
const memoryWords = {};
const wordProxy = new Proxy(memoryWords, {
    get(target, key) { return Object.prototype.hasOwnProperty.call(target, key) ? target[key] : 0; },
    set(target, key, value) { target[key] = Number(value) >>> 0; return true; },
});
let pageSalt = 0;
const context = {
    Date,
    Math,
    JSON,
    Number,
    String,
    Object,
    Array,
    Buffer,
    Uint8Array,
    isFinite,
    isNaN,
    parseInt,
    OS_READ: 0,
    PIF_RAM_START: 0xBFC007C0,
    script: { keepalive() {}, timeout() {} },
    console: { log() {} },
    Server: FakeServer,
    debug: { paused: false, breakhere() {}, resume() {} },
    pj64: {
        frameCount: 41,
        cpuCore: 'interpreter',
        romInfo: {
            name: 'fixture',
            goodName: 'fixture',
            fileName: 'fixture.z64',
            filePath: 'C:/fixture.z64',
            crc1: 0x12345678,
            crc2: 0x9ABCDEF0,
        },
    },
    cpu: { pc: 0x80001000, gpr: zeroProxy, cop0: zeroProxy },
    mem: {
        u8: zeroProxy,
        u16: zeroProxy,
        u32: wordProxy,
        s8: zeroProxy,
        s16: zeroProxy,
        s32: zeroProxy,
        getblock(_address, length) {
            const bytes = new Uint8Array(length);
            for (let index = 0; index < length; index += 1) {
                bytes[index] = (0xAA + index + pageSalt) & 0xFF;
            }
            return bytes;
        },
    },
    events: {
        onstatechange(callback) { callbacks.state = callback; return nextCallbackId++; },
        onpifread(callback) { callbacks.pif = callback; return nextCallbackId++; },
        onpidma(callback) { callbacks.dmaStart = callback; return nextCallbackId++; },
        onpidmacomplete(callback) { callbacks.dmaComplete = callback; return nextCallbackId++; },
        onexec(_target, callback) { return register('exec', callback); },
        onexecunique(_target, callback) { return register('execUnique', callback); },
        onread(_target, callback) { return register('read', callback); },
        onwrite(_target, callback) { return register('write', callback); },
        remove(id) {
            callbacks.exec.delete(id);
            callbacks.execUnique.delete(id);
            callbacks.read.delete(id);
            callbacks.write.delete(id);
        },
    },
};
vm.createContext(context);
vm.runInContext(fsNode.readFileSync(bridgePath, 'utf8'), context, { filename: bridgePath });

if (!serverInstance || !serverInstance.handlers.connection || !callbacks.dmaStart || !callbacks.dmaComplete) {
    throw new Error('bridge did not register its server and DMA callbacks');
}

const replies = [];
let receive = null;
const socket = {
    on(name, callback) {
        if (name === 'data') {
            receive = callback;
        }
    },
    write(payload) {
        replies.push(JSON.parse(String(payload).trim()));
    },
};
serverInstance.handlers.connection(socket);

function command(line) {
    const before = replies.length;
    receive(Buffer.from(line + '\n', 'utf8'));
    if (replies.length !== before + 1) {
        throw new Error('command did not produce exactly one response: ' + line);
    }
    const response = replies.pop();
    if (response.ok !== true) {
        throw new Error('bridge command failed: ' + line + ': ' + response.error);
    }
    return response;
}

const ping = command('ping');
const initialStatus = command('status');
if (ping.version !== '0.8.0' || ping.queueModel !== 'unified') {
    throw new Error('protocol identity mismatch');
}
if (!ping.bridgeEpoch || ping.bridgeEpoch !== initialStatus.bridgeEpoch) {
    throw new Error('bridge epoch is missing or inconsistent');
}
if (callbacks.execUnique.size !== 0 || initialStatus.capture.enabled) {
    throw new Error('bridge installed an execution watch before capture was explicitly enabled');
}

const watch = command('watch exec 0x80001000 4 fixture').watch;
const execCallback = callbacks.exec.get(watch.id);
execCallback({ callbackId: watch.id, pc: 0x80001000 });
command('dma on 0x0 0x800000 65536 0');
callbacks.dmaStart({
    direction: 0,
    completed: false,
    dramAddress: 0x80003000,
    cartAddress: 0xA8000000,
    length: 0x100,
});
callbacks.dmaStart({
    direction: 0,
    completed: false,
    dramAddress: 0x80002000,
    cartAddress: 0xB0001000,
    length: 1,
});
callbacks.dmaComplete({
    direction: 0,
    completed: true,
    dramAddress: 0x80002000,
    cartAddress: 0xB0001000,
    transferLength: 2,
    length: 1,
});

const drained = command('drain 16');
if (drained.count !== 3 || drained.remaining !== 0 || drained.nextEventSequence !== 4) {
    throw new Error('unified drain envelope is inconsistent');
}
if (drained.events[0].bridgeStream !== 'watch' || drained.events[0].bridgeSequence !== 1) {
    throw new Error('watch event lost global creation order');
}
const dmaStart = drained.events[1];
const dma = drained.events[2];
if (
    dmaStart.kind !== 'dma-start' ||
    dmaStart.bridgeStream !== 'dma' ||
    dmaStart.bridgeSequence !== 2 ||
    dmaStart.requestedLength !== 2 ||
    dmaStart.sourceDomain !== 'cartridge-rom'
) {
    throw new Error('DMA start event lost global creation order');
}
if (dma.bridgeStream !== 'dma' || dma.bridgeSequence !== 3) {
    throw new Error('DMA event lost global creation order');
}
if (
    dma.dmaStartSequence !== 2 ||
    dma.pairingStatus !== 'matched' ||
    dma.sourceDomain !== 'cartridge-rom' ||
    dma.requestedLength !== 2 ||
    dma.transferSpanLength !== 2 ||
    dma.capturePhase !== 'post-transfer-callback' ||
    dma.destinationByteLength !== 2 ||
    dma.destinationBytesEncoding !== 'hex-uppercase' ||
    dma.destinationBytesHex !== 'AAAB'
) {
    throw new Error('DMA event-time destination evidence is incomplete');
}
if (command('dma status').dma.ignoredNonRom !== 1) {
    throw new Error('non-ROM PI reads were not excluded from loader-DMA pairing');
}

const fingerprints = command('hashmem 0x80002000 0x3 0x80003000 0x2');
if (
    fingerprints.bridgeEpoch !== ping.bridgeEpoch ||
    fingerprints.nextEventSequence !== 4 ||
    fingerprints.ranges.length !== 2 ||
    fingerprints.ranges[0].address !== '0x80002000' ||
    fingerprints.ranges[0].size !== 3 ||
    fingerprints.ranges[0].hashAlgorithm !== 'fnv1a32'
) {
    throw new Error('bounded memory fingerprints lost observation context');
}
const block = command('readblock 0x80002000 0x3');
if (
    block.bridgeEpoch !== ping.bridgeEpoch ||
    block.nextEventSequence !== 4 ||
    block.address !== '0x80002000' ||
    block.size !== 3 ||
    block.bytesEncoding !== 'hex-uppercase' ||
    block.bytesHex !== 'AAABAC' ||
    block.hash !== fingerprints.ranges[0].hash
) {
    throw new Error('readblock did not return the exact fingerprinted bytes');
}

const capture = command('capture on').capture;
const uniqueCallback = callbacks.execUnique.get(capture.trace.callbackId);
if (
    !uniqueCallback ||
    capture.trace.callbackIds.length !== 2 ||
    callbacks.execUnique.size !== 2 ||
    !capture.controllerInput.enabled
) {
    throw new Error('capture did not enable native unique execution and controller input');
}
const coverage = {
    callbackId: capture.trace.callbackId,
    pc: 0x80001000,
    opcode: 0x27BDFFE0,
    pagePhysicalAddress: 0x00001000,
    pageGeneration: 1,
    hasPrevious: false,
    previousPc: 0,
    previousOpcode: 0,
    previousPagePhysicalAddress: 0xFFFFFFFF,
    previousPageGeneration: 0,
    newInstruction: true,
    newEdge: false,
};
uniqueCallback(coverage);
uniqueCallback({ ...coverage, pageGeneration: 2 });
pageSalt = 1;
uniqueCallback({ ...coverage, pageGeneration: 3 });
pageSalt = 0;
uniqueCallback({
    ...coverage,
    pc: 0x80001004,
    opcode: 0xAFBF001C,
    pageGeneration: 4,
    hasPrevious: true,
    previousPc: 0x80001000,
    previousOpcode: 0x27BDFFE0,
    previousPagePhysicalAddress: 0x00001000,
    previousPageGeneration: 4,
    newInstruction: true,
    newEdge: true,
});

wordProxy[context.PIF_RAM_START] = 0xFF010401;
wordProxy[context.PIF_RAM_START + 4] = 0;
callbacks.pif();
callbacks.pif();
wordProxy[context.PIF_RAM_START + 4] = 0x800010F0;
callbacks.pif();

const captureDrain = command('drain 16');
const tracePages = captureDrain.events.filter((event) => event.kind === 'trace-page');
const exactCoverage = captureDrain.events.filter((event) => event.kind === 'exec-coverage');
const inputTransitions = captureDrain.events.filter((event) => event.kind === 'controller-input');
if (
    tracePages.length !== 2 ||
    exactCoverage.length !== 3 ||
    inputTransitions.length !== 2 ||
    captureDrain.events.some((event, index) => event.bridgeSequence !== index + 4)
) {
    throw new Error('exact trace/input dedupe lost a unique event or retained a duplicate');
}
if (
    exactCoverage[2].pc !== '0x80001004' ||
    !exactCoverage[2].newInstruction ||
    !exactCoverage[2].newEdge
) {
    throw new Error('a novel structure after restored duplicate content was suppressed');
}
const captureStatus = command('capture status').capture;
if (
    captureStatus.trace.suppressedCoverage !== 1 ||
    captureStatus.controllerInput.suppressedConsecutiveSamples !== 1
) {
    throw new Error('capture status did not account for exact/consecutive dedupe');
}
command('capture off');
if (callbacks.execUnique.size !== 0) {
    throw new Error('capture off did not remove every execution watch');
}

const overflowFirstSequence = captureDrain.nextEventSequence;

for (let index = 0; index < 65539; index += 1) {
    execCallback({ callbackId: watch.id, pc: 0x80001000 });
}
const overflow = command('status');
if (
    overflow.queued !== 65536 ||
    overflow.dropped !== 3 ||
    overflow.droppedRanges.length !== 1 ||
    overflow.droppedRanges[0].firstSequence !== overflowFirstSequence ||
    overflow.droppedRanges[0].lastSequence !== overflowFirstSequence + 2 ||
    overflow.droppedRanges[0].count !== 3
) {
    throw new Error('overflow did not expose the exact dropped sequence range');
}

const cleared = command('clear');
const afterClear = command('status');
if (cleared.discardedEvents !== 65536 || afterClear.queued !== 0) {
    throw new Error('clear did not account for all queued events');
}
if (
    afterClear.droppedRanges.length !== 1 ||
    afterClear.droppedRanges[0].firstSequence !== overflowFirstSequence ||
    afterClear.droppedRanges[0].lastSequence !== overflowFirstSequence + 65538 ||
    afterClear.droppedRanges[0].count !== 65539
) {
    throw new Error('discard loss did not extend the exact sequence range');
}

process.stdout.write(JSON.stringify({
    version: ping.version,
    bridgeEpoch: ping.bridgeEpoch,
    orderedSequences: drained.events.map((event) => event.bridgeSequence),
    dmaBytes: dma.destinationBytesHex,
    memoryBytes: block.bytesHex,
    tracePageCount: tracePages.length,
    exactCoverageCount: exactCoverage.length,
    inputTransitionCount: inputTransitions.length,
    suppressedCoverage: captureStatus.trace.suppressedCoverage,
    droppedRange: afterClear.droppedRanges[0],
}) + '\n');
