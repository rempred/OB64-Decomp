#include "common/mus_synth.h"
#include "common/mus_voice.h"
typedef struct {
    u32 w0;
    u32 w1;
} Acmd;

extern AlGlobalsLike *D_800A9E54;
void *alHeapDBAlloc(void *file, s32 line, void *hp, s32 num, s32 size);
Acmd *func_00017990(s32 sampleOffset, Acmd *p);
Acmd *func_00016100(s32 sampleOffset, Acmd *p);
void func_00014dd8(MusSynConfig *c) {
    s32 i;
    N_PVoice *pv;
    N_PVoice *pvoices;
    MusParam *params;
    void *hp = c->heap;
    D_800A9E54->head = ((void *)0);
    D_800A9E54->numPVoices = c->maxPVoices;
    D_800A9E54->curSamples = 0;
    D_800A9E54->paramSamples = 0;
    D_800A9E54->outputRate = c->outputRate;
    D_800A9E54->maxOutSamples = 184;
    D_800A9E54->dma = c->dmaproc;
    D_800A9E54->sv_dramout = 0;
    D_800A9E54->sv_first = 1;
    D_800A9E54->unk34 = alHeapDBAlloc(((void *)0), 0, hp, 1, 0x44);
    D_800A9E54->unk34->sourceCount = 0;
    D_800A9E54->unk34->maxSources = c->maxPVoices;
    D_800A9E54->unk34->sources = alHeapDBAlloc(((void *)0), 0, hp, c->maxPVoices, 4);
    D_800A9E54->mainBus = alHeapDBAlloc(((void *)0), 0, hp, 1, 0x14);
    if (c->fxType != 0) {
        D_800A9E54->unk34->unk20 = (void *)func_00015048(0, c, hp);
        D_800A9E54->mainBus->handler = (void *)func_00017990;
    } else {
        D_800A9E54->mainBus->handler = (void *)func_00016100;
    }
    D_800A9E54->pFreeList.next = ((void *)0);
    D_800A9E54->pFreeList.prev = ((void *)0);
    D_800A9E54->pLameList.next = ((void *)0);
    D_800A9E54->pLameList.prev = ((void *)0);
    D_800A9E54->pAllocList.next = ((void *)0);
    D_800A9E54->pAllocList.prev = ((void *)0);
    pvoices = alHeapDBAlloc(((void *)0), 0, hp, c->maxPVoices, 0x8C);
    for (i = 0; i < c->maxPVoices; i++) {
        pv = &pvoices[i];
        alLink(&pv->node, &D_800A9E54->pFreeList);
        pv->vvoice = ((void *)0);
        func_0001658c(pv, D_800A9E54->dma, hp);
        D_800A9E54->unk34->sources[D_800A9E54->unk34->sourceCount++] = pv;
    }
    params = alHeapDBAlloc(((void *)0), 0, hp, c->maxUpdates, 0x1C);
    D_800A9E54->paramList = ((void *)0);
    for (i = 0; i < c->maxUpdates; i++) {
        params[i].next = D_800A9E54->paramList;
        D_800A9E54->paramList = &params[i];
    }
    D_800A9E54->heap = hp;
}
