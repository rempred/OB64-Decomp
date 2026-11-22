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

Acmd *func_00018fd0(s32 sampleOffset, Acmd *p);
Acmd *func_00018f30(s32 sampleOffset, Acmd *p) {
    Acmd *ptr = p;
    ptr = func_00018fd0(sampleOffset, ptr);
    {
        Acmd *_a = ptr++;
        _a->w0 = 0x0D000000;
    }
    {
        Acmd *_a = ptr++;
        _a->w0 = 0x062E0000;
        _a->w1 = *(s32 *)((u8 *)D_800A9E54 + 0x48);
    }
    return ptr;
}
