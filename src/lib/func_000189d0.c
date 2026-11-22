#include "common/mus_effect.h"
#include "common/mus_synth.h"
#include "common/mus_voice.h"
typedef signed long long s64;

typedef struct {
    u32 w0;
    u32 w1;
} Acmd;

typedef struct {
    u8 pad00[0x34];
    struct {
        u8 pad00[0x14];
        s32 sourceCount;
        s32 maxSources;
        N_PVoice **sources;
        ALFx *fx;
        ALFx *fxArr[1];
    } *auxBus;
    s32 numPVoices;
    u8 pad3C[4];
    s32 outputRate;
} N_ALSynth;
extern N_ALSynth *D_800A9E54;

void *alHeapDBAlloc(void *file, s32 line, void *hp, s32 num, s32 size);
typedef struct ALPlayer_s {
    struct ALPlayer_s *next;
    void *clientData;
    s32 (*handler)(void *);
    s32 callTime;
    s32 samplesLeft;
} ALPlayer;

typedef struct {
    ALPlayer *head;
    ALLink pFreeList;
    ALLink pAllocList;
    ALLink pLameList;
    s32 paramSamples;
    s32 curSamples;
    ALDMANew dma;
    void *heap;
    ALParam *paramList;
    struct {
        u8 pad00[4];
        void *handler;
    } *mainBus;
    struct {
        u8 pad00[0x14];
        s32 sourceCount;
        s32 maxSources;
        N_PVoice **sources;
        void *fx;
    } *auxBus;
    s32 numPVoices;
    u8 pad3C[4];
    s32 outputRate;
    s32 maxOutSamples;
    s32 sv_dramout;
    s32 sv_first;
} N_ALSynthFull;
Acmd *func_00017990(s32 sampleOffset, Acmd *p);
Acmd *func_00016100(s32 sampleOffset, Acmd *p);
void func_000189d0(ALSynConfig *c) {
    s32 i;
    N_PVoice *pv;
    N_PVoice *pvoices;
    ALParam *params;
    void *hp = c->heap;
    ((N_ALSynthFull *)D_800A9E54)->head = ((void *)0);
    ((N_ALSynthFull *)D_800A9E54)->numPVoices = c->maxPVoices;
    ((N_ALSynthFull *)D_800A9E54)->curSamples = 0;
    ((N_ALSynthFull *)D_800A9E54)->paramSamples = 0;
    ((N_ALSynthFull *)D_800A9E54)->outputRate = c->outputRate;
    ((N_ALSynthFull *)D_800A9E54)->maxOutSamples = 184;
    ((N_ALSynthFull *)D_800A9E54)->dma = c->dmaproc;
    ((N_ALSynthFull *)D_800A9E54)->sv_dramout = 0;
    ((N_ALSynthFull *)D_800A9E54)->sv_first = 1;
    ((N_ALSynthFull *)D_800A9E54)->auxBus = alHeapDBAlloc(0, 0, (hp), (1), (0x44));
    ((N_ALSynthFull *)D_800A9E54)->auxBus->sourceCount = 0;
    ((N_ALSynthFull *)D_800A9E54)->auxBus->maxSources = c->maxPVoices;
    ((N_ALSynthFull *)D_800A9E54)->auxBus->sources = alHeapDBAlloc(0, 0, (hp), (c->maxPVoices), (4));
    ((N_ALSynthFull *)D_800A9E54)->mainBus = alHeapDBAlloc(0, 0, (hp), (1), (0x14));
    if (c->fxType != 0) {
        ((N_ALSynthFull *)D_800A9E54)->auxBus->fx = func_00018f80(0, c, hp);
        ((N_ALSynthFull *)D_800A9E54)->mainBus->handler = func_00017990;
    } else {
        ((N_ALSynthFull *)D_800A9E54)->mainBus->handler = func_00016100;
    }
    ((N_ALSynthFull *)D_800A9E54)->pFreeList.next = ((void *)0);
    ((N_ALSynthFull *)D_800A9E54)->pFreeList.prev = ((void *)0);
    ((N_ALSynthFull *)D_800A9E54)->pLameList.next = ((void *)0);
    ((N_ALSynthFull *)D_800A9E54)->pLameList.prev = ((void *)0);
    ((N_ALSynthFull *)D_800A9E54)->pAllocList.next = ((void *)0);
    ((N_ALSynthFull *)D_800A9E54)->pAllocList.prev = ((void *)0);
    pvoices = alHeapDBAlloc(0, 0, (hp), (c->maxPVoices), (sizeof(N_PVoice)));
    for (i = 0; i < c->maxPVoices; i++) {
        pv = &pvoices[i];
        alLink(&pv->node, &((N_ALSynthFull *)D_800A9E54)->pFreeList);
        pv->vvoice = ((void *)0);
        func_0001658c(pv, ((N_ALSynthFull *)D_800A9E54)->dma, hp);
        ((N_ALSynthFull *)D_800A9E54)->auxBus->sources[((N_ALSynthFull *)D_800A9E54)->auxBus->sourceCount++] = pv;
    }
    params = alHeapDBAlloc(0, 0, (hp), (c->maxUpdates), (sizeof(ALParam)));
    ((N_ALSynthFull *)D_800A9E54)->paramList = ((void *)0);
    for (i = 0; i < c->maxUpdates; i++) {
        params[i].next = ((N_ALSynthFull *)D_800A9E54)->paramList;
        ((N_ALSynthFull *)D_800A9E54)->paramList = &params[i];
    }
    ((N_ALSynthFull *)D_800A9E54)->heap = hp;
}
