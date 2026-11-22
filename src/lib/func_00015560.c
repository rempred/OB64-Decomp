#include "common/audio_filter.h"

typedef unsigned char u8;
typedef signed int s32;
typedef struct MusLink {
    struct MusLink *next;
    struct MusLink *prev;
} MusLink;
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
    void *dma;
    void *heap;
    MusParam *paramList;
    struct {
        u8 pad00[4];
        void *handler;
    } *mainBus;
    struct {
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
extern AlGlobalsLike *D_800E8298;
s32 func_00015560(s32 fx);
extern s32 D_800A9B60;
void func_000151e0(s32 *param);
extern int func_0001f2a4(L4Filter *, int, void *);
void func_000151e0(s32 *param);
extern s32 *D_800A9B64[];
s32 func_00015560(s32 fx) {
    s32 r;
    if (fx < D_800A9B60) {
        L4Effect *effect;

        func_000151e0(D_800A9B64[fx]);
        effect = D_800E8298->unk34->unk20;
        func_0001f2a4(&effect->filter, 1, D_800E8298->unk34);
        r = 0;
    } else {
        r = 1;
    }
    return r;
}
