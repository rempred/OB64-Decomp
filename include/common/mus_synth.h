#ifndef OB64_COMMON_MUS_SYNTH_H
#define OB64_COMMON_MUS_SYNTH_H

#include "common/mus_dma.h"
#include "common/audio_link.h"

typedef struct {
    s32 maxVVoices;
    s32 maxPVoices;
    s32 maxUpdates;
    s32 maxFXbusses;
    ALDMANew dmaproc;
    void *heap;
    s32 outputRate;
    u8 fxType;
    s32 *params;
} MusSynConfig;

typedef MusSynConfig ALSynConfig;

typedef ALLink MusLink;

typedef struct MusParam {
    struct MusParam *next;
    u8 pad04[0x18];
} MusParam;

typedef struct {
    void *head;
    MusLink pFreeList;
    MusLink pAllocList;
    MusLink pLameList;
    s32 paramSamples;
    s32 curSamples;
    ALDMANew dma;
    void *heap;
    MusParam *paramList;
    struct MusMainBusView {
        u8 pad00[4];
        void *handler;
    } *mainBus;
    struct MusAuxBusView {
        u8 pad00[0x14];
        s32 sourceCount;
        s32 maxSources;
        void **sources;
        void *unk20;
        s32 arr[1];
    } *unk34;
    s32 numPVoices;
    u8 pad3C[4];
    s32 outputRate;
    s32 maxOutSamples;
    s32 sv_dramout;
    s32 sv_first;
} AlGlobalsLike;

void func_00014d70(AlGlobalsLike *globals, MusSynConfig *config);
void func_00014dd8(MusSynConfig *config);
void func_000154c0(MusSynConfig *config);
s32 func_00015048(s16 bus, MusSynConfig *config, void *heap);
void func_00015098(void **effect, MusSynConfig *config, void *heap);
void func_000189d0(ALSynConfig *config);
void *func_00018f80(s16 bus, ALSynConfig *config, void *heap);

#endif
