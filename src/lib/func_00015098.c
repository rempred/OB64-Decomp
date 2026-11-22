#include "common/mus_synth.h"
#include "common/audio_filter.h"

void *alHeapDBAlloc(void *file, s32 line, void *hp, s32 num, s32 size);
extern int func_0001f2b8(L4Effect *, int, int *);
typedef struct {
    void *unkA8;
    void *unkAC;
    void *unkB0;
    void *unkB4;
    void *unkB8;
    void *unkBC;
} MusFxState;
extern MusFxState D_800E82A8;
s32 func_000154d8(void);
s32 func_0001551c(void);
void func_000151e0(s32 *param);
void func_00015098(void **out, MusSynConfig *c, void *hp) {
    L4Effect *fx = alHeapDBAlloc(((void *)0), 0, hp, 1, 0x2C);
    *out = fx;
    fx->paramHandler = func_0001f2b8;
    D_800E82A8.unkA8 = alHeapDBAlloc(((void *)0), 0, hp, func_000154d8(), 0x28);
    D_800E82A8.unkAC = alHeapDBAlloc(((void *)0), 0, hp, func_0001551c(), 2);
    D_800E82A8.unkB0 = alHeapDBAlloc(((void *)0), 0, hp, 1, 0x34);
    D_800E82A8.unkB4 = alHeapDBAlloc(((void *)0), 0, hp, 1, 0x20);
    D_800E82A8.unkB8 = alHeapDBAlloc(((void *)0), 0, hp, 1, 0x30);
    D_800E82A8.unkBC = alHeapDBAlloc(((void *)0), 0, hp, 1, 8);
    func_000151e0(c->params);
}
void func_000151e0(s32 *param);
s32 func_000154d8(void);
s32 func_0001551c(void);
