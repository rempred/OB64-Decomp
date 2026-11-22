#include "common/mus_effect.h"
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

Acmd *func_00018fd0(s32 sampleOffset, Acmd *p) {
    Acmd *ptr = p;
    Acmd *(*handler)(s32, Acmd *);
    {
        Acmd *_a = ptr++;
        _a->w0 = 0x020004E0;
        _a->w1 = 0x2E0;
    }
    handler = *(void **)(*(u8 **)((u8 *)D_800A9E54 + 0x30) + 4);
    ptr = handler(sampleOffset, ptr);
    {
        Acmd *_a = ptr++;
        _a->w0 = 0x0C007FFF;
        _a->w1 = 0x07C004E0;
    }
    {
        Acmd *_a = ptr++;
        _a->w0 = 0x0C007FFF;
        _a->w1 = 0x09300650;
    }
    return ptr;
}
